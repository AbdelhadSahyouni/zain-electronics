// Set required env vars before NextAuth loads
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "aa80a9ee234f8863dd4b6889fa23c2f9f2426d0a90733c2ee640c3055b1a66d1";
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://zain-electronics-steel.vercel.app";

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
