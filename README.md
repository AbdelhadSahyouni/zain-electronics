# زين العابدين للإلكترونيات — منصة جملة إلكترونية

متجر إلكتروني متكامل لتوزيع الأجهزة الإلكترونية بالجملة في لبنان، يعمل بـ Next.js 14 و PostgreSQL، مع نظام طلبات عبر واتساب مباشرة.

---

## المميزات

**واجهة المتجر (العملاء)**
- تصفح المنتجات حسب الفئة مع تصفية وترتيب
- بحث فوري بالاسم أو الوصف
- صفحة تفاصيل المنتج مع معرض صور
- سلة تسوق محفوظة في `localStorage` (Zustand)
- تعبئة بيانات الطلب (اسم المحل، هاتف، منطقة)
- إنشاء فاتورة واتساب جاهزة بضغطة واحدة
- زر واتساب عائم في كل الصفحات
- عربي بالكامل (RTL)

**لوحة تحكم الإدارة**
- تسجيل دخول آمن مع حماية من Brute Force
- إضافة / تعديل / حذف المنتجات مع رفع صور Cloudinary
- إدارة الفئات
- متابعة الطلبات مع تغيير الحالة (معلّق، مؤكد، موصّل)
- صفحة تفاصيل الطلب مع رابط واتساب مباشر للعميل
- إعدادات المتجر (رقم واتساب، اسم، نص الهيرو)
- إحصاءات سريعة في لوحة التحكم

**الأمان**
- Next.js Middleware يحمي كل مسارات `/admin/*`
- JWT sessions (NextAuth.js)
- Bcrypt salt 12 لكلمات المرور
- Zod validation على جميع API routes
- Rate limiting (Upstash Redis أو in-memory fallback)
- تعقيم المدخلات (sanitization)
- CSP headers في `next.config.js`

---

## المتطلبات

- Node.js ≥ 18.17
- PostgreSQL ≥ 14
- حساب Cloudinary (مجاني)
- رقم واتساب للتوصيل
- (اختياري) Upstash Redis للـ rate limiting الإنتاجي

---

## التثبيت

### 1. استنساخ المشروع

```bash
git clone <repo-url>
cd zain-electronics
npm install
```

### 2. إعداد متغيرات البيئة

```bash
cp .env.example .env
```

ثم عدّل `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zain_electronics"
NEXTAUTH_SECRET="your-secret-minimum-32-chars"   # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

NEXT_PUBLIC_WHATSAPP_NUMBER="96170000000"
```

### 3. إنشاء قاعدة البيانات

```bash
# ادفع الـ schema إلى PostgreSQL
npm run db:push

# أدخل البيانات الأولية (منتجات، فئات، حساب admin)
npm run db:seed
```

### 4. تشغيل المشروع

```bash
npm run dev
```

افتح http://localhost:3000

---

## بيانات الدخول الافتراضية للإدارة

```
البريد: admin@zainelectronics.com
كلمة المرور: Admin@2024!
```

> **مهم:** غيّر كلمة المرور فور أول تسجيل دخول من صفحة الإعدادات.

---

## هيكل المشروع

```
zain-electronics/
├── app/
│   ├── (store)/              # الواجهة العامة (RTL)
│   │   ├── page.tsx          # الصفحة الرئيسية
│   │   ├── products/         # قائمة + تفاصيل المنتج
│   │   ├── category/[slug]/  # فلترة حسب الفئة
│   │   ├── cart/             # السلة + الدفع
│   │   └── search/           # البحث
│   ├── admin/
│   │   ├── login/            # صفحة تسجيل الدخول
│   │   └── (dashboard)/      # لوحة التحكم (محمية)
│   │       ├── page.tsx      # نظرة عامة
│   │       ├── products/     # إدارة المنتجات
│   │       ├── categories/   # إدارة الفئات
│   │       ├── orders/       # إدارة الطلبات
│   │       └── settings/     # إعدادات المتجر
│   └── api/                  # API routes
├── components/
│   ├── store/                # مكونات الواجهة العامة
│   ├── admin/                # مكونات لوحة التحكم
│   └── ui/                   # مكونات مشتركة
├── hooks/
│   └── useCart.ts            # Zustand cart store
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── prisma.ts             # Prisma client
│   ├── whatsapp.ts           # WhatsApp message builder
│   ├── cloudinary.ts         # Cloudinary uploader
│   ├── rate-limit.ts         # Rate limiter
│   ├── validations.ts        # Zod schemas
│   └── utils.ts              # Helpers
├── prisma/
│   ├── schema.prisma         # DB models
│   └── seed.ts               # Seed data
└── middleware.ts             # Admin route protection
```

---

## النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر
vercel --prod
```

أضف متغيرات البيئة في لوحة Vercel، ثم اربط قاعدة بيانات PostgreSQL (Vercel Postgres أو Supabase أو Neon).

---

## أوامر مفيدة

```bash
npm run dev          # تشغيل في وضع التطوير
npm run build        # بناء للإنتاج
npm run db:push      # تطبيق schema بدون migrations
npm run db:migrate   # إنشاء migration جديدة
npm run db:seed      # إدخال البيانات الأولية
npm run db:studio    # فتح Prisma Studio
```

---

## الدعم الفني

للاستفسار عن المشروع، تواصل مع المطوّر.
