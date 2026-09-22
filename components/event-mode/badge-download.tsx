"use client";

import { Download } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character] ?? character);
}

export function BadgeDownload({ participantName, eventTitle, locale }: { participantName: string; eventTitle: string; locale: string }) {
  async function download() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111c46"/><stop offset="1" stop-color="#e85d2c"/></linearGradient></defs><rect width="1200" height="1200" rx="90" fill="url(#g)"/><circle cx="1020" cy="170" r="220" fill="#fff" opacity=".08"/><path d="M110 900 L350 600 L520 775 L720 470 L1090 900 Z" fill="#fff" opacity=".08"/><text x="90" y="150" fill="#ffb59a" font-family="Arial" font-size="42" font-weight="700" letter-spacing="5">GALATA KGK</text><text x="90" y="530" fill="white" font-family="Arial" font-size="42">${locale === "en" ? "EVENT BADGE" : "ETKİNLİK ROZETİ"}</text><text x="90" y="630" fill="white" font-family="Arial" font-size="68" font-weight="700">${escapeXml(participantName)}</text><text x="90" y="710" fill="#ffd8ca" font-family="Arial" font-size="40">${escapeXml(eventTitle)}</text><text x="90" y="1080" fill="white" opacity=".76" font-family="Arial" font-size="32">galatakariyervegirisimcilik.com</text></svg>`;
    const image = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 1200; const context = canvas.getContext("2d"); if (!context) return; context.drawImage(image, 0, 0); URL.revokeObjectURL(url); canvas.toBlob((png) => { if (!png) return; const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(png); anchor.download = "galata-kgk-etkinlik-rozeti.png"; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1000); }, "image/png"); };
    image.src = url;
  }
  return <div><div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-950 via-primary to-accent p-8 text-white shadow-2xl sm:p-12"><div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" /><BrandLogo className="size-16 ring-white/20" /><p className="mt-16 text-sm font-bold uppercase tracking-[.2em] text-accent-200">{locale === "en" ? "Event badge" : "Etkinlik rozeti"}</p><h1 className="mt-4 font-heading text-3xl font-bold sm:text-5xl">{participantName}</h1><p className="mt-4 text-lg text-white/80">{eventTitle}</p><p className="absolute bottom-8 left-8 text-xs text-white/60 sm:bottom-12 sm:left-12">galatakariyervegirisimcilik.com</p></div><Button type="button" onClick={download} size="lg" className="mt-6 w-full"><Download />{locale === "en" ? "Download image" : "Görseli indir"}</Button></div>;
}
