"use client"

import { Bell, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Limpiar cookies o sesión si las hay
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    
    // Redirigir al login
    router.push("/login")
  }

  const handlePerfil = () => {
    router.push("/configuracion")
  }

  const handleConfiguracion = () => {
    router.push("/configuracion")
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {/* El logo ahora está en el sidebar */}
        </div>

        <div className="flex items-center space-x-4">
          {/* Dropdown de notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Sin notificaciones</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  No hay notificaciones nuevas en este momento
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown de perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Usuario" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@aurorasdr.ai</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlePerfil} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleConfiguracion} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
