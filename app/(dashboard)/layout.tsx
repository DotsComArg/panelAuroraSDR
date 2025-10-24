"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Menu } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  console.log('DashboardLayout - sidebarOpen:', sidebarOpen)

  const handleCloseSidebar = useCallback(() => {
    console.log('Closing sidebar')
    setSidebarOpen(false)
  }, [])

  // La autenticación ahora se maneja en middleware.ts
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} onClose={handleCloseSidebar} />
      <div className="flex-1 flex flex-col relative min-w-0">
        <DashboardHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log('Menu clicked! Current state:', sidebarOpen)
              setSidebarOpen(true)
            }}
            className="lg:hidden"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DashboardHeader>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
