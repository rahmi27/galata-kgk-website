import { unstable_cache } from "next/cache";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventList } from "@/components/events/event-list";
import { SectionHeading } from "@/components/shared/section-heading";
import { prisma } from "@/lib/prisma";
import { localizedOptionalValue, localizedValue } from "@/lib/localized-content";
import { createPageMetadata } from "@/lib/site-metadata";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return createPageMetadata({ title: t("metaTitle"), description: t("metaDescription"), path: "/etkinliklerimiz", locale });
}

const getCachedEvents = unstable_cache(
  async () => {
    const events = await prisma.event.findMany({
      orderBy: [
        {
          date: "asc",
        },
        {
          title: "asc",
        },
      ],
      select: {
        id: true,
        title: true,
        titleEn: true,
        slug: true,
        description: true,
        descriptionEn: true,
        date: true,
        imageUrl: true,
        imageAlt: true,
        imageAltEn: true,
        category: true,
        categoryEn: true,
      },
    });

    return events.map((event) => ({
      ...event,
      date: event.date?.toISOString() ?? null,
    }));
  },
  ["public-events"],
  {
    revalidate: 86400,
    tags: ["events"],
  },
);

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "events" });
  const events = (await getCachedEvents()).map((event) => ({
    id: event.id,
    slug: event.slug,
    date: event.date,
    imageUrl: event.imageUrl,
    title: localizedValue(locale, event.title, event.titleEn),
    description: localizedValue(locale, event.description, event.descriptionEn),
    imageAlt: localizedOptionalValue(locale, event.imageAlt, event.imageAltEn),
    category: localizedValue(locale, event.category, event.categoryEn),
  }));

  return (
    <div className="bg-background">

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -right-20 -top-28 size-80 rounded-full border-[48px] border-accent/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("description")}
            />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <EventList
              events={events}
              currentDate={new Date().toISOString()}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
