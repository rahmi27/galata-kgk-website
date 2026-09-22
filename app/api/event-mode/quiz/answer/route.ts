import { getCurrentEventParticipant } from "@/lib/event-participant-session";
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
  await prisma.quizAnswer.create({ data: { participantId: participant.id, questionId, selectedOptionIndex, isCorrect } });
  return Response.json({ isCorrect, alreadyAnswered: false });
}
