"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import ImageUploader from "./ImageUploader";

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  _count: { products: number };
}

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const openAddModal = () => {
    setEditTarget(null);
    setName("");
    setImageUrl("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditTarget(category);
    setName(category.name);
    setImageUrl(category.imageUrl || "");
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("اسم الفئة مطلوب (حرفين على الأقل)");
      return;
    }

    setSubmitting(true);

    try {
      const url = editTarget ? `/api/categories/${editTarget.id}` : "/api/categories";
      const method = editTarget ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), imageUrl: imageUrl || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ");
        setSubmitting(false);
        return;
      }

      showToast(editTarget ? "تم تحديث الفئة بنجاح" : "تم إضافة الفئة بنجاح", "success");
      setModalOpen(false);
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "حدث خطأ في الحذف", "error");
        setDeleting(false);
        return;
      }

      showToast("تم حذف الفئة بنجاح", "success");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      showToast("تعذر الاتصال بالخادم", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">الفئات</h1>
          <p className="text-sm text-text-muted mt-1">{categories.length} فئة</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة فئة
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
              {category.imageUrl ? (
                <Image src={category.imageUrl} alt={category.name} fill className="object-cover" sizes="56px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary truncate">{category.name}</p>
              <p className="text-xs text-text-muted mt-0.5">{category._count.products} منتج</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => openEditModal(category)}
                className="text-primary p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                aria-label="تعديل"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setDeleteTarget(category)}
                className="text-danger p-1.5 rounded-lg hover:bg-red-50 transition-colors"
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

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "تعديل الفئة" : "إضافة فئة جديدة"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="catName">اسم الفئة *</Label>
            <Input
              id="catName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أجهزة استقبال"
              maxLength={100}
              error={error}
            />
          </div>

          <ImageUploader label="صورة الفئة (اختياري)" value={imageUrl} onChange={setImageUrl} />

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
              {submitting ? "جاري الحفظ..." : editTarget ? "حفظ التعديلات" : "إضافة"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف الفئة"
        description={
          deleteTarget && deleteTarget._count.products > 0
            ? `لا يمكن حذف "${deleteTarget.name}" لأنها تحتوي على ${deleteTarget._count.products} منتج. احذف المنتجات أولاً أو نقلها لفئة أخرى.`
            : `هل أنت متأكد من حذف "${deleteTarget?.name}"؟`
        }
        confirmLabel="حذف"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
