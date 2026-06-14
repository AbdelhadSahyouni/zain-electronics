import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { updateCategorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

interface Params {
  params: { id: string };
}

// GET /api/categories/[id] — public, single category
export async function GET(req: NextRequest, { params }: Params) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "الفئة غير موجودة" }, { status: 404 });
    }
    return NextResponse.json({ category });
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// PATCH /api/categories/[id] — admin only
export async function PATCH(req: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: { name?: string; slug?: string; imageUrl?: string | null } = {};

    if (data.name) {
      updateData.name = data.name;
      updateData.slug = data.slug || slugify(data.name);
    }
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    if (updateData.slug) {
      const existing = await prisma.category.findFirst({
        where: { slug: updateData.slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "هذا الرابط مستخدم بالفعل" },
          { status: 409 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("PATCH /api/categories/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في التعديل" }, { status: 500 });
  }
}

// DELETE /api/categories/[id] — admin only
export async function DELETE(req: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف هذه الفئة لأنها تحتوي على ${productCount} منتج. احذف المنتجات أولاً أو نقلها لفئة أخرى.` },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في الحذف" }, { status: 500 });
  }
}
