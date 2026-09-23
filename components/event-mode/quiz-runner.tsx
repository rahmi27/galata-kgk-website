"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Question = { id: number; questionText: string; options: string[]; order: number };

export function QuizRunner({ questions, initialScore, initialAnswered, totalQuestions, locale, raffleEnabled }: { questions: Question[]; initialScore: number; initialAnswered: number; totalQuestions: number; locale: string; raffleEnabled: boolean }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(initialScore);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const en = locale === "en";
  const question = questions[index];

  async function answer(optionIndex: number) {
    if (!question || pending || selected !== null) return;
    setSelected(optionIndex); setPending(true);
    const response = await fetch("/api/event-mode/quiz/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: question.id, selectedOptionIndex: optionIndex }) });
    const data = await response.json() as { isCorrect?: boolean };
    setPending(false);
    if (!response.ok || typeof data.isCorrect !== "boolean") { setSelected(null); return; }
    setResult(data.isCorrect);
    if (data.isCorrect) setScore((current) => current + 1);
  }

  if (!question) return <Summary score={score} total={totalQuestions} en={en} raffleEnabled={raffleEnabled} />;
  return <div className="rounded-[2rem] border border-primary-100 bg-card p-7 shadow-xl sm:p-10 dark:border-white/10"><div className="flex items-center justify-between text-sm font-semibold text-muted-foreground"><span>{en ? "Question" : "Soru"} {Math.min(initialAnswered + index + 1, totalQuestions)} / {totalQuestions}</span><span>{en ? "Score" : "Puan"}: {score}</span></div><h1 className="mt-6 font-heading text-2xl font-bold leading-tight sm:text-3xl">{question.questionText}</h1><div className="mt-7 grid gap-3">{question.options.map((option, optionIndex) => <button key={optionIndex} type="button" onClick={() => answer(optionIndex)} disabled={selected !== null || pending} className={cn("rounded-2xl border px-5 py-4 text-left font-semibold transition-colors", selected === optionIndex ? result === true ? "event-answer-correct border-emerald-500 bg-emerald-50 text-emerald-900" : result === false ? "event-answer-wrong border-red-500 bg-red-50 text-red-900" : "border-accent bg-accent-50" : "border-primary-100 hover:border-accent dark:border-white/10 dark:hover:border-accent")}>{option}</button>)}</div>{pending ? <p className="mt-5 flex items-center gap-2 text-sm font-semibold"><LoaderCircle className="animate-spin" />{en ? "Checking..." : "Kontrol ediliyor..."}</p> : null}{result !== null ? <div className={cn("mt-6 rounded-2xl p-4 font-semibold", result ? "event-answer-correct bg-emerald-50 text-emerald-900" : "event-answer-wrong bg-red-50 text-red-900")}><p className="flex items-center gap-2">{result ? <CheckCircle2 /> : <XCircle />}{result ? (en ? "Correct!" : "Doğru!") : (en ? "Not quite—keep going!" : "Olmadı ama devam!")}</p><Button type="button" className="mt-4" size="sm" onClick={() => { setIndex((value) => value + 1); setSelected(null); setResult(null); }}>{index === questions.length - 1 ? (en ? "Show summary" : "Özeti gör") : (en ? "Next question" : "Sonraki soru")}</Button></div> : null}</div>;
}

function Summary({ score, total, en, raffleEnabled }: { score: number; total: number; en: boolean; raffleEnabled: boolean }) {
  return <div className="rounded-[2rem] border border-primary-100 bg-card p-10 text-center dark:border-white/10"><CheckCircle2 className="mx-auto size-12 text-emerald-600" /><h1 className="mt-5 font-heading text-3xl font-bold">{en ? "Quiz complete!" : "Quiz tamamlandı!"}</h1><p className="mt-4 text-xl font-semibold">{score} / {total}</p>{raffleEnabled ? <div className="mt-7 rounded-2xl bg-accent/10 p-5"><p className="font-heading text-xl font-bold">{en ? "Congratulations! You unlocked the raffle 🎁" : "Tebrikler! Çekilişe katılma hakkı kazandın 🎁"}</p><Button asChild className="mt-4"><Link href={en ? "/en/event/hub/raffle" : "/etkinlik/panel/cekilis"}>{en ? "Claim my raffle entry" : "Çekilişe katıl"}</Link></Button></div> : null}<Button asChild className="mt-4" variant={raffleEnabled ? "outline" : "default"}><Link href={en ? "/en/event/hub/quiz/leaderboard" : "/etkinlik/panel/quiz/tablo"}>{en ? "View leaderboard" : "Skor tablosunu gör"}</Link></Button></div>;
}
