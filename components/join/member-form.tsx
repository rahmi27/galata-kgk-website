"use client";

import { useState, type FormEvent } from "react";
import { ApplicantFields, ConsentField, SocialLinks, inputStyle, type Social } from "@/components/join/shared";

export function MemberForm({ departments, socials }: { departments: string[]; socials: Social[] }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/join/member", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, consent: data.consent === "on" }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "İşlem tamamlanamadı.");
      setFirstName(result.firstName || String(data.fullName).split(" ")[0]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bir hata oluştu."); }
    finally { setSending(false); }
  }
  if (firstName) return <div className="rounded-3xl border border-emerald-300/40 bg-card p-8"><h1 className="font-heading text-3xl font-bold">Hoş geldin, {firstName}! 🎉</h1><p className="mt-3 text-muted-foreground">Kulüp üyeliğin kaydedildi. Artık topluluğumuzun bir parçasısın.</p><SocialLinks socials={socials} /></div>;
  return <form onSubmit={submit} className="rounded-3xl border border-primary/10 bg-card p-6 shadow-xl dark:border-white/10 sm:p-9"><h1 className="mb-7 font-heading text-3xl font-bold">Kulübe üye ol</h1><ApplicantFields departments={departments} /><label className="mt-5 block text-sm font-semibold">Neden katılmak istiyorsun? (opsiyonel)<textarea name="motivation" maxLength={500} rows={4} className={inputStyle} /></label><ConsentField />{error ? <p role="alert" className="mt-5 rounded-xl bg-red-100 p-3 font-medium text-red-900 dark:bg-red-950 dark:text-red-100">{error}</p> : null}<button type="submit" disabled={sending} className="mt-7 rounded-xl bg-accent px-7 py-3 font-bold text-primary-950 disabled:opacity-50">{sending ? "Kaydediliyor…" : "Üyeliğimi tamamla"}</button></form>;
}
