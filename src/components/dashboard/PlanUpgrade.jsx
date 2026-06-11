import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import { toast } from "react-toastify"
import { Sparkles, Loader2, Info } from "lucide-react"

// Importaciones de shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"

import api from "../../api/api"
import { setCredentials } from "../../features/auth/auth.slice"

const PLAN_LIMIT = 4

const PlanUpgrade = () => {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const { courses } = useSelector((state) => state.courses)

  const [upgrading, setUpgrading] = useState(false)

  // Solo se muestra para instructores
  if (user?.role !== "instructor") return null

  const isPlus = user?.plan === "plus"
  const isPremium = user?.plan === "premium"
  const count = courses.length
  
  // Porcentaje limpio para la barra de progreso
  const porcentaje = isPlus ? Math.min(Math.round((count / PLAN_LIMIT) * 100), 100) : 100

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      await api.put(`/users/${user.id}/plan`, { plan: "premium" })
      
      dispatch(
        setCredentials({
          token,
          user: { ...user, plan: "premium" },
        })
      )
      toast.success("¡Plan actualizado a Premium!")
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al cambiar el plan"
      toast.error(msg)
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-muted/10">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight">Suscripción y Uso</CardTitle>
          <CardDescription>Controla el estado de tu cuenta y límites de publicación.</CardDescription>
        </div>
        <Badge variant={isPremium ? "default" : "secondary"} className="h-6 font-semibold px-2.5">
          {isPremium ? "Premium ⭐" : "Plan Plus"}
        </Badge>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Sección: Informe de Uso */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-muted-foreground flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              {isPlus ? "Cursos permitidos" : "Cursos publicados"}
            </span>
            <span className="font-bold text-foreground">
              {count} {isPlus ? `/ ${PLAN_LIMIT}` : count === 1 ? "curso" : "cursos"}
            </span>
          </div>

          {/* Componente Progress de shadcn */}
          <Progress 
            value={porcentaje} 
            className={`h-2.5 ${porcentaje >= 100 && isPlus ? "[&>div]:bg-destructive" : ""}`}
          />
          
          {isPlus && (
            <p className="text-xs text-muted-foreground text-right font-medium">
              Has utilizado el {porcentaje}% de tu cupo disponible.
            </p>
          )}
        </div>

        {/* Sección interactiva con el Switch */}
        <div className="flex items-start justify-between space-x-4 rounded-lg border p-4 bg-card transition-colors">
          <div className="space-y-1 flex-1">
            <Label htmlFor="plan-switch" className="text-sm font-semibold leading-none flex items-center gap-1.5 cursor-pointer">
              <Sparkles className={`h-4 w-4 ${isPremium ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
              Modo Premium Ilimitado
            </Label>
            <p className="text-xs text-muted-foreground leading-normal max-w-85">
              {isPremium 
                ? "Disfrutas de acceso total. Puedes crear y publicar cursos de forma ilimitada." 
                : "Quita las restricciones de cupos y publica todos los cursos que desees."}
            </p>
          </div>

          <div className="flex items-center h-full pt-1">
            {upgrading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            ) : (
              <Switch
                id="plan-switch"
                checked={isPremium}
                disabled={isPremium || upgrading}
                onCheckedChange={(checked) => checked && handleUpgrade()}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PlanUpgrade