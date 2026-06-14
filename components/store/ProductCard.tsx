"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: { name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.productId === product.id);
  const isOutOfStock = product.stock === 0;
  const isLastItems = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badges */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-danger text-white text-xs font-bold px-3 py-1 rounded-full">
              غير متوفر
            </span>
          </div>
        )}
        {isLastItems && !isOutOfStock && (
          <div className="absolute top-2 right-2">
            <span className="bg-secondary text-dark-bg text-xs font-bold px-2 py-0.5 rounded-full">
              ⚠️ آخر قطع!
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-primary font-medium mb-1">
            {product.category.name}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-primary font-bold text-base">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`
              flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all
              ${isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-success text-white"
                : "bg-primary text-white hover:bg-blue-700 active:scale-95"
              }
            `}
          >
            {isOutOfStock ? (
              "غير متوفر"
            ) : added ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                تمت الإضافة
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                </svg>
                أضف للسلة
              </>
            )}
          </button>
        </div>

        {cartItem && (
          <p className="mt-1.5 text-xs text-text-muted">
            في السلة: {cartItem.quantity} قطعة
          </p>
        )}
      </div>
    </div>
  );
}
