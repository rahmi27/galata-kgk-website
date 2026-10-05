import "server-only";

import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

import { getBlobAuthOptions } from "@/lib/image-upload";
import { isValidVideoSignature, MAX_SERVER_VIDEO_SIZE } from "@/lib/event-video-validation";

export async function saveEventGalleryVideoUpload(file: File, eventId: number) {
  if (file.size === 0 || file.size > MAX_SERVER_VIDEO_SIZE) {
    return { success: false as const, error: "Video en fazla 4 MB olabilir." };
  }
  if (file.type !== "video/mp4" && file.type !== "video/webm") {
    return { success: false as const, error: "Yalnızca MP4 veya WebM video yükleyebilirsiniz." };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!isValidVideoSignature(buffer, file.type)) {
    return { success: false as const, error: "Dosya geçerli bir video biçimiyle eşleşmiyor." };
  }
  const blobAuth = getBlobAuthOptions();
  if (!blobAuth) {
    return { success: false as const, error: "Video yükleme servisi yapılandırılmamış." };
  }
  const extension = file.type === "video/mp4" ? "mp4" : "webm";
  try {
    const blob = await put(`uploads/events/gallery/${eventId}/${randomUUID()}.${extension}`, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
      ...blobAuth,
    });
    return { success: true as const, url: blob.url };
  } catch (error) {
    console.error("Etkinlik galerisi videosu Blob'a yüklenemedi.", error);
    return { success: false as const, error: "Video yüklenemedi. Lütfen tekrar deneyin." };
  }
}
