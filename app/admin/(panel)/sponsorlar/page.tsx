/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FolderCog, Handshake, ListOrdered, Pencil } from "lucide-react";

import { createSponsorAction } from "@/app/admin/(panel)/sponsorlar/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteSponsorButton } from "@/components/admin/delete-sponsor-button";
import { SponsorAdminForm } from "@/components/admin/sponsor-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const [{ durum }, tiers] = await Promise.all([
    searchParams,
    prisma.sponsorTier.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        sponsors: {
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
      },
    }),
  ]);

  const sponsorCount = tiers.reduce(
    (total, tier) => total + tier.sponsors.length,
    0,
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="İş Birliği Yönetimi"
        title="Sponsorlar"
        description={`${sponsorCount} sponsoru tier'larıyla birlikte yönetin ve halka açık sayfadaki sıralarını belirleyin.`}
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/sponsorlar/kategoriler">
              <FolderCog aria-hidden="true" />
              Tier’ları yönet
            </Link>
          </Button>
        }
      />

      {durum === "guncellendi" ? (
        <p
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          Sponsor başarıyla güncellendi.
        </p>
      ) : null}

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(26rem,0.72fr)]">
        <section className="min-w-0 space-y-5">
          {tiers.some((tier) => tier.sponsors.length) ? (
            tiers
              .filter((tier) => tier.sponsors.length)
              .map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7"
                >
                  <div>
                    <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
                      {tier.name}
                    </h2>
                    <p className="mt-1 text-sm text-primary-500 dark:text-primary-200">
                      {tier.sponsors.length} sponsor · tier sırası {tier.order}
                    </p>
                  </div>

                  <div className="mt-5 divide-y divide-primary-50 dark:divide-white/10">
                    {tier.sponsors.map((sponsor) => (
                      <article
                        key={sponsor.id}
                        className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary-100 bg-white p-2 dark:border-white/10">
                            <img
                              src={sponsor.logoUrl}
                              alt={sponsor.logoAlt ?? `${sponsor.name} logosu`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-heading font-bold text-primary-950 dark:text-white">
                              {sponsor.name}
                            </h3>
                            {sponsor.websiteUrl ? (
                              <p className="mt-1 truncate text-sm text-primary-500 dark:text-primary-200">
                                {sponsor.websiteUrl}
                              </p>
                            ) : null}
                            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600 dark:bg-white/10 dark:text-primary-100">
                              <ListOrdered className="size-3.5" aria-hidden="true" />
                              Sıra {sponsor.order}
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
                            <Link href={`/admin/sponsorlar/${sponsor.id}/duzenle`}>
                              <Pencil aria-hidden="true" />
                              Düzenle
                            </Link>
                          </Button>
                          <DeleteSponsorButton
                            sponsorId={sponsor.id}
                            sponsorName={sponsor.name}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-16 text-center dark:border-white/15 dark:bg-primary-950">
              <Handshake className="mx-auto size-8 text-primary-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-primary-600 dark:text-primary-100">
                Henüz sponsor bulunmuyor.
              </p>
            </div>
          )}
        </section>

        <section className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7 xl:sticky xl:top-7">
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Yeni sponsor ekle
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-500 dark:text-primary-200">
            Bir tier seçin veya formun içinden yeni bir tier oluşturun.
          </p>
          <div className="mt-6">
            <SponsorAdminForm
              action={createSponsorAction}
              tiers={tiers.map((tier) => ({ id: tier.id, name: tier.name }))}
              submitLabel="Sponsor ekle"
              resetOnSuccess
            />
          </div>
        </section>
      </div>
    </>
  );
}
