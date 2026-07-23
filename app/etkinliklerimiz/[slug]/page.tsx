import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import eventDetailContent from "@/content/event-detail.json";
import { formatEventDateLong } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

type EventDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getEventBySlug = cache((slug: string) =>
  prisma.event.findUnique({
    where: {
      slug,
    },
  }),
);

export const revalidate = 300;

export async function generateStaticParams() {
  return prisma.event.findMany({
    select: {
      slug: true,
    },
  });
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return createPageMetadata({
      title: "Etkinlik Bulunamadı | Galata KGK",
      description: "Aradığınız Galata KGK etkinliği bulunamadı.",
      path: "/etkinliklerimiz",
    });
  }

  return createPageMetadata({
    title: `${event.title} | Galata KGK — İstanbul Galata Üniversitesi`,
    description: `${event.description} İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü etkinliği.`,
    path: `/etkinliklerimiz/${event.slug}`,
    keywords: [event.title, event.category, "Galata KGK etkinliği"],
  });
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const longDescriptionParagraphs = event.longDescription
    .split(/\n\s*\n/)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">

      <main>
        <section className="border-b border-primary/10 bg-primary-50/65 py-16 dark:border-white/10 dark:bg-primary-900/30 sm:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
            <Button asChild variant="ghost" className="-ml-4 w-fit">
              <Link href="/etkinliklerimiz">
                <ArrowLeft aria-hidden="true" />
                {eventDetailContent.backLabel}
              </Link>
            </Button>
            <p className="mt-9 inline-flex rounded-full bg-accent-50 px-3.5 py-2 font-heading text-xs font-bold uppercase tracking-[0.15em] text-accent-800 dark:bg-accent/15 dark:text-accent-300">
              {event.category}
            </p>
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-bold leading-[1.05] tracking-[-0.05em] text-primary sm:text-5xl lg:text-6xl dark:text-white">
              {event.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
              {event.description}
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_19rem] lg:gap-14 lg:px-10">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-primary-900 shadow-[0_28px_80px_-44px_rgba(27,42,94,0.85)]">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.imageAlt ?? `${event.title} etkinliği görseli`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 700px, 100vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_78%_22%,rgba(232,93,44,0.55),transparent_26%),linear-gradient(135deg,#1B2A5E_0%,#283B74_50%,#131D41_100%)]"
                    role="img"
                    aria-label={`${event.title} için görsel alanı`}
                  >
                    <CalendarDays
                      className="size-16 text-white/70"
                      strokeWidth={1.15}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>

              <article className="mt-10">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
                  {eventDetailContent.aboutLabel}
                </p>
                <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
                  {longDescriptionParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>

              <Button asChild variant="outline" className="mt-10">
                <Link href="/etkinliklerimiz">
                  <ArrowLeft aria-hidden="true" />
                  {eventDetailContent.backLabel}
                </Link>
              </Button>
            </div>

            <aside className="self-start rounded-[1.75rem] border border-primary/10 bg-card p-6 shadow-[0_24px_70px_-48px_rgba(27,42,94,0.55)] lg:sticky lg:top-28 dark:border-white/10 dark:bg-white/[0.035]">
              <dl className="space-y-6">
                <div>
                  <dt className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-accent-700 dark:text-accent-300">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {eventDetailContent.dateLabel}
                  </dt>
                  <dd className="mt-2 text-sm font-medium leading-6 text-primary dark:text-primary-100">
                    {formatEventDateLong(event.date)}
                  </dd>
                </div>
                <div className="border-t border-primary/10 pt-6 dark:border-white/10">
                  <dt className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-accent-700 dark:text-accent-300">
                    <MapPin className="size-4" aria-hidden="true" />
                    {eventDetailContent.locationLabel}
                  </dt>
                  <dd className="mt-2 text-sm font-medium leading-6 text-primary dark:text-primary-100">
                    {event.location}
                  </dd>
                </div>
                <div className="border-t border-primary/10 pt-6 dark:border-white/10">
                  <dt className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-accent-700 dark:text-accent-300">
                    <Tag className="size-4" aria-hidden="true" />
                    {eventDetailContent.categoryLabel}
                  </dt>
                  <dd className="mt-2 text-sm font-medium leading-6 text-primary dark:text-primary-100">
                    {event.category}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
