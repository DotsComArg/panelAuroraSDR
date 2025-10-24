"use client"

import { AgentsOverview } from "@/components/agents-overview"
import { LocationsOverview } from "@/components/locations-overview"
import { MeetingsOverview } from "@/components/meetings-overview"
import { PerformanceCharts } from "@/components/performance-charts"
import { MetricsOverview } from "@/components/metrics-overview"
import { PageTransition } from "@/components/page-transition"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function HomePage() {
  // El middleware se encarga de redirigir a /login si no está autenticado
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col relative">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          <PageTransition>
            <div className="space-y-6">
              {/* Métricas principales desde n8n */}
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

