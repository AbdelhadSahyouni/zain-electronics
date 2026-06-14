import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages: (number | "...")[] = [];
  const showRange = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - showRange && i <= currentPage + showRange)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="ترقيم الصفحات">
      <Link
        href={buildUrl(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
          currentPage === 1
            ? "border-slate-200 text-slate-300 pointer-events-none"
            : "border-slate-300 text-text-primary hover:bg-slate-50"
        }`}
      >
        السابق
      </Link>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium text-center border transition-colors ${
              page === currentPage
                ? "bg-primary text-white border-primary"
                : "border-slate-300 text-text-primary hover:bg-slate-50"
            }`}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={buildUrl(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
          currentPage === totalPages
            ? "border-slate-200 text-slate-300 pointer-events-none"
            : "border-slate-300 text-text-primary hover:bg-slate-50"
        }`}
      >
        التالي
      </Link>
    </nav>
  );
}
