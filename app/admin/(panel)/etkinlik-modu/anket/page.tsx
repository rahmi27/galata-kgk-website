import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";

import { savePollAction } from "@/app/admin/(panel)/etkinlik-modu/anket/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PollAdminPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const [{ durum }, active] = await Promise.all([searchParams, prisma.eventSession.findFirst({ where: { isActive: true }, include: { polls: { include: { options: { orderBy: { order: "asc" }, include: { _count: { select: { votes: true } } } }, _count: { select: { votes: true } } }, orderBy: { id: "desc" } } } })]);
  const poll = active?.polls.find((item) => item.isActive) ?? active?.polls[0];
  const total = poll?._count.votes ?? 0;
  return <><AdminPageHeader eyebrow="Etkinlik Modu" title="Anket Yönetimi" description="Aktif oturum için anketi düzenleyin ve sonuçları oy sayısı ile yüzde olarak takip edin." actions={<Button asChild variant="outline"><Link href="/admin/etkinlik-modu"><ArrowLeft /> Merkeze dön</Link></Button>} />
    {durum ? <p className="mt-6 rounded-xl border border-primary-100 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-primary-950">Anket kaydedildi. Seçenekler değiştirildiğinde önceki oylar güvenlik ve tutarlılık için sıfırlanır.</p> : null}
    {!active ? <p className="mt-8 rounded-3xl border border-dashed p-10 text-center">Aktif oturum bulunmuyor.</p> : <div className="mt-8 grid gap-7 lg:grid-cols-2">
      <section className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950"><h2 className="font-heading text-xl font-bold">Anket formu</h2><form action={savePollAction} className="mt-5 space-y-4">{poll ? <input type="hidden" name="pollId" value={poll.id} /> : null}<label className="block text-sm font-semibold">Soru<Input name="question" defaultValue={poll?.question} minLength={3} maxLength={500} required className="mt-2" /></label>{[0,1,2,3].map((index) => <label key={index} className="block text-sm font-semibold">{index + 1}. seçenek {index > 1 ? "(opsiyonel)" : ""}<Input name={`option${index}`} defaultValue={poll?.options[index]?.text} required={index < 2} maxLength={240} className="mt-2" /></label>)}<label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="isActive" defaultChecked={poll?.isActive ?? true} /> Anket aktif</label><Button type="submit">Kaydet</Button></form></section>
      <section className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950"><div className="flex items-center gap-3"><BarChart3 className="text-accent" /><div><h2 className="font-heading text-xl font-bold">Canlı sonuçlar</h2><p className="text-sm text-primary-500">Toplam {total} oy</p></div></div><div className="mt-6 space-y-5">{poll?.options.map((option) => { const percent = total ? Math.round(option._count.votes / total * 100) : 0; return <div key={option.id}><div className="flex justify-between text-sm font-semibold"><span>{option.text}</span><span>{option._count.votes} · %{percent}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-primary-100 dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${percent}%` }} /></div></div>; })}{!poll ? <p className="text-sm text-primary-500">Henüz anket oluşturulmadı.</p> : null}</div></section>
    </div>}
  </>;
}
