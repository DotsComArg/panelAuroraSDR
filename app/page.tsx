import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirigir a la página de login por defecto
  // El dashboard está en /app/(dashboard)/page.tsx
  redirect('/login')
}

