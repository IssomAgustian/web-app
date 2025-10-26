import sharp from "sharp"
import fs from "fs/promises"
import path from "path"
import logger from "../utils/logger.js"
import { config } from "../config/app.js"

export class ImageProcessingService {
  /**
   * Process and validate uploaded image
   * @param {Buffer} imageBuffer - Image file buffer
   * @param {string} filename - Original filename
   * @returns {Promise<Object>} Processed image info
   */
  async processImage(imageBuffer, filename) {
    try {
      // Validate file size
      if (imageBuffer.length > config.upload.maxFileSize) {
        throw new Error("File size exceeds maximum limit")
      }

      // Create uploads directory if not exists
      const uploadDir = config.upload.uploadDir
      await fs.mkdir(uploadDir, { recursive: true })

      // Generate unique filename
      const timestamp = Date.now()
      const ext = path.extname(filename)
      const uniqueFilename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}${ext}`
      const filepath = path.join(uploadDir, uniqueFilename)

      // Resize and optimize image
      const processedImage = await sharp(imageBuffer)
        .resize(512, 512, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 80 })
        .toBuffer()

      // Save processed image
      await fs.writeFile(filepath, processedImage)

      logger.info(`Image processed and saved: ${uniqueFilename}`)

      return {
        filename: uniqueFilename,
        filepath: filepath,
        url: `/uploads/images/${uniqueFilename}`,
        size: processedImage.length,
      }
    } catch (error) {
      logger.error("Image processing error:", error)
      throw error
    }
  }

  /**
   * Delete image file
   * @param {string} filename - Filename to delete
   */
  async deleteImage(filename) {
    try {
      const filepath = path.join(config.upload.uploadDir, filename)
      await fs.unlink(filepath)
      logger.info(`Image deleted: ${filename}`)
    } catch (error) {
      logger.error("Error deleting image:", error)
    }
  }

  /**
   * Get image buffer for AI processing
   * @param {string} filepath - Image filepath
   * @returns {Promise<Buffer>} Image buffer
   */
  async getImageBuffer(filepath) {
    try {
      return await fs.readFile(filepath)
    } catch (error) {
      logger.error("Error reading image:", error)
      throw error
    }
  }
}

export default new ImageProcessingService()
