import { query } from "../config/database.js"
import logger from "../utils/logger.js"

export class ReportService {
  /**
   * Generate disease report
   */
  async generateDiseaseReport(startDate, endDate) {
    try {
      const result = await query(
        `SELECT d.name, COUNT(dh.id) as total_diagnoses, 
         AVG(dh.confidence_level) as avg_confidence
        FROM diagnosis_history dh
        JOIN diseases d ON dh.disease_id = d.id
        WHERE dh.created_at BETWEEN $1 AND $2
        GROUP BY d.id, d.name
        ORDER BY total_diagnoses DESC`,
        [startDate, endDate],
      )

      return result.rows
    } catch (error) {
      logger.error("Error generating disease report:", error)
      throw error
    }
  }

  /**
   * Generate usage report
   */
  async generateUsageReport(startDate, endDate) {
    try {
      const result = await query(
        `SELECT 
         DATE(created_at) as date,
         COUNT(*) as total_diagnoses,
         COUNT(DISTINCT user_id) as unique_users,
         diagnosis_type,
         AVG(confidence_level) as avg_confidence
        FROM diagnosis_history
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY DATE(created_at), diagnosis_type
        ORDER BY date DESC`,
        [startDate, endDate],
      )

      return result.rows
    } catch (error) {
      logger.error("Error generating usage report:", error)
      throw error
    }
  }

  /**
   * Generate accuracy report
   */
  async generateAccuracyReport() {
    try {
      const result = await query(
        `SELECT 
         diagnosis_type,
         COUNT(*) as total,
         COUNT(CASE WHEN confidence_level >= 0.8 THEN 1 END) as high_confidence,
         COUNT(CASE WHEN confidence_level >= 0.6 AND confidence_level < 0.8 THEN 1 END) as medium_confidence,
         COUNT(CASE WHEN confidence_level < 0.6 THEN 1 END) as low_confidence,
         AVG(confidence_level) as avg_confidence
        FROM diagnosis_history
        GROUP BY diagnosis_type`,
      )

      return result.rows
    } catch (error) {
      logger.error("Error generating accuracy report:", error)
      throw error
    }
  }
}

export default new ReportService()
