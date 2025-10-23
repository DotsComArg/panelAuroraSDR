import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protege rutas de admin, requiere cookie role=SuperAdmin
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("role")?.value;
    if (role !== "SuperAdmin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("unauthorized", "1");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


