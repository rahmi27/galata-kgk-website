import { BarChart3, BadgeCheck, ClipboardCheck, Gift, MessageSquareText, Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { requireEventParticipant } from "@/lib/event-participant-session";
import { getQuizGateStatus } from "@/lib/event-mode-quiz";

export const dynamic = "force-dynamic";

export default async function EventHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const participant = await requireEventParticipant(locale);
  const en = locale === "en";
  const session = participant.eventSession;
  const quizGate = session.raffleEnabled ? await getQuizGateStatus(participant.eventSessionId, participant.id) : null;
  const cards = [
    session.quizEnabled && { title: en ? "Quiz" : "Quiz", description: en ? "Answer live questions and see your score." : "Canlı soruları yanıtla ve skorunu gör.", href: "/etkinlik/panel/quiz" as const, icon: Sparkles, locked: false },
    session.raffleEnabled && { title: quizGate?.required && !quizGate.completed ? (en ? "Complete the Quiz First 🔒" : "Önce Quiz'i Çöz 🔒") : (en ? "Raffle" : "Çekiliş"), description: quizGate?.required && !quizGate.completed ? (en ? "Finish every quiz question to unlock your raffle entry." : "Çekiliş hakkını açmak için tüm quiz sorularını tamamla.") : (en ? "Accept the rules and join the draw." : "Koşulları kabul ederek çekilişe katıl."), href: "/etkinlik/panel/cekilis" as const, icon: Gift, locked: Boolean(quizGate?.required && !quizGate.completed) },
    session.joinButtonEnabled && { title: en ? "Join the club" : "Kulübe katıl", description: en ? "Open the club membership form." : "Kulüp üyelik başvuru formunu aç.", href: "/katilim" as const, icon: ClipboardCheck, locked: false },
    session.feedbackEnabled && { title: en ? "Feedback" : "Geri bildirim", description: en ? "Rate the experience and leave a note." : "Deneyimi puanla ve yorumunu bırak.", href: "/etkinlik/panel/geri-bildirim" as const, icon: MessageSquareText, locked: false },
    session.badgeEnabled && { title: en ? "Digital badge" : "Dijital rozet", description: en ? "Create and download your event badge." : "Etkinlik rozetini oluştur ve indir.", href: "/etkinlik/panel/rozet" as const, icon: BadgeCheck, locked: false },
    session.pollEnabled && { title: en ? "Live poll" : "Canlı anket", description: en ? "Vote once and follow the results." : "Bir kez oy ver ve sonuçları takip et.", href: "/etkinlik/panel/anket" as const, icon: BarChart3, locked: false },
  ].filter(Boolean) as { title: string; description: string; href: "/etkinlik/panel/quiz" | "/etkinlik/panel/cekilis" | "/katilim" | "/etkinlik/panel/geri-bildirim" | "/etkinlik/panel/rozet" | "/etkinlik/panel/anket"; icon: typeof Sparkles; locked: boolean }[];

  return <main className="mx-auto max-w-6xl px-5 py-14 sm:py-20"><header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{session.title}</p><h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">{en ? `Hello ${participant.fullName}, welcome!` : `Merhaba ${participant.fullName}, hoş geldin!`}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{en ? "Choose one of the live experiences currently enabled by the event team." : "Etkinlik ekibinin şu anda açtığı deneyimlerden birini seç."}</p></header>
    <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cards.map((card) => { const Icon = card.icon; const content = <><span className={`flex size-12 items-center justify-center rounded-2xl text-white ${card.locked ? "bg-muted-foreground" : "bg-primary"}`}><Icon className="size-6" /></span><h2 className="mt-5 font-heading text-xl font-bold">{card.title}</h2><p className="mt-2 leading-6 text-muted-foreground">{card.description}</p></>; return card.locked ? <div key={card.href} aria-disabled="true" className="card-gradient-edge cursor-not-allowed rounded-[1.75rem] border border-primary-100 bg-card p-6 opacity-70 dark:border-white/10">{content}</div> : <Link key={card.href} href={card.href} locale={locale} className="card-gradient-edge group rounded-[1.75rem] border border-primary-100 bg-card p-6 shadow-[0_20px_55px_-42px_rgba(27,42,94,.7)] transition-transform hover:-translate-y-1 dark:border-white/10">{content}</Link>; })}</section>
    {!cards.length ? <p className="mt-10 rounded-3xl border border-dashed border-primary-200 p-10 text-center text-muted-foreground">{en ? "No live modules are enabled yet. Please check again shortly." : "Henüz açık bir modül yok. Biraz sonra tekrar kontrol edebilirsin."}</p> : null}
  </main>;
}
