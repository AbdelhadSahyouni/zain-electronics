import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg px-4">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-black text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">الصفحة غير موجودة</h1>
        <p className="text-text-muted text-sm mb-8">
          الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/products"
            className="border border-slate-300 text-text-primary font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
