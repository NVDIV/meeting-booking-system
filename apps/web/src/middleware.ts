import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. Якщо токена немає, а користувач намагається зайти в кабінет
  if (!token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Якщо токен є, а користувач йде на сторінку логіну чи реєстрації
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

// Вказуємо, які саме маршрути має перехоплювати middleware
export const config = {
  matcher: ["/profile/:path*", "/login", "/register"],
};