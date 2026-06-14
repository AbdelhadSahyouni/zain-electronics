"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const itemCount = useCart((s) => s.itemCount());
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    if (itemCount > prevCount) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 400);
    }
    setPrevCount(itemCount);
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-50 bg-dark-bg shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm sm:text-base leading-tight">
              زين العابدين<br className="hidden sm:block" />
              <span className="text-secondary text-xs sm:text-sm font-medium">للإلكترونيات</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              الرئيسية
            </Link>
            <Link href="/products" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              المنتجات
            </Link>
            <Link href="/category/receivers" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              أجهزة الاستقبال
            </Link>
            <Link href="/category/cables" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              الكابلات
            </Link>
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Link href="/search" className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
            >
              <svg
                className={`w-5 h-5 ${cartBounce ? "cart-bounce" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="القائمة"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-700 py-4 space-y-1">
            {[
              { href: "/", label: "الرئيسية" },
              { href: "/products", label: "جميع المنتجات" },
              { href: "/category/receivers", label: "أجهزة الاستقبال" },
              { href: "/category/satellite-dishes", label: "صحون الدش" },
              { href: "/category/remote-controls", label: "أجهزة التحكم" },
              { href: "/category/cables", label: "الكابلات" },
              { href: "/category/accessories", label: "الاكسسوارات" },
              { href: "/cart", label: "السلة" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
