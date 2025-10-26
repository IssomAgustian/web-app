import express from "express"
import { query } from "../config/database.js"
import { hashPassword, comparePassword, generateToken, formatResponse } from "../utils/helpers.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import { authenticate } from "../middleware/auth.js"
import logger from "../utils/logger.js"

const router = express.Router()

// Register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json(formatResponse(false, null, "Missing required fields"))
    }

    if (password !== confirmPassword) {
      return res.status(400).json(formatResponse(false, null, "Passwords do not match"))
    }

    // Check if user exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1 OR username = $2", [email, username])
    if (existingUser.rows.length > 0) {
      return res.status(400).json(formatResponse(false, null, "User already exists"))
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const result = await query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [username, email, passwordHash, "user"],
    )

    const user = result.rows[0]
    const token = generateToken(user)

    logger.info(`User registered: ${username}`)

    res.status(201).json(formatResponse(true, { user, token }, "User registered successfully"))
  }),
)

// Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json(formatResponse(false, null, "Email and password required"))
    }

    const result = await query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      return res.status(401).json(formatResponse(false, null, "Invalid credentials"))
    }

    const user = result.rows[0]
    const isPasswordValid = await comparePassword(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json(formatResponse(false, null, "Invalid credentials"))
    }

    const token = generateToken(user)

    logger.info(`User logged in: ${user.username}`)

    res.json(
      formatResponse(
        true,
        {
          user: { id: user.id, username: user.username, email: user.email, role: user.role },
          token,
        },
        "Login successful",
      ),
    )
  }),
)

// Get current user
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const result = await query("SELECT id, username, email, role, created_at FROM users WHERE id = $1", [req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json(formatResponse(false, null, "User not found"))
    }

    res.json(formatResponse(true, result.rows[0], "User retrieved"))
  }),
)

// Logout (client-side token removal)
router.post("/logout", authenticate, (req, res) => {
  logger.info(`User logged out: ${req.user.username}`)
  res.json(formatResponse(true, null, "Logout successful"))
})

export default router
