export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/store/ProductGrid";
import SearchBar from "@/components/store/SearchBar";
import { Prisma } from "@prisma/client";

export const metadata = { title: "البحث | زين العابدين للإلكترونيات" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];

  if (query) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };
    products = await prisma.product.findMany({ where, include: { category: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 24 });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">البحث عن منتج</h1>
      <div className="max-w-xl mb-8"><SearchBar initialQuery={query} /></div>
      {query ? (
        <>
          <p className="text-sm text-text-muted mb-6">{products.length > 0 ? `${products.length} نتيجة لـ "${query}"` : `لا توجد نتائج لـ "${query}"`}</p>
          <ProductGrid products={products} emptyMessage="جرب كلمات بحث أخرى أو تصفح الفئات من الصفحة الرئيسية" />
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">ابدأ بكتابة اسم المنتج الذي تبحث عنه</p>
        </div>
      )}
    </div>
  );
}
