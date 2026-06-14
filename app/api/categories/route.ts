import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { createCategorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

// GET /api/categories — public, list all categories with product counts
export async function GET(req: NextRequest) {
  const { success } = await rateLimit(req, { limit: 60, window: 60 });
  if (!success) return rateLimitResponse();

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الفئات" },
      { status: 500 }
    );
  }
}

// POST /api/categories — admin only, create new category
export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.name);

    // Ensure unique slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "هذا الرابط مستخدم بالفعل، اختر اسماً مختلفاً" },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        imageUrl: data.imageUrl || null,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء الفئة" },
      { status: 500 }
    );
  }
}
