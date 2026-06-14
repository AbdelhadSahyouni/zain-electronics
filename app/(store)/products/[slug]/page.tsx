import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import AddToCartSection from "@/components/store/AddToCartSection";
import ProductGrid from "@/components/store/ProductGrid";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) return { title: "المنتج غير موجود" };
  return {
    title: `${product.name} | زين العابدين للإلكترونيات`,
    description: product.description || `${product.name} - ${product.category.name}`,
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, NOT: { id: product.id } },
    include: { category: { select: { name: true } } },
    take: 4,
  });

  const allImages = [product.imageUrl, ...product.images].filter(Boolean);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-sm text-text-muted mb-4">
        <Link href="/" className="hover:text-primary">الرئيسية</Link>
        {" / "}
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        {" / "}
        <span className="text-text-primary">{product.name}</span>
      </p>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery images={allImages} name={product.name} />
        <div>
          <Link href={`/category/${product.category.slug}`} className="text-sm font-medium text-primary hover:underline">
            {product.category.name}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2 mb-3 leading-snug">{product.name}</h1>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {isOutOfStock ? <Badge variant="danger">غير متوفر</Badge> :
             isLowStock ? <Badge variant="warning">⚠️ آخر {product.stock} قطع</Badge> :
             <Badge variant="success">متوفر</Badge>}
          </div>
          {product.description && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-text-primary mb-2">الوصف</h2>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
          <AddToCartSection product={{ id: product.id, name: product.name, price: product.price, stock: product.stock, imageUrl: product.imageUrl }} />
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <p className="text-sm text-text-muted leading-relaxed">السعر بالدولار الأمريكي. سيتم تأكيد توفر الكمية والسعر النهائي عند التواصل معك على واتساب.</p>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-text-primary mb-6">منتجات مشابهة</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
