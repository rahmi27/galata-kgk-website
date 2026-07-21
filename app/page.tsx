/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Lightbulb,
  Network,
  Sparkles,
} from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { EventCard } from "@/components/shared/event-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import homeContent from "@/content/home.json";
import { formatEventDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: homeContent.meta.title,
  description: homeContent.meta.description,
  path: "/",
  keywords: ["öğrenci etkinlikleri", "networking", "kariyer gelişimi"],
});

export const dynamic = "force-dynamic";

const whyUsIcons = {
  compass: Compass,
  lightbulb: Lightbulb,
  network: Network,
} as const;

export default async function HomePage() {
  const [stats, featuredEvents, sponsors] = await Promise.all([
    prisma.siteStat.findMany({
      orderBy: {
        order: "asc",
      },
    }),
    prisma.event.findMany({
      where: {
        OR: [
          {
            date: null,
          },
          {
            date: {
              gte: new Date(),
            },
          },
        ],
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          title: "asc",
        },
      ],
      take: 3,
    }),
    prisma.sponsor.findMany({
      orderBy: [
        {
          tier: {
            order: "asc",
          },
        },
        {
          order: "asc",
        },
        {
          name: "asc",
        },
      ],
      take: 8,
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <OrganizationJsonLd />
      <Navbar />

      <main>
        <section className="relative isolate overflow-hidden border-b border-primary/10 dark:border-white/10">
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_15%,rgba(232,93,44,0.12),transparent_24%),radial-gradient(circle_at_10%_85%,rgba(27,42,94,0.1),transparent_28%)] dark:bg-[radial-gradient(circle_at_80%_15%,rgba(232,93,44,0.12),transparent_24%),radial-gradient(circle_at_10%_85%,rgba(109,127,190,0.12),transparent_30%)]"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-10 lg:py-32">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-primary/10 bg-white/70 px-4 py-2 font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-primary-200">
                <Sparkles
                  className="size-3.5 text-accent"
                  aria-hidden="true"
                />
                {homeContent.hero.eyebrow}
              </p>
              <h1 className="mt-8 max-w-4xl font-heading text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-primary sm:text-6xl lg:text-7xl dark:text-white">
                {homeContent.hero.title}{" "}
                <span className="relative inline-block text-primary dark:text-primary-100">
                  {homeContent.hero.emphasis}
                  <span
                    className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-accent sm:-bottom-2"
                    aria-hidden="true"
                  />
                </span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                {homeContent.hero.description}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="primary">
                  <Link href={homeContent.hero.primaryCta.href}>
                    {homeContent.hero.primaryCta.label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={homeContent.hero.secondaryCta.href}>
                    {homeContent.hero.secondaryCta.label}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div
                className="absolute -inset-5 -z-10 rotate-2 rounded-[2.5rem] bg-accent-100/70 dark:bg-accent/10"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-[2rem] bg-primary-900 p-8 text-white shadow-[0_32px_90px_-40px_rgba(27,42,94,0.8)] sm:p-10">
                <div
                  className="absolute -right-14 -top-14 size-44 rounded-full border-[28px] border-accent/25"
                  aria-hidden="true"
                />
                <CalendarDays
                  className="size-8 text-accent-300"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="mt-12 font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                  {homeContent.hero.spotlight.eyebrow}
                </p>
                <h2 className="mt-4 max-w-md font-heading text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-4xl">
                  {homeContent.hero.spotlight.title}
                </h2>
                <p className="mt-5 max-w-md leading-7 text-primary-200">
                  {homeContent.hero.spotlight.description}
                </p>
                <div className="mt-9 flex flex-wrap gap-2.5">
                  {homeContent.hero.spotlight.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold text-primary-100"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow={homeContent.statsSection.eyebrow}
              title={homeContent.statsSection.title}
              description={homeContent.statsSection.description}
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {sponsors.length ? (
          <section className="border-y border-primary/10 bg-primary-50/45 py-12 dark:border-white/10 dark:bg-white/[0.025] sm:py-14">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
                    Birlikte değer üretiyoruz
                  </p>
                  <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.035em] text-primary sm:text-3xl dark:text-white">
                    Sponsorlarımız
                  </h2>
                </div>
                <Button asChild variant="link" className="w-fit">
                  <Link href="/sponsorlar">
                    Tüm sponsorları gör
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                {sponsors.map((sponsor) => {
                  const logo = (
                    <div className="flex h-24 items-center justify-center rounded-2xl border border-primary/10 bg-white p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-accent/30 dark:border-white/10 dark:bg-white/[0.06]">
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.logoAlt ?? `${sponsor.name} logosu`}
                        className="max-h-12 w-auto max-w-full object-contain"
                      />
                    </div>
                  );

                  return sponsor.websiteUrl ? (
                    <Link
                      key={sponsor.id}
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label={`${sponsor.name} web sitesini yeni sekmede aç`}
                    >
                      {logo}
                    </Link>
                  ) : (
                    <div key={sponsor.id} className="group">
                      {logo}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section
          id="etkinlikler"
          className="scroll-mt-24 border-y border-primary/10 bg-primary-50/55 py-20 dark:border-white/10 dark:bg-white/[0.025] sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow={homeContent.eventsSection.eyebrow}
                title={homeContent.eventsSection.title}
                description={homeContent.eventsSection.description}
              />
              <Button asChild variant="link" className="w-fit">
                <Link href={homeContent.eventsSection.allEventsCta.href}>
                  {homeContent.eventsSection.allEventsCta.label}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  date={formatEventDate(event.date)}
                  title={event.title}
                  description={event.description}
                  imageSrc={event.imageUrl ?? undefined}
                  imageAlt={event.imageAlt ?? undefined}
                  category={event.category}
                  href={`/etkinliklerimiz/${event.slug}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:px-10">
            <SectionHeading
              eyebrow={homeContent.whyUsSection.eyebrow}
              title={homeContent.whyUsSection.title}
              description={homeContent.whyUsSection.description}
            />
            <div className="grid gap-5">
              {homeContent.whyUsSection.items.map((item, index) => {
                const Icon =
                  whyUsIcons[item.icon as keyof typeof whyUsIcons] ?? Compass;

                return (
                  <article
                    key={item.title}
                    className="group grid gap-5 rounded-[1.75rem] border border-primary/10 bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20 sm:grid-cols-[auto_1fr] sm:p-7 dark:border-white/10 dark:bg-white/[0.035]"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors group-hover:bg-accent-50 group-hover:text-accent-700 dark:bg-white/10 dark:text-primary-100 dark:group-hover:bg-accent/15 dark:group-hover:text-accent-300">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-accent-700 dark:text-accent-300">
                        0{index + 1}
                      </p>
                      <h3 className="mt-2 font-heading text-xl font-bold tracking-[-0.025em] text-primary dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary-900 px-6 py-14 text-white shadow-[0_32px_90px_-44px_rgba(27,42,94,0.9)] sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:gap-14 lg:px-16">
            <div
              className="absolute -bottom-32 -right-20 size-72 rounded-full border-[44px] border-accent/20"
              aria-hidden="true"
            />
            <div className="relative max-w-3xl">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                {homeContent.closingCta.eyebrow}
              </p>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                {homeContent.closingCta.title}
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-primary-200">
                {homeContent.closingCta.description}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="relative mt-8 shrink-0 lg:mt-0"
            >
              <Link href={homeContent.closingCta.button.href}>
                {homeContent.closingCta.button.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
