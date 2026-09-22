import Link from "next/link";
import { ArrowLeft, MessageSquareText, Star } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FeedbackAdminPage() {
  const active = await prisma.eventSession.findFirst({ where: { isActive: true }, include: { feedback: { orderBy: { createdAt: "desc" }, include: { participant: { select: { fullName: true } } } } } });
  const average = active?.feedback.length ? active.feedback.reduce((sum, item) => sum + item.rating, 0) / active.feedback.length : 0;
  return <><AdminPageHeader eyebrow="Etkinlik Modu" title="Geri Bildirimler" description="Aktif etkinlik oturumu için gelen puanları ve isteğe bağlı yorumları inceleyin." actions={<Button asChild variant="outline"><Link href="/admin/etkinlik-modu"><ArrowLeft /> Merkeze dön</Link></Button>} />
    {!active ? <p className="mt-8 rounded-3xl border border-dashed p-10 text-center">Aktif oturum bulunmuyor.</p> : <><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950"><p className="text-sm font-semibold text-primary-500">Ortalama puan</p><p className="mt-2 font-heading text-4xl font-bold">{average.toFixed(1)} / 5</p></div><div className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950"><p className="text-sm font-semibold text-primary-500">Toplam yanıt</p><p className="mt-2 font-heading text-4xl font-bold">{active.feedback.length}</p></div></div><section className="mt-7 space-y-4">{active.feedback.map((item) => <article key={item.id} className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-accent">{Array.from({ length: item.rating }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</div><time className="text-xs text-primary-500">{item.createdAt.toLocaleString("tr-TR")}</time></div><p className="mt-3 text-sm font-semibold">{item.participant?.fullName ?? "Anonim katılımcı"}</p>{item.comment ? <p className="mt-3 leading-7 text-primary-700 dark:text-primary-200">{item.comment}</p> : <p className="mt-3 text-sm text-primary-400">Yorum bırakılmadı.</p>}</article>)}{!active.feedback.length ? <div className="rounded-3xl border border-dashed p-10 text-center"><MessageSquareText className="mx-auto size-8 text-primary-300" /><p className="mt-3">Henüz geri bildirim yok.</p></div> : null}</section></>}
  </>;
}
