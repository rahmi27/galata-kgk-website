import { EventBackButton } from "@/components/event-mode/event-back-button";
import { getActiveEventSession } from "@/lib/event-mode";

export default async function EventModeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getActiveEventSession();

  return (
    <div className="relative">
      <div className="mx-auto max-w-6xl px-5 pt-5 sm:pt-7">
        <EventBackButton linkedEventSlug={session?.linkedEvent?.slug ?? null} />
      </div>
      {children}
    </div>
  );
}
