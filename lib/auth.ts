import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const AUTH_SECRET = "aa80a9ee234f8863dd4b6889fa23c2f9f2426d0a90733c2ee640c3055b1a66d1";

export const authOptions: NextAuthOptions = {
  secret: AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email },
          });

          if (!admin) return null;
          if (admin.lockedUntil && admin.lockedUntil > new Date()) return null;

          const bcrypt = await import("bcryptjs");
          const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash);

          if (!isValidPassword) {
            const failedLogins = admin.failedLogins + 1;
            await prisma.admin.update({
              where: { id: admin.id },
              data: {
                failedLogins,
                lockedUntil: failedLogins >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
              },
            });
            return null;
          }

          await prisma.admin.update({
            where: { id: admin.id },
            data: { failedLogins: 0, lockedUntil: null },
          });

          return { id: String(admin.id), email: admin.email, name: admin.name };
        } catch (err) {
          console.error("AUTH EXCEPTION:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
