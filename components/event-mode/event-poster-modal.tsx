"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type EventPosterModalProps = {
  eventSession: { id: number; title: string; posterImageUrl: string };
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
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismiss, open]);

  if (!open) return null;
  const en = locale === "en";

  return <div role="dialog" aria-modal="true" aria-label={eventSession.title} className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-950/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
    <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/15 bg-primary-950 p-3 shadow-2xl">
      <button type="button" onClick={dismiss} aria-label={en ? "Close poster" : "Afişi kapat"} className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center rounded-full bg-black/65 text-white transition-transform hover:scale-105"><X /></button>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-primary-900"><Image src={eventSession.posterImageUrl} alt={`${eventSession.title} ${en ? "event poster" : "etkinlik afişi"}`} fill priority sizes="(max-width: 640px) 94vw, 560px" className="object-contain" /></div>
      <Button asChild size="lg" className="mt-3 w-full"><Link href="/etkinlik" locale={locale} onClick={dismiss}>{en ? "Join the Event ✨" : "Etkinliğe Katıl ✨"}</Link></Button>
    </div>
  </div>;
}
