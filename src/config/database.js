import pg from "pg"
import dotenv from "dotenv"
import logger from "../utils/logger.js"

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
})

pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", err)
})

export const query = (text, params) => pool.query(text, params)

export const initializeDatabase = async () => {
  try {
    // Test connection
    const result = await pool.query("SELECT NOW()")
    logger.info("Database connected successfully")

    // Create tables
    await createTables()
  } catch (error) {
    logger.error("Database initialization error:", error)
    process.exit(1)
  }
}

const createTables = async () => {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Diseases table
    `CREATE TABLE IF NOT EXISTS diseases (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      prevention_methods TEXT,
      symptoms_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Symptoms table
    `CREATE TABLE IF NOT EXISTS symptoms (
      id SERIAL PRIMARY KEY,
      code VARCHAR(10) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Rules table (Forward Chaining)
    `CREATE TABLE IF NOT EXISTS rules (
      id SERIAL PRIMARY KEY,
      disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
      symptom_ids INTEGER[] NOT NULL,
      confidence_level DECIMAL(3,2) DEFAULT 1.0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Diagnosis History table
    `CREATE TABLE IF NOT EXISTS diagnosis_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      disease_id INTEGER REFERENCES diseases(id),
      diagnosis_type VARCHAR(20) NOT NULL,
      confidence_level DECIMAL(3,2),
      symptoms_selected INTEGER[],
      image_path VARCHAR(255),
      certainty_level VARCHAR(50),
      ai_solution TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // AI Models table
    `CREATE TABLE IF NOT EXISTS ai_models (
      id SERIAL PRIMARY KEY,
      model_name VARCHAR(100) NOT NULL,
      version VARCHAR(20),
      model_path VARCHAR(255),
      accuracy DECIMAL(3,2),
      classes TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Certainty Rules table
    `CREATE TABLE IF NOT EXISTS certainty_rules (
      id SERIAL PRIMARY KEY,
      disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
      base_certainty DECIMAL(3,2),
      confirmation_questions JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ]

  for (const table of tables) {
    try {
      await pool.query(table)
    } catch (error) {
      logger.error("Error creating table:", error)
    }
  }

  logger.info("All tables created/verified")
}

export default pool
