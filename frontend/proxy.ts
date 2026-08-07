import { NextRequest, NextResponse } from "next/server";
import { stripBasePath, withBasePath } from "./lib/base-path";

const protectedRoutes = ["/user", "/dashboard"];

export function proxy(request: NextRequest) {
  const pathname = stripBasePath(request.nextUrl.pathname);
  const token = request.cookies.get("token")?.value;
  const loginUrl = new URL(withBasePath("/login"), request.url);
  const user = request.cookies.get("user")?.value;
  const userRole = user ? JSON.parse(user).role : null;

  if (pathname === "/") {
    if (token) {
      if (userRole !== "admin") {
        return NextResponse.redirect(
          new URL(withBasePath("/dashboard/mahasiswa"), request.url),
        );
      } else {
        return NextResponse.redirect(
          new URL(withBasePath("/dashboard/user"), request.url),
        );
      }
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

  if (pathname === "/dashboard/user" && userRole !== "admin") {
    return NextResponse.redirect(
      new URL(withBasePath("/dashboard/mahasiswa"), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
