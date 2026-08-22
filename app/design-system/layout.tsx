import type {Metadata} from "next";

import {RootDocument} from "@/components/root-document";
import {siteUrl} from "@/lib/site-metadata";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  robots: {index: false, follow: false},
};

export default function DesignSystemRootLayout({children}: {children: React.ReactNode}) {
  return <RootDocument locale="tr">{children}</RootDocument>;
}
