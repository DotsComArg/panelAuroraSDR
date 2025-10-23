"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, TrendingUp, CheckCircle, Activity } from "lucide-react"
import { PageTransition } from "@/components/page-transition"

interface AgentStats {
  tasaExito: number
  respuestasExitosas: number
  totalLeads: number
}

export default function AgentesPage() {
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgentStats = async () => {
      try {
        const response = await fetch('/api/metrics?days=30')
        if (response.ok) {
          const data = await response.json()
          setAgentStats({
            tasaExito: data.generales.porcentajeRespuestasCorrectas || 0,
            respuestasExitosas: data.generales.respuestasAutomaticasCorrectas || 0,
            totalLeads: data.generales.leadsGenerados || 0
          })
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAgentStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-muted/50 rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted/30 rounded w-96 animate-pulse" />
          </div>
        </div>

        {/* Stats Cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted/50 rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-muted/50 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted/50 rounded w-16 mb-2 animate-pulse" />
                <div className="h-3 bg-muted/30 rounded w-32 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agent details skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted/50 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-muted/30 rounded w-64 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 bg-muted/40 rounded animate-pulse" />
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted/30 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agentes IA</h1>
            <p className="text-muted-foreground">Gestiona y monitorea tu agente de inteligencia artificial</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agentes</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Academia MAV IA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">100% operativo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats?.tasaExito || 0}%</div>
            <p className="text-xs text-muted-foreground">Últimos 30 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium text-muted-foreground">Próximamente</div>
            <p className="text-xs text-muted-foreground">En desarrollo</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Detail Card */}
      <Card>
        <CardHeader>
          <CardTitle>Agente Activo</CardTitle>
          <CardDescription>Información detallada del agente de IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Academia MAV Agent */}
            <div className="flex items-center justify-between p-6 border rounded-lg bg-card hover:shadow-md transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">Academia MAV IA</h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Activo
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Asistente de Conversión y Calificación
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Integrado con Aurora SDR IA y Kommo CRM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Tasa de Éxito</p>
                  <p className="text-2xl font-bold text-primary">{agentStats?.tasaExito || 0}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Respuestas</p>
                  <p className="text-2xl font-bold">{agentStats?.respuestasExitosas || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Leads</p>
                  <p className="text-2xl font-bold">{agentStats?.totalLeads || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Estado</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium">Activo ahora</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="grid gap-4 md:grid-cols-3 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Capacidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Responde todos los leads</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Deriva leads calificados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Gestión automática 24/7</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Integración</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Aurora SDR IA</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Kommo CRM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>WhatsApp Business</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Horario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p className="font-medium">24/7 Disponible</p>
                    <p className="text-muted-foreground text-xs">
                      Respuesta automática las 24 horas, los 7 días de la semana
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  )
}
