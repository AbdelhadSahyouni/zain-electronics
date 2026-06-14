"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea, Label } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Skeleton";
import ImageUploader from "@/components/admin/ImageUploader";

interface Settings {
  whatsappNumber: string;
  storeName: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  logoUrl: string | null;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Settings>({
    whatsappNumber: "",
    storeName: "",
    heroTitle: "",
    heroSubtitle: "",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setForm({
          whatsappNumber: data.settings.whatsappNumber || "",
          storeName: data.settings.storeName || "",
          heroTitle: data.settings.heroTitle || "",
          heroSubtitle: data.settings.heroSubtitle || "",
          logoUrl: data.settings.logoUrl || "",
        });
      })
      .catch(() => showToast("فشل تحميل الإعدادات", "error"))
      .finally(() => setLoading(false));
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.whatsappNumber.match(/^[0-9]{10,15}$/)) {
      newErrors.whatsappNumber =
        "رقم واتساب غير صحيح — أرقام فقط بدون + أو مسافات (10-15 رقم)";
    }
    if (form.storeName.trim().length < 2) {
      newErrors.storeName = "اسم المتجر مطلوب";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber: form.whatsappNumber.trim(),
          storeName: form.storeName.trim(),
          heroTitle: form.heroTitle?.trim() || null,
          heroSubtitle: form.heroSubtitle?.trim() || null,
          logoUrl: form.logoUrl?.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "حدث خطأ في الحفظ", "error");
      } else {
        showToast("تم حفظ الإعدادات بنجاح ✓", "success");
        setSettings(data.settings);
      }
    } catch {
      showToast("تعذر الاتصال بالخادم", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">إعدادات المتجر</h1>
        <p className="text-sm text-text-muted mt-1">
          التغييرات تُطبّق فوراً على المتجر
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* WhatsApp */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-text-primary flex items-center gap-2">
            <svg className="w-5 h-5 text-whatsapp" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            إعدادات واتساب
          </h2>

          <div>
            <Label htmlFor="whatsappNumber">رقم واتساب *</Label>
            <Input
              id="whatsappNumber"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="96170000000"
              error={errors.whatsappNumber}
              maxLength={15}
              className="latin"
              dir="ltr"
            />
            <p className="text-xs text-text-muted mt-1">
              صيغة لبنان: 961 + الرقم بدون صفر. مثال: 96170123456
            </p>
          </div>

          {form.whatsappNumber && !errors.whatsappNumber && (
            <a
              href={`https://wa.me/${form.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-whatsapp hover:underline"
            >
              اختبر الرقم ←
            </a>
          )}
        </div>

        {/* Store info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-text-primary">معلومات المتجر</h2>

          <div>
            <Label htmlFor="storeName">اسم المتجر *</Label>
            <Input
              id="storeName"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              placeholder="زين العابدين للإلكترونيات"
              error={errors.storeName}
              maxLength={100}
            />
          </div>

          <ImageUploader
            label="شعار المتجر (اختياري)"
            value={form.logoUrl || ""}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
          />
        </div>

        {/* Hero section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-text-primary">قسم الهيرو (الصفحة الرئيسية)</h2>

          <div>
            <Label htmlFor="heroTitle">العنوان الرئيسي</Label>
            <Input
              id="heroTitle"
              value={form.heroTitle || ""}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              placeholder="زين العابدين للإلكترونيات"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="heroSubtitle">النص الثانوي</Label>
            <Textarea
              id="heroSubtitle"
              value={form.heroSubtitle || ""}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              placeholder="موزعون بالجملة للمحلات والتجار في لبنان"
              rows={3}
              maxLength={300}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-light-bg py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
