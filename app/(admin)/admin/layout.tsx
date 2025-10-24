"use client"

import type React from "react";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Marcar que estamos del lado del cliente
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Solo verificar autenticación en el cliente, no durante SSR
    if (!isClient) return

    // Verificar autenticación y permisos de admin
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
      console.log('[ADMIN LAYOUT] No authentication, redirecting to /login')
      router.replace('/login')
      return
    }

    // Verificar permisos de admin
    if (role !== 'SuperAdmin') {
      console.log('[ADMIN LAYOUT] No admin permissions, redirecting to /')
      router.replace('/?unauthorized=1')
    }
  }, [router, isClient])

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}


