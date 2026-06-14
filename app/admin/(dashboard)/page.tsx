import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalOrders,
    pendingOrders,
    recentOrders,
    totalCategories,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stock: { gt: 0, lte: 5 }, isActive: true } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.category.count(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">نظرة عامة</h1>
        <p className="text-sm text-text-muted mt-1">ملخص نشاط المتجر</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="إجمالي المنتجات"
          value={totalProducts}
          color="primary"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          label="الطلبات الجديدة"
          value={pendingOrders}
          color="warning"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="نواقص المخزون"
          value={lowStockProducts}
          color="warning"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
            </svg>
          }
        />
        <StatCard
          label="نفذ من المخزون"
          value={outOfStockProducts}
          color="danger"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-bold text-text-primary">أحدث الطلبات</h2>
            <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline">
              عرض الكل
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">
              لا توجد طلبات حتى الآن
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{order.storeName}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {order.region} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-left flex items-center gap-3">
                    <span className="font-bold text-text-primary latin text-sm">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-text-primary mb-4">إجراءات سريعة</h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-primary hover:bg-blue-100 transition-colors text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة منتج جديد
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-text-primary hover:bg-slate-100 transition-colors text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="8" height="8" rx="1.5" strokeWidth={2}/>
                <rect x="13" y="13" width="8" height="8" rx="1.5" strokeWidth={2}/>
              </svg>
              إدارة الفئات ({totalCategories})
            </Link>
            <Link
              href="/admin/orders?status=pending"
              className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              </svg>
              الطلبات المعلّقة ({pendingOrders})
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-text-primary hover:bg-slate-100 transition-colors text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth={2}/>
              </svg>
              إعدادات المتجر
            </Link>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs text-text-muted">إجمالي الطلبات</p>
            <p className="text-xl font-bold text-text-primary latin mt-0.5">{totalOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
