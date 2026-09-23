import { prisma } from "@/lib/prisma";

export type QuizGateStatus = {
  required: boolean;
  completed: boolean;
  answeredQuestions: number;
  totalQuestions: number;
};

export async function getQuizGateStatus(eventSessionId: number, participantId: number): Promise<QuizGateStatus> {
  const session = await prisma.eventSession.findUnique({
    where: { id: eventSessionId },
    select: {
      quizEnabled: true,
      quizzes: {
        where: { isActive: true },
        take: 1,
        orderBy: { id: "desc" },
        select: {
          _count: { select: { questions: true } },
          questions: {
            where: { answers: { some: { participantId } } },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!session?.quizEnabled) return { required: false, completed: true, answeredQuestions: 0, totalQuestions: 0 };
  const quiz = session.quizzes[0];
  const totalQuestions = quiz?._count.questions ?? 0;
  const answeredQuestions = quiz?.questions.length ?? 0;
  return {
    required: true,
    completed: totalQuestions > 0 && answeredQuestions === totalQuestions,
    answeredQuestions,
    totalQuestions,
  };
}
