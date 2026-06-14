import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

export default function CategorySidebar({
  categories,
  activeCategory,
  totalCount,
}: {
  categories: Category[];
  activeCategory?: string;
  totalCount: number;
}) {
  return (
    <nav className="space-y-1" aria-label="فئات المنتجات">
      <h3 className="text-sm font-bold text-text-primary mb-3 px-2">الفئات</h3>
      <Link
        href="/products"
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          !activeCategory
            ? "bg-primary text-white"
            : "text-text-primary hover:bg-slate-100"
        )}
      >
        <span>جميع المنتجات</span>
        <span className={cn("text-xs", !activeCategory ? "text-white/80" : "text-text-muted")}>
          {totalCount}
        </span>
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            activeCategory === cat.slug
              ? "bg-primary text-white"
              : "text-text-primary hover:bg-slate-100"
          )}
        >
          <span>{cat.name}</span>
          {cat._count !== undefined && (
            <span className={cn("text-xs", activeCategory === cat.slug ? "text-white/80" : "text-text-muted")}>
              {cat._count.products}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
