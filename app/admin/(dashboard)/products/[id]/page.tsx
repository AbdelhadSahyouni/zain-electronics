import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Params) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-text-muted mb-1">
          <Link href="/admin/products" className="hover:text-primary">المنتجات</Link>
          {" / "}<span className="text-text-primary">{product.name}</span>
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">تعديل المنتج</h1>
      </div>
      <ProductForm categories={categories} initialData={{ id: product.id, name: product.name, description: product.description || "", price: product.price, stock: product.stock, imageUrl: product.imageUrl, images: product.images, categoryId: product.categoryId, isActive: product.isActive, isFeatured: product.isFeatured }} />
    </div>
  );
}
