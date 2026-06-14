import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { updateProductSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

interface Params {
  params: { id: string };
}

// GET /api/products/[id] — public
export async function GET(req: NextRequest, { params }: Params) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// PATCH /api/products/[id] — admin only
export async function PATCH(req: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        return NextResponse.json({ error: "الفئة المحددة غير موجودة" }, { status: 400 });
      }
    }

    let slug = existingProduct.slug;
    if (data.name && data.name !== existingProduct.name) {
      slug = data.slug || slugify(data.name);
      const slugTaken = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: "هذا الرابط مستخدم بالفعل، اختر اسماً مختلفاً" },
          { status: 409 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name, slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.images && { images: data.images }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في التعديل" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(req: NextRequest, { params }: Params) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في الحذف" }, { status: 500 });
  }
}
