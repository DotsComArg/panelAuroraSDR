"use client"

import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
      {children}
    </div>
  )
}

