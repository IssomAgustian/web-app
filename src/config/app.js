export const config = {
  // Certainty Factor thresholds
  certaintyThresholds: {
    notPresent: 0.2,
    maybe: 0.4,
    likely: 0.6,
    almostCertain: 0.8,
    certain: 1.0,
  },

  // Certainty levels
  certaintyLevels: {
    "Tidak ada": 0.2,
    Mungkin: 0.4,
    "Kemungkinan Besar": 0.6,
    "Hampir Pasti": 0.8,
    Pasti: 1.0,
  },

  // Forward Chaining threshold
  forwardChainingThreshold: 0.6,

  // File upload settings
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    uploadDir: "./uploads/images",
  },

  // AI Settings
  ai: {
    provider: process.env.AI_PROVIDER || "openai",
    model: process.env.AI_MODEL || "gpt-3.5-turbo",
  },
}
