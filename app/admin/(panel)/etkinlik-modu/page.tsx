import Link from "next/link";
import { BarChart3, CheckCircle2, Download, Gift, MessageSquareText, Presentation, Radio, Sparkles, UsersRound } from "lucide-react";

import {
  saveEventSessionAction,
  setEventSessionActiveAction,
} from "@/app/admin/(panel)/etkinlik-modu/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventModeQrDownload } from "@/components/admin/event-mode-qr-download";
import { EventModeLiveStats } from "@/components/admin/event-mode-live-stats";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

const featureFields = [
  ["quizEnabled", "Quiz"],
  ["raffleEnabled", "Çekiliş"],
  ["joinButtonEnabled", "Katılım"],
  ["feedbackEnabled", "Geri bildirim"],
  ["badgeEnabled", "Rozet"],
  ["pollEnabled", "Anket"],
] as const;

export default async function EventModeAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const [{ durum }, events, sessions] = await Promise.all([
    searchParams,
    prisma.event.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
    prisma.eventSession.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        linkedEvent: { select: { title: true } },
        participants: { orderBy: { createdAt: "desc" } },
      },
    }),
  ]);
  const active = sessions.find((session) => session.isActive);
  const publicUrl = new URL("/etkinlik", siteUrl).href;
  const status = durum ? eventModeStatus[durum] : null;

  return (
    <>
      <AdminPageHeader
        eyebrow="Canlı Deneyim"
        title="Etkinlik Modu"
        description="Etkinlik oturumunu açın, katılımcıları izleyin ve canlı özellikleri tek tek yönetin. Aynı anda yalnızca bir oturum aktif olabilir."
        actions={<EventModeQrDownload url={publicUrl} />}
      />
      {status ? (
        <p className={`mt-6 rounded-xl border px-4 py-3 text-sm font-semibold ${status.className}`} role={status.error ? "alert" : "status"}>
          {status.message}
        </p>
      ) : null}

      <nav className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Etkinlik modu yönetim bölümleri">
        <AdminShortcut href="/admin/etkinlik-modu/quiz" label="Quiz" icon={Sparkles} />
        <AdminShortcut href="/admin/etkinlik-modu/cekilis" label="Çekiliş" icon={Gift} />
        <AdminShortcut href="/admin/etkinlik-modu/anket" label="Anket" icon={BarChart3} />
        <AdminShortcut href="/admin/etkinlik-modu/geri-bildirim" label="Geri bildirim" icon={MessageSquareText} />
        <AdminShortcut href="/etkinlik/ekran" label="Sahne ekranı" icon={Presentation} external />
      </nav>
      <EventModeLiveStats />

      <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <section className="space-y-5">
          {sessions.map((session) => (
            <article key={session.id} className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-primary-950">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl font-bold">{session.title}</h2>
                    {session.isActive ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">Aktif</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-primary-500">{session.linkedEvent?.title ?? "Bağlı etkinlik yok"} · {session.participants.length} katılımcı</p>
                </div>
                {!session.isActive ? (
                  <form action={setEventSessionActiveAction}>
                    <input type="hidden" name="id" value={session.id} />
                    <Button size="sm" type="submit"><Radio /> Aktif yap</Button>
                  </form>
                ) : <CheckCircle2 className="size-6 text-emerald-600" />}
              </div>
              <SessionForm session={session} events={events} />
            </article>
          ))}
          {!sessions.length ? <EmptyState /> : null}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-primary-950">
            <h2 className="font-heading text-xl font-bold">Yeni oturum</h2>
            <p className="mt-2 text-sm text-primary-500">Oturumu oluşturduktan sonra istediğiniz zaman aktif edebilirsiniz.</p>
            <div className="mt-5"><SessionForm events={events} /></div>
          </section>
          <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-primary-950">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-heading text-xl font-bold">Katılımcılar</h2><p className="mt-1 text-sm text-primary-500">{active ? active.title : "Aktif oturum yok"}</p></div>
              {active ? <Button asChild size="sm" variant="outline"><Link href="/api/admin/event-mode/participants"><Download /> CSV</Link></Button> : null}
            </div>
            <div className="mt-5 max-h-[32rem] space-y-3 overflow-auto">
              {active?.participants.map((participant) => (
                <div key={participant.id} className="rounded-2xl border border-primary-100 p-3 dark:border-white/10">
                  <p className="font-semibold">{participant.fullName}</p>
                  <p className="mt-1 break-all text-xs text-primary-500">{participant.email}</p>
                  <p className="mt-1 text-xs text-primary-500">{participant.department} · {participant.createdAt.toLocaleString("tr-TR")}</p>
                </div>
              )) ?? <p className="text-sm text-primary-500">Aktif oturum bulunmuyor.</p>}
              {active && !active.participants.length ? <p className="text-sm text-primary-500">Henüz katılımcı yok.</p> : null}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

const eventModeStatus: Record<string, { message: string; className: string; error?: boolean }> = {
  kaydedildi: {
    message: "Değişiklik başarıyla kaydedildi.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-100",
  },
  aktif: {
    message: "Etkinlik oturumu aktif hale getirildi.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-100",
  },
  gecersiz: {
    message: "Oturum adı veya gönderilen bilgiler geçersiz.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
  "gecersiz-etkinlik": {
    message: "Seçilen bağlı etkinlik bulunamadı.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
  "gorsel-hatasi": {
    message: "Görsel kaydedilemedi. Dosya biçimini/boyutunu ve Vercel Blob bağlantısını kontrol edip tekrar deneyin.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
  "gorsel-boyut": {
    message: "Görsel kaydedilemedi: dosya boyutu 5 MB sınırını aşıyor.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
  "gorsel-format": {
    message: "Görsel kaydedilemedi: yalnızca JPG, PNG veya WebP dosyaları kabul edilir.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
  "gorsel-gecersiz": {
    message: "Görsel kaydedilemedi: dosya uzantısı ile gerçek görsel biçimi eşleşmiyor veya dosya bozuk.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
  "gorsel-yapilandirma": {
    message: "Görsel kaydedilemedi: canlı ortamda Vercel Blob bağlantısı bulunamadı.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
  "gorsel-yukleme": {
    message: "Görsel yükleme servisi isteği tamamlayamadı. Lütfen kısa bir süre sonra tekrar deneyin.",
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-950/60 dark:text-red-100",
    error: true,
  },
};

function SessionForm({ events, session }: { events: { id: number; title: string }[]; session?: { id: number; title: string; linkedEventId: number | null; posterImageUrl: string | null; posterOrientation: "portrait" | "landscape"; badgeTemplateUrl: string | null; namePositionYPercent: number; eventTitlePositionYPercent: number; showLiveCountersPublicly: boolean; isActive: boolean; quizEnabled: boolean; raffleEnabled: boolean; joinButtonEnabled: boolean; feedbackEnabled: boolean; badgeEnabled: boolean; pollEnabled: boolean } }) {
  return (
    <form action={saveEventSessionAction} className="space-y-4">
      {session ? <input type="hidden" name="id" value={session.id} /> : null}
      <label className="block text-sm font-semibold">Oturum adı<Input name="title" defaultValue={session?.title} minLength={3} maxLength={120} required className="mt-2" /></label>
      <label className="block text-sm font-semibold">Bağlı etkinlik<select name="linkedEventId" defaultValue={session?.linkedEventId ?? ""} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Bağlantı yok</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></label>
      <div className="rounded-2xl border border-primary-100 p-4 dark:border-white/10">
        <ImageUploadField id={`poster-${session?.id ?? "new"}`} name="posterImage" label="Giriş afişi" defaultImageUrl={session?.posterImageUrl ?? undefined} removeName="removePosterImage" />
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">Afiş yönü</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-primary-100 p-3 text-sm transition-colors has-[:checked]:border-accent-500 has-[:checked]:bg-accent-50 dark:border-white/10 dark:has-[:checked]:border-accent-300 dark:has-[:checked]:bg-accent-900/30">
              <input type="radio" name="posterOrientation" value="portrait" defaultChecked={(session?.posterOrientation ?? "portrait") === "portrait"} className="mt-1 accent-orange-600" />
              <span><strong className="block">Dikey</strong><span className="mt-0.5 block text-xs text-primary-500 dark:text-primary-200">Önerilen: 1080 × 1350 px</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-primary-100 p-3 text-sm transition-colors has-[:checked]:border-accent-500 has-[:checked]:bg-accent-50 dark:border-white/10 dark:has-[:checked]:border-accent-300 dark:has-[:checked]:bg-accent-900/30">
              <input type="radio" name="posterOrientation" value="landscape" defaultChecked={session?.posterOrientation === "landscape"} className="mt-1 accent-orange-600" />
              <span><strong className="block">Yatay</strong><span className="mt-0.5 block text-xs text-primary-500 dark:text-primary-200">Önerilen: 1600 × 900 px</span></span>
            </label>
          </div>
        </fieldset>
        <p className="mt-3 text-xs leading-5 text-primary-500">Etkinlik aktifken ziyaretçiye tarayıcı oturumunda bir kez gösterilir. Görsel seçilen yönde bozulmadan yerleştirilir.</p>
      </div>
      <div className="space-y-4 rounded-2xl border border-primary-100 p-4 dark:border-white/10">
        <ImageUploadField id={`badge-template-${session?.id ?? "new"}`} name="badgeTemplateImage" label="Rozet arka plan şablonu" defaultImageUrl={session?.badgeTemplateUrl ?? undefined} removeName="removeBadgeTemplateImage" />
        <p className="text-xs leading-5 text-primary-500">Önerilen boyut: 1080 × 1350 px. Şablon yoksa Galata KGK&apos;nin varsayılan rozet tasarımı kullanılır.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Katılımcı adı dikey konumu (%)<Input type="number" name="namePositionYPercent" min={0} max={100} defaultValue={session?.namePositionYPercent ?? 60} required className="mt-2" /></label>
          <label className="block text-sm font-semibold">Etkinlik adı dikey konumu (%)<Input type="number" name="eventTitlePositionYPercent" min={0} max={100} defaultValue={session?.eventTitlePositionYPercent ?? 72} required className="mt-2" /></label>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle name="isActive" label="Oturum aktif" defaultChecked={session?.isActive} />
        {featureFields.map(([name, label]) => <Toggle key={name} name={name} label={label} defaultChecked={session?.[name]} />)}
        <Toggle name="showLiveCountersPublicly" label="Katılımcı sayılarını sahne ekranında göster" defaultChecked={session?.showLiveCountersPublicly} />
      </div>
      <Button type="submit" size="sm">Kaydet</Button>
    </form>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-2 rounded-xl border border-primary-100 px-3 py-2 text-sm font-medium dark:border-white/10"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-orange-600" />{label}</label>;
}

function EmptyState() {
  return <div className="rounded-3xl border border-dashed border-primary-200 p-12 text-center"><UsersRound className="mx-auto size-8 text-primary-300" /><p className="mt-3 font-semibold">Henüz etkinlik oturumu yok.</p></div>;
}

function AdminShortcut({ href, label, icon: Icon, external = false }: { href: string; label: string; icon: typeof Sparkles; external?: boolean }) {
  return <Button asChild variant="outline" className="h-auto justify-start gap-3 rounded-2xl px-4 py-3"><Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}><Icon className="size-5 text-accent" />{label}</Link></Button>;
}
