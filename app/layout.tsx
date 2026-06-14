import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "زين العابدين للإلكترونيات | أجهزة كهربائية",
  description:
    "تسوق أجهزة رسيفر، صحون دش، كابلات كهربائية، وأكثر بأفضل الأسعار في لبنان",
  keywords: "رسيفر، صحن دش، كابلات، أجهزة تحكم، لبنان، إلكترونيات",
  openGraph: {
    title: "زين العابدين للإلكترونيات",
    description: "موزعون بالجملة للمحلات والتجار في لبنان",
    locale: "ar_LB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A56DB" />
      </head>
      <body>{children}</body>
    </html>
  );
}
