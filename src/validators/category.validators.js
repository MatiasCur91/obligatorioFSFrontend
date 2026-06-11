import Joi from "joi"

export const categorySchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio",
      "string.min":   "Mínimo 2 caracteres",
    }),
})