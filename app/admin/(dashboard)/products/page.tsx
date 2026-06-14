import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ProductsTable from "@/components/admin/ProductsTable";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import Pagination from "@/components/store/Pagination";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

interface SearchParams {
  search?: string;
  category?: string;
  page?: string;
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const search = searchParams.search?.trim();
  const categorySlug = searchParams.category;

  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
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
        <Link href="/admin/products/new">
          <Button variant="primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة منتج
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <AdminSearchInput placeholder="بحث باسم المنتج..." />
        <div className="flex gap-2 overflow-x-auto">
          <Link
            href="/admin/products"
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              !categorySlug ? "bg-primary text-white" : "bg-white border border-slate-300 text-text-primary hover:bg-slate-50"
            }`}
          >
            الكل
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/admin/products?category=${cat.slug}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                categorySlug === cat.slug ? "bg-primary text-white" : "bg-white border border-slate-300 text-text-primary hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <ProductsTable products={products} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/products"
        searchParams={{ search, category: categorySlug }}
      />
    </div>
  );
}
