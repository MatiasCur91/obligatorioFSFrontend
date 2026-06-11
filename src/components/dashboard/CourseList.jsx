import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCourses, removeCourse } from "../../features/courses/courses.slice"
import { setCategories } from "../../features/categories/categories.slice"
import api from "../../api/api"
import { toast } from "react-toastify"
import { Plus, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react"

import CourseItem from "./CourseItem"
import CourseModal from "./CourseModal"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LIMIT = 10

const CourseList = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { courses, totalPages } = useSelector(state => state.courses)
  const { categories } = useSelector(state => state.categories)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)

  const isInstructor = user?.role === "instructor"

  // fetch categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories?page=1&limit=100")
        const list = res.data.categories?.categories ?? res.data.categories ?? []
        dispatch(setCategories({ categories: Array.isArray(list) ? list : [], totalPages: 1 }))
      } catch {
        // silently fail
      }
    }
    fetchCategories()
  }, [dispatch])

  // fetch cursos
  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      let res, list, pages

      if (selectedCategory) {
        res = await api.get(`/categories/category/${selectedCategory}?page=${page}&limit=${LIMIT}`)
        list = res.data.courses?.courses ?? res.data.courses ?? []
        pages = res.data.courses?.totalPages ?? 1
      } else if (isInstructor) {
        res = await api.get(`/users/${user.id}/courses?page=${page}&limit=${LIMIT}`)
        list = res.data.courses?.courses ?? []
        pages = res.data.courses?.totalPages ?? 1
      } else {
        res = await api.get(`/courses?page=${page}&limit=${LIMIT}`)
        list = res.data.courses?.courses ?? []
        pages = res.data.courses?.totalPages ?? 1
      }

      if (isInstructor && selectedCategory) {
        list = list.filter(c => {
          const instId = typeof c.instructor === "object" ? c.instructor?._id : c.instructor
          return instId === user.id
        })
      }

      dispatch(setCourses({ courses: Array.isArray(list) ? list : [], totalPages: pages }))
    } catch {
      toast.error("Error al cargar los cursos")
    } finally {
      setLoading(false)
    }
  }, [dispatch, page, selectedCategory, isInstructor, user])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  const handleDelete = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`)
      dispatch(removeCourse(courseId))
      toast.success("Curso eliminado")
    } catch {
      toast.error("Error al eliminar el curso")
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setModalOpen(true)
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value === "all" ? "" : value)
    setPage(1)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Topbar moderna */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Cursos</h1>
          <p className="text-sm text-muted-foreground">Explorá y gestioná el catálogo de cursos de la plataforma.</p>
        </div>
        {isInstructor && (
          <Button onClick={() => { setEditingCourse(null); setModalOpen(true) }} className="gap-2 shrink-0 self-start sm:self-center shadow-sm">
            <Plus className="h-4 w-4" /> Agregar curso
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-muted/30 border p-4 rounded-xl">
        <Label htmlFor="category-select" className="text-sm font-medium text-muted-foreground shrink-0">Filtrar por categoría:</Label>
        <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category-select" className="w-full sm:w-64 bg-background">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.nombre || cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grilla principal / Skeletons */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-4">
              <div className="flex justify-between"><Skeleton className="h-5 w-24" /><Skeleton className="h-4 w-16" /></div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="aspect-video w-full rounded-md" />
              <Skeleton className="h-4 w-1/2" /><Skeleton className="h-8 w-28 rounded-md" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-16 px-4 text-center bg-muted/10">
          <FolderOpen className="h-12 w-12 text-muted-foreground/60 mb-3 stroke-[1.5]" />
          <h3 className="font-semibold text-lg text-foreground">No hay cursos disponibles</h3>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">Modificá el filtro de categoría o crea un nuevo curso para empezar.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseItem
              key={course._id}
              course={course}
              isInstructor={isInstructor}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Paginación con componentes consistentes */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t pt-6">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground font-medium">Página {page} de {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="gap-1">
            Siguiente <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <CourseModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingCourse(null)
        }}
        course={editingCourse}
        categories={categories}
        onSaved={fetchCourses}
      />
    </div>
  )
}

export default CourseList