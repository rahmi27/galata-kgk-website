"use client";

import { useEffect, useState } from "react";
type Entry = { name: string; score: number };
const medals = ["🥇", "🥈", "🥉"];

export function LiveLeaderboard({ large = false, refreshMs = 4000 }: { large?: boolean; refreshMs?: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(() => { let active = true; async function refresh() { const response = await fetch("/api/event-mode/leaderboard", { cache: "no-store" }); if (response.ok && active) setEntries(((await response.json()) as { leaderboard: Entry[] }).leaderboard); } void refresh(); const timer = window.setInterval(refresh, refreshMs); return () => { active = false; window.clearInterval(timer); }; }, [refreshMs]);
  return <div className="space-y-3">{entries.map((entry, index) => <div key={`${entry.name}-${index}`} className={`flex items-center gap-4 rounded-2xl border border-primary-100 bg-card ${large ? "px-6 py-5 text-xl" : "px-4 py-3"} dark:border-white/10`}><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">{medals[index] ?? index + 1}</span><span className="min-w-0 flex-1 truncate font-semibold">{entry.name}</span><span className="font-heading font-bold text-accent-700 dark:text-accent-300">{entry.score}</span></div>)}{!entries.length ? <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">Henüz skor yok.</p> : null}</div>;
}
