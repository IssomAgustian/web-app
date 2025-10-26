import redis from "redis"
import logger from "./logger.js"

let client

export const initializeCache = async () => {
  try {
    client = redis.createClient({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
    })

    client.on("error", (err) => logger.error("Redis error:", err))
    client.on("connect", () => logger.info("Redis connected"))

    await client.connect()
  } catch (error) {
    logger.warn("Redis not available, caching disabled:", error.message)
  }
}

export const getCache = async (key) => {
  try {
    if (!client) return null
    const value = await client.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    logger.error("Cache get error:", error)
    return null
  }
}

export const setCache = async (key, value, ttl = 3600) => {
  try {
    if (!client) return
    await client.setEx(key, ttl, JSON.stringify(value))
  } catch (error) {
    logger.error("Cache set error:", error)
  }
}

export const deleteCache = async (key) => {
  try {
    if (!client) return
    await client.del(key)
  } catch (error) {
    logger.error("Cache delete error:", error)
  }
}

export const clearCache = async (pattern) => {
  try {
    if (!client) return
    const keys = await client.keys(pattern)
    if (keys.length > 0) {
      await client.del(keys)
    }
  } catch (error) {
    logger.error("Cache clear error:", error)
  }
}
