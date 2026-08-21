import type {Metadata, Viewport} from "next";

import {RootDocument} from "@/components/root-document";
import {siteUrl} from "@/lib/site-metadata";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Galata KGK Yönetim",
  robots: {index: false, follow: false},
  icons: {shortcut: "/favicon-48.png", apple: "/apple-touch-icon.png"},
};

export const viewport: Viewport = {themeColor: "#08090d"};

export default function AdminRootLayout({children}: {children: React.ReactNode}) {
  return <RootDocument locale="tr">{children}</RootDocument>;
}
