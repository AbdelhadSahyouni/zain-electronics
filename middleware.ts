import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const NEXTAUTH_SECRET = "aa80a9ee234f8863dd4b6889fa23c2f9f2426d0a90733c2ee640c3055b1a66d1";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === "/admin/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  },
  {
    secret: NEXTAUTH_SECRET,
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
