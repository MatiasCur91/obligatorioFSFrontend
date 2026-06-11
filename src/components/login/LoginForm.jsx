import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { loginSchema } from "../../validators/auth.validators"
import { setCredentials } from "../../features/auth/auth.slice"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Alert, AlertDescription } from "../ui/alert"
import api from "../../api/api"

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: joiResolver(loginSchema),
    mode: "onChange"
  })

  const procesarForm = async (data) => {
    try {
      const res = await api.post("/auth/login", data)
      dispatch(setCredentials({
        user: res.data.user,
        token: res.data.token,
      }))
      toast.success("¡Bienvenido!")
      navigate("/dashboard")
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al iniciar sesión"
      toast.error(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(procesarForm)} className="space-y-4">

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input
          type="email"
          id="email"
          placeholder="tu@email.com"
          {...register("email")}
        />
        {errors.email && (
          <Alert variant="destructive" className="py-2 px-3">
            <AlertDescription className="text-xs">{errors.email.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
        <Input
          type="password"
          id="password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <Alert variant="destructive" className="py-2 px-3">
            <AlertDescription className="text-xs">{errors.password.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>

    </form>
  )
}

export default LoginForm