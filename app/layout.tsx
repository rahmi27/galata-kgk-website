import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import {getLocale} from "next-intl/server";

import { BrandMountainBackdrop } from "@/components/effects/brand-mountain-motif";
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
  display: "optional",
  preload: true,
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
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-48.png",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08090d" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <BrandMountainBackdrop />
          {children}
        </ThemeProvider>
        <SiteTelemetry />
      </body>
    </html>
  );
}
