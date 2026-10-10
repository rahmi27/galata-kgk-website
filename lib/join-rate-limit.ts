import "server-only";
import { prisma } from "@/lib/prisma";
import { getClientIpHash } from "@/lib/client-ip";

export async function checkJoinRateLimit(request: Request, scope: "member" | "application" | "upload") {
  const ipHash = getClientIpHash(request);
  const max = scope === "upload" ? 30 : 10;
  const since = new Date(Date.now() - 60 * 60 * 1000);
  // The new attempt table stores only keyed HMAC digests, never raw IP addresses.
  const count = await prisma.applicationRateAttempt.count({ where: { scope, ipHash, createdAt: { gte: since } } });
  if (count >= max) return false;
  await prisma.applicationRateAttempt.create({ data: { scope, ipHash } });
  return true;
}
