import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { formatDate } from "@/lib/utils";
import { buildWhatsAppUrl, generateWhatsAppMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export default async function AdminOrderDetailPage({ params }: Params) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const [order, settings] = await Promise.all([
    prisma.order.findUnique({ where: { id } }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  if (!order) notFound();

  const items = order.items as OrderItem[];
  const whatsappNumber =
    settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "96170000000";

  // Build WhatsApp re-confirm link
  const waMessage = generateWhatsAppMessage({
    items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    total: order.totalAmount,
    storeName: order.storeName,
    customerPhone: order.customerPhone,
    region: order.region,
    notes: order.notes || undefined,
  });
  const waUrl = buildWhatsAppUrl(whatsappNumber, waMessage);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb + actions */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-sm text-text-muted mb-1">
            <Link href="/admin/orders" className="hover:text-primary">الطلبات</Link>
            {" / "}
            <span className="text-text-primary">طلب #{order.id}</span>
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
            تفاصيل الطلب #{order.id}
          </h1>
          <p className="text-sm text-text-muted mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-whatsapp hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            فتح في واتساب
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-text-primary">المنتجات المطلوبة</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm">{item.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 latin">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-text-primary latin shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-text-primary">المجموع الكلي</span>
              <span className="text-xl font-bold text-primary latin">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
              <h3 className="text-sm font-bold text-amber-800 mb-1">ملاحظات العميل</h3>
              <p className="text-sm text-amber-700 leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Customer info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-text-primary mb-4">معلومات العميل</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-muted text-xs mb-0.5">اسم المحل</dt>
                <dd className="font-medium text-text-primary">{order.storeName}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs mb-0.5">رقم الهاتف</dt>
                <dd className="font-medium text-text-primary latin">{order.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs mb-0.5">المنطقة</dt>
                <dd className="font-medium text-text-primary">{order.region}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs mb-0.5">تاريخ الطلب</dt>
                <dd className="text-text-muted">{formatDate(order.createdAt)}</dd>
              </div>
            </dl>

            <a
              href={`tel:${order.customerPhone}`}
              className="mt-5 w-full flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              اتصل بالعميل
            </a>
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
