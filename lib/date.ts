const shortDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
});

const longDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatEventDate(date: Date | string | null | undefined) {
  if (!date) {
    return "Tarih yakında duyurulacak";
  }

  return shortDateFormatter.format(new Date(date));
}

export function formatEventDateLong(date: Date | string | null | undefined) {
  if (!date) {
    return "Tarih yakında duyurulacak";
  }

  return longDateFormatter.format(new Date(date));
}
