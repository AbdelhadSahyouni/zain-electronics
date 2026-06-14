import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(200),
  slug: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  stock: z.number().int().min(0, "المخزون لا يمكن أن يكون سالباً"),
  imageUrl: z.string().url("رابط الصورة غير صحيح"),
  images: z.array(z.string().url()).optional().default([]),
  categoryId: z.number().int().positive(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(2, "اسم الفئة مطلوب").max(100),
  slug: z.string().min(2).max(100).optional(),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createOrderSchema = z.object({
  storeName: z.string().min(2, "اسم المحل مطلوب").max(200),
  customerPhone: z
    .string()
    .min(8, "رقم الهاتف غير صحيح")
    .max(20)
    .regex(/^[0-9+\s\-()]+$/, "رقم الهاتف يحتوي على أحرف غير مقبولة"),
  region: z.enum([
    "بيروت",
    "جبل لبنان",
    "الشمال",
    "عكار",
    "البقاع",
    "بعلبك-الهرمل",
    "الجنوب",
    "النبطية",
  ]),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      name: z.string().min(1),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      imageUrl: z.string().optional(),
    })
  ).min(1, "الطلب يجب أن يحتوي على منتج واحد على الأقل"),
  totalAmount: z.number().positive(),
  notes: z.string().max(1000).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "delivered"]),
});

export const updateSettingsSchema = z.object({
  whatsappNumber: z
    .string()
    .regex(/^[0-9]{10,15}$/, "رقم الواتساب يجب أن يكون أرقاماً فقط (10-15 رقم)")
    .optional(),
  storeName: z.string().min(2).max(100).optional(),
  heroTitle: z.string().max(200).optional().nullable(),
  heroSubtitle: z.string().max(300).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
});

export const adminLoginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور قصيرة جداً"),
});
