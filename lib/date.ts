function getLanguageTag(locale: string) {
  return locale === "en" ? "en-GB" : "tr-TR";
}

export function formatEventDate(
  date: Date | string | null | undefined,
  locale = "tr",
) {
  if (!date) {
    return locale === "en" ? "Date to be announced" : "Tarih yakında duyurulacak";
  }

  return new Intl.DateTimeFormat(getLanguageTag(locale), {
    day: "2-digit",
    month: "long",
  }).format(new Date(date));
}

export function formatEventDateLong(
  date: Date | string | null | undefined,
  locale = "tr",
) {
  if (!date) {
    return locale === "en" ? "Date to be announced" : "Tarih yakında duyurulacak";
  }

  return new Intl.DateTimeFormat(getLanguageTag(locale), {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
