"use server";

import { head } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { deleteUploadedImage } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-public";

type Result = { success: boolean; message: string };
type MediaType = "image" | "video";

function normalizedCaption(value: string) {
  const caption = value.trim().replace(/\s+/g, " ");
  return caption.length <= 180 ? caption || null : undefined;
}

function validOrder(value: number) {
  return Number.isInteger(value) && value >= 0 && value <= 10000;
}

function refreshMediaPages(eventId: number, slug: string) {
  revalidatePublicPath(`/etkinliklerimiz/${slug}`);
  revalidatePath(`/admin/etkinlikler/${eventId}/duzenle`);
}

export async function addEventMediaAction(
  eventId: number,
  input: { type: MediaType; url: string; caption: string; captionEn: string; order: number },
): Promise<Result> {
  await requireAdmin();
  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { slug: true } });
  if (!event) return { success: false, message: "Etkinlik bulunamadı." };
  const caption = normalizedCaption(input.caption);
  const captionEn = normalizedCaption(input.captionEn);
  if (caption === undefined || captionEn === undefined || !validOrder(input.order)) {
    return { success: false, message: "Başlık veya sıra numarası geçersiz." };
  }
  if (input.type !== "image" && input.type !== "video") {
    return { success: false, message: "Medya tipi geçersiz." };
  }

  let url: URL;
  try {
    url = new URL(input.url);
  } catch {
    return { success: false, message: "Medya adresi geçersiz." };
  }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".blob.vercel-storage.com") ||
    !url.pathname.startsWith(`/uploads/events/gallery/${eventId}/`) || url.search || url.hash) {
    return { success: false, message: "Medya adresi güvenilir değil." };
  }

  try {
    const blob = await head(url.href);
    const allowedTypes = input.type === "image"
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["video/mp4", "video/webm"];
    const maxSize = input.type === "image" ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (blob.url !== url.href || !blob.pathname.startsWith(`uploads/events/gallery/${eventId}/`) ||
      !allowedTypes.includes(blob.contentType) || blob.size > maxSize) {
      return { success: false, message: "Yüklenen dosya doğrulanamadı." };
    }
    await prisma.eventMedia.create({
      data: { eventId, type: input.type, url: url.href, caption, captionEn, order: input.order },
    });
    refreshMediaPages(eventId, event.slug);
    return { success: true, message: "Medya galeriye eklendi." };
  } catch (error) {
    console.error("Etkinlik medyası kaydedilemedi.", error);
    return { success: false, message: "Medya kaydedilemedi. Lütfen tekrar deneyin." };
  }
}

export async function updateEventMediaAction(
  eventId: number,
  mediaId: number,
  input: { caption: string; captionEn: string; order: number },
): Promise<Result> {
  await requireAdmin();
  const caption = normalizedCaption(input.caption);
  const captionEn = normalizedCaption(input.captionEn);
  if (caption === undefined || captionEn === undefined || !validOrder(input.order)) {
    return { success: false, message: "Başlık veya sıra numarası geçersiz." };
  }
  const media = await prisma.eventMedia.findFirst({
    where: { id: mediaId, eventId },
    select: { event: { select: { slug: true } } },
  });
  if (!media) return { success: false, message: "Medya bulunamadı." };
  await prisma.eventMedia.update({ where: { id: mediaId }, data: { caption, captionEn, order: input.order } });
  refreshMediaPages(eventId, media.event.slug);
  return { success: true, message: "Medya güncellendi." };
}

export async function deleteEventMediaAction(eventId: number, mediaId: number): Promise<Result> {
  await requireAdmin();
  const media = await prisma.eventMedia.findFirst({
    where: { id: mediaId, eventId },
    select: { url: true, event: { select: { slug: true } } },
  });
  if (!media) return { success: false, message: "Medya bulunamadı." };
  await prisma.eventMedia.delete({ where: { id: mediaId } });
  await deleteUploadedImage(media.url);
  refreshMediaPages(eventId, media.event.slug);
  return { success: true, message: "Medya silindi." };
}
