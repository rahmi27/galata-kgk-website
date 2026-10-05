type ActiveLinkedSession = {
  linkedEventId: number | null;
  detailEntryButtonEnabled: boolean;
} | null;

export function shouldShowEventEntryButton(session: ActiveLinkedSession, eventId: number) {
  return session?.linkedEventId === eventId && session.detailEntryButtonEnabled;
}
