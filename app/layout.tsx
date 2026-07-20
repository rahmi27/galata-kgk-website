import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü",
  description: "Kariyer ve Girişimcilik Kulübü web sitesi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
