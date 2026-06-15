import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Inject DB URL if env var is missing (handles special chars in Vercel env)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres.ovlyexxyalcdukdexvnl:A45%2B%26R_sZAUQ_mn@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    "postgresql://postgres.ovlyexxyalcdukdexvnl:A45%2B%26R_sZAUQ_mn@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
