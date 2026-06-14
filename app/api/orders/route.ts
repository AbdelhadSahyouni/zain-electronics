import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { createOrderSchema } from "@/lib/validations";
import { sanitizeString } from "@/lib/sanitize";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

// POST /api/orders — public, creates an order record (rate limited to prevent spam)
export async function POST(req: NextRequest) {
  // Stricter rate limit for order creation: 5 per minute per IP
  const { success } = await rateLimit(req, { limit: 5, window: 60 });
  if (!success) return rateLimitResponse();

  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات الطلب غير صحيحة" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify product prices/stock against DB to prevent client-side tampering
    const productIds = data.items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "بعض المنتجات في طلبك غير موجودة" },
        { status: 400 }
      );
    }

    let recalculatedTotal = 0;
    const verifiedItems = data.items.map((item) => {
      const dbProduct = dbProducts.find((p) => p.id === item.productId)!;
      const lineTotal = dbProduct.price * item.quantity;
      recalculatedTotal += lineTotal;
      return {
        productId: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
        imageUrl: dbProduct.imageUrl,
      };
    });

    const order = await prisma.order.create({
      data: {
        storeName: sanitizeString(data.storeName),
        customerPhone: sanitizeString(data.customerPhone),
        region: data.region,
        items: verifiedItems,
        totalAmount: recalculatedTotal,
        notes: data.notes ? sanitizeString(data.notes) : null,
        status: "pending",
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء الطلب. حاول مجدداً." },
      { status: 500 }
    );
  }
}

// GET /api/orders — admin only, list orders with optional status filter & pagination
export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const where = status ? { status } : {};

    const [orders, total, statusCounts] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const counts = {
      pending: 0,
      confirmed: 0,
      delivered: 0,
      total: 0,
    };
    for (const c of statusCounts) {
      counts[c.status as keyof typeof counts] = c._count.status;
      counts.total += c._count.status;
    }

    return NextResponse.json({
      orders,
      counts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب الطلبات" }, { status: 500 });
  }
}
