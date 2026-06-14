import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error("بيانات الدخول غير صحيحة");
        }

        // Check if account is locked
        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
          const minutesLeft = Math.ceil(
            (admin.lockedUntil.getTime() - Date.now()) / 60000
          );
          throw new Error(
            `الحساب مقفل. حاول مجدداً بعد ${minutesLeft} دقيقة`
          );
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
              lockedUntil: shouldLock
                ? new Date(Date.now() + 15 * 60 * 1000)
                : null,
            },
          });

          if (shouldLock) {
            throw new Error("تم قفل الحساب لمدة 15 دقيقة بسبب المحاولات الفاشلة المتكررة");
          }

          throw new Error("بيانات الدخول غير صحيحة");
        }

        // Reset failed logins on success
        await prisma.admin.update({
          where: { id: admin.id },
          data: { failedLogins: 0, lockedUntil: null },
        });

        return {
          id: String(admin.id),
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
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
