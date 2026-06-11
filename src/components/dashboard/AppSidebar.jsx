import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router"
import { Link } from "react-router"
import { logout } from "../../features/auth/auth.slice"
import { LayoutDashboard, User, FolderOpen, LogOut, BookOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)

  const isInstructor = user?.role === "instructor"
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  const menuItems = [
    { label: isInstructor ? "Mis Cursos" : "Cursos", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Mi Perfil", icon: User, to: "/profile" },
  ]

  const instructorItems = [
    { label: "Categorías", icon: FolderOpen, to: "/dashboard" },
  ]

  return (
    <Sidebar>

      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <BookOpen className="size-5 text-primary shrink-0" />
          <span className="font-black uppercase tracking-tight text-sm">Cursos Online</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>

        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.to + item.label}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)}>
                    <Link to={item.to}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isInstructor && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Gestión</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {instructorItems.map((item) => (
                    <SidebarMenuItem key={item.to + item.label}>
                      <SidebarMenuButton asChild isActive={isActive(item.to)}>
                        <Link to={item.to}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>

          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="size-8 rounded-lg shrink-0">
                <AvatarImage src={user?.photo} alt={user?.name} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-xs font-bold truncate">{user?.name || "Usuario"}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {user?.role || "—"}
                </p>
              </div>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}

export default AppSidebar