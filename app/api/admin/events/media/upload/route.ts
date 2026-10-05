import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = await request.json() as HandleUploadBody;
  } catch {
    return Response.json({ error: "Geçersiz yükleme isteği." }, { status: 400 });
  }

  if (body.type === "blob.generate-client-token" && !(await getCurrentAdmin())) {
    return Response.json({ error: "Yönetici oturumu gerekli." }, { status: 401 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!(await getCurrentAdmin())) throw new Error("Yönetici oturumu gerekli.");
        let payload: { eventId?: number; type?: string };
        try {
          payload = JSON.parse(clientPayload ?? "");
        } catch {
          throw new Error("Geçersiz medya bilgisi.");
        }
        const eventId = payload.eventId;
        const type = payload.type;
        if (!Number.isInteger(eventId) || !eventId || (type !== "image" && type !== "video")) {
          throw new Error("Geçersiz etkinlik veya medya tipi.");
        }
        const extension = type === "image" ? "(?:jpg|png|webp)" : "(?:mp4|webm)";
        const pathnamePattern = new RegExp(`^uploads/events/gallery/${eventId}/[a-f0-9-]+\\.${extension}$`);
        if (!pathnamePattern.test(pathname)) throw new Error("Geçersiz yükleme yolu.");
        const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
        if (!event) throw new Error("Etkinlik bulunamadı.");
        return {
          allowedContentTypes: type === "image"
            ? ["image/jpeg", "image/png", "image/webp"]
            : ["video/mp4", "video/webm"],
          maximumSizeInBytes: type === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    console.error("Etkinlik galerisi yükleme yetkisi verilemedi.", error);
    return Response.json({ error: "Medya yüklemesi başlatılamadı." }, { status: 400 });
  }
}
