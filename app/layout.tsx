import type { Metadata } from "next";
import { Noto_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "زين العابدين للإلكترونيات | أجهزة كهربائية",
  description: "تسوق أجهزة رسيفر، صحون دش، كابلات كهربائية، وأكثر بأفضل الأسعار في لبنان",
  keywords: "رسيفر، صحن دش، كابلات، أجهزة تحكم، لبنان، إلكترونيات",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoSansArabic.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
