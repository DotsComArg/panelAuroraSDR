"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BarChart3, Bot, Home, MapPin, Settings, Users, ChevronLeft, ChevronRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Agentes", href: "/agentes", icon: Bot },
  { name: "Ubicaciones", href: "/ubicaciones", icon: MapPin },
  { name: "Analíticas", href: "/analiticas", icon: BarChart3 },
  { name: "Equipo", href: "/equipo", icon: Users },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si el usuario es admin
    const role = document.cookie
      .split('; ')
      .find(row => row.startsWith('role='))
      ?.split('=')[1]
    
    setIsAdmin(role === 'SuperAdmin')
  }, [])

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className={cn(
        "flex h-16 items-center border-b border-sidebar-border",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {!collapsed ? (
          <>
            <Image 
              src="/Logotipo_Aurora.svg" 
              alt="Aurora SDR" 
              width={170} 
              height={44} 
              className="h-11 w-auto" 
              priority
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Image 
              src="/favicon-32x32.png" 
              alt="Aurora SDR" 
              width={28} 
              height={28} 
              className="h-7 w-7" 
              priority
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-6 w-6 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
                collapsed ? "justify-center px-2 py-3" : "px-2 py-2",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon
                className={cn("h-5 w-5 flex-shrink-0 transition-colors", collapsed ? "mr-0" : "mr-3")}
                aria-hidden="true"
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}

        {/* Link de Admin solo visible para SuperAdmin */}
        {isAdmin && (
          <Link
            key="Admin"
            href="/admin"
            className={cn(
              "group flex items-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
              collapsed ? "justify-center px-2 py-3" : "px-2 py-2",
              pathname?.startsWith("/admin")
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Shield className={cn("h-5 w-5 flex-shrink-0 transition-colors", collapsed ? "mr-0" : "mr-3")} />
            {!collapsed && <span className="truncate">Admin</span>}
          </Link>
        )}
      </nav>

      {/* Footer con versión */}
      <div className={cn(
        "border-t border-sidebar-border p-4",
        collapsed ? "text-center" : ""
      )}>
        {collapsed ? (
          <p className="text-xs text-muted-foreground font-medium">v1.0</p>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Aurora SDR</p>
              <p className="text-xs text-muted-foreground/60">Versión 1.0</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500" title="Sistema operativo" />
          </div>
        )}
      </div>
    </div>
  )
}
