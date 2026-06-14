import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-text-muted mb-1">
          <Link href="/admin/products" className="hover:text-primary">المنتجات</Link>
          {" / "}
          <span className="text-text-primary">إضافة منتج جديد</span>
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">إضافة منتج جديد</h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
