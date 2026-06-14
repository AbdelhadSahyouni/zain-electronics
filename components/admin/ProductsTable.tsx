"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "حدث خطأ في الحذف", "error");
        setDeleting(false);
        return;
      }

      showToast("تم حذف المنتج بنجاح", "success");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      showToast("تعذر الاتصال بالخادم", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <p className="text-text-muted text-sm">لا توجد منتجات مطابقة</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-text-muted">
            <tr>
              <th className="text-right font-medium px-4 py-3">المنتج</th>
              <th className="text-right font-medium px-4 py-3">الفئة</th>
              <th className="text-right font-medium px-4 py-3">السعر</th>
              <th className="text-right font-medium px-4 py-3">المخزون</th>
              <th className="text-right font-medium px-4 py-3">الحالة</th>
              <th className="text-right font-medium px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary truncate max-w-xs">{product.name}</p>
                      {product.isFeatured && (
                        <span className="text-xs text-secondary">⭐ مميز</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">{product.category.name}</td>
                <td className="px-4 py-3 font-semibold text-text-primary latin">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`latin font-medium ${product.stock === 0 ? "text-danger" : product.stock <= 5 ? "text-amber-600" : "text-text-primary"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.isActive ? (
                    <Badge variant="success">نشط</Badge>
                  ) : (
                    <Badge variant="default">غير نشط</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-primary hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      aria-label="تعديل"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="text-danger hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      aria-label="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 4h6a1 1 0 011 1v2H8V5a1 1 0 011-1z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex gap-3">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100">
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary text-sm truncate">{product.name}</p>
              <p className="text-xs text-text-muted">{product.category.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold text-text-primary text-sm latin">${product.price.toFixed(2)}</span>
                <span className={`text-xs latin ${product.stock === 0 ? "text-danger" : "text-text-muted"}`}>
                  المخزون: {product.stock}
                </span>
                {product.isActive ? (
                  <Badge variant="success">نشط</Badge>
                ) : (
                  <Badge variant="default">غير نشط</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <Link
                href={`/admin/products/${product.id}`}
                className="text-primary p-1.5 rounded-lg hover:bg-blue-50"
                aria-label="تعديل"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <button
                onClick={() => setDeleteTarget(product)}
                className="text-danger p-1.5 rounded-lg hover:bg-red-50"
                aria-label="حذف"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 4h6a1 1 0 011 1v2H8V5a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف المنتج"
        description={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
