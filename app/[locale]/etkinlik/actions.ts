"use server";

import { redirect } from "next/navigation";

import { setParticipantSession } from "@/lib/event-participant-session";
import { cleanEventText, isValidEventEmail, normalizeEventEmail } from "@/lib/event-mode";
import { prisma } from "@/lib/prisma";

export async function joinEventModeAction(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "tr";
  const active = await prisma.eventSession.findFirst({ where: { isActive: true }, select: { id: true } });
  const fullName = cleanEventText(formData.get("fullName"), 120);
  const email = normalizeEventEmail(formData.get("email"));
  const department = cleanEventText(formData.get("department"), 160);
  const consent = formData.get("consent") === "on";

  if (!active) redirect(locale === "en" ? "/en/event?durum=aktif-yok" : "/etkinlik?durum=aktif-yok");
  if (fullName.length < 3 || department.length < 2 || !isValidEventEmail(email) || !consent) {
    redirect(locale === "en" ? "/en/event?durum=gecersiz" : "/etkinlik?durum=gecersiz");
  }

  const participant = await prisma.eventParticipant.upsert({
    where: { eventSessionId_email: { eventSessionId: active.id, email } },
    update: { fullName, department },
    create: { eventSessionId: active.id, fullName, email, department, consentAcceptedAt: new Date() },
    select: { id: true, eventSessionId: true },
  });
  await setParticipantSession(participant.id, participant.eventSessionId);
  redirect(locale === "en" ? "/en/event/hub" : "/etkinlik/panel");
}
