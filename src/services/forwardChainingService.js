import { query } from "../config/database.js"
import { config } from "../config/app.js"
import logger from "../utils/logger.js"

export class ForwardChainingService {
  /**
   * Diagnose based on selected symptoms using forward chaining
   * @param {number[]} symptomIds - Array of selected symptom IDs
   * @returns {Promise<Object>} Diagnosis result with disease and confidence
   */
  async diagnose(symptomIds) {
    try {
      if (!symptomIds || symptomIds.length === 0) {
        throw new Error("At least one symptom must be selected")
      }

      // Get all rules from database
      const rulesResult = await query("SELECT * FROM rules")
      const rules = rulesResult.rows

      // Calculate match scores for each disease
      const diseaseScores = {}

      for (const rule of rules) {
        const matchScore = this.calculateMatchScore(rule.symptom_ids, symptomIds)

        if (matchScore >= config.forwardChainingThreshold) {
          const diseaseId = rule.disease_id
          const confidence = matchScore * rule.confidence_level

          if (!diseaseScores[diseaseId]) {
            diseaseScores[diseaseId] = []
          }
          diseaseScores[diseaseId].push(confidence)
        }
      }

      // Find disease with highest average confidence
      let topDiseaseId = null
      let topConfidence = 0

      for (const [diseaseId, confidences] of Object.entries(diseaseScores)) {
        const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length
        if (avgConfidence > topConfidence) {
          topConfidence = avgConfidence
          topDiseaseId = diseaseId
        }
      }

      if (!topDiseaseId) {
        return {
          success: false,
          disease: null,
          confidence: 0,
          message: "No matching disease found for selected symptoms",
        }
      }

      // Get disease details
      const diseaseResult = await query("SELECT * FROM diseases WHERE id = $1", [topDiseaseId])
      const disease = diseaseResult.rows[0]

      logger.info(`Forward chaining diagnosis: ${disease.name} (confidence: ${topConfidence})`)

      return {
        success: true,
        disease,
        confidence: Math.round(topConfidence * 100) / 100,
        matchedRules: diseaseScores[topDiseaseId].length,
      }
    } catch (error) {
      logger.error("Forward chaining error:", error)
      throw error
    }
  }

  /**
   * Calculate match score between rule symptoms and selected symptoms
   * @param {number[]} ruleSymptoms - Symptoms in the rule
   * @param {number[]} selectedSymptoms - Selected symptoms by user
   * @returns {number} Match score (0-1)
   */
  calculateMatchScore(ruleSymptoms, selectedSymptoms) {
    if (!ruleSymptoms || ruleSymptoms.length === 0) return 0

    const intersection = ruleSymptoms.filter((s) => selectedSymptoms.includes(s))
    return intersection.length / ruleSymptoms.length
  }

  /**
   * Get all possible diagnoses with their confidence scores
   * @param {number[]} symptomIds - Array of selected symptom IDs
   * @returns {Promise<Array>} Array of possible diagnoses sorted by confidence
   */
  async getAllPossibleDiagnoses(symptomIds) {
    try {
      const rulesResult = await query("SELECT * FROM rules")
      const rules = rulesResult.rows

      const diseaseScores = {}

      for (const rule of rules) {
        const matchScore = this.calculateMatchScore(rule.symptom_ids, symptomIds)

        if (matchScore > 0) {
          const diseaseId = rule.disease_id
          const confidence = matchScore * rule.confidence_level

          if (!diseaseScores[diseaseId]) {
            diseaseScores[diseaseId] = []
          }
          diseaseScores[diseaseId].push(confidence)
        }
      }

      // Get disease details for all matches
      const diagnoses = []

      for (const [diseaseId, confidences] of Object.entries(diseaseScores)) {
        const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length
        const diseaseResult = await query("SELECT * FROM diseases WHERE id = $1", [diseaseId])

        if (diseaseResult.rows.length > 0) {
          diagnoses.push({
            disease: diseaseResult.rows[0],
            confidence: Math.round(avgConfidence * 100) / 100,
            matchedRules: confidences.length,
          })
        }
      }

      // Sort by confidence descending
      return diagnoses.sort((a, b) => b.confidence - a.confidence)
    } catch (error) {
      logger.error("Error getting all possible diagnoses:", error)
      throw error
    }
  }
}

export default new ForwardChainingService()
