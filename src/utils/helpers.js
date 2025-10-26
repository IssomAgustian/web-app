import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

export const formatResponse = (success, data = null, message = "") => {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}
