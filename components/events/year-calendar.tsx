"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type CalendarEvent = {
  id: number;
  title: string;
  slug: string;
  date: string;
};

type YearCalendarProps = {
  events: CalendarEvent[];
  currentDate: string;
  className?: string;
};

const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

const weekdays = [
  { short: "P", long: "Pazartesi" },
  { short: "S", long: "Salı" },
  { short: "Ç", long: "Çarşamba" },
  { short: "P", long: "Perşembe" },
  { short: "C", long: "Cuma" },
  { short: "C", long: "Cumartesi" },
  { short: "P", long: "Pazar" },
] as const;

const istanbulDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Istanbul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getDateParts(value: string | Date) {
  const parts = istanbulDateFormatter.formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month) - 1,
    day: Number(values.day),
  };
}

function getInitialYear(eventYears: number[], currentYear: number) {
  if (!eventYears.length || eventYears.includes(currentYear)) {
    return currentYear;
  }

  return (
    eventYears.find((year) => year > currentYear) ??
    eventYears[eventYears.length - 1]
  );
}

export function YearCalendar({
  events,
  currentDate,
  className,
}: YearCalendarProps) {
  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        calendarDate: getDateParts(event.date),
      })),
    [events],
  );
  const currentYear = getDateParts(currentDate).year;
  const eventYears = useMemo(
    () =>
      Array.from(
        new Set(calendarEvents.map((event) => event.calendarDate.year)),
      ).sort((first, second) => first - second),
    [calendarEvents],
  );
  const availableYears = eventYears.length ? eventYears : [currentYear];
  const [activeYear, setActiveYear] = useState(() =>
    getInitialYear(eventYears, currentYear),
  );
  const activeYearIndex = availableYears.indexOf(activeYear);

  const eventsByDay = useMemo(() => {
    const groupedEvents = new Map<string, typeof calendarEvents>();

    for (const event of calendarEvents) {
      const { day, month, year } = event.calendarDate;
      const key = `${year}-${month}-${day}`;
      const dayEvents = groupedEvents.get(key) ?? [];
      dayEvents.push(event);
      groupedEvents.set(key, dayEvents);
    }

    return groupedEvents;
  }, [calendarEvents]);

  function showPreviousYear() {
    const previousYear = availableYears[activeYearIndex - 1];

    if (previousYear) {
      setActiveYear(previousYear);
    }
  }

  function showNextYear() {
    const nextYear = availableYears[activeYearIndex + 1];

    if (nextYear) {
      setActiveYear(nextYear);
    }
  }

  return (
    <section className={cn("space-y-9", className)} aria-label="Yıllık etkinlik takvimi">
      <div className="flex items-end justify-between gap-5 border-b border-primary/10 pb-6 dark:border-white/10">
        <div>
          <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
            Etkinlik takvimi
          </p>
          <p
            className="mt-1 font-heading text-6xl font-black leading-none tracking-[-0.075em] text-primary sm:text-7xl dark:text-white"
            aria-live="polite"
          >
            {activeYear}
          </p>
        </div>

        <div className="flex items-center gap-2" aria-label="Takvim yılı seçimi">
          <button
            type="button"
            onClick={showPreviousYear}
            disabled={activeYearIndex <= 0}
            className="inline-flex size-11 items-center justify-center rounded-full border border-primary/15 bg-background text-primary transition-all hover:-translate-x-0.5 hover:border-accent/50 hover:text-accent-700 disabled:pointer-events-none disabled:opacity-30 dark:border-white/15 dark:text-primary-100 dark:hover:text-accent-300"
            aria-label="Etkinlik bulunan önceki yılı göster"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNextYear}
            disabled={activeYearIndex >= availableYears.length - 1}
            className="inline-flex size-11 items-center justify-center rounded-full border border-primary/15 bg-background text-primary transition-all hover:translate-x-0.5 hover:border-accent/50 hover:text-accent-700 disabled:pointer-events-none disabled:opacity-30 dark:border-white/15 dark:text-primary-100 dark:hover:text-accent-300"
            aria-label="Etkinlik bulunan sonraki yılı göster"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {months.map((month, monthIndex) => (
          <MonthCard
            key={`${activeYear}-${month}`}
            year={activeYear}
            month={month}
            monthIndex={monthIndex}
            eventsByDay={eventsByDay}
          />
        ))}
      </div>

      {!calendarEvents.some(
        (event) => event.calendarDate.year === activeYear,
      ) ? (
        <p className="rounded-2xl border border-dashed border-primary/20 bg-primary-50/50 px-5 py-4 text-center text-sm text-muted-foreground dark:border-white/15 dark:bg-white/[0.025]">
          Bu yıl için tarihi kesinleşmiş bir etkinlik bulunmuyor.
        </p>
      ) : null}
    </section>
  );
}

