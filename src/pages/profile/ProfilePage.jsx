import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import ProfileForm from "../../components/profile/ProfileForm"
import PhotoUpload from "../../components/profile/PhotoUpload"
import { Separator } from "@/components/ui/separator"


const ProfilePage = () => {
  const { user } = useSelector(state => state.auth)

  if (!user) return <Navigate to="/" replace />

  return (
    <div className="dash-layout">

      <div className="auth-container">

        <div className="auth-card" style={{ maxWidth: "500px" }}>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Información del Perfil</h2>
            <p className="text-sm text-muted-foreground">
              Actualiza tus datos de usuario y dirección de correo electrónico.
            </p>
          </div>
          
          <PhotoUpload />
          
          <Separator />
          <ProfileForm />
          
        </div>
      </div>
    </div>
  )
}

export default ProfilePage