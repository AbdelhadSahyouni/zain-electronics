export const revalidate = 300;

import { prisma } from "@/lib/prisma";
import CartPageContent from "@/components/store/CartPageContent";

export const metadata = {
  title: "سلة الطلبات | زين العابدين للإلكترونيات",
};

export default async function CartPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const whatsappNumber =
    settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "96170000000";

  return <CartPageContent whatsappNumber={whatsappNumber} />;
}
