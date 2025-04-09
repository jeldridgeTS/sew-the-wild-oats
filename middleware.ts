import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Get JWT_SECRET from environment variables with fallback
const JWT_SECRET_VALUE =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "DEV_ONLY_SECRET_7a6cdd2f-d4e2-4c37-9b60-df09af6c853b");

// Convert JWT_SECRET to TextEncoder for jose
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE);

// This function is async since we need to verify the JWT token
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow API routes and login page to pass through - they handle their own auth
  if (path.startsWith("/api/auth/login") || path === "/admin/login") {
    return NextResponse.next();
  }

  // Define admin paths that require authentication
  const isAdminPath = ["/admin"].some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  );

  // Don't apply middleware to non-admin routes
  if (!isAdminPath) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get("admin_auth_token")?.value;

  // If no token is present, redirect to admin login page
  if (!token) {
    const url = new URL("/admin/login", request.url);

    return NextResponse.redirect(url);
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check if the user has admin role
    if (payload && payload.role === "admin") {
      return NextResponse.next();
    }

    // If not admin, redirect to home page
    throw new Error("Not authorized");
  } catch (error) {
    // If token verification fails, redirect to admin login page
    const url = new URL("/admin/login", request.url);

    return NextResponse.redirect(url);
  }
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/admin/:path*"],
};
