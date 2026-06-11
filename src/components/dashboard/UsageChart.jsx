import { useSelector } from "react-redux"
import { Label, Pie, PieChart } from "recharts"

// Importaciones de shadcn/ui necesarias para gráficos modernos
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

const UsageChart = () => {
  const { courses } = useSelector((state) => state.courses)

  // 1. Agrupar cursos por categoría (Mantenemos tu lógica intacta para el mapeo inicial)
  const dataMap = {}
  courses.forEach((course) => {
    const nombre =
      typeof course.categoria === "object"
        ? course.categoria?.nombre || "Sin categoría"
        : course.categoria || "Sin categoría"

    dataMap[nombre] = (dataMap[nombre] || 0) + 1
  })

  // 2. Definimos la configuración de colores de shadcn basada en tus categorías
  // Esto mapea cada nombre de categoría a una variable de color HSL de shadcn
  const chartConfig = {
    cantidad: {
      label: "Cantidad de Cursos",
    },
  }

  // Mantenemos tu paleta de colores para el mapeo, pero lo integramos en la config
  const COLORS = [
    "hsl(var(--chart-1))", // Integración nativa de shadcn
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "#22c55e", // Verde vibrante
    "#f59e0b", // Ámbar
  ]

  // 3. Generamos los datos formateados para Recharts y la config de colores dinámica
  const data = Object.entries(dataMap).map(([nombre, cantidad], index) => {
    // Creamos una clave única para la config de color (ej: "sin_categoria")
    const colorKey = nombre.toLowerCase().replace(/ /g, "_")
    
    // Agregamos la categoría dinámicamente a la configuración del gráfico
    chartConfig[colorKey] = {
      label: nombre,
      color: COLORS[index % COLORS.length],
    }

    return {
      category: nombre, // Clave para los labels
      cantidad, // Clave para el tamaño del sector
      fill: `var(--color-${colorKey})`, // Referencia dinámica a la config
    }
  })

  // 4. Calculamos el total de cursos para el label central
  const totalCourses = data.reduce((acc, curr) => acc + curr.cantidad, 0)

  if (data.length === 0) return null

  return (
    <Card className="flex flex-col w-full max-w-xl mx-auto shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold tracking-tight">Distribución de Cursos</CardTitle>
        <CardDescription>Cursos activos desglosados por categoría.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-0 pt-2">
        {/* ChartContainer es el wrapper mágico de shadcn que maneja temas y colores */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-75"
        >
          <PieChart>
            {/* ChartTooltipContent estiliza el tooltip automáticamente */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="cantidad"
              nameKey="category"
              innerRadius={60} // Grosor interno para el label central
              outerRadius={90}
              paddingAngle={3} // Espacio sutil entre sectores
              strokeWidth={1}
              stroke="hsl(var(--background))" // Borde del color de fondo
            >
              {/* Label central con el total */}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
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
                          className="fill-muted-foreground text-xs"
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