import express from "express"
import { query } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import { authenticate, authorize } from "../middleware/auth.js"
import { formatResponse } from "../utils/helpers.js"

const router = express.Router()

// Dashboard statistics
router.get(
  "/dashboard/stats",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    // Total users
    const usersResult = await query("SELECT COUNT(*) FROM users")
    const totalUsers = Number.parseInt(usersResult.rows[0].count)

    // Total diagnoses
    const diagnosisResult = await query("SELECT COUNT(*) FROM diagnosis_history")
    const totalDiagnoses = Number.parseInt(diagnosisResult.rows[0].count)

    // Diagnoses by type
    const typeResult = await query(
      "SELECT diagnosis_type, COUNT(*) as count FROM diagnosis_history GROUP BY diagnosis_type",
    )

    // Most common diseases
    const diseasesResult = await query(
      `SELECT d.name, COUNT(dh.id) as count 
    FROM diagnosis_history dh 
    JOIN diseases d ON dh.disease_id = d.id 
    GROUP BY d.id, d.name 
    ORDER BY count DESC 
    LIMIT 10`,
    )

    // Recent diagnoses
    const recentResult = await query(
      `SELECT dh.*, d.name as disease_name, u.username 
    FROM diagnosis_history dh 
    JOIN diseases d ON dh.disease_id = d.id 
    LEFT JOIN users u ON dh.user_id = u.id 
    ORDER BY dh.created_at DESC 
    LIMIT 10`,
    )

    res.json(
      formatResponse(
        true,
        {
          total_users: totalUsers,
          total_diagnoses: totalDiagnoses,
          diagnoses_by_type: typeResult.rows,
          most_common_diseases: diseasesResult.rows,
          recent_diagnoses: recentResult.rows,
        },
        "Dashboard stats retrieved",
      ),
    )
  }),
)

// Get all users (admin)
router.get(
  "/users",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { limit = 20, offset = 0 } = req.query

    const result = await query(
      "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    )

    const countResult = await query("SELECT COUNT(*) FROM users")

    res.json(
      formatResponse(
        true,
        {
          data: result.rows,
          total: Number.parseInt(countResult.rows[0].count),
        },
        "Users retrieved",
      ),
    )
  }),
)

// Get diagnosis history (admin)
router.get(
  "/diagnosis-history",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { limit = 20, offset = 0, disease_id, diagnosis_type } = req.query

    let whereClause = "WHERE 1=1"
    const params = []

    if (disease_id) {
      whereClause += ` AND dh.disease_id = $${params.length + 1}`
      params.push(disease_id)
    }

    if (diagnosis_type) {
      whereClause += ` AND dh.diagnosis_type = $${params.length + 1}`
      params.push(diagnosis_type)
    }

    params.push(limit)
    params.push(offset)

    const result = await query(
      `SELECT dh.*, d.name as disease_name, u.username 
    FROM diagnosis_history dh 
    JOIN diseases d ON dh.disease_id = d.id 
    LEFT JOIN users u ON dh.user_id = u.id 
    ${whereClause}
    ORDER BY dh.created_at DESC 
    LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    )

    res.json(formatResponse(true, result.rows, "Diagnosis history retrieved"))
  }),
)

// Get disease statistics
router.get(
  "/diseases/stats",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT d.id, d.name, COUNT(dh.id) as diagnosis_count 
    FROM diseases d 
    LEFT JOIN diagnosis_history dh ON d.id = dh.disease_id 
    GROUP BY d.id, d.name 
    ORDER BY diagnosis_count DESC`,
    )

    res.json(formatResponse(true, result.rows, "Disease statistics retrieved"))
  }),
)

// Export diagnosis data
router.get(
  "/export/diagnoses",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT dh.id, dh.created_at, d.name as disease, dh.diagnosis_type, dh.confidence_level, u.username 
    FROM diagnosis_history dh 
    JOIN diseases d ON dh.disease_id = d.id 
    LEFT JOIN users u ON dh.user_id = u.id 
    ORDER BY dh.created_at DESC`,
    )

    // Convert to CSV
    const csv = [
      ["ID", "Tanggal", "Penyakit", "Tipe Diagnosis", "Confidence", "User"],
      ...result.rows.map((row) => [
        row.id,
        row.created_at,
        row.disease,
        row.diagnosis_type,
        row.confidence_level,
        row.username || "Anonymous",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", 'attachment; filename="diagnoses.csv"')
    res.send(csv)
  }),
)

export default router
