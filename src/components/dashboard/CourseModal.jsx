import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { useDispatch } from "react-redux"
import { addCourse, updateCourse } from "../../features/courses/courses.slice"
import { courseSchema } from "../../validators/course.validators"
import api from "../../api/api"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

// Importaciones de shadcn/ui
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CourseModal = ({ open, onOpenChange, course, categories, onSaved }) => {
  const dispatch = useDispatch()
  const isEditing = !!course

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: joiResolver(courseSchema),
    mode: "onChange",
    defaultValues: isEditing
      ? {
          nombre: course.nombre,
          descripcion: course.descripcion,
          temas: course.temas,
          link: course.link,
          thumbnail: course.thumbnail,
          duracion: course.duracion,
          categoria: typeof course.categoria === "object" ? course.categoria._id : course.categoria,
        }
      : {},
  })

  const procesarForm = async (data) => {
    try {
      if (isEditing) {
        const res = await api.put(`/courses/${course._id}`, data)
        dispatch(updateCourse(res.data.course ?? { ...course, ...data }))
        toast.success("Curso actualizado")
      } else {
        const res = await api.post("/courses", data)
        dispatch(addCourse(res.data.course))
        toast.success("Curso creado")
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Error al guardar el curso")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 overflow-hidden sm:max-w-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEditing ? "Editar curso" : "Crear nuevo curso"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
            {isEditing ? "Editar curso" : "Crear nuevo curso"}
          </DialogDescription>

        <form onSubmit={handleSubmit(procesarForm)} className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre" className="text-sm font-semibold">Nombre del curso</Label>
            <Input id="nombre" {...register("nombre")} placeholder="Ej: Introducción a React" />
            {errors.nombre && <p className="text-xs font-medium text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="categoria" className="text-sm font-semibold">Categoría</Label>
            <Select
              defaultValue={isEditing ? (typeof course.categoria === "object" ? course.categoria._id : course.categoria) : ""}
              onValueChange={(value) => setValue("categoria", value, { shouldValidate: true })}
            >
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Seleccioná una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria && <p className="text-xs font-medium text-destructive">{errors.categoria.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descripcion" className="text-sm font-semibold">Descripción</Label>
            {/* Reemplazado por Textarea de shadcn */}
            <Textarea
              id="descripcion"
              rows={4}
              placeholder="Escribe un resumen detallado sobre los objetivos del curso..."
              {...register("descripcion")}
              className="resize-none"
            />
            {errors.descripcion && <p className="text-xs font-medium text-destructive">{errors.descripcion.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="temas" className="text-sm font-semibold">Temas principales</Label>
            <Input id="temas" {...register("temas")} placeholder="Ej: Hooks, Context, Redux (separados por comas)" />
            {errors.temas && <p className="text-xs font-medium text-destructive">{errors.temas.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="link" className="text-sm font-semibold">Link de YouTube</Label>
              <Input id="link" placeholder="https://www.youtube.com/watch?v=..." {...register("link")} />
              {errors.link && <p className="text-xs font-medium text-destructive">{errors.link.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="duracion" className="text-sm font-semibold">Duración estimada</Label>
              <Input id="duracion" placeholder="Ej: 15m 40s o 2h 30m" {...register("duracion")} />
              {errors.duracion && <p className="text-xs font-medium text-destructive">{errors.duracion.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thumbnail" className="text-sm font-semibold">URL de la Miniatura (Thumbnail)</Label>
            <Input id="thumbnail" placeholder="https://images.unsplash.com/..." {...register("thumbnail")} />
            {errors.thumbnail && <p className="text-xs font-medium text-destructive">{errors.thumbnail.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : isEditing ? (
                "Guardar cambios"
              ) : (
                "Crear curso"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CourseModal