import { requireEventParticipant } from "@/lib/event-participant-session";

export const dynamic = "force-dynamic";

export default async function EventParticipantLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  await requireEventParticipant(locale);
  return children;
}
