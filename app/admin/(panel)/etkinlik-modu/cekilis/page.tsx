import Link from "next/link";
import { ArrowLeft, Gift, Sparkles, Trophy } from "lucide-react";

import { drawRaffleWinnerAction } from "@/app/admin/(panel)/etkinlik-modu/cekilis/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RaffleAdminPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const [{ durum }, active] = await Promise.all([
    searchParams,
    prisma.eventSession.findFirst({
      where: { isActive: true },
      include: {
        raffleEntries: { include: { participant: true }, orderBy: { createdAt: "asc" } },
        raffleWinners: { include: { raffleEntry: { include: { participant: true } } }, orderBy: { drawnAt: "desc" } },
      },
    }),
  ]);
  return <>
    <AdminPageHeader eyebrow="Etkinlik Modu" title="Çekiliş Yönetimi" description="Katılım koşullarını kabul eden adaylar arasından kriptografik güvenli rastgele seçim yapın." actions={<Button asChild variant="outline"><Link href="/admin/etkinlik-modu"><ArrowLeft /> Merkeze dön</Link></Button>} />
    {durum === "aday-yok" ? <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Seçilebilecek yeni bir aday yok.</p> : null}
    {durum === "kazanan" ? <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">Kazanan seçildi ve sahne ekranına iletildi.</p> : null}
    {!active ? <p className="mt-8 rounded-3xl border border-dashed p-10 text-center">Aktif etkinlik oturumu bulunmuyor.</p> : <div className="mt-8 grid gap-7 lg:grid-cols-2">
      <section className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950">
        <div className="flex items-center justify-between gap-4"><div><h2 className="font-heading text-xl font-bold">Çekiliş havuzu</h2><p className="mt-1 text-sm text-primary-500">{active.raffleEntries.length} katılımcı</p></div><form action={drawRaffleWinnerAction}><Button type="submit" disabled={!active.raffleEntries.length}><Sparkles /> Kazananı Çek</Button></form></div>
        <div className="mt-5 space-y-3">{active.raffleEntries.map((entry) => <div key={entry.id} className="flex items-center gap-3 rounded-2xl border border-primary-100 p-3 dark:border-white/10"><Gift className="size-5 text-accent" /><div><p className="font-semibold">{entry.participant.fullName}</p><p className="text-xs text-primary-500">{entry.createdAt.toLocaleString("tr-TR")}</p></div></div>)}{!active.raffleEntries.length ? <p className="text-sm text-primary-500">Henüz çekiliş katılımı yok.</p> : null}</div>
      </section>
      <section className="rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-primary-950"><h2 className="font-heading text-xl font-bold">Geçmiş kazananlar</h2><div className="mt-5 space-y-3">{active.raffleWinners.map((winner, index) => <div key={winner.id} className="rounded-2xl bg-primary-50 p-4 dark:bg-white/5"><div className="flex gap-3"><Trophy className="size-5 text-accent" /><div><p className="font-bold">{index + 1}. {winner.raffleEntry.participant.fullName}</p><p className="mt-1 text-xs text-primary-500">{winner.drawnAt.toLocaleString("tr-TR")}</p></div></div></div>)}{!active.raffleWinners.length ? <p className="text-sm text-primary-500">Henüz kazanan çekilmedi.</p> : null}</div></section>
    </div>}
  </>;
}
