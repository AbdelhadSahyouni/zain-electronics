import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Pagination from "@/components/store/Pagination";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;
const STATUS_TABS = [
  { value: "", label: "الكل" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "confirmed", label: "مؤكدة" },
  { value: "delivered", label: "موصّلة" },
];

interface Props {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, search, page: pageStr } = await searchParams;
  const statusVal = status || "";
  const searchTrim = search?.trim() || "";
  const page = Math.max(1, parseInt(pageStr || "1", 10));

  const where: Prisma.OrderWhereInput = {};
  if (statusVal) where.status = statusVal;
  if (searchTrim) where.OR = [
    { storeName: { contains: searchTrim, mode: "insensitive" } },
    { customerPhone: { contains: searchTrim } },
    { region: { contains: searchTrim, mode: "insensitive" } },
  ];

  const [orders, total, statusCounts] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const counts: Record<string, number> = { "": total };
  for (const c of statusCounts) counts[c.status] = c._count.status;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">الطلبات</h1>
        <p className="text-sm text-text-muted mt-1">{total} طلب</p>
      </div>
      <div className="flex gap-2 overflow-x-auto mb-4">
        {STATUS_TABS.map((tab) => (
          <Link key={tab.value} href={tab.value ? `/admin/orders?status=${tab.value}` : "/admin/orders"}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusVal === tab.value ? "bg-primary text-white" : "bg-white border border-slate-300 text-text-primary hover:bg-slate-50"}`}>
            {tab.label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${statusVal === tab.value ? "bg-white/20 text-white" : "bg-slate-100 text-text-muted"}`}>
              {counts[tab.value] ?? 0}
            </span>
          </Link>
        ))}
      </div>
      <div className="mb-4"><AdminSearchInput placeholder="بحث باسم المحل أو الهاتف..." /></div>
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center"><p className="text-text-muted text-sm">لا توجد طلبات مطابقة</p></div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-text-muted">
              <tr>
                <th className="text-right font-medium px-4 py-3">#</th>
                <th className="text-right font-medium px-4 py-3">المحل</th>
                <th className="text-right font-medium px-4 py-3">المنطقة</th>
                <th className="text-right font-medium px-4 py-3">المبلغ</th>
                <th className="text-right font-medium px-4 py-3">الحالة</th>
                <th className="text-right font-medium px-4 py-3">التاريخ</th>
                <th className="text-right font-medium px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-text-muted latin">#{order.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{order.storeName}</td>
                  <td className="px-4 py-3 text-text-muted">{order.region}</td>
                  <td className="px-4 py-3 font-semibold latin">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-text-muted text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3"><Link href={`/admin/orders/${order.id}`} className="text-primary text-xs font-medium hover:underline">تفاصيل</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/orders" searchParams={{ status: statusVal || undefined, search: searchTrim || undefined }} />
    </div>
  );
}
