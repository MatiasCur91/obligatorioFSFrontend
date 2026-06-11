import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import { MoreHorizontal, Pencil, Trash2, FolderPlus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

// Importaciones de shadcn/ui
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"

import { setCategories, addCategory, updateCategory, removeCategory } from "../../features/categories/categories.slice"
import { categorySchema } from "../../validators/category.validators"
import api from "../../api/api"

const LIMIT = 10

const CategoryManager = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { categories, totalPages } = useSelector(state => state.categories)

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingNombre, setEditingNombre] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  
  // Estado para el control del Alert Dialog de eliminación
  const [catToDelete, setCatToDelete] = useState(null)

  const isInstructor = user?.role === "instructor"

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: joiResolver(categorySchema),
    mode: "onChange"
  })

  if (!isInstructor) return null

  // Fetch categorías
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/categories?page=${page}&limit=${LIMIT}`)
      const list = res.data.categories?.categories ?? []
      const pages = res.data.categories?.totalPages ?? 1
      dispatch(setCategories({ categories: list, totalPages: pages }))
    } catch {
      toast.error("Error al cargar las categorías")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [page])

  // Crear categoría
  const procesarForm = async (data) => {
    try {
      const res = await api.post("/categories", data)
      dispatch(addCategory(res.data.category))
      toast.success("Categoría creada")
      reset()
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al crear la categoría"
      toast.error(msg)
    }
  }

  // Iniciar edición inline
  const handleStartEdit = (cat) => {
    setEditingId(cat._id)
    setEditingNombre(cat.nombre)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingNombre("")
  }

  // Guardar edición
  const handleSaveEdit = async (cat) => {
    if (!editingNombre.trim()) return
    setSavingEdit(true)
    try {
      await api.put(`/categories/${cat._id}`, { nombre: editingNombre })
      dispatch(updateCategory({ ...cat, nombre: editingNombre }))
      toast.success("Categoría actualizada")
      setEditingId(null)
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al actualizar la categoría"
      toast.error(msg)
    } finally {
      setSavingEdit(false)
    }
  }

  // Confirmar y eliminar
  const handleExecuteDelete = async () => {
    if (!catToDelete) return
    try {
      await api.delete(`/categories/${catToDelete._id}`)
      dispatch(removeCategory(catToDelete._id))
      toast.success("Categoría eliminada")
    } catch (err) {
      const msg = err.response?.data?.message ?? "No se puede eliminar una categoría con cursos asociados"
      toast.error(msg)
    } finally {
      setCatToDelete(null)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">Gestión de categorías</CardTitle>
          <CardDescription>Crea, edita o elimina las clasificaciones para tus cursos.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Formulario nueva categoría */}
          <form onSubmit={handleSubmit(procesarForm)} className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Nueva categoría..."
                  {...register("nombre")}
                  className={errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}
                />
              </div>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="gap-2 shrink-0"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
                Agregar
              </Button>
            </div>
            {errors.nombre && (
              <p className="text-sm font-medium text-destructive">{errors.nombre.message}</p>
            )}
          </form>

          {/* Lista de Categorías */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/20">
              <span className="text-3xl mb-2">🗂️</span>
              <p className="text-sm font-medium">No hay categorías registradas</p>
            </div>
          ) : (
            <ul className="divide-y border rounded-lg overflow-hidden bg-background">
              {categories.map((cat) => (
                <li key={cat._id} className="flex items-center justify-between p-3 min-h-[56px] transition-colors hover:bg-muted/30">
                  {editingId === cat._id ? (
                    // Edición inline
                    <div className="flex gap-2 w-full items-center">
                      <Input
                        type="text"
                        value={editingNombre}
                        onChange={(e) => setEditingNombre(e.target.value)}
                        className="h-9 flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(cat)}
                        disabled={savingEdit || !editingNombre.trim()}
                        className="h-9"
                      >
                        {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        disabled={savingEdit}
                        className="h-9"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    // Vista normal con menú desplegable
                    <>
                      <span className="font-medium text-sm text-foreground pr-4 truncate">
                        {cat.nombre}
                      </span>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 shrink-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => handleStartEdit(cat)} className="gap-2 cursor-pointer">
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setCatToDelete(cat)} 
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        {/* Paginación */}
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4 bg-muted/10">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground font-medium">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="gap-1"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* AlertDialog de Confirmación de Eliminación */}
      <AlertDialog open={!!catToDelete} onOpenChange={(open) => !open && setCatToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a eliminar definitivamente la categoría{" "}
              <span className="font-semibold text-foreground">"{catToDelete?.nombre}"</span>. Esta
              acción fallará si tiene cursos asociados actualmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExecuteDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CategoryManager