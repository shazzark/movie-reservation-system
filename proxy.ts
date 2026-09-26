import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/confirmation/:path*"],
};
