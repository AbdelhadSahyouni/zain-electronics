import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter as fallback when Upstash is not configured
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function rateLimit(
  req: NextRequest,
  { limit = 100, window = 60 } = {}
): Promise<{ success: boolean; remaining: number }> {
  const ip = getClientIp(req);
  const key = `rl:${ip}`;
  const now = Date.now();
  const windowMs = window * 1000;

  // Use Upstash if configured
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      const { Ratelimit } = await import("@upstash/ratelimit");
      const { Redis } = await import("@upstash/redis");

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${window} s`),
      });

      const { success, remaining } = await ratelimit.limit(key);
      return { success, remaining };
    } catch {
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const existing = inMemoryStore.get(key);

  if (!existing || existing.resetAt < now) {
    inMemoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  existing.count++;
  if (existing.count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - existing.count };
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: "تجاوزت الحد المسموح به من الطلبات. حاول لاحقاً." },
    { status: 429 }
  );
}
