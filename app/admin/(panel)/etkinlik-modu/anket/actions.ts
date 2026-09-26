"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { cleanEventText } from "@/lib/event-mode";
import { prisma } from "@/lib/prisma";

export async function savePollAction(formData: FormData) {
  await requireAdmin();
  const active = await prisma.eventSession.findFirst({ where: { isActive: true }, select: { id: true } });
  const pollIdValue = Number(formData.get("pollId"));
  const pollId = Number.isInteger(pollIdValue) && pollIdValue > 0 ? pollIdValue : null;
  const question = cleanEventText(formData.get("question"), 500);
  const options = [0, 1, 2, 3].map((index) => cleanEventText(formData.get(`option${index}`), 240)).filter(Boolean);
  const isActive = formData.get("isActive") === "on";
  if (!active || question.length < 3 || options.length < 2) redirect("/admin/etkinlik-modu/anket?durum=gecersiz");

  await prisma.$transaction(async (tx) => {
    if (isActive) await tx.poll.updateMany({ where: { eventSessionId: active.id, isActive: true, ...(pollId ? { NOT: { id: pollId } } : {}) }, data: { isActive: false } });
    if (pollId) {
      const poll = await tx.poll.findFirst({ where: { id: pollId, eventSessionId: active.id }, select: { id: true } });
      if (!poll) throw new Error("Anket bulunamadı.");
      await tx.pollVote.deleteMany({ where: { pollId } });
      await tx.pollOption.deleteMany({ where: { pollId } });
      await tx.poll.update({ where: { id: pollId }, data: { question, isActive, options: { create: options.map((text, order) => ({ text, order })) } } });
    } else {
      await tx.poll.create({ data: { eventSessionId: active.id, question, isActive, options: { create: options.map((text, order) => ({ text, order })) } } });
    }
  });
  revalidatePath("/admin/etkinlik-modu/anket");
  revalidatePath("/tr/etkinlik/ekran");
  revalidatePath("/en/etkinlik/ekran");
  redirect("/admin/etkinlik-modu/anket?durum=kaydedildi");
}
