"use client";

import { useMemo, useState } from "react";
import { CalendarRange, CalendarSearch, List } from "lucide-react";

import { YearCalendar } from "@/components/events/year-calendar";
import { EventCard } from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import eventsPageContent from "@/content/events-page.json";
import { formatEventDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type EventFilter = "upcoming" | "past" | "all";
type EventView = "list" | "calendar";

type EventListItem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  category: string;
};

type EventListProps = {
  events: EventListItem[];
  currentDate: string;
  initialView?: EventView;
};

const viewIcons = {
  list: List,
  calendar: CalendarRange,
} as const;

export function EventList({
  events,
  currentDate,
  initialView = "list",
}: EventListProps) {
  const [activeFilter, setActiveFilter] =
    useState<EventFilter>("upcoming");
  const [activeView, setActiveView] = useState<EventView>(initialView);

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
  const calendarEvents = useMemo(
    () =>
      events.flatMap((event) =>
        event.date
          ? [
              {
                id: event.id,
                title: event.title,
                slug: event.slug,
                date: event.date,
              },
            ]
          : [],
      ),
    [events],
  );
  const calendarResultLabel = eventsPageContent.calendarResultLabel.replace(
    "{count}",
    calendarEvents.length.toString(),
  );

  function changeView(view: EventView) {
    setActiveView(view);

    const url = new URL(window.location.href);

    if (view === "calendar") {
      url.searchParams.set("view", "takvim");
    } else {
      url.searchParams.delete("view");
    }

    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-primary/10 pb-8 lg:flex-row lg:items-center lg:justify-between dark:border-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="flex flex-wrap gap-2.5"
            role="group"
            aria-label="Etkinlik listesi filtresi"
          >
            {eventsPageContent.filters.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <Button
                  key={filter.value}
                  type="button"
                  variant={isActive && activeView === "list" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveFilter(filter.value as EventFilter);
                    changeView("list");
                  }}
                  aria-pressed={isActive && activeView === "list"}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>

          <div
            className="flex w-fit items-center rounded-full border border-primary/15 bg-primary-50/70 p-1 dark:border-white/15 dark:bg-white/[0.06]"
            role="group"
            aria-label="Etkinlik görünümü"
          >
            {eventsPageContent.viewModes.map((viewMode) => {
              const view = viewMode.value as EventView;
              const isActive = activeView === view;
              const Icon = viewIcons[view];

              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => changeView(view)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full px-3.5 font-heading text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    isActive
                      ? "bg-primary text-white shadow-sm dark:bg-white dark:text-primary-950"
                      : "text-primary-600 hover:bg-white hover:text-primary dark:text-primary-200 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                  aria-pressed={isActive}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {viewMode.label}
                </button>
              );
            })}
          </div>
        </div>
        <p
          className="text-sm font-medium text-muted-foreground"
          aria-live="polite"
        >
          {activeView === "list" ? resultLabel : calendarResultLabel}
        </p>
      </div>

      {activeView === "calendar" ? (
        <YearCalendar
          key="calendar"
          events={calendarEvents}
          currentDate={currentDate}
          className="view-fade-in mt-10"
        />
      ) : filteredEvents.length > 0 ? (
        <div
          key={`list-${activeFilter}`}
          className="view-fade-in mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredEvents.map((event) => (
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
      ) : (
        <div className="view-fade-in mt-10 flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-dashed border-primary/20 bg-primary-50/50 px-6 text-center dark:border-white/15 dark:bg-white/[0.025]">
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
