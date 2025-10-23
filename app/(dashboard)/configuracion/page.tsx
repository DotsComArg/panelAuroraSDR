"use client"

import { useEffect, useState } from "react"
import { User, Shield, CreditCard, Bell, Key, Calendar, Download, Edit, Eye, EyeOff, Save, Bot } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Customer } from "@/lib/customer-types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConfiguracionPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
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

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    reports: true,
  })

  useEffect(() => {
    loadCustomerData()
  }, [])

  const loadCustomerData = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        // Asumimos que cargamos el primer customer por ahora
        // En producción, cargarías el customer del usuario autenticado
        if (data.success && data.data.length > 0) {
          const customerData = data.data[0]
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
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!customer?._id) return

    setSaving(true)
    try {
      const response = await fetch(`/api/customers/${customer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCustomer(data.data)
          alert('Datos guardados correctamente')
        }
      } else {
        alert('Error al guardar los datos')
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar los datos')
    } finally {
      setSaving(false)
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
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            {customer.rol === 'Owner' ? 'Configuración del sistema' : 'Gestiona tu cuenta, seguridad y preferencias'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile & Account */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Información Personal</CardTitle>
                </div>
                <Badge className={getRoleColor(customer.rol)}>
                  {customer.rol}
                </Badge>
              </div>
              <CardDescription>Actualiza tu información de perfil y datos de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {customer.rol === 'Owner' ? (
                // Vista simplificada para Owner
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                // Vista completa para Clientes
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input 
                        id="nombre" 
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input 
                        id="apellido" 
                        value={formData.apellido}
                        onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input 
                        id="telefono" 
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pais">País</Label>
                      <Input 
                        id="pais" 
                        value={formData.pais}
                        onChange={(e) => setFormData({...formData, pais: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cantidadAgentes">Cantidad de Agentes</Label>
                      <Input 
                        id="cantidadAgentes" 
                        type="number"
                        min="1"
                        value={formData.cantidadAgentes}
                        onChange={(e) => setFormData({...formData, cantidadAgentes: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="planContratado">Plan Contratado</Label>
                    <Select 
                      value={formData.planContratado}
                      onValueChange={(value: any) => setFormData({...formData, planContratado: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Profesional">Profesional</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button 
                className="bg-primary hover:bg-primary/90" 
                onClick={handleSaveProfile}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Seguridad</span>
              </CardTitle>
              <CardDescription>Gestiona tu contraseña y configuración de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input id="newPassword" type="password" placeholder="Ingresa tu nueva contraseña" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirma tu nueva contraseña" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Autenticación de Dos Factores</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Activar 2FA</p>
                    <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <Switch 
                    checked={formData.twoFactorAuth}
                    onCheckedChange={(checked) => setFormData({...formData, twoFactorAuth: checked})}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <Key className="h-4 w-4 mr-2" />
                  Actualizar Contraseña
                </Button>
                <Button variant="outline">Recuperar Contraseña</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notificaciones</span>
              </CardTitle>
              <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Notificaciones por Email</p>
                    <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por correo</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Notificaciones Push</p>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones en tiempo real</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Notificaciones SMS</p>
                    <p className="text-sm text-muted-foreground">Recibe alertas críticas por mensaje de texto</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reportes Semanales</p>
                    <p className="text-sm text-muted-foreground">Recibe resúmenes de actividad semanales</p>
                  </div>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, reports: checked })}
                  />
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90">Guardar Preferencias</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Subscription & Account Info */}
        <div className="space-y-6">
          {/* Subscription */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Membresía</span>
              </CardTitle>
              <CardDescription>Información de tu plan actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <Badge className={getPlanColor(customer.planContratado) + " px-3 py-1"}>
                  Plan {customer.planContratado}
                </Badge>
                <p className="text-sm text-muted-foreground">Plan contratado</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Agentes contratados</span>
                  <span className="font-medium flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    {customer.cantidadAgentes}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2FA Activado</span>
                  <Badge className={customer.twoFactorAuth ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {customer.twoFactorAuth ? 'Sí' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>País</span>
                  <span className="font-medium">{customer.pais}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fecha de inicio</span>
                  <span className="font-medium">
                    {new Date(customer.fechaInicio).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Última actualización</span>
                  <span className="font-medium">
                    {new Date(customer.updatedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-primary hover:bg-primary/90">Actualizar Plan</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Gestionar Facturación
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Summary */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Resumen de Cuenta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Cuenta creada</span>
                  <span className="font-medium">
                    {new Date(customer.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Email</span>
                  <span className="font-medium text-xs">{customer.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Teléfono</span>
                  <span className="font-medium">{customer.telefono}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rol</span>
                  <Badge className={getRoleColor(customer.rol)}>
                    {customer.rol}
                  </Badge>
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
