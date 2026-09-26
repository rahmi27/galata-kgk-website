import { getCurrentAdmin } from "@/lib/admin-auth";
import { getEventModeStats } from "@/lib/event-mode-stats";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!await getCurrentAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 401 });
  const active = await prisma.eventSession.findFirst({ where: { isActive: true }, orderBy: { createdAt: "desc" }, select: { id: true, title: true } });
  if (!active) return Response.json({ session: null }, { headers: { "Cache-Control": "private, no-store" } });
  return Response.json({ session: { id: active.id, title: active.title, stats: await getEventModeStats(active.id) } }, { headers: { "Cache-Control": "private, no-store" } });
}
