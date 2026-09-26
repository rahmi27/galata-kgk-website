"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireEventParticipant } from "@/lib/event-participant-session";
import { getQuizGateStatus } from "@/lib/event-mode-quiz";
import { prisma } from "@/lib/prisma";

export async function joinRaffleAction(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "tr";
  const participant = await requireEventParticipant(locale);
  if (!participant.eventSession.raffleEnabled || formData.get("consent") !== "on") redirect(locale === "en" ? "/en/event/hub/raffle?durum=onay" : "/etkinlik/panel/cekilis?durum=onay");
  const quizGate = await getQuizGateStatus(participant.eventSessionId, participant.id);
  if (quizGate.required && !quizGate.completed) redirect(locale === "en" ? "/en/event/hub/raffle?durum=quiz-gerekli" : "/etkinlik/panel/cekilis?durum=quiz-gerekli");
  await prisma.raffleEntry.upsert({
    where: { eventSessionId_participantId: { eventSessionId: participant.eventSessionId, participantId: participant.id } },
    update: {},
    create: { eventSessionId: participant.eventSessionId, participantId: participant.id, consentAcceptedAt: new Date() },
  });
  revalidatePath("/admin/etkinlik-modu/cekilis");
  redirect(locale === "en" ? "/en/event/hub/raffle?durum=katildi" : "/etkinlik/panel/cekilis?durum=katildi");
}
