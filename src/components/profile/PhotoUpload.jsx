import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Camera, Loader2 } from "lucide-react" // Lucide viene con shadcn por defecto

// Importaciones de shadcn/ui
import { Button } from "../ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Skeleton } from "../ui/skeleton"

import { setCredentials } from "../../features/auth/auth.slice"
import api from "../../api/api"

const PhotoUpload = () => {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const [preview, setPreview] = useState(user?.urlPhoto || null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  // Extrae la inicial del nombre para el Fallback
  const obtenerInicial = () => {
    if (!user?.name) return "U"
    return user.name.trim().charAt(0).toUpperCase()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview local inmediato
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    // Subir al backend
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("folder", "profiles")

      const res = await api.post(`/users/${user.id}/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      dispatch(
        setCredentials({
          token,
          user: res.data.usuario,
        })
      )

      toast.success("Foto actualizada con éxito")
    } catch (err) {
      const msg = err.response?.data?.error ?? "Error al subir la foto"
      toast.error(msg)
      setPreview(user?.urlPhoto || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-xl bg-card text-card-foreground shadow-sm max-w-xl mx-auto">
      
      {/* Contenedor del Avatar interactivo */}
      <div
        className="relative group cursor-pointer select-none"
        onClick={() => !uploading && inputRef.current.click()}
        title="Cambiar foto de perfil"
      >
        {/* Si está subiendo, metemos un Skeleton de fondo circular */}
        {uploading && (
          <Skeleton className="absolute inset-0 rounded-full w-24 h-24 z-10 animate-pulse" />
        )}

        <Avatar className="w-24 h-24 border-2 border-border group-hover:border-primary/50 transition-colors">
          {preview && <AvatarImage src={preview} alt="Foto de perfil" className="object-cover" />}
          <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">
            {obtenerInicial()}
          </AvatarFallback>
        </Avatar>

        {/* Overlay con hover profesional */}
        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          {uploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </div>

      {/* Info y botón de acción */}
      <div className="flex-1 text-center sm:text-left space-y-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold leading-none">Foto de perfil</h3>
          <p className="text-xs text-muted-foreground">
            JPG, PNG o WEBP. Máximo 5MB.
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="h-9"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            "Cambiar foto"
          )}
        </Button>
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default PhotoUpload