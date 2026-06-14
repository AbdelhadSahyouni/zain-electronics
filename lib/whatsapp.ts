export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  items: OrderItem[];
  total: number;
  storeName: string;
  customerPhone: string;
  region: string;
  notes?: string;
}

export function generateWhatsAppMessage(order: OrderData): string {
  const itemLines = order.items
    .map(
      (item) =>
        `▪️ ${item.name} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");

  return `مرحباً زين العابدين للإلكترونيات 👋

🏪 *طلب جملة جديد*
─────────────────
${itemLines}
─────────────────
💰 *المجموع الكلي: $${order.total.toFixed(2)}*

🏬 اسم المحل: ${order.storeName}
📞 الهاتف: ${order.customerPhone}
📍 المنطقة: ${order.region}
📝 ملاحظات: ${order.notes || "لا يوجد"}

شكراً لكم 🙏`.trim();
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = buildWhatsAppUrl(phoneNumber, message);
  window.open(url, "_blank");
}
