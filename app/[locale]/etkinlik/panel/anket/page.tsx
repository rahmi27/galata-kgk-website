import { PollWidget } from "@/components/event-mode/poll-widget";
import { requireEventParticipant } from "@/lib/event-participant-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PollPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const participant = await requireEventParticipant(locale);
  if (!participant.eventSession.pollEnabled) return null;
  const poll = await prisma.poll.findFirst({ where: { eventSessionId: participant.eventSessionId, isActive: true }, include: { options: { orderBy: { order: "asc" }, include: { _count: { select: { votes: true } } } }, votes: { where: { participantId: participant.id }, select: { id: true } }, _count: { select: { votes: true } } } });
  if (!poll) return <main className="mx-auto max-w-2xl px-5 py-20 text-center"><h1 className="font-heading text-3xl font-bold">{locale === "en" ? "No active poll" : "Aktif anket yok"}</h1></main>;
  const total = poll._count.votes;
  const initialPoll = { id: poll.id, question: poll.question, total, options: poll.options.map((option) => ({ id: option.id, text: option.text, votes: option._count.votes, percent: total ? Math.round(option._count.votes / total * 100) : 0 })) };
  return <main className="mx-auto max-w-2xl px-5 py-14 sm:py-20"><PollWidget initialPoll={initialPoll} hasVoted={poll.votes.length > 0} locale={locale} /></main>;
}
