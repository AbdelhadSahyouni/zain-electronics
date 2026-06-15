import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://postgres.ovlyexxyalcdukdexvnl:A45%2B%26R_sZAUQ_mn@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: DATABASE_URL },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
