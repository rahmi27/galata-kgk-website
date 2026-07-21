import type { Metadata } from "next";

export const SITE_NAME =
  "İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü";
export const SITE_SHORT_NAME = "Galata KGK";
export const SITE_DESCRIPTION =
  "İstanbul Galata Üniversitesi öğrencilerini kariyer, girişimcilik ve güçlü profesyonel bağlantılar etrafında buluşturan öğrenci kulübü.";

const fallbackSiteUrl = "http://localhost:3000";

export const siteUrl = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
})();

const defaultKeywords = [
  "İstanbul Galata Üniversitesi",
  "Kariyer ve Girişimcilik Kulübü",
  "Galata KGK",
  "üniversite kulübü",
  "kariyer etkinlikleri",
  "girişimcilik",
  "öğrenci topluluğu",
];

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataOptions): Metadata {
  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: path,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${SITE_SHORT_NAME} sosyal medya paylaşım görseli`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
