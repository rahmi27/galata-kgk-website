"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const locales = ["tr", "en"] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  function changeLocale(nextLocale: (typeof locales)[number]) {
    if (nextLocale === locale) return;
    const query = Object.fromEntries(searchParams.entries());
    router.replace({ pathname, params, query } as never, { locale: nextLocale });
  }

  return (
    <div
      className="inline-flex items-center rounded-full border border-primary/15 bg-background/80 p-1 shadow-sm dark:border-white/15 dark:bg-white/[0.04]"
      role="group"
      aria-label={t("languageLabel")}
    >
      {locales.map((item) => {
        const active = item === locale;
        return (
          <button
            key={item}
            type="button"
            onClick={() => changeLocale(item)}
            className={cn(
              "min-w-8 rounded-full px-2 py-1 font-heading text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors",
              active
                ? "bg-primary text-white dark:bg-primary-700"
                : "text-primary-600 hover:bg-primary-50 hover:text-primary dark:text-primary-200 dark:hover:bg-white/10 dark:hover:text-white",
            )}
            aria-pressed={active}
            aria-label={item === "tr" ? t("turkish") : t("english")}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
