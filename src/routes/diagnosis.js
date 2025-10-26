import express from "express"
import multer from "multer"
import { query } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import { formatResponse } from "../utils/helpers.js"
import forwardChainingService from "../services/forwardChainingService.js"
import certaintyFactorService from "../services/certaintyFactorService.js"
import imageProcessingService from "../services/imageProcessingService.js"
import aiSolutionService from "../services/aiSolutionService.js"
import logger from "../utils/logger.js"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Diagnose by symptoms (Forward Chaining)
router.post(
  "/symptoms",
  asyncHandler(async (req, res) => {
    const { symptom_ids } = req.body

    if (!symptom_ids || !Array.isArray(symptom_ids) || symptom_ids.length === 0) {
      return res.status(400).json(formatResponse(false, null, "Symptom IDs array required"))
    }

    // Forward chaining diagnosis
    const diagnosisResult = await forwardChainingService.diagnose(symptom_ids)

    if (!diagnosisResult.success) {
      return res.status(400).json(formatResponse(false, null, diagnosisResult.message))
    }

    // Generate AI solution
    const aiSolution = await aiSolutionService.generateSolution(diagnosisResult.disease, diagnosisResult.confidence)

    // Save to history if user is authenticated
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())

        await query(
          `INSERT INTO diagnosis_history 
        (user_id, disease_id, diagnosis_type, confidence_level, symptoms_selected, ai_solution) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            decoded.id,
            diagnosisResult.disease.id,
            "symptoms",
            diagnosisResult.confidence,
            symptom_ids,
            JSON.stringify(aiSolution),
          ],
        )
      } catch (error) {
        logger.warn("Could not save diagnosis history:", error)
      }
    }

    res.json(
      formatResponse(
        true,
        {
          disease: diagnosisResult.disease,
          confidence: diagnosisResult.confidence,
          solution: aiSolution,
        },
        "Diagnosis completed",
      ),
    )
  }),
)

// Diagnose by image (Certainty Factor)
router.post(
  "/image",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json(formatResponse(false, null, "Image file required"))
    }

    // Process image
    const processedImage = await imageProcessingService.processImage(req.file.buffer, req.file.originalname)

    // Mock AI model prediction (in production, use actual ML model)
    const mockPrediction = {
      disease: { id: 1, name: "Blast", description: "Penyakit blast pada padi" },
      confidence: 0.85,
    }

    // Apply certainty factor
    const diagnosis = certaintyFactorService.applyUncertainty(mockPrediction)

    // Get confirmation questions
    const confirmationQuestions = await certaintyFactorService.getConfirmationQuestions(mockPrediction.disease.id)

    // Generate AI solution
    const aiSolution = await aiSolutionService.generateSolution(mockPrediction.disease, diagnosis.confidence)

    res.json(
      formatResponse(
        true,
        {
          initial_diagnosis: diagnosis,
          confirmation_questions: confirmationQuestions,
          solution: aiSolution,
          image_path: processedImage.url,
        },
        "Image diagnosis completed",
      ),
    )
  }),
)

// Confirm image diagnosis with answers
router.post(
  "/image/confirm",
  asyncHandler(async (req, res) => {
    const { disease_id, base_confidence, answers } = req.body

    if (!disease_id || base_confidence === undefined) {
      return res.status(400).json(formatResponse(false, null, "Disease ID and confidence required"))
    }

    // Calculate combined certainty
    const finalDiagnosis = await certaintyFactorService.calculateCombinedCertainty(
      base_confidence,
      answers || [],
      disease_id,
    )

    // Get disease details
    const diseaseResult = await query("SELECT * FROM diseases WHERE id = $1", [disease_id])
    const disease = diseaseResult.rows[0]

    // Generate AI solution with final confidence
    const aiSolution = await aiSolutionService.generateSolution(disease, finalDiagnosis.confidence)

    res.json(
      formatResponse(
        true,
        {
          final_diagnosis: {
            disease,
            ...finalDiagnosis,
          },
          solution: aiSolution,
        },
        "Diagnosis confirmed",
      ),
    )
  }),
)

export default router
