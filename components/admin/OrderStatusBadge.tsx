import { Badge } from "@/components/ui";

const statusConfig = {
  pending: { label: "قيد الانتظار", variant: "warning" as const },
  confirmed: { label: "مؤكد", variant: "info" as const },
  delivered: { label: "تم التوصيل", variant: "success" as const },
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "default" as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
