import { publicParticipantName } from "@/lib/event-mode";
import { getEventModeStats } from "@/lib/event-mode-stats";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const active = await prisma.eventSession.findFirst({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      showLiveCountersPublicly: true,
      quizzes: { where: { isActive: true }, take: 1, select: { id: true } },
      polls: { where: { isActive: true }, take: 1, include: { options: { orderBy: { order: "asc" }, include: { _count: { select: { votes: true } } } }, _count: { select: { votes: true } } } },
      raffleEntries: { select: { participant: { select: { fullName: true } } } },
      raffleWinners: { take: 1, orderBy: { drawnAt: "desc" }, include: { raffleEntry: { include: { participant: { select: { fullName: true } } } } } },
    },
  });
  if (!active) return Response.json({ session: null }, { headers: { "Cache-Control": "no-store" } });

  const quizId = active.quizzes[0]?.id;
  const participants = quizId ? await prisma.eventParticipant.findMany({ where: { eventSessionId: active.id, quizAnswers: { some: { question: { quizId } } } }, select: { fullName: true, quizAnswers: { where: { isCorrect: true, question: { quizId } }, select: { id: true } } } }) : [];
  const leaderboard = participants.map((participant) => ({ name: publicParticipantName(participant.fullName), score: participant.quizAnswers.length })).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "tr"));
  const poll = active.polls[0];
  const total = poll?._count.votes ?? 0;
  const winner = active.raffleWinners[0];
  const counters = active.showLiveCountersPublicly ? await getEventModeStats(active.id) : null;
  return Response.json({ session: { title: active.title, leaderboard, poll: poll ? { question: poll.question, total, options: poll.options.map((option) => ({ text: option.text, votes: option._count.votes, percent: total ? Math.round(option._count.votes / total * 100) : 0 })) } : null, counters, raffleNames: active.raffleEntries.map((entry) => publicParticipantName(entry.participant.fullName)), winner: winner ? { id: winner.id, name: publicParticipantName(winner.raffleEntry.participant.fullName), drawnAt: winner.drawnAt.toISOString() } : null } }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
