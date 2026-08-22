"use client";

import {useEffect} from "react";
import {House, RefreshCw} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";
import {Button} from "@/components/ui/button";

export default function LocalizedErrorPage({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const t = useTranslations("errorPage");
  const locale = useLocale();

  useEffect(() => {
    console.error(t("logMessage"), error);
  }, [error, t]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-5 py-24">
      <div className="w-full max-w-2xl rounded-[2rem] border border-primary/10 bg-card p-7 text-center shadow-[0_30px_90px_-55px_rgba(27,42,94,0.75)] sm:p-12 dark:border-white/10">
        <span className="mx-auto block h-1.5 w-14 rounded-full bg-accent" />
        <p className="mt-7 font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl dark:text-white">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button type="button" variant="primary" onClick={reset}>
            <RefreshCw aria-hidden="true" />
            {t("retry")}
          </Button>
          <Button asChild variant="outline">
            <Link href="/" locale={locale}>
              <House aria-hidden="true" />
              {t("home")}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
