'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { AgentsOverview } from '@/components/agents-overview'
import { LocationsOverview } from '@/components/locations-overview'
import { MeetingsOverview } from '@/components/meetings-overview'
import { PerformanceCharts } from '@/components/performance-charts'
import { MetricsOverview } from '@/components/metrics-overview'
import { PageTransition } from '@/components/page-transition'

export default function HomePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Verificar si hay sesión activa
    const email = document.cookie
      .split('; ')
      .find(row => row.startsWith('email='))
      ?.split('=')[1]

    if (!email) {
      // Si no está autenticado, redirigir a login
      console.log('[HOME] No authentication, redirecting to /login')
      router.replace('/login')
    } else {
      // Usuario autenticado, mostrar dashboard
      setIsChecking(false)
    }
  }, [router])

  // Mostrar loading mientras se verifica
  if (isChecking) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          <PageTransition>
            <div className="space-y-6">
              <MetricsOverview />
              <AgentsOverview />
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <LocationsOverview />
                <MeetingsOverview />
              </div>
              <PerformanceCharts />
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  )
}

