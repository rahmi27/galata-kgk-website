"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireEventParticipant } from "@/lib/event-participant-session";
import { cleanEventText } from "@/lib/event-mode";
import { prisma } from "@/lib/prisma";

export async function submitEventFeedbackAction(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "tr";
  const participant = await requireEventParticipant(locale);
  const rating = Number(formData.get("rating"));
  const comment = cleanEventText(formData.get("comment"), 2000);
  if (!participant.eventSession.feedbackEnabled || !Number.isInteger(rating) || rating < 1 || rating > 5) redirect(locale === "en" ? "/en/event/hub/feedback?durum=gecersiz" : "/etkinlik/panel/geri-bildirim?durum=gecersiz");
  await prisma.feedback.create({ data: { eventSessionId: participant.eventSessionId, participantId: participant.id, rating, comment: comment || null } });
  revalidatePath("/admin/etkinlik-modu/geri-bildirim");
  redirect(locale === "en" ? "/en/event/hub/feedback?durum=tesekkurler" : "/etkinlik/panel/geri-bildirim?durum=tesekkurler");
}
