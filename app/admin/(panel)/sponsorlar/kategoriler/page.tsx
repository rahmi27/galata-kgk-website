import Link from "next/link";
import { ArrowLeft, BadgeCheck, FolderCog } from "lucide-react";

import {
  createSponsorTierAction,
  updateSponsorTierAction,
} from "@/app/admin/(panel)/sponsorlar/kategoriler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteSponsorTierButton } from "@/components/admin/delete-sponsor-tier-button";
import { SponsorTierForm } from "@/components/admin/sponsor-tier-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SponsorTiersPage() {
  const tiers = await prisma.sponsorTier.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { sponsors: true } },
    },
  });

  const nextOrder =
    tiers.reduce((highest, tier) => Math.max(highest, tier.order), 0) + 1;

  return (
    <>
      <AdminPageHeader
        eyebrow="Sponsor Yapısı"
        title="Sponsor Tier'ları"
        description="Sponsorların halka açık sayfadaki grup adlarını ve görüntülenme sıralarını yönetin."
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/sponsorlar">
              <ArrowLeft aria-hidden="true" />
              Sponsor yönetimine dön
            </Link>
          </Button>
        }
      />

      <section className="mt-9 rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
            <FolderCog className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-primary-950 dark:text-white">
              Yeni tier oluştur
            </h2>
            <p className="mt-1 text-xs text-primary-500 dark:text-primary-200">
              Büyük/küçük harf farkı aynı tier olarak değerlendirilir.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <SponsorTierForm
            action={createSponsorTierAction}
            defaultOrder={nextOrder}
            submitLabel="Tier ekle"
            resetOnSuccess
          />
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {tiers.map((tier) => {
          const updateAction = updateSponsorTierAction.bind(null, tier.id);

          return (
            <article
              key={tier.id}
              className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-primary-50 pb-4 dark:border-white/10">
                <div>
                  <p className="font-heading font-bold text-primary-950 dark:text-white">
                    {tier.name}
                  </p>
                  <p className="mt-1 text-xs text-primary-500 dark:text-primary-200">
                    /{tier.slug}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:bg-white/10 dark:text-primary-100">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    {tier._count.sponsors} sponsor
                  </span>
                  <DeleteSponsorTierButton
                    tierId={tier.id}
                    tierName={tier.name}
                    sponsorCount={tier._count.sponsors}
                  />
                </div>
              </div>
              <SponsorTierForm
                action={updateAction}
                defaultName={tier.name}
                defaultOrder={tier.order}
                submitLabel="Kaydet"
              />
            </article>
          );
        })}
      </section>
    </>
  );
}
