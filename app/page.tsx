'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    console.log('[ROOT PAGE] Redirecting to /login')
    router.replace('/login')
  }, [router])

  return null
}

