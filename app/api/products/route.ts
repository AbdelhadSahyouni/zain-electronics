import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { createProductSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

// GET /api/products — public, with filters: ?category=slug&search=&featured=true&page=1&limit=12
export async function GET(req: NextRequest) {
  const { success } = await rateLimit(req, { limit: 60, window: 60 });
  if (!success) return rateLimitResponse();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const includeInactive = searchParams.get("includeInactive") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const where: Prisma.ProductWhereInput = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المنتجات" },
      { status: 500 }
    );
  }
}

// POST /api/products — admin only
export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "هذا الرابط مستخدم بالفعل، اختر اسماً مختلفاً" },
        { status: 409 }
      );
    }

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "الفئة المحددة غير موجودة" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        images: data.images || [],
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء المنتج" },
      { status: 500 }
    );
  }
}
