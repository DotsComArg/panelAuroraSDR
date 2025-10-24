"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { AgentsOverview } from "@/components/agents-overview"
import { LocationsOverview } from "@/components/locations-overview"
import { MeetingsOverview } from "@/components/meetings-overview"
import { PerformanceCharts } from "@/components/performance-charts"
import { MetricsOverview } from "@/components/metrics-overview"
import { PageTransition } from "@/components/page-transition"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  console.log('HomePage - sidebarOpen:', sidebarOpen)

  // El middleware se encarga de redirigir a /login si no está autenticado
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} onClose={() => {
        console.log('Closing sidebar')
        setSidebarOpen(false)
      }} />
      <div className="flex-1 flex flex-col relative min-w-0">
        <DashboardHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Menu clicked! Current state:', sidebarOpen)
              setSidebarOpen(true)
            }}
            className="lg:hidden relative z-50 touch-manipulation min-w-[44px] min-h-[44px]"
            type="button"
          >
            <Menu className="h-5 w-5 pointer-events-none" />
          </Button>
        </DashboardHeader>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <PageTransition>
            <div className="space-y-6">
              {/* Métricas principales */}
              <MetricsOverview />

              {/* Top section - Agents IA full width */}
              <AgentsOverview />

              {/* Middle section - Ubicaciones and Reuniones side by side */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <LocationsOverview />
                <MeetingsOverview />
              </div>

              {/* Bottom section - Performance charts full width */}
              <PerformanceCharts />
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  )
}

