import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// Inject auth env vars as fallbacks if missing
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "aa80a9ee234f8863dd4b6889fa23c2f9f2426d0a90733c2ee640c3055b1a66d1";
}
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "https://zain-electronics-steel.vercel.app";
}

export const authOptions: NextAuthOptions = {
  secret: "aa80a9ee234f8863dd4b6889fa23c2f9f2426d0a90733c2ee640c3055b1a66d1",
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error("بيانات الدخول غير صحيحة");
        }

        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
          const minutesLeft = Math.ceil(
            (admin.lockedUntil.getTime() - Date.now()) / 60000
          );
          throw new Error(`الحساب مقفل. حاول مجدداً بعد ${minutesLeft} دقيقة`);
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        );

        if (!isValidPassword) {
          const failedLogins = admin.failedLogins + 1;
          const shouldLock = failedLogins >= 5;
          await prisma.admin.update({
            where: { id: admin.id },
            data: {
              failedLogins,
              lockedUntil: shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null,
            },
          });
          if (shouldLock) throw new Error("تم قفل الحساب لمدة 15 دقيقة");
          throw new Error("بيانات الدخول غير صحيحة");
        }

        await prisma.admin.update({
          where: { id: admin.id },
          data: { failedLogins: 0, lockedUntil: null },
        });

        return { id: String(admin.id), email: admin.email, name: admin.name };
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
