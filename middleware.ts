import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[MIDDLEWARE] Request: ${pathname}`);

  const role = request.cookies.get("role")?.value;

  // Protección específica de admin - requiere role SuperAdmin
  if (pathname.startsWith("/admin")) {
    console.log(`[MIDDLEWARE] Admin route, role: ${role}`);
    if (role !== "SuperAdmin") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("unauthorized", "1");
      console.log(`[MIDDLEWARE] Redirecting to /login - insufficient permissions`);
      return NextResponse.redirect(url);
    }
  }

  console.log(`[MIDDLEWARE] Passing through: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


