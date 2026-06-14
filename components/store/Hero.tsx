import Link from "next/link";

interface HeroProps {
  title?: string | null;
  subtitle?: string | null;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative bg-dark-bg overflow-hidden">
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow accent */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-slate-300 text-xs font-medium">
              أسعار جملة لجميع المناطق اللبنانية
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
            {title || "زين العابدين للإلكترونيات"}
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
            {subtitle ||
              "موزعون بالجملة لأجهزة الاستقبال، صحون الدش، الكابلات وأجهزة التحكم. اطلب الآن وسنرسل لك عرض سعر مباشر على واتساب."}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="bg-primary hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm sm:text-base"
            >
              تصفح المنتجات
            </Link>
            <Link
              href="/category/receivers"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm sm:text-base"
            >
              أجهزة الاستقبال
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-white">+500</p>
              <p className="text-xs text-slate-400 mt-0.5">منتج متوفر</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">8</p>
              <p className="text-xs text-slate-400 mt-0.5">محافظات نوصل لها</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">طلب فوري</p>
              <p className="text-xs text-slate-400 mt-0.5">عبر واتساب مباشرة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
