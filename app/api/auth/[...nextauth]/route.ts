import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  debug: true,
  secret: "aa80a9ee234f8863dd4b6889fa23c2f9f2426d0a90733c2ee640c3055b1a66d1",
  session: { strategy: "jwt", maxAge: 7200 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("AUTHORIZE CALLED", credentials?.email);
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("AUTH: missing credentials");
            return null;
          }

          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email },
          });
          console.log("AUTH: admin lookup result", !!admin);

          if (!admin) return null;

          if (admin.lockedUntil && admin.lockedUntil > new Date()) {
            console.log("AUTH: locked");
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);
          console.log("AUTH: password valid?", isValid);

          if (!isValid) {
            const failed = admin.failedLogins + 1;
            await prisma.admin.update({
              where: { id: admin.id },
              data: {
                failedLogins: failed,
                lockedUntil: failed >= 5 ? new Date(Date.now() + 900000) : null,
              },
            });
            return null;
          }

          await prisma.admin.update({
            where: { id: admin.id },
            data: { failedLogins: 0, lockedUntil: null },
          });

          console.log("AUTH: SUCCESS", admin.email);
          return { id: String(admin.id), email: admin.email, name: admin.name };
        } catch (err) {
          console.error("AUTH: EXCEPTION", err);
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
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
