import { prisma } from "@/lib/prisma";
import Hero from "@/components/store/Hero";
import CategoryGrid from "@/components/store/CategoryGrid";
import ProductGrid from "@/components/store/ProductGrid";
import WhatsAppFloatingButton from "@/components/store/WhatsAppFloatingButton";
import Link from "next/link";

export const revalidate = 60;

async function getHomeData() {
  const [categories, featuredProducts, settings] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  return { categories, featuredProducts, settings };
}

export default async function HomePage() {
  const { categories, featuredProducts, settings } = await getHomeData();
  const whatsappNumber =
    settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "96170000000";

  return (
    <>
      <Hero title={settings?.heroTitle} subtitle={settings?.heroSubtitle} />

      <CategoryGrid categories={categories} />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                المنتجات الأكثر طلباً
              </h2>
              <p className="text-sm text-text-muted mt-1">
                الأكثر مبيعاً هذا الشهر بين تجار الجملة
              </p>
            </div>
            <Link href="/products" className="text-primary text-sm font-medium hover:underline whitespace-nowrap">
              عرض الكل
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-l from-blue-50 to-white rounded-2xl border border-blue-100 p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">
            كيف تتم عملية الطلب؟
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">اختر منتجاتك</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  تصفح الفئات وأضف ما تحتاجه إلى السلة بالكمية المطلوبة
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">أدخل بيانات محلك</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  اسم المحل، رقم الهاتف، والمنطقة لتسهيل التوصيل
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-whatsapp text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">أرسل الطلب على واتساب</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  سيتم تجهيز فاتورة جاهزة وإرسالها مباشرة لفريقنا للتأكيد
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFloatingButton phoneNumber={whatsappNumber} />
    </>
  );
}
