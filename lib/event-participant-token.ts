import { createHmac, timingSafeEqual } from "node:crypto";

export const EVENT_PARTICIPANT_COOKIE = "galata-event-participant";
export const EVENT_PARTICIPANT_MAX_AGE_SECONDS = 12 * 60 * 60;

function participantTokenSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET etkinlik katılımcı oturumu için gereklidir.");
  }
  return value ?? "development-event-mode-secret-change-me";
}

function participantTokenSignature(payload: string) {
  return createHmac("sha256", participantTokenSecret())
    .update(payload)
    .digest("base64url");
}

export function createParticipantToken(participantId: number, eventSessionId: number) {
  const expiresAt = Math.floor(Date.now() / 1000) + EVENT_PARTICIPANT_MAX_AGE_SECONDS;
  const payload = `v1.${participantId}.${eventSessionId}.${expiresAt}`;
  return `${payload}.${participantTokenSignature(payload)}`;
}

export function verifyParticipantToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== "v1") return null;

  const payload = parts.slice(0, 4).join(".");
  const expected = Buffer.from(participantTokenSignature(payload));
  const received = Buffer.from(parts[4]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  const participantId = Number(parts[1]);
  const eventSessionId = Number(parts[2]);
  const expiresAt = Number(parts[3]);
  if (!Number.isInteger(participantId) || !Number.isInteger(eventSessionId) || expiresAt <= Math.floor(Date.now() / 1000)) return null;

  return { participantId, eventSessionId, expiresAt };
}
