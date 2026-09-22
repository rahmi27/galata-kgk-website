import { publicParticipantName } from "@/lib/event-mode";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const active = await prisma.eventSession.findFirst({ where: { isActive: true, quizEnabled: true }, select: { id: true, quizzes: { where: { isActive: true }, take: 1, select: { id: true } } } });
  const quizId = active?.quizzes[0]?.id;
  if (!active || !quizId) return Response.json({ leaderboard: [] }, { headers: { "Cache-Control": "no-store" } });
  const participants = await prisma.eventParticipant.findMany({
    where: { eventSessionId: active.id, quizAnswers: { some: { question: { quizId } } } },
    select: { fullName: true, quizAnswers: { where: { isCorrect: true, question: { quizId } }, select: { id: true } } },
  });
  const leaderboard = participants.map((participant) => ({ name: publicParticipantName(participant.fullName), score: participant.quizAnswers.length })).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "tr"));
  return Response.json({ leaderboard }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
