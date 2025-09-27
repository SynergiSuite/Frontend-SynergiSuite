import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

// JWT secret — MUST match the backend secret
const secret = new TextEncoder().encode("synergi_user");

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/projects",
  "/crm",
  "/team",
  "/profile",
];

// Public routes accessible without login
const publicRoutes = ["/login", "/signup", "/forgot-password"];

// Routes only accessible through internal code flow
const programmaticOnlyRoutes = ["/session/verify-code"];

// In middleware.ts
async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const result = await jwtVerify(token, secret);
    return result.payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  // -------------------------
  // 1. Handle programmatic-only routes
  // -------------------------
  const isProgrammatic = programmaticOnlyRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProgrammatic) {
    if (pathname.startsWith("/session/verify-code")) {
      const codeToken = request.cookies.get("token")?.value;

      if (!codeToken) {
        return NextResponse.redirect(new URL("/session", request.url));
      }

      const payload = await verifyJWT(codeToken);
      if (!payload) {
        const response = NextResponse.redirect(
          new URL("/session", request.url),
        );
        response.cookies.delete("token");
        return response;
      }

      const email = request.nextUrl.searchParams.get("email");
      if (email && payload.email !== email) {
        return NextResponse.redirect(new URL("/session", request.url));
      }
    } else {
      const referer = request.headers.get("referer") ?? "";
      const allowedReferer =
        referer.includes("/signin") || referer.includes("/signup");
      if (!allowedReferer) {
        return NextResponse.redirect(new URL("/session", request.url));
      }
    }
  }

  // -------------------------
  // 2. Handle public routes
  // -------------------------
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublic) {
    // If user is already logged in and tries to access login/signup, redirect to dashboard
    if (accessToken && (pathname === "/login" || pathname === "/signup")) {
      const response = NextResponse.redirect(
        new URL("/dashboard", request.url),
      );
      return response;
    }
    return NextResponse.next();
  }

  // -------------------------
  // 3. Handle protected routes
  // -------------------------
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isProtected) {
    if (!accessToken) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }

    try {
      const payload = await verifyJWT(accessToken);
      if (!payload) {
        throw new Error("Invalid token");
      }
      // If token is valid, continue to the requested page
      return NextResponse.next();
    } catch (error) {
      // If token verification fails, redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }
  }

  // -------------------------
  // 4. Allow all other routes
  // -------------------------
  return NextResponse.next();
}

// Only apply middleware to client-side pages (ignore API, _next, etc.)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
