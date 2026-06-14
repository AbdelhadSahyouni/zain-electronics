"use client";

import { Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function SortSelectInner({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => handleChange(e.target.value)}
      className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      aria-label="ترتيب المنتجات"
    >
      <option value="newest">الأحدث</option>
      <option value="price-asc">السعر: من الأقل للأعلى</option>
      <option value="price-desc">السعر: من الأعلى للأقل</option>
    </select>
  );
}

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <Suspense fallback={
      <div className="h-10 w-40 rounded-lg border border-slate-300 bg-slate-50 animate-pulse" />
    }>
      <SortSelectInner defaultValue={defaultValue} />
    </Suspense>
  );
}
