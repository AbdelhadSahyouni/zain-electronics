import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

// Custom icons grounded in the actual product categories
const icons: Record<string, JSX.Element> = {
  receivers: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="36" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="13" cy="24" r="2" fill="currentColor" />
      <rect x="20" y="22" width="14" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <path d="M12 16V11a2 2 0 012-2h20a2 2 0 012 2v5" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  "satellite-dishes": (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 28a18 18 0 0128-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 30c8-12 24-16 34-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <circle cx="34" cy="14" r="2.5" fill="currentColor" />
      <path d="M34 16.5V30M34 30l-6 8M34 30l6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="34" r="2" fill="currentColor" />
    </svg>
  ),
  "remote-controls": (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="5" width="18" height="38" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="13" r="2.5" fill="currentColor" />
      <rect x="19" y="20" width="10" height="6" rx="1.5" fill="currentColor" opacity="0.25" />
      <circle cx="20" cy="33" r="2" fill="currentColor" />
      <circle cx="28" cy="33" r="2" fill="currentColor" />
      <circle cx="20" cy="39" r="2" fill="currentColor" />
      <circle cx="28" cy="39" r="2" fill="currentColor" />
    </svg>
  ),
  cables: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14c8 0 8 8 16 8s8-8 16-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 34c8 0 8-8 16-8s8 8 16 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <circle cx="10" cy="14" r="3" fill="currentColor" />
      <circle cx="38" cy="14" r="3" fill="currentColor" />
      <circle cx="10" cy="34" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="38" cy="34" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  mixers: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="6" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
      <path d="M19 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 26l-3 14h12l-3-14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 16c4 0 6 3 6 7s-2 7-6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    </svg>
  ),
  accessories: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="24" r="2.5" fill="currentColor" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      <circle cx="31" cy="24" r="2.5" fill="currentColor" />
      <path d="M24 34v6M18 44h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const defaultIcon = (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
    <path d="M8 18h32M18 8v32" stroke="currentColor" strokeWidth="2" opacity="0.3" />
  </svg>
);

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
          تصفح حسب الفئة
        </h2>
        <Link href="/products" className="text-primary text-sm font-medium hover:underline">
          عرض الكل
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center text-center bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
              <div className="w-7 h-7 sm:w-8 sm:h-8">
                {icons[category.slug] || defaultIcon}
              </div>
            </div>
            <span className="text-sm font-semibold text-text-primary leading-snug">
              {category.name}
            </span>
            {category._count !== undefined && (
              <span className="text-xs text-text-muted mt-1">
                {category._count.products} منتج
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
