import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createParticipantToken,
  EVENT_PARTICIPANT_COOKIE,
  EVENT_PARTICIPANT_MAX_AGE_SECONDS,
  verifyParticipantToken,
} from "@/lib/event-participant-token";
import { prisma } from "@/lib/prisma";

export async function setParticipantSession(participantId: number, eventSessionId: number) {
  const store = await cookies();
  store.set(EVENT_PARTICIPANT_COOKIE, createParticipantToken(participantId, eventSessionId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: EVENT_PARTICIPANT_MAX_AGE_SECONDS,
  });
}

export async function getCurrentEventParticipant() {
  const store = await cookies();
  const token = store.get(EVENT_PARTICIPANT_COOKIE)?.value;
  const decoded = token ? verifyParticipantToken(token) : null;
  if (!decoded) return null;
  return prisma.eventParticipant.findFirst({
    where: {
      id: decoded.participantId,
      eventSessionId: decoded.eventSessionId,
      eventSession: { isActive: true },
    },
    include: { eventSession: true },
  });
}

export async function requireEventParticipant(locale = "tr") {
  const participant = await getCurrentEventParticipant();
  if (!participant) redirect(locale === "en" ? "/en/event?durum=oturum-yenile" : "/etkinlik?durum=oturum-yenile");
  return participant;
}
