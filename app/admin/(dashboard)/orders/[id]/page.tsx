import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { formatDate } from "@/lib/utils";
import { buildWhatsAppUrl, generateWhatsAppMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

type OrderItem = { productId: number; name: string; price: number; quantity: number; imageUrl?: string };

export default async function AdminOrderDetailPage({ params }: Params) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const [order, settings] = await Promise.all([
    prisma.order.findUnique({ where: { id } }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  if (!order) notFound();

  const items = order.items as OrderItem[];
  const whatsappNumber = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "96170000000";
  const waMessage = generateWhatsAppMessage({ items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })), total: order.totalAmount, storeName: order.storeName, customerPhone: order.customerPhone, region: order.region, notes: order.notes || undefined });
  const waUrl = buildWhatsAppUrl(whatsappNumber, waMessage);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-sm text-text-muted mb-1">
            <Link href="/admin/orders" className="hover:text-primary">الطلبات</Link>
            {" / "}<span className="text-text-primary">طلب #{order.id}</span>
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">تفاصيل الطلب #{order.id}</h1>
          <p className="text-sm text-text-muted mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-whatsapp hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            فتح في واتساب
          </a>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100"><h2 className="font-bold text-text-primary">المنتجات المطلوبة</h2></div>
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm">{item.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 latin">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <p className="font-bold text-text-primary latin shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-text-primary">المجموع الكلي</span>
              <span className="text-xl font-bold text-primary latin">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          {order.notes && <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4"><h3 className="text-sm font-bold text-amber-800 mb-1">ملاحظات العميل</h3><p className="text-sm text-amber-700">{order.notes}</p></div>}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-text-primary mb-4">معلومات العميل</h2>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-text-muted text-xs mb-0.5">اسم المحل</dt><dd className="font-medium text-text-primary">{order.storeName}</dd></div>
              <div><dt className="text-text-muted text-xs mb-0.5">رقم الهاتف</dt><dd className="font-medium text-text-primary latin">{order.customerPhone}</dd></div>
              <div><dt className="text-text-muted text-xs mb-0.5">المنطقة</dt><dd className="font-medium text-text-primary">{order.region}</dd></div>
            </dl>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-text-primary mb-3">تغيير الحالة</h2>
            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