function MonthCard({
  year,
  month,
  monthIndex,
  eventsByDay,
}: {
  year: number;
  month: string;
  monthIndex: number;
  eventsByDay: Map<
    string,
    Array<CalendarEvent & { calendarDate: ReturnType<typeof getDateParts> }>
  >;
}) {
  const firstWeekday = (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  return (
    <article className="rounded-[1.5rem] border border-primary/10 bg-card p-4 shadow-[0_18px_55px_-44px_rgba(27,42,94,0.65)] dark:border-white/10 dark:bg-white/[0.035] sm:p-5">
      <h2 className="font-heading text-lg font-bold tracking-[-0.025em] text-primary dark:text-white">
        {month}
      </h2>

      <div className="mt-4 grid grid-cols-7 gap-1" aria-hidden="true">
        {weekdays.map((weekday) => (
          <abbr
            key={weekday.long}
            title={weekday.long}
            className="flex aspect-square items-center justify-center text-[0.65rem] font-bold uppercase text-primary-400 no-underline dark:text-primary-300"
          >
            {weekday.short}
          </abbr>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }, (_, index) => (
          <span key={`empty-${index}`} className="aspect-square" aria-hidden="true" />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const dayEvents = eventsByDay.get(`${year}-${monthIndex}-${day}`) ?? [];

          if (!dayEvents.length) {
            return (
              <span
                key={day}
                className="flex aspect-square items-center justify-center text-xs font-medium text-primary-700 dark:text-primary-200"
              >
                {day}
              </span>
            );
          }

          const eventTitles = dayEvents.map((event) => event.title).join("; ");

          return (
            <Link
              key={day}
              href={`/etkinliklerimiz/${dayEvents[0].slug}`}
              className="group relative z-0 flex aspect-square items-center justify-center rounded-full text-xs font-bold text-primary-900 outline-none transition-transform hover:z-20 hover:scale-105 focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-offset-background"
              aria-label={`${day} ${month} ${year}: ${eventTitles}. Etkinlik detayını aç.`}
            >
              <HandDrawnCircle isMultiple={dayEvents.length > 1} />
              <time dateTime={`${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`}>
                {day}
              </time>
              {dayEvents.length > 1 ? (
                <span className="absolute -right-1 -top-1 z-10 flex size-4 items-center justify-center rounded-full bg-primary text-[0.55rem] font-black text-white shadow-sm dark:bg-white dark:text-primary-900">
                  {dayEvents.length}
                </span>
              ) : null}
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-52 -translate-x-1/2 translate-y-1 rounded-xl bg-primary-950 px-3 py-2 text-center text-[0.68rem] font-semibold leading-4 text-white opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-white dark:text-primary-950"
              >
                {eventTitles}
                <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary-950 dark:bg-white" />
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}

function HandDrawnCircle({ isMultiple }: { isMultiple: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="pointer-events-none absolute -inset-0.5 -z-10 size-[calc(100%+0.25rem)] overflow-visible text-accent"
      aria-hidden="true"
    >
      <path
        d="M20.4 3.7C28 3.2 35.2 8.5 36.2 16.4c1.1 8.3-3.7 17.1-11.8 19.1C16.1 37.6 7.2 33.3 4.7 25.2 2 16.7 6.1 7.5 14.6 4.5c1.9-.7 3.8-.9 5.8-.8Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth={isMultiple ? 2.8 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isMultiple ? (
        <path
          d="M19.2 5.2c7.5-.8 14.9 4.1 16.1 11.8 1.3 8-3.2 16.2-10.8 18.2-7.9 2.1-16.7-2.1-19-9.9C3 17.2 6.9 8.7 15 5.8c1.4-.5 2.8-.6 4.2-.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeDasharray="21 3"
        />
      ) : null}
    </svg>
  );
}
