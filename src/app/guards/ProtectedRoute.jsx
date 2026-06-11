import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const token = useSelector(state => state.auth.token)
  console.log("ProtectedRoute token:", token)
  // Si no hay token, manda al login
  if (!token) return <Navigate to="/login" replace />

  // Si hay token, renderiza la página hija
  return <Outlet />
}

export default ProtectedRoute