import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {SiteShell} from "@/components/layout/site-shell";
import {routing} from "@/i18n/routing";
import {getSiteChromeContent} from "@/lib/site-content";

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
    getMessages(),
    getSiteChromeContent(),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      <SiteShell content={chromeContent}>{children}</SiteShell>
    </NextIntlClientProvider>
  );
}
