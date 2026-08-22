import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft, CalendarDays} from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";

import {Button} from "@/components/ui/button";
import {BrandMountainBackdrop} from "@/components/effects/brand-mountain-motif";
import {rootDocumentBodyClassName} from "@/components/root-document";
import {SiteTelemetry} from "@/components/site-telemetry";
import {ThemeProvider} from "@/components/theme-provider";
import {routing} from "@/i18n/routing";
import {siteUrl} from "@/lib/site-metadata";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "404 | Galata KGK",
  robots: {index: false, follow: false},
};

export default async function GlobalNotFound() {
  const requestedLocale = await getLocale();
  const locale = requestedLocale === "en" ? "en" : routing.defaultLocale;
  const t = await getTranslations({locale, namespace: "notFound"});
  const homePath = locale === "en" ? "/en" : "/";
  const eventsPath = locale === "en" ? "/en/events" : "/etkinliklerimiz";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={rootDocumentBodyClassName}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <BrandMountainBackdrop />
          <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-background px-5 py-24">
        <div
          className="absolute -right-36 top-10 -z-10 size-[30rem] rounded-full border-[70px] border-accent/10"
          aria-hidden="true"
        />
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="font-heading text-7xl font-bold tracking-[-0.07em] text-primary sm:text-9xl dark:text-white">
            4<span className="text-accent">0</span>4
          </p>
          <h1 className="mt-5 font-heading text-3xl font-bold tracking-[-0.04em] text-primary sm:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href={homePath}>
                <ArrowLeft aria-hidden="true" />
                {t("home")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={eventsPath}>
                <CalendarDays aria-hidden="true" />
                {t("events")}
              </Link>
            </Button>
          </div>
        </div>
          </main>
        </ThemeProvider>
        <SiteTelemetry />
      </body>
    </html>
  );
}
