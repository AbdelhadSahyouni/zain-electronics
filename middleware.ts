import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { AUTH_SECRET } from "@/lib/auth";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === "/admin/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  },
  {
    secret: AUTH_SECRET,
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === "/admin/login") return true;
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
