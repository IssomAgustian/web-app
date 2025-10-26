import express from "express"
import { query } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import { authenticate, authorize } from "../middleware/auth.js"
import { formatResponse } from "../utils/helpers.js"

const router = express.Router()

// Get all symptoms
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM symptoms ORDER BY category, name")
    res.json(formatResponse(true, result.rows, "Symptoms retrieved"))
  }),
)

// Get symptom by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM symptoms WHERE id = $1", [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Symptom not found"))
    }

    res.json(formatResponse(true, result.rows[0], "Symptom retrieved"))
  }),
)

// Create symptom (admin only)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { code, name, description, category } = req.body

    if (!code || !name) {
      return res.status(400).json(formatResponse(false, null, "Code and name required"))
    }

    const result = await query(
      "INSERT INTO symptoms (code, name, description, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [code, name, description, category],
    )

    res.status(201).json(formatResponse(true, result.rows[0], "Symptom created"))
  }),
)

// Update symptom (admin only)
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { code, name, description, category } = req.body

    const result = await query(
      "UPDATE symptoms SET code = COALESCE($1, code), name = COALESCE($2, name), description = COALESCE($3, description), category = COALESCE($4, category) WHERE id = $5 RETURNING *",
      [code, name, description, category, req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Symptom not found"))
    }

    res.json(formatResponse(true, result.rows[0], "Symptom updated"))
  }),
)

// Delete symptom (admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM symptoms WHERE id = $1 RETURNING id", [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Symptom not found"))
    }

    res.json(formatResponse(true, null, "Symptom deleted"))
  }),
)

export default router
