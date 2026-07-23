import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { SiteTelemetry } from "@/components/site-telemetry";
import { ThemeProvider } from "@/components/theme-provider";
import siteContent from "@/content/site.json";
import {
  createPageMetadata,
  SITE_NAME,
  SITE_SHORT_NAME,
  siteUrl,
} from "@/lib/site-metadata";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  ...createPageMetadata({
    title: siteContent.meta.title,
    description: siteContent.meta.description,
    path: "/",
  }),
  metadataBase: siteUrl,
  applicationName: SITE_SHORT_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <SiteTelemetry />
      </body>
    </html>
  );
}
