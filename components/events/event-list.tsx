"use client";

import { useMemo, useState } from "react";
import { CalendarSearch } from "lucide-react";

import { EventCard } from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import eventsPageContent from "@/content/events-page.json";
import { formatEventDate } from "@/lib/date";

type EventFilter = "upcoming" | "past" | "all";

type EventListItem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string | null;
  imageUrl: string | null;
  category: string;
};

type EventListProps = {
  events: EventListItem[];
  currentDate: string;
};

export function EventList({ events, currentDate }: EventListProps) {
  const [activeFilter, setActiveFilter] =
    useState<EventFilter>("upcoming");

  const filteredEvents = useMemo(() => {
    const now = new Date(currentDate).getTime();

    return events
      .filter((event) => {
        if (!event.date) {
          return activeFilter !== "past";
        }

        const eventTime = new Date(event.date).getTime();

        if (activeFilter === "upcoming") {
          return eventTime >= now;
        }

        if (activeFilter === "past") {
          return eventTime < now;
        }

        return true;
      })
      .sort((firstEvent, secondEvent) => {
        if (!firstEvent.date && !secondEvent.date) {
          return firstEvent.title.localeCompare(secondEvent.title, "tr");
        }

        if (!firstEvent.date) {
          return -1;
        }

        if (!secondEvent.date) {
          return 1;
        }

        const firstTime = new Date(firstEvent.date).getTime();
        const secondTime = new Date(secondEvent.date).getTime();

        return activeFilter === "upcoming"
          ? firstTime - secondTime
          : secondTime - firstTime;
      });
  }, [activeFilter, currentDate, events]);

  const resultLabel = eventsPageContent.resultLabel.replace(
    "{count}",
    filteredEvents.length.toString(),
  );

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-primary/10 pb-8 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <div
          className="flex flex-wrap gap-2.5"
          role="group"
          aria-label={eventsPageContent.hero.eyebrow}
        >
          {eventsPageContent.filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <Button
                key={filter.value}
                type="button"
                variant={isActive ? "primary" : "outline"}
                size="sm"
                onClick={() =>
                  setActiveFilter(filter.value as EventFilter)
                }
                aria-pressed={isActive}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
        <p
          className="text-sm font-medium text-muted-foreground"
          aria-live="polite"
        >
          {resultLabel}
        </p>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              date={formatEventDate(event.date)}
              title={event.title}
              description={event.description}
              imageSrc={event.imageUrl ?? undefined}
              category={event.category}
              href={`/etkinliklerimiz/${event.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-dashed border-primary/20 bg-primary-50/50 px-6 text-center dark:border-white/15 dark:bg-white/[0.025]">
          <CalendarSearch
            className="size-10 text-accent-700 dark:text-accent-300"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h2 className="mt-5 font-heading text-xl font-bold text-primary dark:text-white">
            {eventsPageContent.emptyState.title}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {eventsPageContent.emptyState.description}
          </p>
        </div>
      )}
    </div>
  );
}
