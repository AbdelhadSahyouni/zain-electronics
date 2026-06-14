import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { updateOrderStatusSchema } from "@/lib/validations";

interface Params {
  params: { id: string };
}

// GET /api/orders/[id] — admin only
export async function GET(req: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — admin only, update status
export async function PATCH(req: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "حالة غير صحيحة" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في التعديل" }, { status: 500 });
  }
}

// DELETE /api/orders/[id] — admin only
export async function DELETE(req: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في الحذف" }, { status: 500 });
  }
}
