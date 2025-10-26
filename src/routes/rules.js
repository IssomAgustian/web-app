import express from "express"
import { query } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import { authenticate, authorize } from "../middleware/auth.js"
import { formatResponse } from "../utils/helpers.js"

const router = express.Router()

// Get all rules
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await query(`
    SELECT r.*, d.name as disease_name 
    FROM rules r 
    JOIN diseases d ON r.disease_id = d.id 
    ORDER BY d.name
  `)
    res.json(formatResponse(true, result.rows, "Rules retrieved"))
  }),
)

// Get rules by disease
router.get(
  "/disease/:diseaseId",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM rules WHERE disease_id = $1", [req.params.diseaseId])
    res.json(formatResponse(true, result.rows, "Rules retrieved"))
  }),
)

// Create rule (admin only)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { disease_id, symptom_ids, confidence_level } = req.body

    if (!disease_id || !symptom_ids || symptom_ids.length === 0) {
      return res.status(400).json(formatResponse(false, null, "Disease ID and symptom IDs required"))
    }

    const result = await query(
      "INSERT INTO rules (disease_id, symptom_ids, confidence_level) VALUES ($1, $2, $3) RETURNING *",
      [disease_id, symptom_ids, confidence_level || 1.0],
    )

    res.status(201).json(formatResponse(true, result.rows[0], "Rule created"))
  }),
)

// Update rule (admin only)
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { disease_id, symptom_ids, confidence_level } = req.body

    const result = await query(
      "UPDATE rules SET disease_id = COALESCE($1, disease_id), symptom_ids = COALESCE($2, symptom_ids), confidence_level = COALESCE($3, confidence_level), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [disease_id, symptom_ids, confidence_level, req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Rule not found"))
    }

    res.json(formatResponse(true, result.rows[0], "Rule updated"))
  }),
)

// Delete rule (admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM rules WHERE id = $1 RETURNING id", [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Rule not found"))
    }

    res.json(formatResponse(true, null, "Rule deleted"))
  }),
)

export default router
