"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "confirmed", label: "مؤكد" },
  { value: "delivered", label: "تم التوصيل" },
];

const statusColors: Record<string, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  confirmed: "border-blue-300 bg-blue-50 text-blue-700",
  delivered: "border-emerald-300 bg-emerald-50 text-emerald-700",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "حدث خطأ", "error");
        setUpdating(false);
        return;
      }

      setStatus(newStatus);
      showToast("تم تحديث حالة الطلب", "success");
      router.refresh();
    } catch {
      showToast("تعذر الاتصال بالخادم", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={updating}
      className={cn(
        "h-9 px-3 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors cursor-pointer disabled:opacity-60",
        statusColors[status]
      )}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
