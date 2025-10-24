import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[MIDDLEWARE] Request: ${pathname}`);

  // Verificar autenticación para rutas protegidas
  const email = request.cookies.get("email")?.value;
  const role = request.cookies.get("role")?.value;

  // Si no hay email (no autenticado) y no está en /login, redirigir a login
  if (!email && pathname !== "/login") {
    console.log(`[MIDDLEWARE] No authentication, redirecting to /login`);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protección específica de admin
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
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
  ],
};


