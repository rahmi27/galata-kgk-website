"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function getEventBackPath(pathname: string, linkedEventSlug: string | null) {
  const en = pathname === "/en" || pathname.startsWith("/en/");

  if (
    pathname === "/etkinlik/panel/quiz/tablo" ||
    pathname === "/en/event/hub/quiz/leaderboard"
  ) {
    return en ? "/en/event/hub/quiz" : "/etkinlik/panel/quiz";
  }

  if (
    pathname.startsWith("/etkinlik/panel/") ||
    pathname.startsWith("/en/event/hub/")
  ) {
    return en ? "/en/event/hub" : "/etkinlik/panel";
  }

  if (pathname === "/etkinlik/panel" || pathname === "/en/event/hub") {
    if (linkedEventSlug) {
      return en ? `/en/events/${linkedEventSlug}` : `/etkinliklerimiz/${linkedEventSlug}`;
    }
    return en ? "/en/events" : "/etkinliklerimiz";
  }

  return en ? "/en" : "/";
}

export function EventBackButton({ linkedEventSlug }: { linkedEventSlug: string | null }) {
  const pathname = usePathname();
  const en = pathname === "/en" || pathname.startsWith("/en/");

  if (pathname === "/etkinlik/ekran" || pathname === "/en/event/screen") {
    return null;
  }

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="rounded-full border-primary-200 bg-background/85 shadow-sm backdrop-blur dark:border-white/15"
    >
      <Link href={getEventBackPath(pathname, linkedEventSlug)}>
        <ArrowLeft aria-hidden="true" />
        {en ? "Back" : "Geri"}
      </Link>
    </Button>
  );
}
