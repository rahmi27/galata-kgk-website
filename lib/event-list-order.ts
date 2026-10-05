export type EventFilter = "upcoming" | "past" | "all";

type DatedEvent = { date: string | null; title: string };

export function filterAndSortEvents<T extends DatedEvent>(
  events: T[],
  filter: EventFilter,
  currentDate: string,
  locale: string,
): T[] {
  const now = new Date(currentDate).getTime();
  return events
    .filter((event) => {
      if (!event.date) return filter !== "past";
      const time = new Date(event.date).getTime();
      return filter === "all" || (filter === "upcoming" ? time >= now : time < now);
    })
    .sort((first, second) => {
      if (!first.date && !second.date) return first.title.localeCompare(second.title, locale);
      if (!first.date) return 1;
      if (!second.date) return -1;

      const firstTime = new Date(first.date).getTime();
      const secondTime = new Date(second.date).getTime();
      if (filter === "all") {
        const firstUpcoming = firstTime >= now;
        const secondUpcoming = secondTime >= now;
        if (firstUpcoming !== secondUpcoming) return firstUpcoming ? -1 : 1;
      }

      const dateOrder = filter === "past" || (filter === "all" && firstTime < now)
        ? secondTime - firstTime
        : firstTime - secondTime;
      return dateOrder || first.title.localeCompare(second.title, locale);
    });
}
