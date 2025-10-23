"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  MessageSquare,
  Package
} from "lucide-react"
import { DashboardMetrics } from "@/lib/n8n-types"

export function MetricsOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/metrics?days=30')
        if (!response.ok) throw new Error('Error al cargar métricas')
        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton para métricas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="h-3 bg-muted/50 rounded w-2/3 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted/50 rounded w-1/2 mb-2 animate-pulse" />
                <div className="h-2 bg-muted/30 rounded w-3/4 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Skeleton para métricas secundarias */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="transition-all duration-300">
              <CardHeader>
                <div className="h-4 bg-muted/50 rounded w-2/3 mb-2 animate-pulse" />
                <div className="h-3 bg-muted/30 rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-9 bg-muted/50 rounded w-1/3 animate-pulse" />
                <div className="h-2 bg-muted/40 rounded w-full animate-pulse" />
                <div className="h-6 bg-muted/30 rounded w-1/4 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">
            {error || 'No se pudieron cargar las métricas'}
          </p>
        </CardContent>
      </Card>
    )
  }

  const { generales, comunicacion } = metrics

  return (
    <div className="space-y-6">
      {/* Métricas principales en grid - 5 columnas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Leads Totales */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leads Totales
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generales.leadsGenerados}</div>
            <p className="text-xs text-muted-foreground">
              Leads únicos registrados
            </p>
          </CardContent>
        </Card>

        {/* Respuestas Exitosas */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Respuestas Exitosas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generales.respuestasAutomaticasCorrectas}</div>
            <p className="text-xs text-muted-foreground">
              Ejecuciones completadas
            </p>
          </CardContent>
        </Card>

        {/* Reuniones Agendadas */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reuniones Agendadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {generales.reunionesAgendadas === null || generales.reunionesAgendadas === 0 ? (
              <>
                <div className="text-lg font-medium text-muted-foreground">-</div>
                <p className="text-xs text-muted-foreground">
                  ¡Aún no tenemos datos!
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{generales.reunionesAgendadas}</div>
                <p className="text-xs text-muted-foreground">
                  {generales.leadsGenerados > 0 
                    ? `${Math.round((generales.reunionesAgendadas / generales.leadsGenerados) * 100)}% de conversión`
                    : 'Reuniones agendadas'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tasa de Éxito */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Éxito
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {generales.porcentajeRespuestasCorrectas}%
            </div>
            <p className="text-xs text-muted-foreground">
              {generales.respuestasAutomaticasCorrectas} respuestas correctas
            </p>
          </CardContent>
        </Card>

        {/* Tiempo Promedio */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(generales.tiempoPromedioRespuesta)}s
            </div>
            <p className="text-xs text-muted-foreground">
              Tiempo de respuesta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas secundarias en grid de 3 columnas */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Cierres Efectivos */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Cierres Efectivos</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>Sin seguimiento manual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">
              {generales.porcentajeCierresEfectivos}%
            </div>
            <Progress 
              value={generales.porcentajeCierresEfectivos} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground">
              {generales.cierresEfectivos} cierres sin intervención
            </p>
          </CardContent>
        </Card>

        {/* Adecuación de Marca */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Comunicación de Marca</CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>Adecuación al tono y estilo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">
              {comunicacion.adecuacionMarca}%
            </div>
            <Progress 
              value={comunicacion.adecuacionMarca} 
              className="h-2"
            />
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={comunicacion.adecuacionMarca >= 90 ? "default" : "secondary"}
                className="text-xs"
              >
                {comunicacion.adecuacionMarca >= 90 ? "Excelente" : 
                 comunicacion.adecuacionMarca >= 75 ? "Bueno" : "Mejorable"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Conocimiento de Productos */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Conocimiento de Productos</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>Precisión en detalles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">
              {comunicacion.conocimientoProductos}%
            </div>
            <Progress 
              value={comunicacion.conocimientoProductos} 
              className="h-2"
            />
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={comunicacion.conocimientoProductos >= 90 ? "default" : "secondary"}
                className="text-xs"
              >
                {comunicacion.conocimientoProductos >= 90 ? "Excelente" : 
                 comunicacion.conocimientoProductos >= 75 ? "Bueno" : "Mejorable"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Última actualización */}
      <div className="flex justify-end">
        <p className="text-xs text-muted-foreground">
          Última actualización: {new Date(metrics.ultimaActualizacion).toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  )
}

