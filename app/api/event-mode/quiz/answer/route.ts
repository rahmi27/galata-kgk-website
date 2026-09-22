import { getCurrentEventParticipant } from "@/lib/event-participant-session";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const participant = await getCurrentEventParticipant();
  if (!participant || !participant.eventSession.quizEnabled) return Response.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await request.json().catch(() => null) as { questionId?: unknown; selectedOptionIndex?: unknown } | null;
  const questionId = Number(body?.questionId);
  const selectedOptionIndex = Number(body?.selectedOptionIndex);
  if (!Number.isInteger(questionId) || !Number.isInteger(selectedOptionIndex) || selectedOptionIndex < 0 || selectedOptionIndex > 3) return Response.json({ error: "Geçersiz cevap." }, { status: 400 });

  const question = await prisma.quizQuestion.findFirst({
    where: { id: questionId, quiz: { eventSessionId: participant.eventSessionId, isActive: true } },
    select: { id: true, correctOptionIndex: true, options: true },
  });
  if (!question || !Array.isArray(question.options) || selectedOptionIndex >= question.options.length) return Response.json({ error: "Soru bulunamadı." }, { status: 404 });

  const existing = await prisma.quizAnswer.findUnique({
    where: { participantId_questionId: { participantId: participant.id, questionId } },
    select: { isCorrect: true },
  });
  if (existing) return Response.json({ isCorrect: existing.isCorrect, alreadyAnswered: true });

  const isCorrect = question.correctOptionIndex === selectedOptionIndex;
  try {
    await prisma.quizAnswer.create({ data: { participantId: participant.id, questionId, selectedOptionIndex, isCorrect } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const saved = await prisma.quizAnswer.findUnique({ where: { participantId_questionId: { participantId: participant.id, questionId } }, select: { isCorrect: true } });
      return Response.json({ isCorrect: saved?.isCorrect ?? false, alreadyAnswered: true });
    }
    throw error;
  }
  return Response.json({ isCorrect, alreadyAnswered: false });
}
