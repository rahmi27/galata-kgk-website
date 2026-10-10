"use client";

import { useEffect, useState } from "react";
import { OFFICIAL_PRIVACY_NOTICE_URL } from "@/lib/privacy";
import { classYears } from "@/lib/join-validation";

export type Social = { platform: string; label: string; url: string };
export const inputStyle = "mt-2 w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent-600 dark:border-white/20";

export function ApplicantFields({ departments, initial = {} }: { departments: string[]; initial?: Record<string, string> }) {
  return <div className="grid gap-5 sm:grid-cols-2">
    <label className="text-sm font-semibold">Ad soyad<input name="fullName" defaultValue={initial.fullName} autoComplete="name" required minLength={3} maxLength={120} className={inputStyle} /></label>
    <label className="text-sm font-semibold">Telefon<input name="phone" defaultValue={initial.phone} type="tel" autoComplete="tel" inputMode="tel" required placeholder="05xx xxx xx xx" className={inputStyle} /></label>
    <label className="text-sm font-semibold">E-posta<input name="email" defaultValue={initial.email} type="email" autoComplete="email" required maxLength={254} className={inputStyle} /></label>
    <label className="text-sm font-semibold">Bölüm{departments.length ? <select name="departmentName" required defaultValue={initial.departmentName || ""} className={inputStyle}><option value="" disabled>Seçiniz</option>{departments.map((name) => <option key={name} value={name}>{name}</option>)}</select> : <input name="departmentName" defaultValue={initial.departmentName} required minLength={2} maxLength={150} className={inputStyle} />}</label>
    <label className="text-sm font-semibold">Sınıf<select name="classYear" required defaultValue={initial.classYear || ""} className={inputStyle}><option value="" disabled>Seçiniz</option>{classYears.map((year) => <option key={year} value={year}>{year === "Hazırlık" ? year : `${year}. sınıf`}</option>)}</select></label>
    <label className="text-sm font-semibold">Öğrenci numarası<input name="studentNumber" defaultValue={initial.studentNumber} inputMode="numeric" pattern="[0-9]{5,15}" minLength={5} maxLength={15} required className={inputStyle} /></label>
    <div className="absolute -left-[10000px] size-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
  </div>;
}

export function ConsentField() {
  return <label className="mt-6 flex items-start gap-3 rounded-xl border border-primary/20 p-4 text-sm leading-6 dark:border-white/20"><input type="checkbox" name="consent" required className="mt-1 size-4 accent-orange-600" /><span><a href={OFFICIAL_PRIVACY_NOTICE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-accent-700 underline dark:text-accent-300">KVKK aydınlatma metnini</a> okudum ve bilgilerimin bu başvuru için işlenmesini kabul ediyorum.</span></label>;
}

function SocialCard({ social }: { social: Social }) {
  const [qr, setQr] = useState("");
  useEffect(() => { import("qrcode").then((module) => module.default.toDataURL(social.url, { width: 168, margin: 1 })).then(setQr).catch(() => setQr("")); }, [social.url]);
  return <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/15 bg-card p-4 dark:border-white/15"><div><p className="font-bold">{social.label}</p><a href={social.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex rounded-lg bg-accent px-4 py-2 font-bold text-primary-950 hover:brightness-110">Hesabı aç ↗</a></div>{qr ? <img src={qr} alt={`${social.label} QR kodu`} width={100} height={100} className="hidden rounded-md bg-white p-1 md:block" /> : null}</div>;
}

export function SocialLinks({ socials }: { socials: Social[] }) {
  if (!socials.length) return null;
  return <section className="mt-9"><h2 className="font-heading text-xl font-bold">Bizi takip et</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{socials.map((social) => <SocialCard key={social.platform} social={social} />)}</div></section>;
}
