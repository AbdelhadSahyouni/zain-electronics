import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ProductsTable from "@/components/admin/ProductsTable";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import Pagination from "@/components/store/Pagination";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 15;

interface Props {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { search, category: categorySlug, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10));
  const searchTrim = search?.trim();

  const where: Prisma.ProductWhereInput = {};
  if (searchTrim) where.name = { contains: searchTrim, mode: "insensitive" };
  if (categorySlug) where.category = { slug: categorySlug };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start sm:items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">المنتجات</h1>
          <p className="text-sm text-text-muted mt-1">{total} منتج</p>
        </div>
        <Link href="/admin/products/new"><Button variant="primary">+ إضافة منتج</Button></Link>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <AdminSearchInput placeholder="بحث باسم المنتج..." />
        <div className="flex gap-2 overflow-x-auto">
          <Link href="/admin/products" className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!categorySlug ? "bg-primary text-white" : "bg-white border border-slate-300 text-text-primary hover:bg-slate-50"}`}>الكل</Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/admin/products?category=${cat.slug}`} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${categorySlug === cat.slug ? "bg-primary text-white" : "bg-white border border-slate-300 text-text-primary hover:bg-slate-50"}`}>{cat.name}</Link>
          ))}
        </div>
      </div>
      <ProductsTable products={products} />
      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/products" searchParams={{ search: searchTrim, category: categorySlug }} />
    </div>
  );
}
