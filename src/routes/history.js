import express from "express"
import { query } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import { authenticate } from "../middleware/auth.js"
import { formatResponse } from "../utils/helpers.js"

const router = express.Router()

// Get user's diagnosis history
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const { limit = 10, offset = 0 } = req.query

    const result = await query(
      `SELECT dh.*, d.name as disease_name 
    FROM diagnosis_history dh 
    JOIN diseases d ON dh.disease_id = d.id 
    WHERE dh.user_id = $1 
    ORDER BY dh.created_at DESC 
    LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset],
    )

    const countResult = await query("SELECT COUNT(*) FROM diagnosis_history WHERE user_id = $1", [req.user.id])

    res.json(
      formatResponse(
        true,
        {
          data: result.rows,
          total: Number.parseInt(countResult.rows[0].count),
          limit: Number.parseInt(limit),
          offset: Number.parseInt(offset),
        },
        "History retrieved",
      ),
    )
  }),
)

// Get specific diagnosis history
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT dh.*, d.* 
    FROM diagnosis_history dh 
    JOIN diseases d ON dh.disease_id = d.id 
    WHERE dh.id = $1 AND dh.user_id = $2`,
      [req.params.id, req.user.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "History not found"))
    }

    res.json(formatResponse(true, result.rows[0], "History retrieved"))
  }),
)

// Delete diagnosis history
router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM diagnosis_history WHERE id = $1 AND user_id = $2 RETURNING id", [
      req.params.id,
      req.user.id,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "History not found"))
    }

    res.json(formatResponse(true, null, "History deleted"))
  }),
)

export default router
