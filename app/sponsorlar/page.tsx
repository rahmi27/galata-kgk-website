import Link from "next/link";
import { ArrowRight, Handshake, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { SponsorCard } from "@/components/sponsors/sponsor-card";
import { Button } from "@/components/ui/button";
import sponsorContent from "@/content/sponsors.json";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: sponsorContent.meta.title,
  description: sponsorContent.meta.description,
  path: "/sponsorlar",
  keywords: ["üniversite sponsorluk", "öğrenci kulübü iş ortaklığı"],
});

export const revalidate = 300;

export default async function SponsorsPage() {
  const [tiers, stats] = await Promise.all([
    prisma.sponsorTier.findMany({
      where: {
        sponsors: {
          some: {},
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        sponsors: {
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
      },
    }),
    prisma.siteStat.findMany({
      orderBy: { order: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -right-32 -top-48 size-[32rem] rounded-full border-[72px] border-accent/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={sponsorContent.hero.eyebrow}
              title={sponsorContent.hero.title}
              description={sponsorContent.hero.description}
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            {tiers.length ? (
              <div className="space-y-20">
                {tiers.map((tier, tierIndex) => {
                  const featured = tierIndex === 0;

                  return (
                    <section
                      key={tier.id}
                      aria-labelledby={`sponsor-tier-${tier.slug}`}
                    >
                      <div className="flex items-center gap-5">
                        <span className="font-heading text-xs font-bold tracking-[0.16em] text-accent-700 dark:text-accent-300">
                          {String(tierIndex + 1).padStart(2, "0")}
                        </span>
                        <h2
                          id={`sponsor-tier-${tier.slug}`}
                          className="font-heading text-2xl font-bold tracking-[-0.035em] text-primary sm:text-3xl dark:text-white"
                        >
                          {tier.name}
                        </h2>
                        <span
                          className="h-px flex-1 bg-primary/10 dark:bg-white/10"
                          aria-hidden="true"
                        />
                      </div>

                      <div
                        className={
                          featured
                            ? "mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
                            : "mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                        }
                      >
                        {tier.sponsors.map((sponsor) => (
                          <SponsorCard
                            key={sponsor.id}
                            name={sponsor.name}
                            logoUrl={sponsor.logoUrl}
                            logoAlt={sponsor.logoAlt}
                            websiteUrl={sponsor.websiteUrl}
                            description={sponsor.description}
                            featured={featured}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-primary-800 bg-primary-900 px-6 py-16 text-center text-white shadow-[0_30px_80px_-46px_rgba(27,42,94,0.9)] dark:border-white/10 dark:bg-primary-950 sm:px-12 sm:py-20">
                <span
                  className="absolute -right-16 -top-16 size-44 rounded-full border-[26px] border-accent/25"
                  aria-hidden="true"
                />
                <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/10 text-accent-300 ring-1 ring-white/10">
                  <Handshake className="size-6" aria-hidden="true" />
                </div>
                <h2 className="relative mt-6 font-heading text-3xl font-bold tracking-[-0.04em] text-white">
                  {sponsorContent.emptyState.title}
                </h2>
                <p className="relative mx-auto mt-4 max-w-xl leading-7 text-primary-200">
                  {sponsorContent.emptyState.description}
                </p>
                <Button asChild variant="secondary" className="relative mt-8">
                  <Link href="/iletisim">
                    {sponsorContent.emptyState.cta}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-primary/10 bg-primary-900 py-20 text-white dark:border-white/10 dark:bg-[#080d20] sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-10">
            <div>
              <p className="flex items-center gap-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                <Sparkles className="size-4" aria-hidden="true" />
                {sponsorContent.whyPartner.eyebrow}
              </p>
              <h2 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl">
                {sponsorContent.whyPartner.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-200">
                {sponsorContent.whyPartner.description}
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {sponsorContent.whyPartner.models.map((model, index) => (
                  <article
                    key={model.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6"
                  >
                    <p className="font-heading text-xs font-bold tracking-[0.16em] text-accent-300">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-heading text-xl font-bold tracking-[-0.025em] text-white">
                      {model.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-primary-200">
                      {model.description}
                    </p>
                  </article>
                ))}
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-300">
                {sponsorContent.whyPartner.closing}
              </p>
              <Button asChild variant="secondary" className="mt-8">
                <Link href="/iletisim">
                  {sponsorContent.whyPartner.cta}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {stats.length ? (
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:self-center">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-5 sm:px-6"
                  >
                    <p className="font-heading text-3xl font-bold tracking-[-0.04em] text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-primary-200">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
