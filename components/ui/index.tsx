import { TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes, HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

// Textarea
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[100px] px-3 py-2 rounded-lg border bg-white text-sm text-text-primary placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y",
          error ? "border-danger" : "border-slate-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

// Label
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-sm font-medium text-text-primary mb-1.5", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

// Select
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          "w-full h-10 px-3 rounded-lg border bg-white text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none",
          error ? "border-danger" : "border-slate-300",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";

// Badge
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          default: "bg-slate-100 text-slate-700",
          success: "bg-emerald-100 text-emerald-700",
          warning: "bg-amber-100 text-amber-700",
          danger: "bg-red-100 text-red-700",
          info: "bg-blue-100 text-blue-700",
        }[variant],
        className
      )}
      {...props}
    />
  );
}

// Card
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 border-b border-slate-100", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-bold text-text-primary", className)} {...props} />;
}
