"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

function getFallbackPath(pathname: string) {
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
    return en ? "/en/event" : "/etkinlik";
  }

  return en ? "/en" : "/";
}

export function EventBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const en = pathname === "/en" || pathname.startsWith("/en/");

  if (pathname === "/etkinlik/ekran" || pathname === "/en/event/screen") {
    return null;
  }

  function goBack() {
    const fallbackPath = getFallbackPath(pathname);
    let previousPath = "";

    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (referrer?.origin === window.location.origin) {
        previousPath = referrer.pathname;
      }
    } catch {
      previousPath = "";
    }

    const previousIsInEventFlow =
      previousPath.startsWith("/etkinlik") ||
      previousPath.startsWith("/en/event");

    if (previousIsInEventFlow && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackPath);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={goBack}
      className="rounded-full border-primary-200 bg-background/85 shadow-sm backdrop-blur dark:border-white/15"
    >
      <ArrowLeft aria-hidden="true" />
      {en ? "Back" : "Geri"}
    </Button>
  );
}
