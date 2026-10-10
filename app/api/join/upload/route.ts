import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { prisma } from "@/lib/prisma";
import { ALLOWED_APPLICATION_FILE_TYPES, isApplicationPath, MAX_APPLICATION_FILE_BYTES, cleanupPendingApplicationFiles } from "@/lib/private-application-files";
import { checkJoinRateLimit } from "@/lib/join-rate-limit";

export async function POST(request: Request) {
  if (!process.env.BLOB_PRIVATE_READ_WRITE_TOKEN) return Response.json({ error: "Özel dosya deposu yapılandırılmamış." }, { status: 503 });
  const body = await request.json().catch(() => null) as HandleUploadBody | null;
  if (!body) return Response.json({ error: "Geçersiz yükleme isteği." }, { status: 400 });
  if (body.type === "blob.generate-client-token" && !(await checkJoinRateLimit(request, "upload"))) return Response.json({ error: "Yükleme sınırına ulaşıldı." }, { status: 429 });
  try {
    const result = await handleUpload({
      body, request, token: process.env.BLOB_PRIVATE_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        if (!isApplicationPath(pathname)) throw new Error("Geçersiz dosya yolu.");
        // Bounded cleanup on each new token avoids a cron and does not leave
        // abandoned files waiting on a random chance to be selected.
        await cleanupPendingApplicationFiles();
        await prisma.pendingUpload.create({ data: { pathname } });
        return { allowedContentTypes: [...ALLOWED_APPLICATION_FILE_TYPES], maximumSizeInBytes: MAX_APPLICATION_FILE_BYTES, validUntil: Date.now() + 5 * 60_000, addRandomSuffix: false };
      },
    });
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Özel dosya yükleme token hatası", error);
    return Response.json({ error: "Dosya yüklemesi başlatılamadı." }, { status: 400 });
  }
}
