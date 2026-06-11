import { useState } from "react"
import { Calendar, User, BookOpen, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"

// Importaciones de shadcn/ui
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const CourseItem = ({ course, isInstructor, onEdit, onDelete }) => {
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const getYoutubeId = (url) => {
    if (!url) return null
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?\s]+)/)
    return match ? match[1] : null
  }

  const categoriaNombre =
    typeof course.categoria === "object"
      ? course.categoria?.nombre || "Sin categoría"
      : course.categoria || "Sin categoría"

  const instructorNombre =
    typeof course.instructor === "object"
      ? course.instructor?.name || "—"
      : course.instructor || "—"

  return (
    <>
      <Card className="overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
        <div>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
            <Badge variant="secondary" className="font-medium">
              {categoriaNombre}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {course.duracion || "—"}
            </span>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-3">
            <h3 className="text-base font-bold tracking-tight line-clamp-2 min-h-[3rem]">
              {course.nombre}
            </h3>

            {course.thumbnail && (
              <div className="overflow-hidden rounded-md border aspect-video bg-muted">
                <img
                  src={course.thumbnail}
                  alt={course.nombre}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            )}

            <div className="space-y-1.5 pt-1 text-sm text-muted-foreground font-medium">
              <p className="flex items-center gap-2 truncate">
                <User className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                <span>{instructorNombre}</span>
              </p>
              {course.temas && (
                <p className="flex items-center gap-2 truncate">
                  <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  <span>{course.temas}</span>
                </p>
              )}
            </div>
          </CardContent>
        </div>

        <CardContent className="p-4 pt-0 flex items-center justify-between border-t mt-4 bg-muted/5 min-h-[52px]">
          <Button variant="outline" size="sm" onClick={() => setViewOpen(true)} className="gap-1.5 h-8">
            <Eye className="h-3.5 w-3.5" />
            Ver detalles
          </Button>

          {isInstructor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onEdit(course)} className="gap-2 cursor-pointer">
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardContent>
      </Card>

      {/* Modal Ver Detalles */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[85vh] flex flex-col p-0 overflow-hidden sm:max-w-2xl">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold tracking-tight">{course.nombre}</DialogTitle>
            <DialogDescription className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {categoriaNombre}</span>
              <span className="flex items-center gap-1"><User className="h-4 w-4" /> {instructorNombre}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {course.duracion || "—"}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {getYoutubeId(course.link) && (
              <div className="aspect-video overflow-hidden rounded-lg border shadow-sm bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${getYoutubeId(course.link)}`}
                  title={course.nombre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-semibold tracking-wide text-foreground uppercase">Descripción del curso</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 border p-4 rounded-lg">
                {course.descripcion || "Este curso no cuenta con una descripción detallada todavía."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de eliminación shadcn */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el curso <span className="font-semibold text-foreground">"{course.nombre}"</span> de forma permanente de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(course._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar curso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CourseItem