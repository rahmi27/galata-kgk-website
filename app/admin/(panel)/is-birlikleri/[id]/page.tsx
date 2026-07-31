import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, Pencil } from "lucide-react";

import { createCollaborationItemAction } from "@/app/admin/(panel)/is-birlikleri/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollaborationItemAdminForm } from "@/components/admin/collaboration-item-admin-form";
import { DeleteCollaborationItemButton } from "@/components/admin/delete-collaboration-item-button";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

export default async function AdminPartnerClubPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ durum?: string }>;
}) {
  const [{ id }, { durum }] = await Promise.all([params, searchParams]);
  const partnerClubId = Number(id);

  if (!Number.isInteger(partnerClubId)) {
    notFound();
  }

  const partnerClub = await prisma.partnerClub.findUnique({
    where: { id: partnerClubId },
    include: {
      collaborations: {
        orderBy: [{ date: "desc" }, { order: "asc" }, { title: "asc" }],
      },
    },
  });

  if (!partnerClub) {
    notFound();
  }

  const createAction = createCollaborationItemAction.bind(
    null,
    partnerClub.id,
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Partner Kulüp"
        title={partnerClub.name}
        description={`${partnerClub.collaborations.length} iş birliği maddesini yönetin; tarih kesin değilse alanı boş bırakın.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/admin/is-birlikleri">
                <ArrowLeft aria-hidden="true" />
                Listeye dön
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/is-birlikleri/${partnerClub.slug}`} target="_blank">
                <ExternalLink aria-hidden="true" />
                Sayfayı gör
              </Link>
            </Button>
          </div>
        }
      />

      {durum ? (
        <p
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          {durum === "madde-guncellendi"
            ? "İş birliği maddesi güncellendi."
            : "Partner kulüp bilgileri güncellendi."}
        </p>
      ) : null}

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,0.68fr)]">
        <section className="space-y-4">
          {partnerClub.collaborations.length ? (
            partnerClub.collaborations.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {item.date ? (
                      <p className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-accent-700 dark:text-accent-300">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        {dateFormatter.format(item.date)}
                      </p>
                    ) : (
                      <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary-500 dark:text-primary-200">
                        Devam eden iş birliği
                      </p>
                    )}
                    <h2 className="mt-3 font-heading text-xl font-bold text-primary-950 dark:text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-primary-500 dark:text-primary-200">
                      {item.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-primary-500 dark:text-primary-300">
                      Sıra {item.order}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                      <Link
                        href={`/admin/is-birlikleri/${partnerClub.id}/maddeler/${item.id}/duzenle`}
                      >
                        <Pencil aria-hidden="true" />
                        Düzenle
                      </Link>
                    </Button>
                    <DeleteCollaborationItemButton
                      partnerClubId={partnerClub.id}
                      collaborationItemId={item.id}
                      title={item.title}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-14 text-center dark:border-white/15 dark:bg-primary-950">
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-100">
                Bu kulüp için henüz iş birliği maddesi yok.
              </p>
            </div>
          )}
        </section>

        <section className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950 sm:p-7 xl:sticky xl:top-7">
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Yeni iş birliği maddesi
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-500 dark:text-primary-200">
            Kesin tarihi olmayan çalışmalar halka açık sayfada ayrı grupta gösterilir.
          </p>
          <div className="mt-6">
            <CollaborationItemAdminForm
              action={createAction}
              submitLabel="Maddeyi ekle"
              resetOnSuccess
            />
          </div>
        </section>
      </div>
    </>
  );
}
