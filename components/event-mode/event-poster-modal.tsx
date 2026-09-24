"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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
  const landscape = eventSession.posterOrientation === "landscape";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={eventSession.title}
      className="event-poster-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div
        className={`event-poster-card relative my-auto max-h-[calc(100dvh-1.5rem)] w-[min(92vw,76rem)] overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_32px_110px_-30px_rgba(0,0,0,.82)] dark:bg-primary-950 sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2rem] ${landscape ? "max-w-6xl" : "max-w-2xl"}`}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={en ? "Close poster" : "Afişi kapat"}
          className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-black/45 text-white shadow-sm ring-1 ring-white/25 backdrop-blur transition-[transform,background-color] hover:scale-105 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 sm:right-4 sm:top-4"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className={landscape ? "lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,.75fr)]" : ""}>
          <div className={`relative overflow-hidden bg-primary-950 ${landscape ? "h-[min(56dvh,36rem)] lg:h-[min(76dvh,46rem)]" : "h-[min(68dvh,48rem)]"}`}>
            <Image
              src={eventSession.posterImageUrl}
              alt={`${eventSession.title} ${en ? "event poster" : "etkinlik afişi"}`}
              fill
              priority
              sizes={landscape ? "(max-width: 1023px) 92vw, 65vw" : "(max-width: 640px) 92vw, 672px"}
              className="object-contain"
            />
          </div>

          <div className={`flex flex-col justify-center border-primary-100 p-5 dark:border-white/10 sm:p-7 ${landscape ? "border-t lg:border-l lg:border-t-0 lg:p-8" : "border-t"}`}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
              {en ? "Live at Galata KGK" : "Galata KGK'de canlı"}
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary-950 dark:text-white sm:text-3xl">
              {eventSession.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-primary-600 dark:text-primary-200">
              {en
                ? "Step into the live experience and explore everything prepared for the event."
                : "Canlı deneyime katıl, etkinlik için hazırlanan tüm içerikleri keşfet."}
            </p>
            <Button asChild size="lg" className="mt-5 w-full rounded-xl">
              <Link href="/etkinlik" locale={locale} onClick={dismiss}>
                {en ? "Join the Event" : "Etkinliğe Katıl"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
