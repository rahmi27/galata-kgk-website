"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type EventPosterModalProps = {
  eventSession: {
    id: number;
    title: string;
    posterImageUrl: string;
    posterOrientation: "portrait" | "landscape";
  };
  locale: string;
};

const shownWithoutSessionStorage = new Set<string>();

export function EventPosterModal({ eventSession, locale }: EventPosterModalProps) {
  const [open, setOpen] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(
    eventSession.posterOrientation === "landscape" ? 1.5 : 0.8,
  );
  // v4 clears the early "shown" marker written by the original implementation
  // before the visitor had actually dismissed the poster.
  const storageKey = `galata-event-poster-v4:${eventSession.id}`;

  const dismiss = useCallback(() => {
    try {
      if (!window.sessionStorage) throw new Error("Session storage is unavailable");
      window.sessionStorage.setItem(storageKey, "shown");
    } catch {
      shownWithoutSessionStorage.add(storageKey);
    }
    setOpen(false);
  }, [storageKey]);

  useEffect(() => {
    try {
      if (!window.sessionStorage) throw new Error("Session storage is unavailable");
      if (window.sessionStorage.getItem(storageKey)) return;
    } catch {
      if (shownWithoutSessionStorage.has(storageKey)) return;
    }
    // Do not cancel this zero-delay reveal during React Strict Mode's
    // development-only effect replay; cancelling the first timer can leave the
    // poster permanently hidden even though the component remains mounted.
    window.setTimeout(() => {
      setOpen(true);
    }, 0);
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dismiss, open]);

  if (!open) return null;
  const en = locale === "en";
  const widePoster = imageAspectRatio >= 1;
  const maxWidth = widePoster ? "90rem" : "42rem";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={eventSession.title}
      className="event-poster-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-0 backdrop-blur-md sm:p-3"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div
        className="event-poster-card relative my-auto max-h-dvh max-w-full overflow-y-auto rounded-[2px] p-[2px] sm:max-h-[calc(100dvh-1.5rem)]"
        style={{ width: `min(100vw, ${maxWidth}, ${84 * imageAspectRatio}dvh)` }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={en ? "Close poster" : "Afişi kapat"}
          className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-[2px] bg-black/65 text-white shadow-sm ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 sm:right-4 sm:top-4"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="bg-primary-950">
          <div className="relative w-full overflow-hidden bg-primary-950" style={{ aspectRatio: imageAspectRatio }}>
            <Image
              src={eventSession.posterImageUrl}
              alt={`${eventSession.title} ${en ? "event poster" : "etkinlik afişi"}`}
              fill
              priority
              sizes={widePoster ? "(max-width: 640px) 100vw, 90rem" : "(max-width: 640px) 100vw, 42rem"}
              className="object-contain"
              onLoad={(event) => {
                const image = event.currentTarget;
                if (image.naturalWidth && image.naturalHeight) {
                  setImageAspectRatio(image.naturalWidth / image.naturalHeight);
                }
              }}
            />
          </div>

          <div className="event-poster-footer flex flex-col gap-2 border-t border-white/15 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4">
            <p className="text-[13px] font-medium leading-5 text-white sm:text-base">
              {en
                ? "Quizzes, raffles and more await."
                : "Quiz, çekiliş ve sürprizler bir arada."}
            </p>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="event-poster-join h-12 w-full shrink-0 rounded-[2px] px-7 text-sm font-bold hover:scale-[1.03] hover:brightness-110 sm:w-auto sm:text-base"
            >
              <Link href="/etkinlik" locale={locale} onClick={dismiss}>
                {en ? "Join the Event" : "Etkinliğe Katıl"}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
