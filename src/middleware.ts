import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "gt-printing-press-jwt-production-secret-2026-secure-key"
);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /admin route authentication
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("gt_admin_session")?.value;
    let isAuthenticated = false;

    if (sessionToken) {
      try {
        await jwtVerify(sessionToken, JWT_SECRET);
        isAuthenticated = true;
      } catch (err) {
        isAuthenticated = false;
      }
    }

    // If on /admin/login and already authenticated, forward to dashboard
    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // If accessing any other /admin route without authentication, redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Handle all public routes with next-intl
  return intlMiddleware(request);
}

export const config = {
  // Match all request paths except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - all static files with an extension (e.g. favicon.ico, images, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
