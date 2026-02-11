import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // If accessing admin page and role is not admin, redirect to home
    if (isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // Middleware only runs if authorized returns true
      authorized: ({ token }) => !!token,
    },
  },
);

/**
 * Match all routes that need protection.
 * Add your specific paths here.
 */
export const config = {
  matcher: [
    "/admin/:path*", // Protects all admin dashboard routes
    "/profile/:path*", // Protects user profile
    "/booking/confirm", // Protects the final booking steps
  ],
};
