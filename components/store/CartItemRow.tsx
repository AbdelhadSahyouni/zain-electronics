"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, type CartItem } from "@/hooks/useCart";

export default function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const lineTotal = item.price * item.quantity;
  const atMaxStock = item.quantity >= item.stock;

  return (
    <div className="flex gap-4 py-4 border-b border-slate-100 last:border-b-0">
      {/* Image */}
      <Link href={`#`} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2">
          {item.name}
        </h3>
        <p className="text-primary font-bold text-sm mt-1">${item.price.toFixed(2)}</p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center border border-slate-300 rounded-lg">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors text-lg"
              aria-label="تقليل الكمية"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-semibold text-text-primary latin">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={atMaxStock}
              className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="زيادة الكمية"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.productId)}
            className="text-danger hover:text-red-700 transition-colors p-1.5"
            aria-label="إزالة من السلة"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 4h6a1 1 0 011 1v2H8V5a1 1 0 011-1z" />
            </svg>
          </button>
        </div>

        {atMaxStock && (
          <p className="text-xs text-secondary mt-1.5">
            بلغت الحد الأقصى المتوفر ({item.stock} قطعة)
          </p>
        )}
      </div>

      {/* Line total */}
      <div className="shrink-0 text-left">
        <p className="font-bold text-text-primary latin">${lineTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
