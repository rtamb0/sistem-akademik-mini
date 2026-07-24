import { getToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/user", "/mahasiswa"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = getToken();
  const loginUrl = new URL("/login", request.url);

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/mahasiswa", request.url));
    } else {
      return NextResponse.redirect(loginUrl);
    }
  }

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !token) {
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
