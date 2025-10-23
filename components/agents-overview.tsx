"use client"

import { useEffect, useState } from "react"
import { Bot, Activity, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AgentStats {
  totalEjecuciones: number
  exitosas: number
  tasaExito: number
  ultimaActividad: string
}

export function AgentsOverview() {
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgentStats = async () => {
      try {
        const response = await fetch('/api/metrics?days=30')
        if (response.ok) {
          const data = await response.json()
          const stats: AgentStats = {
            totalEjecuciones: data.generales.respuestasAutomaticasCorrectas || 0,
            exitosas: data.generales.respuestasAutomaticasCorrectas || 0,
            tasaExito: data.generales.porcentajeRespuestasCorrectas || 0,
            ultimaActividad: "Activo ahora"
          }
          setAgentStats(stats)
        }
      } catch (error) {
        console.error('Error al cargar estadísticas del agente:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAgentStats()
  }, [])

  if (loading) {
    return (
      <Card className="col-span-2 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <div className="h-6 bg-muted/50 rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted/30 rounded w-48 animate-pulse" />
          </div>
          <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-muted/50 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 bg-muted/50 rounded w-36 animate-pulse" />
                <div className="h-4 bg-muted/30 rounded w-48 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right space-y-2">
                <div className="h-5 bg-muted/50 rounded w-16 animate-pulse" />
                <div className="h-3 bg-muted/30 rounded w-20 animate-pulse" />
              </div>
              <div className="text-right space-y-2">
                <div className="h-5 bg-muted/50 rounded w-12 animate-pulse" />
                <div className="h-3 bg-muted/30 rounded w-24 animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">Agente IA</CardTitle>
          <CardDescription>
            Academia MAV - Agente activo
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 transition-all duration-200 hover:bg-card hover:shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bot className="h-12 w-12 text-primary" />
                <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-green-500 bg-background rounded-full" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Academia MAV IA</h4>
                <p className="text-sm text-muted-foreground">Integrado con Aurora SDR IA y Kommo CRM</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-lg">{agentStats?.tasaExito || 0}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Tasa de éxito</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-lg">{agentStats?.exitosas || 0}</div>
                <p className="text-xs text-muted-foreground">Respuestas exitosas</p>
              </div>
              <Badge variant="default" className="transition-all duration-200">
                Activo
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
