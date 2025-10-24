"use client"

import { useEffect, useState } from "react"
import { User, CreditCard, Calendar, Bot } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Customer } from "@/lib/customer-types"

export default function ConfiguracionPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Estados para edición
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    pais: '',
    cantidadAgentes: 1,
    planContratado: 'Básico' as 'Básico' | 'Profesional' | 'Enterprise' | 'Custom',
    twoFactorAuth: false
  })


  useEffect(() => {
    loadCustomerData()
  }, [])

  const loadCustomerData = async () => {
    try {
      // Obtener el email del usuario logueado
      const userEmail = document.cookie
        .split('; ')
        .find(row => row.startsWith('email='))
        ?.split('=')[1]

      // Datos hardcodeados según el usuario logueado
      let customerData: any
      
      if (userEmail === 'contacto@academiamav.com') {
        customerData = {
          _id: 'academia-mav-001',
          nombre: 'Academia Mav',
          apellido: '',
          email: 'contacto@academiamav.com',
          telefono: '+57 300 123 4567',
          pais: 'Colombia',
          cantidadAgentes: 1,
          planContratado: 'Custom',
          twoFactorAuth: false,
          rol: 'Cliente',
          createdAt: new Date('2025-10-01'),
          updatedAt: new Date(),
          fechaInicio: new Date('2025-10-01')
        }
      } else {
        // Usuario admin u otros
        customerData = {
          _id: 'admin-001',
          nombre: 'Admin',
          apellido: 'Aurora',
          email: 'admin@aurorasdr.ai',
          telefono: '+57 300 000 0000',
          pais: 'Colombia',
          cantidadAgentes: 1,
          planContratado: 'Enterprise',
          twoFactorAuth: false,
          rol: 'Owner',
          createdAt: new Date('2025-10-01'),
          updatedAt: new Date(),
          fechaInicio: new Date('2025-10-01')
        }
      }

      setCustomer(customerData)
      setFormData({
        nombre: customerData.nombre,
        apellido: customerData.apellido,
        email: customerData.email,
        telefono: customerData.telefono,
        pais: customerData.pais,
        cantidadAgentes: customerData.cantidadAgentes,
        planContratado: customerData.planContratado,
        twoFactorAuth: customerData.twoFactorAuth
      })
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-muted/50 rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted/30 rounded w-96 animate-pulse" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-muted/40 rounded w-32 animate-pulse" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted/50 rounded w-40 mb-2 animate-pulse" />
                <div className="h-4 bg-muted/30 rounded w-56 animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-muted/40 rounded w-24 animate-pulse" />
                    <div className="h-10 bg-muted/30 rounded w-full animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">No se encontró información del cliente</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin datos de cliente</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No hay clientes registrados en el sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Básico': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Profesional': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Enterprise': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Custom': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleColor = (rol: string) => {
    return rol === 'Owner' 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
      : 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">Configuración</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
            {customer.rol === 'Owner' ? 'Configuración del sistema' : 'Gestiona tu cuenta, seguridad y preferencias'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column - Profile & Account */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Profile Information */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <CardTitle className="text-base sm:text-lg truncate">Información Personal</CardTitle>
                </div>
                <Badge className={getRoleColor(customer.rol) + " flex-shrink-0 text-xs"}>
                  {customer.rol}
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm">Información de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="nombre" className="text-xs sm:text-sm">Nombre</Label>
                  <Input 
                    id="nombre" 
                    value={formData.nombre}
                    disabled
                    className="bg-muted cursor-not-allowed text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="bg-muted cursor-not-allowed text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="pais" className="text-xs sm:text-sm">País</Label>
                  <Input 
                    id="pais" 
                    value={formData.pais}
                    disabled
                    className="bg-muted cursor-not-allowed text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="cantidadAgentes" className="text-xs sm:text-sm">Cantidad de Agentes</Label>
                  <Input 
                    id="cantidadAgentes" 
                    type="number"
                    value={formData.cantidadAgentes}
                    disabled
                    className="bg-muted cursor-not-allowed text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Subscription & Account Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Subscription */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>Membresía</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Información de tu plan actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="text-center space-y-2">
                <Badge className={getPlanColor(customer.planContratado) + " px-2 sm:px-3 py-1 text-xs sm:text-sm"}>
                  Plan {customer.planContratado}
                </Badge>
                <p className="text-xs sm:text-sm text-muted-foreground">Plan contratado</p>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Agentes contratados</span>
                  <span className="font-medium flex items-center gap-1">
                    <Bot className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    1
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm items-center">
                  <span>2FA Activado</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] sm:text-xs">
                    Próximamente
                  </Badge>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>País</span>
                  <span className="font-medium">Colombia</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Fecha de inicio</span>
                  <span className="font-medium">10/2025</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Última actualización</span>
                  <span className="font-medium">
                    {new Date(customer.updatedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Account Summary */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>Resumen de Cuenta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Cuenta creada</span>
                  <span className="font-medium">10/2025</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="flex-shrink-0">Email</span>
                  <span className="font-medium text-[10px] sm:text-xs truncate">{customer.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </PageTransition>
  )
}
