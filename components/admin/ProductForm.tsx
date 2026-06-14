"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea, Label, Select } from "@/components/ui";
import ImageUploader from "./ImageUploader";
import MultiImageUploader from "./MultiImageUploader";
import { useToast } from "@/components/ui/Toast";

interface Category {
  id: number;
  name: string;
}

interface ProductFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  images: string[];
  categoryId: number;
  isActive: boolean;
  isFeatured: boolean;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: ProductFormData;
}

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrl: "",
  images: [],
  categoryId: 0,
  isActive: true,
  isFeatured: false,
};

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(
    initialData || { ...emptyForm, categoryId: categories[0]?.id || 0 }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const isEdit = !!initialData?.id;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) newErrors.name = "اسم المنتج مطلوب (حرفين على الأقل)";
    if (form.price <= 0) newErrors.price = "السعر يجب أن يكون أكبر من صفر";
    if (form.stock < 0) newErrors.stock = "المخزون لا يمكن أن يكون سالباً";
    if (!form.imageUrl) newErrors.imageUrl = "الصورة الرئيسية مطلوبة";
    if (!form.categoryId) newErrors.categoryId = "اختر فئة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const url = isEdit ? `/api/products/${form.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          price: form.price,
          stock: form.stock,
          imageUrl: form.imageUrl,
          images: form.images,
          categoryId: form.categoryId,
          isActive: form.isActive,
          isFeatured: form.isFeatured,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "حدث خطأ", "error");
        setSubmitting(false);
        return;
      }

      showToast(isEdit ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح", "success");
      router.push("/admin/products");
      router.refresh();
    } catch {
      showToast("تعذر الاتصال بالخادم", "error");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div>
            <Label htmlFor="name">اسم المنتج *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="مثال: رسيفر سامسونج DSB-S2"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="وصف تفصيلي للمنتج، المواصفات، إلخ"
              rows={5}
              maxLength={2000}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">السعر (دولار) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                error={errors.price}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stock">المخزون (الكمية) *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock || ""}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                error={errors.stock}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="categoryId">الفئة *</Label>
            <Select
              id="categoryId"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
              error={errors.categoryId}
            >
              {categories.length === 0 && <option value={0}>لا توجد فئات — أضف فئة أولاً</option>}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Side panel: images + visibility */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <ImageUploader
              label="الصورة الرئيسية *"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />
            {errors.imageUrl && <p className="mt-1 text-xs text-danger">{errors.imageUrl}</p>}

            <div className="mt-4">
              <MultiImageUploader
                images={form.images}
                onChange={(images) => setForm({ ...form, images })}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-text-primary">الظهور</h3>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-primary">منتج نشط (يظهر في المتجر)</span>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 rounded text-primary focus:ring-primary/30"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-primary">منتج مميز (يظهر في الصفحة الرئيسية)</span>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded text-primary focus:ring-primary/30"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-0 bg-light-bg py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/products")}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
