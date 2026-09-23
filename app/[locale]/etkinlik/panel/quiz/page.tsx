import { QuizRunner } from "@/components/event-mode/quiz-runner";
import { requireEventParticipant } from "@/lib/event-participant-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const participant = await requireEventParticipant(locale);
  if (!participant.eventSession.quizEnabled) return <Unavailable locale={locale} />;
  const quiz = await prisma.quiz.findFirst({ where: { eventSessionId: participant.eventSessionId, isActive: true }, include: { questions: { orderBy: { order: "asc" }, include: { answers: { where: { participantId: participant.id }, select: { isCorrect: true } } } } } });
  if (!quiz) return <Unavailable locale={locale} />;
  const answered = quiz.questions.filter((question) => question.answers.length);
  const questions = quiz.questions.filter((question) => !question.answers.length).map((question) => ({ id: question.id, questionText: question.questionText, options: Array.isArray(question.options) ? question.options.map(String) : [], order: question.order }));
  return <main className="mx-auto max-w-3xl px-5 py-14 sm:py-20"><p className="mb-4 text-center font-heading text-lg font-bold text-accent">{quiz.title}</p><QuizRunner questions={questions} initialScore={answered.filter((question) => question.answers[0]?.isCorrect).length} initialAnswered={answered.length} totalQuestions={quiz.questions.length} locale={locale} raffleEnabled={participant.eventSession.raffleEnabled} /></main>;
}

function Unavailable({ locale }: { locale: string }) { return <main className="mx-auto max-w-2xl px-5 py-20 text-center"><h1 className="font-heading text-3xl font-bold">{locale === "en" ? "The quiz is not open yet" : "Quiz henüz açık değil"}</h1></main>; }
