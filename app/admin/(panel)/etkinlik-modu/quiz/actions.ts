"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { cleanEventText } from "@/lib/event-mode";
import { prisma } from "@/lib/prisma";

function positiveId(value: FormDataEntryValue | null) {
  const parsed = typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function activeSessionId() {
  const active = await prisma.eventSession.findFirst({
    where: { isActive: true },
    select: { id: true },
  });
  return active?.id ?? null;
}

export async function saveQuizAction(formData: FormData) {
  await requireAdmin();
  const eventSessionId = await activeSessionId();
  const id = positiveId(formData.get("id"));
  const title = cleanEventText(formData.get("title"), 140);
  const isActive = formData.get("isActive") === "on";
  if (!eventSessionId || title.length < 3) redirect("/admin/etkinlik-modu/quiz?durum=gecersiz");

  await prisma.$transaction(async (tx) => {
    if (isActive) {
      await tx.quiz.updateMany({
        where: { eventSessionId, isActive: true, ...(id ? { NOT: { id } } : {}) },
        data: { isActive: false },
      });
    }
    if (id) {
      const quiz = await tx.quiz.findFirst({ where: { id, eventSessionId }, select: { id: true } });
      if (!quiz) throw new Error("Quiz bulunamadı.");
      await tx.quiz.update({ where: { id }, data: { title, isActive } });
    } else {
      await tx.quiz.create({ data: { eventSessionId, title, isActive } });
    }
  });
  revalidatePath("/admin/etkinlik-modu/quiz");
  redirect("/admin/etkinlik-modu/quiz?durum=kaydedildi");
}

export async function saveQuizQuestionAction(formData: FormData) {
  await requireAdmin();
  const eventSessionId = await activeSessionId();
  const id = positiveId(formData.get("id"));
  const quizId = positiveId(formData.get("quizId"));
  const questionText = cleanEventText(formData.get("questionText"), 500);
  const options = [0, 1, 2, 3].map((index) => cleanEventText(formData.get(`option${index}`), 240));
  const correctOptionIndex = Number(formData.get("correctOptionIndex"));
  const order = Number(formData.get("order"));

  if (!eventSessionId || !quizId || questionText.length < 3 || options.some((option) => option.length < 1) || !Number.isInteger(correctOptionIndex) || correctOptionIndex < 0 || correctOptionIndex > 3 || !Number.isInteger(order) || order < 0 || order > 10000) {
    redirect("/admin/etkinlik-modu/quiz?durum=gecersiz-soru");
  }
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, eventSessionId }, select: { id: true } });
  if (!quiz) redirect("/admin/etkinlik-modu/quiz?durum=quiz-yok");

  const data = { quizId, questionText, options, correctOptionIndex, order };
  if (id) {
    const existing = await prisma.quizQuestion.findFirst({ where: { id, quizId }, select: { id: true } });
    if (!existing) redirect("/admin/etkinlik-modu/quiz?durum=soru-yok");
    await prisma.quizQuestion.update({ where: { id }, data });
  } else {
    await prisma.quizQuestion.create({ data });
  }
  revalidatePath("/admin/etkinlik-modu/quiz");
  redirect("/admin/etkinlik-modu/quiz?durum=kaydedildi");
}

export async function deleteQuizQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = positiveId(formData.get("id"));
  const eventSessionId = await activeSessionId();
  if (!id || !eventSessionId) return;
  const question = await prisma.quizQuestion.findFirst({ where: { id, quiz: { eventSessionId } }, select: { id: true } });
  if (question) await prisma.quizQuestion.delete({ where: { id } });
  revalidatePath("/admin/etkinlik-modu/quiz");
}
