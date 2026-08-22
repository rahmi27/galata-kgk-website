import type {Metadata, Viewport} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {SiteShell} from "@/components/layout/site-shell";
import {RootDocument} from "@/components/root-document";
import {routing} from "@/i18n/routing";
import {getSiteChromeContent} from "@/lib/site-content";
import {
  createPageMetadata,
  SITE_NAME,
  SITE_SHORT_NAME,
  siteUrl,
} from "@/lib/site-metadata";

import "../globals.css";

// Locale params are finite and known. Force the public tree to remain static/ISR
// even though unknown dynamic slugs can still be generated on first request.
export const dynamic = "force-static";
// Public content is refreshed on demand by the related admin action. The
// daily fallback only protects against out-of-band database changes and date
// rollovers without continuously rewriting every localized route.
export const revalidate = 86400;

const clientMessageNamespaces = [
  "common",
  "nav",
  "footer",
  "events",
  "team",
  "collaborations",
  "contact",
  "join",
  "errorPage",
] as const;

export const viewport: Viewport = {
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "#ffffff"},
    {media: "(prefers-color-scheme: dark)", color: "#08090d"},
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "home"});

  return {
    ...createPageMetadata({
      title: t("metaTitle"),
      description: t("metaDescription"),
      path: "/",
      locale,
    }),
    metadataBase: siteUrl,
    applicationName: SITE_SHORT_NAME,
    authors: [{name: SITE_NAME}],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    icons: {
      icon: [
        {url: "/favicon-48.png", sizes: "48x48", type: "image/png"},
        {url: "/favicon-96.png", sizes: "96x96", type: "image/png"},
        {url: "/icon-192.png", sizes: "192x192", type: "image/png"},
        {url: "/icon-512.png", sizes: "512x512", type: "image/png"},
      ],
      shortcut: "/favicon-48.png",
      apple: [{url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png"}],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, chromeContent] = await Promise.all([
    getMessages({locale}),
    getSiteChromeContent(locale),
  ]);
  const clientMessages = Object.fromEntries(
    clientMessageNamespaces.map((namespace) => [
      namespace,
      messages[namespace],
    ]),
  );

  return (
    <RootDocument locale={locale}>
      <NextIntlClientProvider locale={locale} messages={clientMessages}>
        <SiteShell content={chromeContent}>{children}</SiteShell>
      </NextIntlClientProvider>
    </RootDocument>
  );
}
