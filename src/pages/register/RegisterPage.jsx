import { useSelector } from "react-redux"
import { Navigate, Link } from "react-router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import RegisterForm from "../../components/register/RegisterForm"
import { BookOpen } from "lucide-react"


const RegisterPage = () => {
  const token = useSelector(state => state.auth.token)
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="auth-container">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          
          <BookOpen className="size-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl font-black uppercase tracking-tight">
            Crear cuenta
          </CardTitle>
          <CardDescription>
            Completá tus datos para registrarte
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link to="/" className="font-semibold text-primary hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage