"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import CartItemRow from "@/components/store/CartItemRow";
import CheckoutForm from "@/components/store/CheckoutForm";
import { Button } from "@/components/ui/Button";

export default function CartPageContent({ whatsappNumber }: { whatsappNumber: string }) {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — Zustand persist reads localStorage on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">سلة الطلبات</h1>
        <div className="animate-pulse space-y-3">
          <div className="h-24 bg-slate-100 rounded-xl" />
          <div className="h-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">السلة فارغة</h1>
          <p className="text-sm text-text-muted mb-6">
            لم تقم بإضافة أي منتجات بعد. تصفح منتجاتنا وأضف ما تحتاجه
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">تصفح المنتجات</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">
        سلة الطلبات
        <span className="text-text-muted text-sm font-normal mr-2">
          ({items.reduce((sum, i) => sum + i.quantity, 0)} قطعة)
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            متابعة التسوق
          </Link>
        </div>

        {/* Summary + Checkout */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-20 space-y-5">
            {/* Total */}
            <div>
              <div className="flex items-center justify-between text-sm text-text-muted mb-1">
                <span>عدد القطع</span>
                <span className="latin">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold text-text-primary pt-2 border-t border-slate-100">
                <span>المجموع</span>
                <span className="text-primary latin">${total.toFixed(2)}</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <CheckoutForm whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}
