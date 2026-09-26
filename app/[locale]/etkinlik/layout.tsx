import { EventBackButton } from "@/components/event-mode/event-back-button";

export default function EventModeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-6xl px-5 pt-5 sm:pt-7">
        <EventBackButton />
      </div>
      {children}
    </div>
  );
}
