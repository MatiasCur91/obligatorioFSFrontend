import { Outlet } from "react-router"
import AppSidebar from "../../components/dashboard/AppSidebar"
import Navbar from "../../components/dashboard/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar"

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen overflow-auto">
        <Navbar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout