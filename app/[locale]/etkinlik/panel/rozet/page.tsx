import { BadgeDownload } from "@/components/event-mode/badge-download";
import { requireEventParticipant } from "@/lib/event-participant-session";

export const dynamic = "force-dynamic";

export default async function BadgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const participant = await requireEventParticipant(locale);
  if (!participant.eventSession.badgeEnabled) return null;
  return <main className="mx-auto max-w-2xl px-5 py-14 sm:py-20"><BadgeDownload participantName={participant.fullName} eventTitle={participant.eventSession.title} locale={locale} templateUrl={participant.eventSession.badgeTemplateUrl} namePositionYPercent={participant.eventSession.namePositionYPercent} eventTitlePositionYPercent={participant.eventSession.eventTitlePositionYPercent} /></main>;
}
