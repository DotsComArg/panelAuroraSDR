"use client"

import { AgentsOverview } from "@/components/agents-overview"
import { LocationsOverview } from "@/components/locations-overview"
import { MeetingsOverview } from "@/components/meetings-overview"
import { PerformanceCharts } from "@/components/performance-charts"
import { MetricsOverview } from "@/components/metrics-overview"
import { PageTransition } from "@/components/page-transition"

// Forzar renderizado dinámico para evitar problemas con middleware durante build
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
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
  )
}

