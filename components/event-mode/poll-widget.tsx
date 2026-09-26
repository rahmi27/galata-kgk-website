"use client";

import { useEffect, useState } from "react";
import { BarChart3, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Poll = { id: number; question: string; total: number; options: { id: number; text: string; votes: number; percent: number }[] };

export function PollWidget({ initialPoll, hasVoted, locale }: { initialPoll: Poll; hasVoted: boolean; locale: string }) {
  const [poll, setPoll] = useState(initialPoll);
  const [voted, setVoted] = useState(hasVoted);
  const [selected, setSelected] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const en = locale === "en";
  async function refresh() { const response = await fetch("/api/event-mode/poll", { cache: "no-store" }); if (response.ok) { const data = await response.json() as { poll: Poll | null }; if (data.poll) setPoll(data.poll); } }
  useEffect(() => { if (!voted) return; const timer = window.setInterval(refresh, 4000); return () => window.clearInterval(timer); }, [voted]);
  async function vote() { if (!selected) return; setPending(true); const response = await fetch("/api/event-mode/poll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pollOptionId: selected }) }); setPending(false); if (response.ok) { setVoted(true); await refresh(); } }
  return <div className="rounded-[2rem] border border-primary-100 bg-card p-8 sm:p-10 dark:border-white/10"><BarChart3 className="size-11 text-accent-700 dark:text-accent-300" /><p className="mt-5 inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-primary-700 dark:bg-white/10 dark:text-primary-100">{en ? "📊 Live Poll" : "📊 Anlık Anket"}</p><h1 className="mt-4 font-heading text-3xl font-bold">{poll.question}</h1>{!voted ? <div className="mt-7 space-y-3">{poll.options.map((option) => <label key={option.id} className="block cursor-pointer"><input type="radio" name="pollOption" className="peer sr-only" onChange={() => setSelected(option.id)} /><span className="block rounded-2xl border border-primary-100 px-5 py-4 font-semibold peer-checked:border-accent-700 peer-checked:bg-accent-50 peer-checked:text-accent-900 dark:border-white/10 dark:peer-checked:border-accent-300 dark:peer-checked:bg-accent-900/40 dark:peer-checked:text-accent-100">{option.text}</span></label>)}<Button type="button" onClick={vote} disabled={!selected || pending} className="mt-4 w-full">{pending ? <LoaderCircle className="animate-spin" /> : null}{en ? "Submit vote" : "Oy ver"}</Button></div> : <div className="mt-7 space-y-5"><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{en ? "Your vote is recorded. Results update automatically." : "Oyun kaydedildi. Sonuçlar otomatik yenilenir."}</p>{poll.options.map((option) => <div key={option.id}><div className="flex justify-between text-sm font-semibold"><span>{option.text}</span><span>%{option.percent}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-primary-100 dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-transform" style={{ width: `${option.percent}%` }} /></div></div>)}<p className="text-xs text-muted-foreground">{poll.total} {en ? "votes" : "oy"}</p></div>}</div>;
}
