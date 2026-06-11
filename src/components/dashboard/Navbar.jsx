import { BookOpen } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const Navbar = () => {
    return (
        <header className="flex items-center gap-3 px-4 h-14 border-b bg-background shrink-0 sticky top-0 z-10">      <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <span className="font-black uppercase tracking-tight text-sm">Cursos Online</span>
            </div>
        </header>
    )
}

export default Navbar