"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea, Label, Select } from "@/components/ui";
import { generateWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const REGIONS = [
  "بيروت",
  "جبل لبنان",
  "الشمال",
  "عكار",
  "البقاع",
  "بعلبك-الهرمل",
  "الجنوب",
  "النبطية",
];

interface FormErrors {
  storeName?: string;
  customerPhone?: string;
  region?: string;
}

export default function CheckoutForm({ whatsappNumber }: { whatsappNumber: string }) {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clearCart = useCart((s) => s.clearCart);
  const router = useRouter();

  const [storeName, setStoreName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (storeName.trim().length < 2) {
      newErrors.storeName = "اسم المحل مطلوب";
    }
    if (customerPhone.trim().length < 8) {
      newErrors.customerPhone = "رقم الهاتف غير صحيح";
    } else if (!/^[0-9+\s\-()]+$/.test(customerPhone.trim())) {
      newErrors.customerPhone = "رقم الهاتف يحتوي على أحرف غير مقبولة";
    }
    if (!region) {
      newErrors.region = "اختر المنطقة";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (items.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: storeName.trim(),
          customerPhone: customerPhone.trim(),
          region,
          notes: notes.trim() || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "حدث خطأ. حاول مجدداً");
        setSubmitting(false);
        return;
      }

      // Build and open WhatsApp message
      const message = generateWhatsAppMessage({
        items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total,
        storeName: storeName.trim(),
        customerPhone: customerPhone.trim(),
        region,
        notes: notes.trim() || undefined,
      });

      const waUrl = buildWhatsAppUrl(whatsappNumber, message);
      window.open(waUrl, "_blank");

      clearCart();
      router.push("/");
    } catch {
      setServerError("تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary mb-2">بيانات الطلب</h2>

      <div>
        <Label htmlFor="storeName">اسم المحل / الشركة *</Label>
        <Input
          id="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="مثال: محل النور للإلكترونيات"
          error={errors.storeName}
          maxLength={200}
        />
      </div>

      <div>
        <Label htmlFor="customerPhone">رقم الهاتف *</Label>
        <Input
          id="customerPhone"
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="03 123 456"
          error={errors.customerPhone}
          maxLength={20}
        />
      </div>

      <div>
        <Label htmlFor="region">المنطقة *</Label>
        <Select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          error={errors.region}
        >
          <option value="">اختر المنطقة</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">ملاحظات (اختياري)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أي تفاصيل إضافية عن طلبك..."
          maxLength={1000}
          rows={3}
        />
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-100 text-danger text-sm rounded-lg p-3">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        variant="whatsapp"
        size="lg"
        className="w-full"
        disabled={submitting || items.length === 0}
      >
        {submitting ? (
          "جاري إرسال الطلب..."
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            إرسال الطلب عبر واتساب
          </>
        )}
      </Button>

      <p className="text-xs text-text-muted text-center leading-relaxed">
        بالضغط على "إرسال الطلب" سيتم فتح واتساب مع فاتورة طلبك الجاهزة لإرسالها
        لفريقنا للتأكيد
      </p>
    </form>
  );
}
