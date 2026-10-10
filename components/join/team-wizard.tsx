"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { ApplicantFields, ConsentField, SocialLinks, inputStyle, type Social } from "@/components/join/shared";
import { safeHttpUrl, validateApplicantBasics } from "@/lib/join-validation";

type Question = { id: number; label: string; helpText: string | null; type: "YES_NO" | "SHORT_TEXT" | "LONG_TEXT" | "FILE" | "LINK"; required: boolean; maxLength: number | null; minFiles: number | null; maxFiles: number | null; anyOfGroup: string | null };
type Position = { id: number; title: string; shortDescription: string; detailMarkdown: string; isOpen: boolean; isArchived: boolean; deadline: string | null; questions: Question[]; media: { id: number; url: string; alt: string; caption: string | null }[] };
type Draft = Record<string, string>;
type FileRef = { pathname: string; originalName: string };

const draftKey = "galata-team-application-draft-v1";
const button = "rounded-xl bg-accent px-6 py-3 font-bold text-primary-950 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-700 disabled:opacity-50";
function extension(type: string) { return ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" } as Record<string, string>)[type]; }

export function TeamWizard({ positions, departments, socials }: { positions: Position[]; departments: string[]; socials: Social[] }) {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [basic, setBasic] = useState<Draft>({});
  const [values, setValues] = useState<Record<number, string | boolean>>({});
  const [files, setFiles] = useState<Record<number, FileRef[]>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const position = positions.find((item) => item.id === selected);

  useEffect(() => {
    try { const raw = sessionStorage.getItem(draftKey); if (raw) { const draft = JSON.parse(raw) as { basic?: Draft; values?: Record<number, string | boolean>; step?: number; selected?: number }; setBasic(draft.basic || {}); setValues(draft.values || {}); if (draft.selected && positions.some((item) => item.id === draft.selected && item.isOpen && !item.isArchived && (!item.deadline || new Date(item.deadline) > new Date()))) { setSelected(draft.selected); setStep(draft.step === 3 ? 3 : draft.step === 2 ? 2 : 1); } else if (draft.step === 2) setStep(2); } } catch { /* ignore corrupt draft */ }
    setReady(true);
  }, [positions]);
  useEffect(() => { if (ready && !success) sessionStorage.setItem(draftKey, JSON.stringify({ basic, values, step, selected })); }, [basic, values, step, selected, ready, success]);
  useEffect(() => { if (ready) headingRef.current?.focus(); }, [step, ready]);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  function nextBasics(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = validateApplicantBasics(payload);
    if (!result.data) { setError(result.error); return; }
    setBasic(Object.fromEntries(Object.entries(result.data).map(([key, value]) => [key, value]))); setError(""); setStep(2);
  }

  async function handleFiles(questionId: number, incoming: FileList | null) {
    if (!incoming?.length) return;
    const question = position?.questions.find((item) => item.id === questionId);
    if (!question || (files[questionId]?.length || 0) + incoming.length > (question.maxFiles ?? 2)) {
      setError("Bu soru için izin verilen dosya sayısını aştın.");
      return;
    }
    setError(""); setSending(true);
    const uploaded: FileRef[] = [];
    try {
      for (const file of Array.from(incoming)) {
        const ext = extension(file.type);
        if (!ext || !file.size || file.size > 5 * 1024 * 1024) throw new Error("Yalnızca JPG, PNG, WebP veya PDF; dosya başına en fazla 5 MB.");
        const pathname = `applications/${crypto.randomUUID()}/${crypto.randomUUID()}.${ext}`;
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(pathname, file, { access: "private", handleUploadUrl: "/api/join/upload", multipart: false });
        uploaded.push({ pathname: blob.pathname, originalName: file.name });
      }
      setFiles((current) => ({ ...current, [questionId]: [...(current[questionId] || []), ...uploaded] }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Dosya yüklenemedi."); }
    finally { setSending(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!position) return;
    setSending(true); setError("");
    const data = new FormData(event.currentTarget);
    const answers = position.questions.map((question) => ({
      questionId: question.id,
      ...(question.type === "YES_NO" ? { boolValue: values[question.id] === "yes" ? true : values[question.id] === "no" ? false : undefined } : { textValue: String(values[question.id] ?? "") }),
      files: files[question.id] || [],
    }));
    try {
      const response = await fetch("/api/join/application", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...basic, positionId: position.id, answers, consent: data.get("consent") === "on", website: data.get("website") }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Başvuru kaydedilemedi.");
      sessionStorage.removeItem(draftKey); setSuccess(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Başvuru kaydedilemedi."); }
    finally { setSending(false); }
  }

  if (success) return <div className="rounded-3xl border border-emerald-300/40 bg-card p-8"><h1 className="font-heading text-3xl font-bold">Başvurun alındı! 🎉</h1><p className="mt-4 text-muted-foreground">Sonuç sana telefonla veya WhatsApp’tan iletilecek.</p><SocialLinks socials={socials} /></div>;

  return <div className="rounded-3xl border border-primary/10 bg-card p-6 shadow-xl dark:border-white/10 sm:p-9">
    <p className="text-sm font-bold text-accent-700 dark:text-accent-300">Adım {step} / 3</p>
    <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-heading text-3xl font-bold outline-none">{step === 1 ? "Önce seni tanıyalım" : step === 2 ? "Pozisyonunu seç" : position?.title}</h1>
    {error ? <div ref={errorRef} role="alert" tabIndex={-1} className="mt-5 rounded-xl bg-red-100 p-4 font-medium text-red-900 outline-none dark:bg-red-950 dark:text-red-100">{error}</div> : null}
    {step === 1 ? <form onSubmit={nextBasics} onChange={(event) => setBasic(Object.fromEntries(new FormData(event.currentTarget).entries()) as Draft)} className="mt-8"><ApplicantFields key={ready ? "restored" : "initial"} departments={departments} initial={basic} /><button className={`${button} mt-8`} type="submit">Pozisyonları gör →</button></form> : null}
    {step === 2 ? <div className="mt-8"><button type="button" onClick={() => setStep(1)} className="mb-5 font-semibold text-accent-700 underline dark:text-accent-300">← Geri</button><div className="grid gap-4 sm:grid-cols-2">{positions.map((item) => { const open = item.isOpen && !item.isArchived && (!item.deadline || new Date(item.deadline) > new Date()); return <button type="button" key={item.id} disabled={!open} onClick={() => { setSelected(item.id); setStep(3); setError(""); }} className="rounded-2xl border border-primary/15 p-6 text-left transition-colors hover:border-accent-600 disabled:cursor-not-allowed disabled:opacity-55 dark:border-white/20"><h2 className="font-heading text-xl font-bold">{item.title}</h2><p className="mt-3 text-muted-foreground">{item.shortDescription}</p><span className="mt-5 block font-bold text-accent-700 dark:text-accent-300">{open ? "Detayı gör →" : "Başvurular kapandı"}</span></button>; })}</div></div> : null}
    {step === 3 && position ? <form ref={formRef} onSubmit={submit} className="mt-8"><button type="button" onClick={() => setStep(2)} className="mb-6 font-semibold text-accent-700 underline dark:text-accent-300">← Geri</button><div className="prose max-w-none text-foreground dark:prose-invert"><ReactMarkdown skipHtml components={{ a: ({ href, children }) => { const safe = safeHttpUrl(href); return safe ? <a href={safe} target="_blank" rel="noopener noreferrer">{children}</a> : <span>{children}</span>; } }}>{position.detailMarkdown}</ReactMarkdown></div>{position.media.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{position.media.map((media) => <figure key={media.id}><img src={media.url} alt={media.alt} className="w-full rounded-xl" />{media.caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{media.caption}</figcaption> : null}</figure>)}</div> : null}<div className="mt-9 space-y-6">{position.questions.map((question) => <div key={question.id}><label className="block font-semibold">{question.label}{question.required ? " *" : ""}</label>{question.helpText ? <p className="mt-1 text-sm text-muted-foreground">{question.helpText}</p> : null}{question.type === "YES_NO" ? <div className="mt-3 flex gap-5"><label><input type="radio" name={`q-${question.id}`} checked={values[question.id] === "yes"} onChange={() => setValues((old) => ({ ...old, [question.id]: "yes" }))} /> Evet</label><label><input type="radio" name={`q-${question.id}`} checked={values[question.id] === "no"} onChange={() => setValues((old) => ({ ...old, [question.id]: "no" }))} /> Hayır</label></div> : question.type === "FILE" ? <div><input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" multiple={Boolean((question.maxFiles || 2) > 1)} onChange={(event) => handleFiles(question.id, event.target.files)} className={inputStyle} /><p className="mt-2 text-xs text-muted-foreground">En fazla {question.maxFiles || 2} dosya, her biri en fazla 5 MB. Dosyalar yalnızca yöneticilere açıktır.</p>{files[question.id]?.map((file) => <p key={file.pathname} className="mt-1 text-sm">✓ {file.originalName}</p>)}</div> : question.type === "LONG_TEXT" ? <textarea value={String(values[question.id] ?? "")} onChange={(event) => setValues((old) => ({ ...old, [question.id]: event.target.value }))} rows={5} maxLength={question.maxLength ?? 5000} className={inputStyle} /> : <input type={question.type === "LINK" ? "url" : "text"} value={String(values[question.id] ?? "")} onChange={(event) => setValues((old) => ({ ...old, [question.id]: event.target.value }))} maxLength={question.maxLength ?? 2000} className={inputStyle} />}</div>)}</div><div className="absolute -left-[10000px] size-px overflow-hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div><ConsentField /><button type="submit" disabled={sending} className={`${button} mt-7`}>{sending ? "İşleniyor…" : "Başvuruyu gönder"}</button></form> : null}
  </div>;
}
