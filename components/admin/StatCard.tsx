import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger";
  href?: string;
}

const colorMap = {
  primary: "bg-blue-50 text-primary",
  success: "bg-emerald-50 text-success",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-danger",
};

export default function StatCard({ label, value, icon, color = "primary" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm">{label}</p>
          <p className="text-2xl font-bold text-text-primary mt-1 latin">{value}</p>
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colorMap[color])}>
          <div className="w-5 h-5">{icon}</div>
        </div>
      </div>
    </div>
  );
}
