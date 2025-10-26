import { query } from "../config/database.js"
import logger from "../utils/logger.js"

export class CertaintyFactorService {
  /**
   * Convert confidence score to certainty level
   * @param {number} confidence - Confidence score (0-1)
   * @returns {string} Certainty level
   */
  getCertaintyLevel(confidence) {
    if (confidence < 0.2) return "Tidak ada"
    if (confidence < 0.4) return "Mungkin"
    if (confidence < 0.6) return "Kemungkinan Besar"
    if (confidence < 0.8) return "Hampir Pasti"
    return "Pasti"
  }

  /**
   * Apply certainty factor to image diagnosis
   * @param {Object} prediction - AI model prediction
   * @returns {Object} Diagnosis with certainty factor applied
   */
  applyUncertainty(prediction) {
    const confidence = prediction.confidence || 0
    const certaintyLevel = this.getCertaintyLevel(confidence)

    return {
      disease: prediction.disease,
      confidence: Math.round(confidence * 100) / 100,
      certaintyLevel,
      confidencePercentage: Math.round(confidence * 100),
    }
  }

  /**
   * Calculate combined certainty factor with confirmation answers
   * @param {number} baseConfidence - Initial confidence from model
   * @param {Array} answers - User answers to confirmation questions
   * @param {number} diseaseId - Disease ID
   * @returns {Promise<Object>} Updated diagnosis with combined certainty
   */
  async calculateCombinedCertainty(baseConfidence, answers, diseaseId) {
    try {
      let combinedConfidence = baseConfidence

      // Get certainty rules for the disease
      const rulesResult = await query("SELECT confirmation_questions FROM certainty_rules WHERE disease_id = $1", [
        diseaseId,
      ])

      if (rulesResult.rows.length > 0) {
        const rules = rulesResult.rows[0]
        const questions = rules.confirmation_questions || []

        // Apply adjustments based on answers
        for (let i = 0; i < answers.length; i++) {
          const answer = answers[i]
          const question = questions[i]

          if (question) {
            if (answer.answer === true) {
              combinedConfidence += question.yes_certainty_adjustment || 0
            } else {
              combinedConfidence += question.no_certainty_adjustment || 0
            }
          }
        }
      }

      // Ensure confidence stays within 0-1 range
      combinedConfidence = Math.max(0, Math.min(1, combinedConfidence))

      const certaintyLevel = this.getCertaintyLevel(combinedConfidence)

      logger.info(`Combined certainty calculated: ${certaintyLevel} (${combinedConfidence})`)

      return {
        confidence: Math.round(combinedConfidence * 100) / 100,
        certaintyLevel,
        confidencePercentage: Math.round(combinedConfidence * 100),
      }
    } catch (error) {
      logger.error("Error calculating combined certainty:", error)
      throw error
    }
  }

  /**
   * Get confirmation questions for a disease
   * @param {number} diseaseId - Disease ID
   * @returns {Promise<Array>} Confirmation questions
   */
  async getConfirmationQuestions(diseaseId) {
    try {
      const result = await query("SELECT confirmation_questions FROM certainty_rules WHERE disease_id = $1", [
        diseaseId,
      ])

      if (result.rows.length === 0) {
        return []
      }

      return result.rows[0].confirmation_questions || []
    } catch (error) {
      logger.error("Error getting confirmation questions:", error)
      throw error
    }
  }
}

export default new CertaintyFactorService()
