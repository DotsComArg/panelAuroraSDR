import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicPaths = ['/login']

// Rutas protegidas que requieren autenticación
const protectedPaths = ['/', '/agentes', '/analiticas', '/configuracion', '/equipo', '/ubicaciones', '/admin']

// Rutas de admin
const adminPaths = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Permitir acceso a archivos estáticos y API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Archivos con extensión (imágenes, etc.)
  ) {
    return NextResponse.next()
  }

  // Obtener cookies de autenticación
  const email = request.cookies.get('email')?.value
  const role = request.cookies.get('role')?.value

  // Si está en login y ya está autenticado, redirigir al dashboard
  if (pathname === '/login' && email) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Si está en una ruta protegida y no está autenticado, redirigir a login
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  if (isProtectedPath && !email) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar permisos de admin
  const isAdminPath = adminPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  if (isAdminPath && role !== 'SuperAdmin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
}

