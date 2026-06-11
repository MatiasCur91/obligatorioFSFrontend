import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Label, Pie, PieChart } from "recharts"
import api from "../../api/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "../ui/chart"

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#f97316",
  "#8b5cf6",
  "#10b981",
  "#06b6d4",
]

const UsageChart = () => {
  const { user } = useSelector((state) => state.auth)
  const [allCourses, setAllCourses] = useState([])
const { courses } = useSelector((state) => state.courses)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let res
        if (user?.role === "instructor") {
          res = await api.get(`/users/${user.id}/courses?page=1&limit=1000`)
        } else {
          res = await api.get(`/courses?page=1&limit=1000`)
        }
        const list = res.data.courses?.courses ?? []
        setAllCourses(Array.isArray(list) ? list : [])
      } catch {
        // silently fail
      }
    }
    fetchAll()
  }, [user, courses.length])

  const dataMap = {}
  allCourses.forEach((course) => {
    const nombre =
      typeof course.categoria === "object"
        ? course.categoria?.nombre || "Sin categoría"
        : course.categoria || "Sin categoría"
    dataMap[nombre] = (dataMap[nombre] || 0) + 1
  })

  const chartConfig = { cantidad: { label: "Cantidad de Cursos" } }

  const data = Object.entries(dataMap).map(([nombre, cantidad], index) => {
    const colorKey = nombre.toLowerCase().replace(/[^a-z0-9]/g, "_")
    const color = COLORS[index % COLORS.length]
    chartConfig[colorKey] = { label: nombre, color }
    return { category: nombre, cantidad, fill: color }
  })

  const totalCourses = data.reduce((acc, curr) => acc + curr.cantidad, 0)

  if (data.length === 0) return null

  return (
    <Card className="flex flex-col w-full max-w-xl mx-auto shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold tracking-tight">Distribución de Cursos</CardTitle>
        <CardDescription>Cursos activos desglosados por categoría.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-2">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-75">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="cantidad"
              nameKey="category"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              strokeWidth={1}
              stroke="hsl(var(--background))"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-extrabold tracking-tighter"
                        >
                          {totalCourses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs font-medium"
                        >
                          Total Cursos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default UsageChart