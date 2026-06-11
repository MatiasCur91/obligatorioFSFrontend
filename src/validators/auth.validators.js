import Joi from "joi"

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "Email inválido",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "La contraseña es obligatoria",
      "string.min": "Mínimo 6 caracteres",
    }),
})

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio",
      "string.min": "Mínimo 2 caracteres",
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
    .required()
    .messages({
      "string.empty": "La contraseña es obligatoria",
      "string.min": "Mínimo 6 caracteres",
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Las contraseñas no coinciden",
      "any.required": "Repetí la contraseña",
    }),
  role: Joi.string()
  .valid("estudiante", "instructor")
  .default("estudiante"),
})