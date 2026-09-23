"use client";

import { useEffect, useState } from "react";
import { BarChart3, CircleGauge, Gift, MessageSquareText, Sparkles, UsersRound } from "lucide-react";

type Stats = { participants: number; quizCompleted: number; quizInProgress: number; raffleEntries: number; feedbackParticipants: number; pollVoters: number };
type Snapshot = { title: string; stats: Stats } | null;

const cards = [
  ["participants", "Toplam katılımcı", UsersRound],
  ["quizCompleted", "Quiz'i tamamlayan", Sparkles],
  ["quizInProgress", "Şu an quiz çözen", CircleGauge],
  ["raffleEntries", "Çekilişe katılan", Gift],
  ["feedbackParticipants", "Geri bildirim", MessageSquareText],
  ["pollVoters", "Anket oyu", BarChart3],
] as const;

export function EventModeLiveStats() {
  const [snapshot, setSnapshot] = useState<Snapshot>(null);

  useEffect(() => {
    let active = true;
    async function refresh() {
      const response = await fetch("/api/admin/event-mode/stats", { cache: "no-store" });
      if (response.ok && active) setSnapshot(((await response.json()) as { session: Snapshot }).session);
    }
    void refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  return <section className="mt-8 rounded-3xl border border-primary-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-primary-950">
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">5 saniyede bir yenilenir</p><h2 className="mt-2 font-heading text-2xl font-bold">Canlı etkinlik özeti</h2><p className="mt-1 text-sm text-primary-500">{snapshot?.title ?? "Aktif oturum bulunmuyor"}</p></div>
    {snapshot ? <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{cards.map(([key, label, Icon]) => <div key={key} className="rounded-2xl border border-primary-100 p-4 dark:border-white/10"><Icon className="size-5 text-accent" /><p className="mt-3 font-heading text-3xl font-bold">{snapshot.stats[key]}</p><p className="mt-1 text-xs font-semibold text-primary-500">{label}</p></div>)}</div> : <p className="mt-5 rounded-2xl border border-dashed p-6 text-center text-sm text-primary-500">Sayaçlar, bir oturum aktif olduğunda otomatik başlayacak.</p>}
  </section>;
}
