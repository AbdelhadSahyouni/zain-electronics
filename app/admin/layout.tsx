import AuthProvider from "./providers";

export const metadata = {
  title: "لوحة التحكم | زين العابدين للإلكترونيات",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
