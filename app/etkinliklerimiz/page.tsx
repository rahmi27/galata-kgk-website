import type { Metadata } from "next";

import { EventList } from "@/components/events/event-list";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SectionHeading } from "@/components/shared/section-heading";
import eventsPageContent from "@/content/events-page.json";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: eventsPageContent.meta.title,
  description: eventsPageContent.meta.description,
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
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
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -right-20 -top-28 size-80 rounded-full border-[48px] border-accent/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow={eventsPageContent.hero.eyebrow}
              title={eventsPageContent.hero.title}
              description={eventsPageContent.hero.description}
            />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <EventList
              events={events.map((event) => ({
                ...event,
                date: event.date?.toISOString() ?? null,
              }))}
              currentDate={new Date().toISOString()}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
