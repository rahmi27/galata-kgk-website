import type { Metadata } from "next";
import { CalendarDays, ShieldCheck, Sparkles } from "lucide-react";

import { joinEventModeAction } from "@/app/[locale]/etkinlik/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { getCurrentEventParticipant } from "@/lib/event-participant-session";
import { getActiveEventSession } from "@/lib/event-mode";
import { createPageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: locale === "en" ? "Live Event | Galata KGK" : "Etkinlik Modu | Galata KGK", description: locale === "en" ? "Join the live Galata KGK event experience." : "Galata KGK canlı etkinlik deneyimine katılın.", path: "/etkinlik", locale });
}

export default async function EventModeJoinPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ durum?: string }> }) {
  const [{ locale }, { durum }, active, participant] = await Promise.all([params, searchParams, getActiveEventSession(), getCurrentEventParticipant()]);
  const en = locale === "en";
  if (!active) return <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-20"><div className="w-full rounded-[2rem] border border-primary-100 bg-card p-8 text-center shadow-xl sm:p-12 dark:border-white/10"><CalendarDays className="mx-auto size-12 text-accent" /><h1 className="mt-5 font-heading text-3xl font-bold">{en ? "There is no live event right now" : "Şu an aktif bir etkinlik yok"}</h1><p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">{en ? "You can explore our event calendar and join us at the next gathering." : "Etkinlik takvimimize göz atabilir, bir sonraki buluşmamızda bize katılabilirsin."}</p><Button asChild className="mt-7"><Link href="/etkinliklerimiz" locale={locale}>{en ? "View events" : "Etkinlikleri gör"}</Link></Button></div></main>;
  if (participant?.eventSessionId === active.id) return <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-20"><div className="w-full rounded-[2rem] border border-primary-100 bg-card p-10 text-center dark:border-white/10"><Sparkles className="mx-auto size-11 text-accent" /><h1 className="mt-5 font-heading text-3xl font-bold">{en ? `Welcome back, ${participant.fullName}!` : `Tekrar hoş geldin, ${participant.fullName}!`}</h1><Button asChild className="mt-7"><Link href="/etkinlik/panel" locale={locale}>{en ? "Open event hub" : "Etkinlik panelini aç"}</Link></Button></div></main>;

  return <main className="mx-auto max-w-3xl px-5 py-14 sm:py-20"><div className="rounded-[2rem] border border-primary-100 bg-card p-7 shadow-[0_28px_80px_-44px_rgba(27,42,94,.6)] sm:p-10 dark:border-white/10"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{en ? "Live experience" : "Canlı deneyim"}</p><h1 className="mt-3 font-heading text-4xl font-bold tracking-tight">{active.title}</h1><p className="mt-4 leading-7 text-muted-foreground">{en ? "Enter your details once to access the live quiz, raffle, poll and other enabled experiences." : "Açık olan quiz, çekiliş, anket ve diğer deneyimlere ulaşmak için bilgilerini bir kez gir."}</p>
    {durum === "gecersiz" ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{en ? "Please complete all fields and accept the notice." : "Tüm alanları doğru doldur ve onay kutusunu işaretle."}</p> : null}
    <form action={joinEventModeAction} className="mt-8 space-y-5"><input type="hidden" name="locale" value={locale} /><label className="block text-sm font-semibold">{en ? "Full name" : "Ad soyad"}<Input name="fullName" autoComplete="name" minLength={3} maxLength={120} required className="mt-2 h-11" /></label><label className="block text-sm font-semibold">{en ? "Email" : "E-posta"}<Input name="email" type="email" autoComplete="email" maxLength={254} required className="mt-2 h-11" /></label><label className="block text-sm font-semibold">{en ? "Department" : "Bölüm"}<Input name="department" autoComplete="organization-title" minLength={2} maxLength={160} required className="mt-2 h-11" /></label><label className="flex items-start gap-3 rounded-2xl border border-primary-100 p-4 text-sm leading-6 dark:border-white/10"><input type="checkbox" name="consent" required className="mt-1 size-4 accent-orange-600" /><span>{en ? "I understand that my details will be used and stored only within the scope of this event." : "Bilgilerimin yalnızca bu etkinlik kapsamında kullanılacağını ve saklanacağını kabul ediyorum."}</span></label><Button type="submit" size="lg" className="w-full"><ShieldCheck />{en ? "Join event" : "Etkinliğe giriş yap"}</Button></form>
  </div></main>;
}
