import Link from "next/link";
import { BarChart3, Cookie, LockKeyhole, ShieldCheck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SectionHeading } from "@/components/shared/section-heading";
export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });
  const sections = [
    { icon: LockKeyhole, title: t("sessionTitle"), description: t("sessionDescription") },
    { icon: BarChart3, title: t("analyticsTitle"), description: t("analyticsDescription") },
    { icon: ShieldCheck, title: t("performanceTitle"), description: t("performanceDescription") },
    { icon: Cookie, title: t("marketingTitle"), description: t("marketingDescription") },
  ];
  return (
    <div className="bg-background">
      <main>
        <section className="border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("description")}
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
            <p className="text-sm font-medium text-muted-foreground">
              {t("updated")}
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.title}
                    className="rounded-[1.5rem] border border-primary/10 bg-card p-6 dark:border-white/10 sm:p-8"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent-700 dark:text-accent-300">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 font-heading text-xl font-bold text-primary dark:text-white">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {section.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-primary/10 bg-primary-900 p-6 text-primary-100 sm:p-8">
              <h2 className="font-heading text-xl font-bold text-white">
                {t("more")}
              </h2>
              <p className="mt-3 leading-7 text-primary-200">
                {t("contactPrefix")}
                <Link
                  href="mailto:dataprivacy@galatauni.edu.tr"
                  className="font-semibold text-accent-300 underline underline-offset-4"
                >
                  dataprivacy@galatauni.edu.tr
                </Link>{" "}
                {t("contactSuffix")}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <Link
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-300 underline underline-offset-4"
                >
                  {t("analyticsPolicy")}
                </Link>
                <Link
                  href="https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-300 underline underline-offset-4"
                >
                  {t("cookieGuide")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
