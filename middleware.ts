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
  "/collab-station",
  "/cloud",
  "/employees",
  "/teams",
  "/clients",
  "/reports",
];

// Public routes accessible without login
const publicRoutes = ["/session", "/login", "/signup", "/forgot-password", "/main"];

// Routes only accessible through internal code flow
const programmaticOnlyRoutes = [
  "/session/verify-code",
  "/session/register-business",
];

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
  const accessToken =
    request.cookies.get("access-token")?.value ||
    request.cookies.get("access_token")?.value;
  const verifyToken =
    request.cookies.get("verify-token")?.value ||
    request.cookies.get("token")?.value;
  const registerToken = request.cookies.get("register-token")?.value;
  const hasBusiness =
    Boolean(request.cookies.get("business-id")?.value) &&
    Boolean(request.cookies.get("business-name")?.value);
  const pathname = request.nextUrl.pathname;

  // -------------------------
  // 1. Handle programmatic-only routes
  // -------------------------
  const isProgrammatic = programmaticOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProgrammatic) {
    if (pathname.startsWith("/session/verify-code")) {
      if (!verifyToken) {
        return NextResponse.redirect(new URL("/session", request.url));
      }

      const payload = await verifyJWT(verifyToken);
      if (!payload) {
        const response = NextResponse.redirect(
          new URL("/session", request.url)
        );
        response.cookies.delete("verify-token");
        response.cookies.delete("token");
        return response;
      }

      const email = request.nextUrl.searchParams.get("email");
      if (email && payload.email !== email) {
        return NextResponse.redirect(new URL("/session", request.url));
      }
    } else if (pathname.startsWith("/session/register-business")) {
      if (!registerToken) {
        return NextResponse.redirect(new URL("/session", request.url));
      }

      const payload = await verifyJWT(registerToken);
      if (!payload) {
        const response = NextResponse.redirect(
          new URL("/session", request.url)
        );
        response.cookies.delete("register-token");
        return response;
      }
    } else {
      const referer = request.headers.get("referer") ?? "";
      const allowedReferer =
        referer.includes("/signin") || referer.includes("/signup") || referer.includes("/session");
      if (!allowedReferer) {
        return NextResponse.redirect(new URL("/session", request.url));
      }
    }
  }

  // -------------------------
  // 2. Handle public routes
  // -------------------------
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublic) {
    // Keep middleware aligned with the client dashboard guard.
    if (
      accessToken &&
      (pathname === "/session" ||
        pathname === "/login" ||
        pathname === "/signup")
    ) {
      const payload = await verifyJWT(accessToken);

      if (!payload) {
        const response = NextResponse.next();
        response.cookies.delete("access-token");
        response.cookies.delete("access_token");
        return response;
      }

      if (verifyToken) {
        return NextResponse.redirect(new URL("/session/verify-code", request.url));
      }

      if (registerToken && !hasBusiness) {
        return NextResponse.redirect(
          new URL("/session/register-business", request.url)
        );
      }

      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // -------------------------
  // 3. Handle protected routes
  // -------------------------
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    if (!accessToken) {
      const response = NextResponse.redirect(new URL("/session", request.url));
      response.cookies.delete("access-token");
      response.cookies.delete("access_token");
      return response;
    }

    if (registerToken && !hasBusiness) {
      return NextResponse.redirect(
        new URL("/session/register-business", request.url)
      );
    }

    try {
      const payload = await verifyJWT(accessToken);
      if (!payload) {
        throw new Error("Invalid token");
      }
      // If token is valid, continue to the requested page
      return NextResponse.next();
    } catch {
      // If token verification fails, redirect to session
      const response = NextResponse.redirect(new URL("/session", request.url));
      response.cookies.delete("access-token");
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
