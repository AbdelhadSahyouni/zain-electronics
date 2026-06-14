"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";

interface ProductForCart {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export default function AddToCartSection({ product }: { product: ProductForCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const items = useCart((s) => s.items);
  const router = useRouter();

  const isOutOfStock = product.stock === 0;
  const cartItem = items.find((i) => i.productId === product.id);

  const increment = () => setQuantity((q) => Math.min(q + 1, product.stock));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    // If quantity > 1, update to the exact selected quantity
    if (quantity > 1) {
      const currentQty = cartItem?.quantity || 0;
      updateQuantity(product.id, currentQty + quantity);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      {!isOutOfStock && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            الكمية
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                onClick={decrement}
                className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors"
                aria-label="تقليل الكمية"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-text-primary latin">
                {quantity}
              </span>
              <button
                onClick={increment}
                className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors"
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>
            <span className="text-sm text-text-muted">
              {product.stock} قطعة متوفرة
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant={added ? "primary" : "outline"}
          size="lg"
          className="flex-1"
        >
          {isOutOfStock ? (
            "غير متوفر حالياً"
          ) : added ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              تمت الإضافة للسلة
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
              </svg>
              أضف إلى السلة
            </>
          )}
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          اطلب الآن
        </Button>
      </div>

      {cartItem && (
        <p className="text-sm text-text-muted">
          لديك {cartItem.quantity} قطعة من هذا المنتج في السلة
        </p>
      )}
    </div>
  );
}
