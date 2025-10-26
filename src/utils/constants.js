export const DIAGNOSIS_TYPES = {
  SYMPTOMS: "symptoms",
  IMAGE: "image",
}

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
}

export const CERTAINTY_LEVELS = {
  NOT_PRESENT: "Tidak ada",
  MAYBE: "Mungkin",
  LIKELY: "Kemungkinan Besar",
  ALMOST_CERTAIN: "Hampir Pasti",
  CERTAIN: "Pasti",
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Email atau password salah",
  USER_EXISTS: "User sudah terdaftar",
  USER_NOT_FOUND: "User tidak ditemukan",
  UNAUTHORIZED: "Anda tidak memiliki akses",
  INVALID_TOKEN: "Token tidak valid",
  MISSING_FIELDS: "Field yang diperlukan tidak lengkap",
  INTERNAL_ERROR: "Terjadi kesalahan pada server",
}
