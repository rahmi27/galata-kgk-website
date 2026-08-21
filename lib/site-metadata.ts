import type { Metadata } from "next";

export const SITE_NAME =
  "İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü";
export const SITE_SHORT_NAME = "Galata KGK";
export const SITE_DESCRIPTION =
  "İstanbul Galata Üniversitesi öğrencilerini kariyer, girişimcilik ve güçlü profesyonel bağlantılar etrafında buluşturan öğrenci kulübü.";
export const SITE_NAME_EN =
  "Istanbul Galata University Career and Entrepreneurship Club";

const fallbackSiteUrl = "https://galatakariyervegirisimcilik.com";

export const siteUrl = (() => {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHostname =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ??
    process.env.VERCEL_URL?.trim();
  const resolvedSiteUrl =
    configuredSiteUrl ||
    (vercelHostname ? `https://${vercelHostname}` : fallbackSiteUrl);

  try {
    return new URL(resolvedSiteUrl);
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
  locale?: string;
  keywords?: string[];
};

export function localizedPublicPath(path: string, locale: "tr" | "en") {
  if (locale === "tr") return path || "/";
  if (path === "/") return "/en";
  const dynamicMappings = [
    ["/etkinliklerimiz/", "/en/events/"],
    ["/is-birlikleri/", "/en/collaborations/"],
  ] as const;
  for (const [source, target] of dynamicMappings) {
    if (path.startsWith(source)) return `${target}${path.slice(source.length)}`;
  }
  const mappings: Record<string, string> = {
    "/hakkimizda": "/en/about",
    "/etkinliklerimiz": "/en/events",
    "/ekibimiz": "/en/team",
    "/sponsorlar": "/en/sponsors",
    "/is-birlikleri": "/en/collaborations",
    "/iletisim": "/en/contact",
    "/katilim": "/en/join",
    "/cerez-politikasi": "/en/cookie-policy",
  };
  return mappings[path] ?? `/en${path}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  locale = "tr",
  keywords = [],
}: PageMetadataOptions): Metadata {
  const activeLocale = locale === "en" ? "en" : "tr";
  const canonical = localizedPublicPath(path, activeLocale);
  const turkishPath = localizedPublicPath(path, "tr");
  const englishPath = localizedPublicPath(path, "en");
  const siteName = activeLocale === "en" ? SITE_NAME_EN : SITE_NAME;
  const localeKeywords = activeLocale === "en"
    ? ["Istanbul Galata University", "Career and Entrepreneurship Club", "student community", "career events", "entrepreneurship"]
    : defaultKeywords;
  return {
    metadataBase: siteUrl,
    title: {
      absolute: title,
    },
    description,
    keywords: [...localeKeywords, ...keywords],
    alternates: {
      canonical,
      languages: {
        tr: turkishPath,
        en: englishPath,
        "x-default": turkishPath,
      },
    },
    openGraph: {
      type: "website",
      locale: activeLocale === "en" ? "en_GB" : "tr_TR",
      alternateLocale: activeLocale === "en" ? ["tr_TR"] : ["en_GB"],
      url: canonical,
      siteName,
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: activeLocale === "en" ? `${SITE_SHORT_NAME} social sharing image` : `${SITE_SHORT_NAME} sosyal medya paylaşım görseli`,
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
