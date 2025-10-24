"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar autenticación
    const email = document.cookie
      .split('; ')
      .find(row => row.startsWith('email='))
      ?.split('=')[1]

    const role = document.cookie
      .split('; ')
      .find(row => row.startsWith('role='))
      ?.split('=')[1]

    // Si no hay email, redirigir a login
    if (!email) {
      console.log('[DASHBOARD LAYOUT] No authentication, redirecting to /login')
      router.replace('/login')
      return
    }

    // Verificar permisos de admin
    if (pathname?.startsWith('/admin') && role !== 'SuperAdmin') {
      console.log('[DASHBOARD LAYOUT] No admin permissions, redirecting to /')
      router.replace('/?unauthorized=1')
    }
  }, [router, pathname])

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
