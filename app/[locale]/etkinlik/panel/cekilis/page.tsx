import { CheckCircle2, Gift, ShieldCheck } from "lucide-react";

import { joinRaffleAction } from "@/app/[locale]/etkinlik/panel/cekilis/actions";
import { Button } from "@/components/ui/button";
import { requireEventParticipant } from "@/lib/event-participant-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RafflePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ durum?: string }> }) {
  const [{ locale }, { durum }] = await Promise.all([params, searchParams]);
  const participant = await requireEventParticipant(locale);
  const en = locale === "en";
  if (!participant.eventSession.raffleEnabled) return <main className="mx-auto max-w-2xl px-5 py-20 text-center"><h1 className="font-heading text-3xl font-bold">{en ? "The raffle is currently closed" : "Çekiliş şu anda kapalı"}</h1></main>;
  const entry = await prisma.raffleEntry.findUnique({ where: { eventSessionId_participantId: { eventSessionId: participant.eventSessionId, participantId: participant.id } } });
  return <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-16"><div className="w-full rounded-[2rem] border border-primary-100 bg-card p-8 shadow-xl sm:p-10 dark:border-white/10">{entry ? <div className="text-center"><CheckCircle2 className="mx-auto size-14 text-emerald-600" /><h1 className="mt-5 font-heading text-3xl font-bold">{en ? "You are in the raffle!" : "Çekilişe katıldın!"}</h1><p className="mt-4 leading-7 text-muted-foreground">{en ? "Your entry is recorded. Keep an eye on the stage screen for the result." : "Katılımın kaydedildi. Sonuç için sahne ekranını takip et."}</p></div> : <><Gift className="size-12 text-accent" /><h1 className="mt-5 font-heading text-3xl font-bold">{en ? "Join the raffle" : "Çekilişe katıl"}</h1><p className="mt-4 leading-7 text-muted-foreground">{en ? "One entry is allowed per participant. Winners are selected randomly from eligible entries. Club rules apply." : "Her katılımcı yalnızca bir kez katılabilir. Kazananlar uygun katılımlar arasından rastgele seçilir. Kulüp kuralları geçerlidir."}</p>{durum === "onay" ? <p className="mt-4 text-sm font-semibold text-red-700">{en ? "Please accept the rules." : "Lütfen koşulları kabul et."}</p> : null}<form action={joinRaffleAction} className="mt-7"><input type="hidden" name="locale" value={locale} /><label className="flex items-start gap-3 rounded-2xl border border-primary-100 p-4 text-sm leading-6 dark:border-white/10"><input type="checkbox" name="consent" required className="mt-1 size-4 accent-orange-600" /><span>{en ? "I have read and accept the raffle rules and the use of my event registration for this draw." : "Çekiliş kurallarını ve etkinlik kaydımın bu çekiliş için kullanılmasını okudum, kabul ediyorum."}</span></label><Button type="submit" size="lg" className="mt-5 w-full"><ShieldCheck />{en ? "Join raffle" : "Çekilişe katıl"}</Button></form></>}</div></main>;
}
