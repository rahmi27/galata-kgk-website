"use client";

import { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Download, PartyPopper, Share2 } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

type BadgeDownloadProps = {
  participantName: string;
  eventTitle: string;
  locale: string;
  templateUrl: string | null;
  namePositionYPercent: number;
  eventTitlePositionYPercent: number;
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Badge artwork could not be loaded"));
    image.src = source;
  });
}

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

async function createBadgeBlob({ participantName, eventTitle, locale, templateUrl, namePositionYPercent, eventTitlePositionYPercent }: BadgeDownloadProps) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");

  if (templateUrl) {
    drawCover(context, await loadImage(templateUrl), canvas.width, canvas.height);
  } else {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#111c46");
    gradient.addColorStop(0.62, "#1b2a5e");
    gradient.addColorStop(1, "#e85d2c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(255,255,255,.08)";
    context.beginPath();
    context.arc(910, 170, 230, 0, Math.PI * 2);
    context.fill();
    context.font = "700 38px Arial";
    context.fillStyle = "#ffb59a";
    context.textAlign = "left";
    context.fillText("GALATA KGK", 80, 120);
    context.font = "600 34px Arial";
    context.fillStyle = "#ffffff";
    context.fillText(locale === "en" ? "EVENT BADGE" : "ETKİNLİK ROZETİ", 80, 560);
    context.font = "400 28px Arial";
    context.fillStyle = "rgba(255,255,255,.72)";
    context.fillText("galatakariyervegirisimcilik.com", 80, 1260);
  }

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineJoin = "round";
  context.strokeStyle = "rgba(7,12,32,.68)";
  context.fillStyle = "#ffffff";
  context.lineWidth = 10;
  context.font = "700 66px Arial";
  context.strokeText(participantName, canvas.width / 2, canvas.height * namePositionYPercent / 100, 940);
  context.fillText(participantName, canvas.width / 2, canvas.height * namePositionYPercent / 100, 940);
  context.lineWidth = 7;
  context.font = "600 40px Arial";
  context.strokeText(eventTitle, canvas.width / 2, canvas.height * eventTitlePositionYPercent / 100, 940);
  context.fillText(eventTitle, canvas.width / 2, canvas.height * eventTitlePositionYPercent / 100, 940);

  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Badge could not be generated")), "image/png"));
}

function downloadBlob(blob: Blob) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "galata-kgk-etkinlik-rozeti.png";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export function BadgeDownload(props: BadgeDownloadProps) {
  const { participantName, eventTitle, locale, templateUrl, namePositionYPercent, eventTitlePositionYPercent } = props;
  const [badgeBlob, setBadgeBlob] = useState<Blob | null>(null);
  const [pending, setPending] = useState(false);
  const en = locale === "en";

  async function generate() {
    setPending(true);
    try {
      const blob = await createBadgeBlob(props);
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
    <header className="mb-7 text-center"><p className="text-sm font-bold uppercase tracking-[.2em] text-accent">{en ? "A memory worth sharing" : "Paylaşmaya değer bir anı"}</p><h1 className="mt-3 font-heading text-4xl font-bold">{en ? "Claim Your Badge! 🎉" : "Rozetini Kap! 🎉"}</h1><p className="mt-3 leading-7 text-muted-foreground">{en ? `Show everyone you were part of ${eventTitle}—share it in your story!` : `${eventTitle}'na katıldığını göster, story'nde paylaş!`}</p></header>
    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-950 via-primary to-accent text-white shadow-2xl">
      {templateUrl ? <Image src={templateUrl} alt="" fill unoptimized sizes="(max-width: 672px) 94vw, 640px" className="object-cover" /> : <><div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" /><div className="absolute left-8 top-8 sm:left-12 sm:top-12"><BrandLogo className="size-16 ring-white/20" /></div><p className="absolute left-8 top-[40%] text-sm font-bold uppercase tracking-[.2em] text-accent-200 sm:left-12">{en ? "Event badge" : "Etkinlik rozeti"}</p><p className="absolute bottom-8 left-8 text-xs text-white/60 sm:bottom-12 sm:left-12">galatakariyervegirisimcilik.com</p></>}
      <p className="absolute left-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 text-center font-heading text-3xl font-bold [text-shadow:0_2px_12px_rgba(7,12,32,.9)] sm:text-5xl" style={{ top: `${namePositionYPercent}%` }}>{participantName}</p>
      <p className="absolute left-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold [text-shadow:0_2px_10px_rgba(7,12,32,.9)] sm:text-2xl" style={{ top: `${eventTitlePositionYPercent}%` }}>{eventTitle}</p>
    </div>
    {!badgeBlob ? <Button type="button" onClick={generate} disabled={pending} size="lg" className="mt-6 w-full"><PartyPopper />{pending ? (en ? "Creating your badge..." : "Rozetin hazırlanıyor...") : (en ? "Create My Digital Badge" : "Dijital Rozetimi Oluştur")}</Button> : <div className="mt-6 grid gap-3 sm:grid-cols-2"><Button type="button" onClick={share} size="lg"><Share2 />{en ? "Share on Instagram 📸" : "Instagram'da Paylaş 📸"}</Button><Button type="button" onClick={() => downloadBlob(badgeBlob)} size="lg" variant="outline"><Download />{en ? "Download" : "İndir"}</Button></div>}
  </div>;
}
