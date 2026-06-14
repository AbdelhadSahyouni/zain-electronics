import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const pendingOrders = await prisma.order.count({ where: { status: "pending" } });

  return (
    <AdminShell pendingOrders={pendingOrders} adminName={session?.user?.name || session?.user?.email}>
      {children}
    </AdminShell>
  );
}
