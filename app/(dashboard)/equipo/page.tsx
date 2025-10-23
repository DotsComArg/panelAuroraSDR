"use client"

import { Users, Crown, Mail, Calendar, Bot, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { PageTransition } from "@/components/page-transition"

const teamStats = [
  {
    title: "Total Miembros",
    value: "2",
    change: "1 Owner + 1 Cliente",
    icon: Users,
    trend: "up",
  },
  {
    title: "Propietarios",
    value: "1",
    change: "Aurora SDR IA",
    icon: Crown,
    trend: "neutral",
  },
  {
    title: "Clientes",
    value: "1",
    change: "Academia MAV",
    icon: Building2,
    trend: "up",
  },
  {
    title: "Estado",
    value: "Activo",
    change: "100% operativo",
    icon: Calendar,
    trend: "up",
  },
]

const teamMembers = [
  {
    id: 1,
    name: "Aurora SDR IA",
    email: "admin@aurorasdr.ai",
    role: "Owner",
    type: "Sistema",
    avatar: "/isotipo-aurora-profile.png",
    lastAccess: "Activo ahora",
    status: "Activo",
    joinDate: "2024",
    permissions: ["Gestión completa", "Configuración global", "Administración de clientes", "Reportes avanzados", "Analíticas completas", "Control total"],
    description: "Sistema propietario de gestión y monitoreo integral de IA"
  },
  {
    id: 2,
    name: "Academia MAV",
    email: "contacto@academiamav.com",
    role: "Cliente",
    type: "Cliente",
    avatar: "/favicon-32x32.png",
    lastAccess: "Activo ahora",
    status: "Activo",
    joinDate: "2024",
    iaName: "Academia MAV IA",
    permissions: ["Dashboard de métricas", "Visualización de leads", "Reportes de rendimiento", "Gestión de ubicaciones"],
    description: "Cliente de Aurora SDR. Su agente IA 'Academia MAV IA' está integrado con Kommo CRM y gestiona leads automáticamente"
  },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "Owner":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Cliente":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Activo":
      return "bg-green-100 text-green-800 border-green-200"
    case "Inactivo":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function EquipoPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Equipo</h1>
          <p className="text-muted-foreground mt-1">Propietarios y clientes de Aurora SDR IA</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {teamStats.map((stat, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Members List */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Miembros</span>
          </CardTitle>
          <CardDescription>Propietario y clientes del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-6 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {member.role === "Owner" ? (
                      <div className="h-20 w-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center p-3 overflow-hidden">
                        <Image 
                          src={member.avatar} 
                          alt={member.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-primary" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-xl">{member.name}</h3>
                      <Badge className={getRoleColor(member.role)}>
                        {member.role === "Owner" && <Crown className="h-3 w-3 mr-1" />}
                        {member.role === "Cliente" && <Building2 className="h-3 w-3 mr-1" />}
                        {member.role}
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                      {member.iaName && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Bot className="h-3 w-3 mr-1" />
                          IA: {member.iaName}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground max-w-2xl">
                      {member.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Último acceso: {member.lastAccess}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium mb-2">
                      {member.role === "Owner" ? "Capacidades" : "Acceso"}
                    </p>
                    <div className="flex flex-wrap gap-1 max-w-64 justify-end">
                      {member.permissions.slice(0, 3).map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {member.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.permissions.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-lg border-yellow-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span>Aurora SDR IA</span>
            </CardTitle>
            <CardDescription>Propietario del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rol</span>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Crown className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tipo</span>
                <span className="text-sm font-medium">Sistema de Control</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clientes activos</span>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Academia MAV</span>
            </CardTitle>
            <CardDescription>Cliente con agente IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rol</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Building2 className="h-3 w-3 mr-1" />
                  Cliente
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Agente IA</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Bot className="h-3 w-3 mr-1" />
                  Academia MAV IA
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Activo 24/7
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Integraciones</span>
                <span className="text-sm font-medium">Kommo CRM + WhatsApp</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageTransition>
  )
}
