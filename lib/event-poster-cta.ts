export type PosterCtaTarget =
  | "linkedEvent"
  | "eventMode"
  | "join"
  | "joinMember"
  | "events"
  | "contact";

export const POSTER_CTA_TARGETS: PosterCtaTarget[] = [
  "linkedEvent",
  "eventMode",
  "join",
  "joinMember",
  "events",
  "contact",
];

export function parsePosterCtaTarget(value: FormDataEntryValue | null): PosterCtaTarget | null {
  return typeof value === "string" && POSTER_CTA_TARGETS.includes(value as PosterCtaTarget)
    ? value as PosterCtaTarget
    : null;
}

export function getPosterCtaHref(target: PosterCtaTarget, linkedEventSlug: string | null) {
  switch (target) {
    case "linkedEvent":
      return linkedEventSlug
        ? { pathname: "/etkinliklerimiz/[slug]" as const, params: { slug: linkedEventSlug } }
        : "/etkinlik" as const;
    case "join":
      return "/katilim" as const;
    case "joinMember":
      return "/katilim/uye" as const;
    case "events":
      return "/etkinliklerimiz" as const;
    case "contact":
      return "/iletisim" as const;
    case "eventMode":
      return "/etkinlik" as const;
  }
}

export function getPosterCtaLabel(locale: string, label: string | null, labelEn: string | null) {
  return locale === "en"
    ? labelEn?.trim() || "Join the Event"
    : label?.trim() || "Etkinliğe Katıl";
}
