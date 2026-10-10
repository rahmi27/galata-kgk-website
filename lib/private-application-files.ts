import "server-only";
import { del, get, head } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { MAX_APPLICATION_FILE_BYTES, ALLOWED_APPLICATION_FILE_TYPES, isApplicationPath, validApplicationSignature } from "@/lib/application-file-validation";

export { MAX_APPLICATION_FILE_BYTES, ALLOWED_APPLICATION_FILE_TYPES, isApplicationPath } from "@/lib/application-file-validation";
export type ApplicationFileReference = { pathname: string; originalName: string };

function token() {
  const value = process.env.BLOB_PRIVATE_READ_WRITE_TOKEN;
  if (!value) throw new Error("BLOB_PRIVATE_READ_WRITE_TOKEN eksik.");
  return value;
}

export async function verifyPrivateApplicationFile(reference: ApplicationFileReference) {
  if (!reference || typeof reference.pathname !== "string" || typeof reference.originalName !== "string" || !isApplicationPath(reference.pathname) || !reference.originalName || reference.originalName.length > 255) throw new Error("Dosya bilgisi geçersiz.");
  const pending = await prisma.pendingUpload.findUnique({ where: { pathname: reference.pathname } });
  if (!pending || pending.attachedAt || pending.createdAt < new Date(Date.now() - 24 * 3600_000)) throw new Error("Dosya yükleme süresi doldu.");
  const blob = await head(reference.pathname, { token: token() });
  if (!blob || blob.size <= 0 || blob.size > MAX_APPLICATION_FILE_BYTES || !ALLOWED_APPLICATION_FILE_TYPES.includes(blob.contentType as (typeof ALLOWED_APPLICATION_FILE_TYPES)[number])) {
    await del(reference.pathname, { token: token() }).catch(() => undefined);
    throw new Error("Dosya boyutu veya türü geçersiz.");
  }
  const content = await get(reference.pathname, { access: "private", token: token(), useCache: false });
  if (!content || content.statusCode !== 200) throw new Error("Dosya doğrulanamadı.");
  const reader = content.stream.getReader();
  const signature = new Uint8Array(16);
  let offset = 0;
  while (offset < signature.length) {
    const part = await reader.read();
    if (part.done) break;
    const length = Math.min(part.value.length, signature.length - offset);
    signature.set(part.value.subarray(0, length), offset);
    offset += length;
  }
  await reader.cancel();
  if (!validApplicationSignature(signature.subarray(0, offset), blob.contentType)) {
    await del(reference.pathname, { token: token() }).catch(() => undefined);
    throw new Error("Dosyanın gerçek biçimi bildirilen türle eşleşmiyor.");
  }
  return { pathname: reference.pathname, originalName: reference.originalName, contentType: blob.contentType, sizeBytes: blob.size };
}

export async function deletePrivateApplicationFiles(pathnames: string[]) {
  if (pathnames.length) await del(pathnames, { token: token() });
}

export async function cleanupPendingApplicationFiles() {
  const stale = await prisma.pendingUpload.findMany({ where: { attachedAt: null, createdAt: { lt: new Date(Date.now() - 24 * 3600_000) } }, select: { pathname: true }, take: 50 });
  for (const item of stale) {
    try {
      await del(item.pathname, { token: token() });
      await prisma.pendingUpload.deleteMany({ where: { pathname: item.pathname, attachedAt: null } });
    } catch {
      // Keep the row for a later retry if Blob deletion failed.
    }
  }
}
