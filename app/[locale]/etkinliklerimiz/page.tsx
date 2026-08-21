import { unstable_cache } from "next/cache";

import { EventList } from "@/components/events/event-list";
import { SectionHeading } from "@/components/shared/section-heading";
import eventsPageContent from "@/content/events-page.json";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: eventsPageContent.meta.title,
  description: eventsPageContent.meta.description,
  path: "/etkinliklerimiz",
  keywords: ["kariyer etkinlikleri", "girişimcilik etkinlikleri", "networking"],
});

export const revalidate = 300;

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
        slug: true,
        description: true,
        date: true,
        imageUrl: true,
        imageAlt: true,
        category: true,
      },
    });

    return events.map((event) => ({
      ...event,
      date: event.date?.toISOString() ?? null,
    }));
  },
  ["public-events"],
  {
    revalidate: 300,
    tags: ["events"],
  },
);

export default async function EventsPage() {
  const events = await getCachedEvents();

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
              eyebrow={eventsPageContent.hero.eyebrow}
              title={eventsPageContent.hero.title}
              description={eventsPageContent.hero.description}
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
