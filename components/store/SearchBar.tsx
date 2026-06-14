"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SearchBarInner({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      const queryStr = params.toString();
      router.replace(queryStr ? `/search?${queryStr}` : "/search");
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleClear = useCallback(() => setQuery(""), []);

  return (
    <div className="relative">
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث عن منتج... مثلاً: رسيفر، صحن دش، كابل"
        autoFocus
        className="w-full h-14 pr-12 pl-12 rounded-xl border border-slate-300 bg-white text-base text-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-text-primary transition-colors"
          aria-label="مسح البحث"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  return (
    <Suspense fallback={
      <div className="w-full h-14 rounded-xl border border-slate-300 bg-slate-50 animate-pulse" />
    }>
      <SearchBarInner initialQuery={initialQuery} />
    </Suspense>
  );
}
