import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/contact/contact-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { SocialPlatformIcon } from "@/components/shared/social-platform-icon";
import { Button } from "@/components/ui/button";
import { getPublicClubSocialLinks } from "@/lib/club-social-links";
import { createPageMetadata } from "@/lib/site-metadata";
import {
  getContactContentFromRows,
  getPublicSiteContentRows,
} from "@/lib/site-content";
import { buildGoogleMapsUrls } from "@/lib/url-security";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return createPageMetadata({ title: t("metaTitle"), description: t("metaDescription"), path: "/iletisim", locale });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const common = await getTranslations({ locale, namespace: "common" });
  const [siteContentRows, socialLinks] = await Promise.all([
    getPublicSiteContentRows(),
    getPublicClubSocialLinks(),
  ]);
  const content = getContactContentFromRows(siteContentRows, socialLinks, locale);
  const { details } = content;
  const { directionsUrl, embedUrl: mapEmbedUrl } = buildGoogleMapsUrls(
    details.address.value,
  );

  return (
    <div className="bg-background">

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -left-28 -top-44 size-[28rem] rounded-full border-[64px] border-primary/5 dark:border-white/[0.03]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={t("heroEyebrow")}
              title={t("heroTitle")}
              description={t("heroDescription")}
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid overflow-hidden rounded-[2rem] border border-primary/10 bg-card shadow-[0_32px_90px_-50px_rgba(27,42,94,0.75)] lg:grid-cols-[0.8fr_1.2fr] dark:border-white/10 dark:bg-white/[0.035]">
              <aside className="relative overflow-hidden bg-primary-900 p-8 text-white sm:p-10 lg:p-12">
                <span
                  className="absolute -bottom-20 -right-20 size-56 rounded-full border-[34px] border-accent/20"
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                    {t("detailsEyebrow")}
                  </p>
                  <h2 className="mt-5 font-heading text-3xl font-bold tracking-[-0.04em]">
                    {t("detailsTitle")}
                  </h2>
                  <p className="mt-4 leading-7 text-primary-200">
                    {t("detailsDescription")}
                  </p>

                  <div className="mt-10 space-y-7">
                    <Link
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-4"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent-300 transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        <MapPin className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary-300">
                          {t("address")}
                        </span>
                        <span className="mt-1.5 block text-sm leading-6 text-primary-100">
                          {details.address.value}
                        </span>
                      </span>
                    </Link>
                  </div>

                  {details.socials.length ? (
                  <div className="mt-12 border-t border-white/10 pt-8">
                    <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary-300">
                      {t("socials")}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {details.socials.map((social) => {
                        const isExternal = social.href.startsWith("http");

                        return (
                          <Link
                            key={social.platform}
                            href={social.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-primary-100 transition-colors hover:border-accent/70 hover:bg-accent"
                            aria-label={common("socialAccount", { label: social.label, external: String(isExternal) })}
                          >
                            <SocialPlatformIcon
                              platform={social.platform}
                              className="size-3.5"
                            />
                            {social.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  ) : null}
                </div>
              </aside>

              <div className="p-8 sm:p-10 lg:p-12">
                <ContactForm />
              </div>
            </div>

            <section
              className="mt-8 overflow-hidden rounded-[2rem] border border-primary/10 bg-card shadow-[0_28px_80px_-52px_rgba(27,42,94,0.7)] dark:border-white/10 dark:bg-white/[0.035]"
              aria-labelledby="contact-map-title"
              data-reveal=""
            >
              <div className="flex flex-col gap-5 border-b border-primary/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-white/10">
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-accent-700 dark:text-accent-300">
                    {t("mapEyebrow")}
                  </p>
                  <h2
                    id="contact-map-title"
                    className="mt-2 font-heading text-2xl font-bold tracking-[-0.035em] text-primary dark:text-white"
                  >
                    {t("mapTitle")}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {details.address.value}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="shrink-0 self-start sm:self-auto"
                >
                  <Link
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("directions")}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="aspect-[4/3] w-full bg-primary-50 sm:aspect-[16/7] dark:bg-primary-900/40">
                <iframe
                  src={mapEmbedUrl}
                  title={t("mapFrameTitle")}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
