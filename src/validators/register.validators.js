export function validateRegister(values) {
  const errors = {};
  if (!values.name) errors.name = "Nombre es obligatorio.";
  if (!values.email) errors.email = "Email es obligatorio.";
  if (!values.password) errors.password = "Contraseña es obligatoria.";
  if (values.password !== values.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden.";
  return errors;
}
