import { useState } from "react"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"

// Importaciones de shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { profileSchema } from "../../validators/profile.validators"
import { setCredentials, logout } from "../../features/auth/auth.slice"
import api from "../../api/api"

const ProfileForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const [deleting, setDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    resolver: joiResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  const procesarForm = async (data) => {
    try {
      const res = await api.put(`/users/${user.id}`, data)
      dispatch(
        setCredentials({
          token,
          user: res.data.usuario,
        })
      )
      toast.success("Perfil actualizado correctamente")
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al actualizar el perfil"
      toast.error(msg)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/users/${user.id}`)
      dispatch(logout())
      toast.success("Cuenta eliminada")
      navigate("/")
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al eliminar la cuenta"
      toast.error(msg)
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto py-6">
      {/* Formulario Principal */}
      <form onSubmit={handleSubmit(procesarForm)} className="space-y-6">
        <div className="space-y-4">
          {/* Campo: Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              placeholder="Tu nombre completo"
              {...register("name")}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Campo: Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              {...register("email")}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Campo: Password */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Nueva contraseña</Label>
              <span className="text-xs text-muted-foreground font-normal">Opcional</span>
            </div>
            <Input
              type="password"
              id="password"
              placeholder="Dejá vacío para no cambiarla"
              {...register("password")}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!isValid || isSubmitting || !isDirty}
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>

          {/* AlertDialog para Eliminar Cuenta */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" className="w-full sm:w-auto">
                Eliminar cuenta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta de usuario
                  y removerá todos tus datos de nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault() // Evita que se cierre el modal antes de que termine la petición
                    handleDelete()
                  }}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/95"
                >
                  {deleting ? "Eliminando..." : "Confirmar Eliminación"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm