export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/store/ProductGrid";
import CategorySidebar from "@/components/store/CategorySidebar";
import Pagination from "@/components/store/Pagination";
import SortSelect from "@/components/store/SortSelect";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";


const PAGE_SIZE = 12;

interface Params {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "الفئة غير موجودة" };
  return {
    title: `${category.name} | زين العابدين للإلكترونيات`,
    description: `تصفح ${category.name} بأفضل أسعار الجملة في لبنان`,
  };
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { page: pageStr, sort: sortStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10));
  const sort = sortStr || "newest";

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = { isActive: true, categoryId: category!.id };

  const [products, total, categories, totalAll] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-sm text-text-muted mb-4">
        <Link href="/" className="hover:text-primary">الرئيسية</Link>
        {" / "}
        <Link href="/products" className="hover:text-primary">المنتجات</Link>
        {" / "}
        <span className="text-text-primary">{category!.name}</span>
      </p>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-20">
            <CategorySidebar categories={categories} activeCategory={category!.slug} totalCount={totalAll} />
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">{category!.name}</h1>
              <p className="text-sm text-text-muted mt-1">{total} منتج متوفر</p>
            </div>
            <SortSelect defaultValue={sort} />
          </div>
          <ProductGrid products={products} emptyMessage={`لا توجد منتجات في فئة "${category!.name}" حالياً`} />
          <Pagination currentPage={page} totalPages={totalPages} basePath={`/category/${category!.slug}`} searchParams={{ sort: sort !== "newest" ? sort : undefined }} />
        </div>
      </div>
    </div>
  );
}
