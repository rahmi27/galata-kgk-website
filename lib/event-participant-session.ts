import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { EVENT_PARTICIPANT_COOKIE } from "@/lib/event-mode";
import { prisma } from "@/lib/prisma";

const MAX_AGE_SECONDS = 12 * 60 * 60;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET etkinlik katılımcı oturumu için gereklidir.");
  }
  return value ?? "development-event-mode-secret-change-me";
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encodeToken(participantId: number, eventSessionId: number) {
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `v1.${participantId}.${eventSessionId}.${expiresAt}`;
  return `${payload}.${signature(payload)}`;
}

function decodeToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== "v1") return null;
  const payload = parts.slice(0, 4).join(".");
  const expected = Buffer.from(signature(payload));
  const received = Buffer.from(parts[4]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  const participantId = Number(parts[1]);
  const eventSessionId = Number(parts[2]);
  const expiresAt = Number(parts[3]);
  if (!Number.isInteger(participantId) || !Number.isInteger(eventSessionId) || expiresAt <= Math.floor(Date.now() / 1000)) return null;
  return { participantId, eventSessionId };
}

export async function setParticipantSession(participantId: number, eventSessionId: number) {
  const store = await cookies();
  store.set(EVENT_PARTICIPANT_COOKIE, encodeToken(participantId, eventSessionId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export const getCurrentEventParticipant = cache(async function getCurrentEventParticipant() {
  const store = await cookies();
  const token = store.get(EVENT_PARTICIPANT_COOKIE)?.value;
  const decoded = token ? decodeToken(token) : null;
  if (!decoded) return null;
  return prisma.eventParticipant.findFirst({
    where: {
      id: decoded.participantId,
      eventSessionId: decoded.eventSessionId,
      eventSession: { isActive: true },
    },
    include: { eventSession: true },
  });
});

export async function requireEventParticipant(locale = "tr") {
  const participant = await getCurrentEventParticipant();
  if (!participant) redirect(locale === "en" ? "/en/event" : "/etkinlik");
  return participant;
}
