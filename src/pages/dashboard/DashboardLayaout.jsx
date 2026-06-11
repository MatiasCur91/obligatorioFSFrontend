import { Outlet } from "react-router"
import AppSidebar from "../../components/dashboard/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-4">
          <SidebarTrigger className="mb-4" />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout