import express from "express"
import { query } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import { authenticate, authorize } from "../middleware/auth.js"
import { formatResponse } from "../utils/helpers.js"

const router = express.Router()

// Get all diseases
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM diseases ORDER BY name")
    res.json(formatResponse(true, result.rows, "Diseases retrieved"))
  }),
)

// Get disease by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM diseases WHERE id = $1", [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Disease not found"))
    }

    res.json(formatResponse(true, result.rows[0], "Disease retrieved"))
  }),
)

// Create disease (admin only)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { name, description, prevention_methods, symptoms_description } = req.body

    if (!name) {
      return res.status(400).json(formatResponse(false, null, "Disease name required"))
    }

    const result = await query(
      "INSERT INTO diseases (name, description, prevention_methods, symptoms_description) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, prevention_methods, symptoms_description],
    )

    res.status(201).json(formatResponse(true, result.rows[0], "Disease created"))
  }),
)

// Update disease (admin only)
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { name, description, prevention_methods, symptoms_description } = req.body

    const result = await query(
      "UPDATE diseases SET name = COALESCE($1, name), description = COALESCE($2, description), prevention_methods = COALESCE($3, prevention_methods), symptoms_description = COALESCE($4, symptoms_description), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [name, description, prevention_methods, symptoms_description, req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Disease not found"))
    }

    res.json(formatResponse(true, result.rows[0], "Disease updated"))
  }),
)

// Delete disease (admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM diseases WHERE id = $1 RETURNING id", [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "Disease not found"))
    }

    res.json(formatResponse(true, null, "Disease deleted"))
  }),
)

export default router
