import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { updateSettingsSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 1,
          whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "96170000000",
          storeName: "زين العابدين للإلكترونيات",
          heroTitle: "زين العابدين للإلكترونيات",
          heroSubtitle: "موزعون بالجملة للمحلات والتجار في لبنان",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "حدث خطأ", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: {
        id: 1,
        whatsappNumber: parsed.data.whatsappNumber || "96170000000",
        storeName: parsed.data.storeName || "زين العابدين للإلكترونيات",
        heroTitle: parsed.data.heroTitle,
        heroSubtitle: parsed.data.heroSubtitle,
        logoUrl: parsed.data.logoUrl,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json({ error: "حدث خطأ في الحفظ", details: String(error) }, { status: 500 });
  }
}
