import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protege rutas de admin, requiere cookie role=SuperAdmin
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[MIDDLEWARE] Request: ${pathname}`);

  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("role")?.value;
    console.log(`[MIDDLEWARE] Admin route, role: ${role}`);
    if (role !== "SuperAdmin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("unauthorized", "1");
      console.log(`[MIDDLEWARE] Redirecting to /`);
      return NextResponse.redirect(url);
    }
  }

  console.log(`[MIDDLEWARE] Passing through: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


