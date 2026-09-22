import { StageDashboard } from "@/components/event-mode/stage-dashboard";

export const dynamic = "force-dynamic";

export default async function EventStagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <StageDashboard locale={locale} />;
}
