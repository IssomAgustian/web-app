import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { initializeDatabase } from "./src/config/database.js"
import { errorHandler } from "./src/middleware/errorHandler.js"
import logger from "./src/utils/logger.js"

// Routes
import authRoutes from "./src/routes/auth.js"
import diseaseRoutes from "./src/routes/diseases.js"
import symptomRoutes from "./src/routes/symptoms.js"
import ruleRoutes from "./src/routes/rules.js"
import diagnosisRoutes from "./src/routes/diagnosis.js"
import historyRoutes from "./src/routes/history.js"
import adminRoutes from "./src/routes/admin.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Initialize Database
await initializeDatabase()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/diseases", diseaseRoutes)
app.use("/api/symptoms", symptomRoutes)
app.use("/api/rules", ruleRoutes)
app.use("/api/diagnose", diagnosisRoutes)
app.use("/api/history", historyRoutes)
app.use("/api/admin", adminRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
