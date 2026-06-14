import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If authenticated but somehow hits /admin/login, redirect to dashboard
    if (
      req.nextUrl.pathname === "/admin/login" &&
      req.nextauth.token
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // /admin/login is always accessible
        if (req.nextUrl.pathname === "/admin/login") return true;
        // All other /admin/* routes require a valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
