import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/store/ProductGrid";
import CategorySidebar from "@/components/store/CategorySidebar";
import Pagination from "@/components/store/Pagination";
import SortSelect from "@/components/store/SortSelect";
import { Prisma } from "@prisma/client";

export const revalidate = 60;
const PAGE_SIZE = 12;

export const metadata = {
  title: "جميع المنتجات | زين العابدين للإلكترونيات",
  description: "تصفح كافة المنتجات: أجهزة استقبال، صحون دش، كابلات، أجهزة تحكم وأكثر",
};

interface Props {
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page: pageStr, sort: sortStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10));
  const sort = sortStr || "newest";

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = { isActive: true };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: { select: { name: true } } }, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-sm text-text-muted mb-4">الرئيسية / جميع المنتجات</p>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-20">
            <CategorySidebar categories={categories} totalCount={total} />
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">جميع المنتجات</h1>
              <p className="text-sm text-text-muted mt-1">{total} منتج متوفر</p>
            </div>
            <SortSelect defaultValue={sort} />
          </div>
          <ProductGrid products={products} />
          <Pagination currentPage={page} totalPages={totalPages} basePath="/products" searchParams={{ sort: sort !== "newest" ? sort : undefined }} />
        </div>
      </div>
    </div>
  );
}
