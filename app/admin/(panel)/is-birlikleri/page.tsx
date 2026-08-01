import Image from "next/image";
import Link from "next/link";
import { Eye, Handshake, ListOrdered, Pencil } from "lucide-react";

import { createPartnerClubAction } from "@/app/admin/(panel)/is-birlikleri/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeletePartnerClubButton } from "@/components/admin/delete-partner-club-button";
import { PartnerClubAdminForm } from "@/components/admin/partner-club-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCollaborationsPage() {
  const partnerClubs = await prisma.partnerClub.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { collaborations: true } },
    },
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="Ortaklarımız"
        title="İş Birlikleri"
        description={`${partnerClubs.length} partner kulübü, logolarını ve birlikte yürütülen çalışmaları yönetin.`}
      />

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(26rem,0.72fr)]">
        <section className="min-w-0 space-y-4">
          {partnerClubs.length ? (
            partnerClubs.map((club) => (
              <article
                key={club.id}
                className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary-100 bg-white p-2 dark:border-white/10">
                      <Image
                        src={club.logoUrl}
                        alt={club.logoAlt ?? `${club.name} logosu`}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
                        {club.name}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-primary-500 dark:text-primary-200">
                        {club.shortDescription}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-white/10 dark:text-primary-100">
                          <Handshake className="size-3.5" aria-hidden="true" />
                          {club._count.collaborations} madde
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-white/10 dark:text-primary-100">
                          <ListOrdered className="size-3.5" aria-hidden="true" />
                          Sıra {club.order}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1">
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                      <Link href={`/admin/is-birlikleri/${club.id}`}>
                        <Eye aria-hidden="true" />
                        Yönet
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                      <Link href={`/admin/is-birlikleri/${club.id}/duzenle`}>
                        <Pencil aria-hidden="true" />
                        Düzenle
                      </Link>
                    </Button>
                    <DeletePartnerClubButton
                      partnerClubId={club.id}
                      partnerClubName={club.name}
                      collaborationCount={club._count.collaborations}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-16 text-center dark:border-white/15 dark:bg-primary-950">
              <Handshake className="mx-auto size-8 text-primary-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-primary-600 dark:text-primary-100">
                Henüz partner kulüp bulunmuyor.
              </p>
            </div>
          )}
        </section>

        <section className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7 xl:sticky xl:top-7">
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Yeni partner kulüp ekle
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-500 dark:text-primary-200">
            Logo Vercel Blob’a yüklenir; kart ve detay sayfası otomatik oluşur.
          </p>
          <div className="mt-6">
            <PartnerClubAdminForm
              action={createPartnerClubAction}
              submitLabel="Partner kulübü ekle"
              resetOnSuccess
            />
          </div>
        </section>
      </div>
    </>
  );
}
