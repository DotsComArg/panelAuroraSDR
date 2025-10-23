import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirigir al login en la raíz
  redirect('/login')
}

