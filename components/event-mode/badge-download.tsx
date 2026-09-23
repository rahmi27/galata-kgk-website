"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Download, PartyPopper, Share2 } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character] ?? character);
}

function createBadgeBlob(participantName: string, eventTitle: string, locale: string) {
  return new Promise<Blob>((resolve, reject) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111c46"/><stop offset="1" stop-color="#e85d2c"/></linearGradient></defs><rect width="1200" height="1200" rx="90" fill="url(#g)"/><circle cx="1020" cy="170" r="220" fill="#fff" opacity=".08"/><path d="M110 900 L350 600 L520 775 L720 470 L1090 900 Z" fill="#fff" opacity=".08"/><text x="90" y="150" fill="#ffb59a" font-family="Arial" font-size="42" font-weight="700" letter-spacing="5">GALATA KGK</text><text x="90" y="530" fill="white" font-family="Arial" font-size="42">${locale === "en" ? "EVENT BADGE" : "ETKİNLİK ROZETİ"}</text><text x="90" y="630" fill="white" font-family="Arial" font-size="68" font-weight="700">${escapeXml(participantName)}</text><text x="90" y="710" fill="#ffd8ca" font-family="Arial" font-size="40">${escapeXml(eventTitle)}</text><text x="90" y="1080" fill="white" opacity=".76" font-family="Arial" font-size="32">galatakariyervegirisimcilik.com</text></svg>`;
    const image = new Image();
    const source = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1200;
      const context = canvas.getContext("2d");
      URL.revokeObjectURL(source);
      if (!context) return reject(new Error("Canvas is not available"));
      context.drawImage(image, 0, 0);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Badge could not be generated")), "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("Badge artwork could not be loaded"));
    };
    image.src = source;
  });
}

function downloadBlob(blob: Blob) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "galata-kgk-etkinlik-rozeti.png";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export function BadgeDownload({ participantName, eventTitle, locale }: { participantName: string; eventTitle: string; locale: string }) {
  const [badgeBlob, setBadgeBlob] = useState<Blob | null>(null);
  const [pending, setPending] = useState(false);
  const en = locale === "en";

  async function generate() {
    setPending(true);
    try {
      const blob = await createBadgeBlob(participantName, eventTitle, locale);
      setBadgeBlob(blob);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        void confetti({ particleCount: 48, spread: 58, startVelocity: 24, scalar: 0.72, origin: { y: 0.72 }, colors: ["#111c46", "#e85d2c", "#ffd8ca"] });
      }
    } finally {
      setPending(false);
    }
  }

  async function share() {
    if (!badgeBlob) return;
    const file = new File([badgeBlob], "galata-kgk-etkinlik-rozeti.png", { type: "image/png" });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({ title: eventTitle, text: en ? `I joined ${eventTitle}!` : `${eventTitle} etkinliğine katıldım!`, files: [file] });
      return;
    }
    downloadBlob(badgeBlob);
  }

  return <div>
    <header className="mb-7 text-center">
      <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">{en ? "A memory worth sharing" : "Paylaşmaya değer bir anı"}</p>
      <h1 className="mt-3 font-heading text-4xl font-bold">{en ? "Claim Your Badge! 🎉" : "Rozetini Kap! 🎉"}</h1>
      <p className="mt-3 leading-7 text-muted-foreground">{en ? `Show everyone you were part of ${eventTitle}—share it in your story!` : `${eventTitle}'na katıldığını göster, story'nde paylaş!`}</p>
    </header>
    <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-950 via-primary to-accent p-8 text-white shadow-2xl sm:p-12"><div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" /><BrandLogo className="size-16 ring-white/20" /><p className="mt-16 text-sm font-bold uppercase tracking-[.2em] text-accent-200">{en ? "Event badge" : "Etkinlik rozeti"}</p><h2 className="mt-4 font-heading text-3xl font-bold sm:text-5xl">{participantName}</h2><p className="mt-4 text-lg text-white/80">{eventTitle}</p><p className="absolute bottom-8 left-8 text-xs text-white/60 sm:bottom-12 sm:left-12">galatakariyervegirisimcilik.com</p></div>
    {!badgeBlob ? <Button type="button" onClick={generate} disabled={pending} size="lg" className="mt-6 w-full"><PartyPopper />{pending ? (en ? "Creating your badge..." : "Rozetin hazırlanıyor...") : (en ? "Create My Digital Badge" : "Dijital Rozetimi Oluştur")}</Button> : <div className="mt-6 grid gap-3 sm:grid-cols-2"><Button type="button" onClick={share} size="lg"><Share2 />{en ? "Share on Instagram 📸" : "Instagram'da Paylaş 📸"}</Button><Button type="button" onClick={() => downloadBlob(badgeBlob)} size="lg" variant="outline"><Download />{en ? "Download" : "İndir"}</Button></div>}
  </div>;
}
