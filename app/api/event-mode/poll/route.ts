import { getCurrentEventParticipant } from "@/lib/event-participant-session";
import { prisma } from "@/lib/prisma";

async function currentPoll() {
  return prisma.poll.findFirst({ where: { eventSession: { isActive: true, pollEnabled: true }, isActive: true }, include: { options: { orderBy: { order: "asc" }, include: { _count: { select: { votes: true } } } }, _count: { select: { votes: true } } } });
}

export async function GET() {
  const poll = await currentPoll();
  if (!poll) return Response.json({ poll: null }, { headers: { "Cache-Control": "no-store" } });
  const total = poll._count.votes;
  return Response.json({ poll: { id: poll.id, question: poll.question, total, options: poll.options.map((option) => ({ id: option.id, text: option.text, votes: option._count.votes, percent: total ? Math.round(option._count.votes / total * 100) : 0 })) } }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const participant = await getCurrentEventParticipant();
  if (!participant || !participant.eventSession.pollEnabled) return Response.json({ error: "Yetkisiz." }, { status: 401 });
  const body = await request.json().catch(() => null) as { pollOptionId?: unknown } | null;
  const pollOptionId = Number(body?.pollOptionId);
  if (!Number.isInteger(pollOptionId)) return Response.json({ error: "Geçersiz seçenek." }, { status: 400 });
  const option = await prisma.pollOption.findFirst({ where: { id: pollOptionId, poll: { eventSessionId: participant.eventSessionId, isActive: true } }, select: { id: true, pollId: true } });
  if (!option) return Response.json({ error: "Seçenek bulunamadı." }, { status: 404 });
  const existing = await prisma.pollVote.findUnique({ where: { pollId_participantId: { pollId: option.pollId, participantId: participant.id } }, select: { id: true } });
  if (!existing) await prisma.pollVote.create({ data: { pollId: option.pollId, pollOptionId: option.id, participantId: participant.id } });
  return Response.json({ success: true });
}
