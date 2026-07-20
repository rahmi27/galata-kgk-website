import Link from "next/link";
import { CalendarDays, MapPin, Pencil } from "lucide-react";

import { createEventAction } from "@/app/admin/(panel)/etkinlikler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteEventButton } from "@/components/admin/delete-event-button";
import { EventAdminForm } from "@/components/admin/event-admin-form";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const [{ durum }, events] = await Promise.all([
    searchParams,
    prisma.event.findMany({
      orderBy: {
        date: "desc",
      },
    }),
  ]);

  return (
    <>
      <AdminPageHeader
        eyebrow="İçerik Yönetimi"
        title="Etkinlikler"
        description="Yeni etkinlik yayınlayın; mevcut etkinliklerin ayrıntılarını güncelleyin veya yayından kaldırın."
      />

      {durum === "guncellendi" ? (
        <p
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          Etkinlik başarıyla güncellendi.
        </p>
      ) : null}

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(26rem,0.72fr)]">
        <section className="min-w-0 rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-primary-950">
                Kayıtlı etkinlikler
              </h2>
              <p className="mt-1 text-sm text-primary-400">
                Toplam {events.length} etkinlik
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {events.length ? (
              events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-primary-100 p-4 transition-colors hover:border-primary-200 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-primary-600">
                          {event.category}
                        </span>
                        <span className="text-xs text-primary-400">
                          {event.slug}
                        </span>
                      </div>
                      <h3 className="mt-3 font-heading text-lg font-bold text-primary-950">
                        {event.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-primary-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5 text-accent-600" />
                          {formatEventDate(event.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-accent-600" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="rounded-lg"
                      >
                        <Link
                          href={`/admin/etkinlikler/${event.id}/duzenle`}
                        >
                          <Pencil aria-hidden="true" />
                          Düzenle
                        </Link>
                      </Button>
                      <DeleteEventButton
                        eventId={event.id}
                        eventTitle={event.title}
                      />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-primary-200 px-5 py-12 text-center">
                <CalendarDays className="mx-auto size-8 text-primary-300" />
                <p className="mt-3 text-sm font-semibold text-primary-600">
                  Henüz etkinlik bulunmuyor.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7 xl:sticky xl:top-7">
          <h2 className="font-heading text-xl font-bold text-primary-950">
            Yeni etkinlik ekle
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-400">
            Form kaydedildiğinde etkinlik halka açık sayfalarda görünür.
          </p>
          <div className="mt-6">
            <EventAdminForm
              action={createEventAction}
              submitLabel="Etkinlik oluştur"
              resetOnSuccess
            />
          </div>
        </section>
      </div>
    </>
  );
}
