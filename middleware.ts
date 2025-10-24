import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorar durante el build/ISR
  if (request.headers.get('x-prerender-revalidate') || 
      request.headers.get('purpose') === 'prefetch') {
    return NextResponse.next();
  }
  
  console.log(`[MIDDLEWARE] Request: ${pathname}`);

  const email = request.cookies.get("email")?.value;
  const role = request.cookies.get("role")?.value;

  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Si es ruta pública, permitir acceso
  if (isPublicRoute) {
    console.log(`[MIDDLEWARE] Public route, allowing access`);
    return NextResponse.next();
  }

  // Verificar autenticación para rutas protegidas
  if (!email) {
    console.log(`[MIDDLEWARE] No authentication, redirecting to /login`);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protección específica de admin - requiere role SuperAdmin
  if (pathname.startsWith("/admin")) {
    console.log(`[MIDDLEWARE] Admin route, role: ${role}`);
    if (role !== "SuperAdmin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("unauthorized", "1");
      console.log(`[MIDDLEWARE] Redirecting to / - insufficient permissions`);
      return NextResponse.redirect(url);
    }
  }

  console.log(`[MIDDLEWARE] Passing through: ${pathname}`);
  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|.*\\.ico|.*\\.webp).*)',
  ],
};


