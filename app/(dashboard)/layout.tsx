"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticación del lado del cliente
    const email = document.cookie
      .split('; ')
      .find(row => row.startsWith('email='))
      ?.split('=')[1]

    if (!email) {
      console.log('[DASHBOARD LAYOUT] No authentication, redirecting to /login')
      router.replace('/login')
    }
  }, [router])

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
