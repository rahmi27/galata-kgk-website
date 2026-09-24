import { LiveLeaderboard } from "@/components/event-mode/live-leaderboard";
import { requireEventParticipant } from "@/lib/event-participant-session";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const participant = await requireEventParticipant(locale);
  if (!participant.eventSession.quizEnabled) return null;
  return <main className="mx-auto max-w-3xl px-5 py-14 sm:py-20"><header className="mb-8 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent-700 dark:text-accent-300">{participant.eventSession.title}</p><h1 className="mt-3 font-heading text-4xl font-bold">{locale === "en" ? "Live leaderboard" : "Canlı skor tablosu"}</h1><p className="mt-3 text-muted-foreground">{locale === "en" ? "Refreshes automatically. Only privacy-safe display names are shown." : "Otomatik yenilenir. Yalnızca gizliliği koruyan görünen adlar gösterilir."}</p></header><LiveLeaderboard /></main>;
}
