import { get } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { asciiDownloadFilename } from "@/lib/application-file-validation";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^\d+$/.test(id)) return new Response("Dosya bulunamadı.", { status: 404 });
  const file = await prisma.applicationFile.findUnique({ where: { id: Number(id) } });
  if (!file) return new Response("Dosya bulunamadı.", { status: 404 });
  const token = process.env.BLOB_PRIVATE_READ_WRITE_TOKEN;
  if (!token) return new Response("Özel dosya deposu yapılandırılmamış.", { status: 503 });
  const blob = await get(file.storagePathname, { access: "private", token, useCache: false });
  if (!blob || blob.statusCode !== 200) return new Response("Dosya bulunamadı.", { status: 404 });
  const safeName = asciiDownloadFilename(file.originalName);
  return new Response(blob.stream, { headers: { "Content-Type": file.contentType, "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(file.originalName)}`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
