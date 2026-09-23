import "server-only";

import { prisma } from "@/lib/prisma";

export type EventModeStats = {
  participants: number;
  quizCompleted: number;
  quizInProgress: number;
  raffleEntries: number;
  feedbackParticipants: number;
  pollVoters: number;
};

export async function getEventModeStats(eventSessionId: number): Promise<EventModeStats> {
  const activeQuiz = await prisma.quiz.findFirst({
    where: { eventSessionId, isActive: true },
    orderBy: { id: "desc" },
    select: { id: true, _count: { select: { questions: true } } },
  });
  const quizId = activeQuiz?.id;
  const totalQuestions = activeQuiz?._count.questions ?? 0;
  const recentThreshold = new Date(Date.now() - 5 * 60 * 1000);

  const [participants, raffleEntries, feedback, pollVotes] = await Promise.all([
    prisma.eventParticipant.findMany({
      where: { eventSessionId },
      select: {
        id: true,
        quizAnswers: quizId ? {
          where: { question: { quizId } },
          select: { questionId: true, answeredAt: true },
        } : false,
      },
    }),
    prisma.raffleEntry.count({ where: { eventSessionId } }),
    prisma.feedback.findMany({ where: { eventSessionId, participantId: { not: null } }, distinct: ["participantId"], select: { participantId: true } }),
    prisma.pollVote.findMany({ where: { poll: { eventSessionId } }, distinct: ["participantId"], select: { participantId: true } }),
  ]);

  let quizCompleted = 0;
  let quizInProgress = 0;
  if (quizId && totalQuestions > 0) {
    for (const participant of participants) {
      const answers = participant.quizAnswers || [];
      if (answers.length === totalQuestions) quizCompleted += 1;
      else if (answers.some((answer) => answer.answeredAt >= recentThreshold)) quizInProgress += 1;
    }
  }

  return {
    participants: participants.length,
    quizCompleted,
    quizInProgress,
    raffleEntries,
    feedbackParticipants: feedback.length,
    pollVoters: pollVotes.length,
  };
}
