import { useSelector } from "react-redux"
import { Navigate, Link } from "react-router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "../../components/login/LoginForm"

const LoginPage = () => {
  const token = useSelector(state => state.auth.token)
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="auth-container">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">📚</div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight">
            Iniciar sesión
          </CardTitle>
          <CardDescription>
            Ingresá a tu cuenta para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Registrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage