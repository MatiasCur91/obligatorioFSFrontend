import { useForm, Controller } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { registerSchema } from "../../validators/auth.validators"
import { setCredentials } from "../../features/auth/auth.slice"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Alert, AlertDescription } from "../ui/alert"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

import api from "../../api/api"

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: joiResolver(registerSchema),
    mode: "onChange",
    defaultValues: { role: "student" }
  })

  const isInstructor = watch("role") === "instructor"

  const procesarForm = async (data) => {
    try {
      const res = await api.post("/auth/register", data)
      dispatch(setCredentials({
        user: res.data.user,
        token: res.data.token,
      }))
      toast.success("¡Cuenta creada exitosamente!")
      navigate("/dashboard")
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al registrarse"
      toast.error(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(procesarForm)} className="space-y-4">

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">Nombre</label>
        <Input type="text" id="name" placeholder="Tu nombre" {...register("name")} />
        {errors.name && (
          <Alert variant="destructive" className="py-2 px-3">
            <AlertDescription className="text-xs">{errors.name.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input type="email" id="email" placeholder="tu@email.com" {...register("email")} />
        {errors.email && (
          <Alert variant="destructive" className="py-2 px-3">
            <AlertDescription className="text-xs">{errors.email.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
        <Input type="password" id="password" placeholder="••••••••" {...register("password")} />
        {errors.password && (
          <Alert variant="destructive" className="py-2 px-3">
            <AlertDescription className="text-xs">{errors.password.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Repetir contraseña</label>
        <Input type="password" id="confirmPassword" placeholder="••••••••" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <Alert variant="destructive" className="py-2 px-3">
            <AlertDescription className="text-xs">{errors.confirmPassword.message}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Switch de rol */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="role-switch" className="text-sm font-medium cursor-pointer">
            {isInstructor ? "Instructor" : "Estudiante"}
          </Label>
          <p className="text-xs text-muted-foreground">
            {isInstructor
              ? "Podrás crear y publicar cursos."
              : "Podrás explorar y acceder a los cursos."}
          </p>
        </div>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Switch
              id="role-switch"
              checked={field.value === "instructor"}
              onCheckedChange={(checked) => field.onChange(checked ? "instructor" : "student")}
            />
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Registrando..." : "Registrarse"}
      </Button>

    </form>
  )
}

export default RegisterForm