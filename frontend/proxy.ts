import { NextRequest, NextResponse } from "next/server";
import { stripBasePath, withBasePath } from "./lib/base-path";

const protectedRoutes = ["/user", "/dashboard"];

function getUserRole(userCookie: string | undefined) {
  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(userCookie).role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const pathname = stripBasePath(request.nextUrl.pathname);
  const token = request.cookies.get("token")?.value;
  const loginUrl = new URL(withBasePath("/login"), request.url);
  const userRole = getUserRole(request.cookies.get("user")?.value);

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
