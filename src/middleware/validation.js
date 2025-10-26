import Joi from "joi"

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
        },
      })
    }

    req.validatedData = value
    next()
  }
}

// Validation schemas
export const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createDisease: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    prevention_methods: Joi.string(),
    symptoms_description: Joi.string(),
  }),

  createSymptom: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string(),
  }),

  createRule: Joi.object({
    disease_id: Joi.number().required(),
    symptom_ids: Joi.array().items(Joi.number()).required(),
    confidence_level: Joi.number().min(0).max(1),
  }),

  diagnoseSymptoms: Joi.object({
    symptom_ids: Joi.array().items(Joi.number()).required(),
  }),
}
