import { Outlet } from "react-router"

const ContainerPage = () => {
  return (
    <div className="app-container">
      {/* lo que pongas acá aparece en TODAS las rutas */}
      <Outlet />  {/* acá se renderiza LoginPage, RegisterPage, DashboardPage... */}
    </div>
  )
}

export default ContainerPage