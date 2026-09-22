import "server-only";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const EVENT_MODE_CACHE_TAG = "event-mode-active";
export const EVENT_PARTICIPANT_COOKIE = "galata-event-participant";

export const getActiveEventSession = unstable_cache(
  async () =>
    prisma.eventSession.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        quizEnabled: true,
        raffleEnabled: true,
        joinButtonEnabled: true,
        feedbackEnabled: true,
        badgeEnabled: true,
        pollEnabled: true,
        linkedEventId: true,
      },
    }),
  ["active-event-session"],
  // Admin mutations invalidate this tag immediately. The daily fallback only
  // covers out-of-band database edits and must not shorten every public page's
  // ISR lifetime merely because the navbar consumes this value.
  { revalidate: 86400, tags: [EVENT_MODE_CACHE_TAG] },
);

export function normalizeEventEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function cleanEventText(
  value: FormDataEntryValue | null,
  maxLength: number,
) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, maxLength)
    : "";
}

export function isValidEventEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function publicParticipantName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts[0] ?? "Katılımcı";
  return `${parts[0]} ${parts.at(-1)?.charAt(0).toLocaleUpperCase("tr-TR")}.`;
}
