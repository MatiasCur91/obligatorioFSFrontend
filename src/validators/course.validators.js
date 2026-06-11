import Joi from "joi"

export const courseSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio",
      "string.min": "Mínimo 3 caracteres",
    }),
  categoria: Joi.string()
    .required()
    .messages({
      "string.empty": "La categoría es obligatoria",
    }),
  descripcion: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.empty": "La descripción es obligatoria",
      "string.min": "Mínimo 10 caracteres",
    }),
  temas: Joi.string()
    .required()
    .messages({
      "string.empty": "Los temas son obligatorios",
    }),
  link: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "El link es obligatorio",
      "string.uri": "Debe ser una URL válida",
    }),
  thumbnail: Joi.string()
    .uri()
    .optional()
    .allow("")
    .messages({
      "string.uri": "Debe ser una URL válida",
    }),
  duracion: Joi.string()
    .optional()
    .allow(""),
})
