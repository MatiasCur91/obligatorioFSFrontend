import Joi from "joi"

export const profileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio",
      "string.min":   "Mínimo 2 caracteres",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "Email inválido",
    }),
  password: Joi.string()
    .min(6)
    .optional()
    .allow("")
    .messages({
      "string.min": "Mínimo 6 caracteres",
    }),
})