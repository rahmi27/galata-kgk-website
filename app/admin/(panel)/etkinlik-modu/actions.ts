"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { EVENT_MODE_CACHE_TAG, cleanEventText } from "@/lib/event-mode";
import { deleteUploadedImage, saveImageUpload } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-public";

function optionalId(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function flag(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function refreshEventMode() {
  revalidateTag(EVENT_MODE_CACHE_TAG, "max");
  revalidatePath("/admin/etkinlik-modu");
  revalidatePublicPath("/etkinlik");
}

export async function saveEventSessionAction(formData: FormData) {
  await requireAdmin();

  const id = optionalId(formData.get("id"));
  const linkedEventId = optionalId(formData.get("linkedEventId"));
  const title = cleanEventText(formData.get("title"), 120);
  const isActive = flag(formData, "isActive");

  if (title.length < 3) {
    redirect("/admin/etkinlik-modu?durum=gecersiz");
  }

  if (linkedEventId) {
    const linkedEvent = await prisma.event.findUnique({
      where: { id: linkedEventId },
      select: { id: true },
    });
    if (!linkedEvent) redirect("/admin/etkinlik-modu?durum=gecersiz-etkinlik");
  }

  const existingSession = id ? await prisma.eventSession.findUnique({
    where: { id },
    select: { id: true, posterImageUrl: true },
  }) : null;
  if (id && !existingSession) throw new Error("Oturum bulunamadı.");

  const posterUpload = await saveImageUpload(formData.get("posterImage"), "event-mode");
  if (!posterUpload.success) redirect("/admin/etkinlik-modu?durum=gorsel-hatasi");
  const removePoster = formData.get("removePosterImage") === "true";
  const posterImageUrl = posterUpload.path ?? (removePoster ? null : existingSession?.posterImageUrl ?? null);

  const data = {
    title,
    posterImageUrl,
    linkedEventId,
    isActive,
    quizEnabled: flag(formData, "quizEnabled"),
    raffleEnabled: flag(formData, "raffleEnabled"),
    joinButtonEnabled: flag(formData, "joinButtonEnabled"),
    feedbackEnabled: flag(formData, "feedbackEnabled"),
    badgeEnabled: flag(formData, "badgeEnabled"),
    pollEnabled: flag(formData, "pollEnabled"),
  };

  try {
    await prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.eventSession.updateMany({
          where: id ? { isActive: true, NOT: { id } } : { isActive: true },
          data: { isActive: false },
        });
      }
      if (id) await tx.eventSession.update({ where: { id }, data });
      else await tx.eventSession.create({ data });
    });
  } catch (error) {
    await deleteUploadedImage(posterUpload.path);
    throw error;
  }

  if (existingSession?.posterImageUrl && existingSession.posterImageUrl !== posterImageUrl) {
    await deleteUploadedImage(existingSession.posterImageUrl);
  }

  await refreshEventMode();
  redirect("/admin/etkinlik-modu?durum=kaydedildi");
}

export async function setEventSessionActiveAction(formData: FormData) {
  await requireAdmin();
  const id = optionalId(formData.get("id"));
  if (!id) redirect("/admin/etkinlik-modu?durum=gecersiz");

  await prisma.$transaction([
    prisma.eventSession.updateMany({
      where: { isActive: true, NOT: { id } },
      data: { isActive: false },
    }),
    prisma.eventSession.update({ where: { id }, data: { isActive: true } }),
  ]);
  await refreshEventMode();
  redirect("/admin/etkinlik-modu?durum=aktif");
}
