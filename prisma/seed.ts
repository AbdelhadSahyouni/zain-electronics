import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      whatsappNumber: "96170000000",
      storeName: "زين العابدين للإلكترونيات",
      heroTitle: "زين العابدين للإلكترونيات",
      heroSubtitle: "موزعون بالجملة للمحلات والتجار في لبنان",
    },
  });

  // Seed Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "receivers" },
      update: {},
      create: {
        name: "أجهزة استقبال",
        slug: "receivers",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag",
      },
    }),
    prisma.category.upsert({
      where: { slug: "satellite-dishes" },
      update: {},
      create: {
        name: "صحون دش",
        slug: "satellite-dishes",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray",
      },
    }),
    prisma.category.upsert({
      where: { slug: "remote-controls" },
      update: {},
      create: {
        name: "أجهزة تحكم",
        slug: "remote-controls",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes",
      },
    }),
    prisma.category.upsert({
      where: { slug: "cables" },
      update: {},
      create: {
        name: "كابلات كهربائية",
        slug: "cables",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/architecture-signs",
      },
    }),
    prisma.category.upsert({
      where: { slug: "mixers" },
      update: {},
      create: {
        name: "خلاطات كهرباء",
        slug: "mixers",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "اكسسوارات",
        slug: "accessories",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/car-interior-design",
      },
    }),
  ]);

  const [receivers, dishes, remotes, cables, mixers, accessories] = categories;

  // Seed Products
  const products = [
    {
      name: "رسيفر سامسونج DSB-S2 متعدد القنوات",
      slug: "samsung-dsb-s2-receiver",
      description: "جهاز استقبال رقمي عالي الدقة يدعم أكثر من 5000 قناة، مع تقنية DVB-S2 للاستقبال الأفضل",
      price: 45.0,
      stock: 25,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag",
      images: [],
      categoryId: receivers.id,
      isFeatured: true,
    },
    {
      name: "رسيفر سوني HD بلاس",
      slug: "sony-hd-plus-receiver",
      description: "رسيفر فائق الجودة بدقة Full HD مع دعم USB للتسجيل المباشر وتشغيل الملفات",
      price: 65.0,
      stock: 12,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray",
      images: [],
      categoryId: receivers.id,
      isFeatured: true,
    },
    {
      name: "صحن دش 120 سم ألومنيوم",
      slug: "aluminum-dish-120cm",
      description: "صحن دش احترافي من الألومنيوم عالي الجودة قطر 120 سم، مثالي للمناطق ذات الإشارة الضعيفة",
      price: 38.0,
      stock: 40,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/architecture-signs",
      images: [],
      categoryId: dishes.id,
      isFeatured: false,
    },
    {
      name: "صحن دش 90 سم خفيف الوزن",
      slug: "dish-90cm-lightweight",
      description: "صحن دش صغير الحجم 90 سم للمناطق ذات الإشارة القوية، سهل التركيب والتوجيه",
      price: 22.0,
      stock: 60,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat",
      images: [],
      categoryId: dishes.id,
      isFeatured: false,
    },
    {
      name: "ريموت كونترول سامسونج الأصلي",
      slug: "samsung-original-remote",
      description: "جهاز تحكم أصلي يتوافق مع معظم رسيفرات سامسونج، بطاريات مضمّنة",
      price: 8.5,
      stock: 150,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes",
      images: [],
      categoryId: remotes.id,
      isFeatured: true,
    },
    {
      name: "ريموت كونترول يونيفرسال ذكي",
      slug: "universal-smart-remote",
      description: "جهاز تحكم عالمي يدعم أكثر من 500 ماركة من الأجهزة الإلكترونية، بتقنية التعلم الذاتي",
      price: 12.0,
      stock: 80,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/car-interior-design",
      images: [],
      categoryId: remotes.id,
      isFeatured: false,
    },
    {
      name: "كابل RG6 المحوري 100 متر",
      slug: "rg6-coaxial-cable-100m",
      description: "كابل محوري RG6 عالي الجودة بطول 100 متر، مثالي لتوصيل صحون الدش والأجهزة الاستقبالية",
      price: 28.0,
      stock: 35,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/road-countryside",
      images: [],
      categoryId: cables.id,
      isFeatured: false,
    },
    {
      name: "كابل كهربائي NYM 3×2.5 ملم لفة 100م",
      slug: "nym-cable-3x2-5-100m",
      description: "كابل كهربائي صلب نوع NYM مقطع 3×2.5 ملم مناسب للأسلاك الكهربائية الداخلية",
      price: 55.0,
      stock: 20,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-mountains",
      images: [],
      categoryId: cables.id,
      isFeatured: false,
    },
    {
      name: "خلاط كهربائي صناعي 1500W",
      slug: "industrial-mixer-1500w",
      description: "خلاط كهربائي احترافي 1500 واط للاستخدام الصناعي والتجاري، متين وطويل العمر",
      price: 120.0,
      stock: 8,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables",
      images: [],
      categoryId: mixers.id,
      isFeatured: true,
    },
    {
      name: "مقسّم إشارة دش 4 منافذ",
      slug: "splitter-4-ports",
      description: "موزع إشارة دش عالي الجودة 4 منافذ مع تقليل أدنى للإشارة، مناسب للمباني السكنية",
      price: 6.5,
      stock: 200,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag",
      images: [],
      categoryId: accessories.id,
      isFeatured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Seed Admin
  const passwordHash = await bcrypt.hash("Admin@2024!", 12);
  await prisma.admin.upsert({
    where: { email: "admin@zainelectronics.com" },
    update: {},
    create: {
      email: "admin@zainelectronics.com",
      passwordHash,
      name: "Admin",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
