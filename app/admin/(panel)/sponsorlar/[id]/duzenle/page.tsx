import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateSponsorAction } from "@/app/admin/(panel)/sponsorlar/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SponsorAdminForm } from "@/components/admin/sponsor-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sponsorId = Number(id);

  if (!Number.isInteger(sponsorId)) {
    notFound();
  }

  const [sponsor, tiers] = await Promise.all([
    prisma.sponsor.findUnique({ where: { id: sponsorId } }),
    prisma.sponsorTier.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  if (!sponsor) {
    notFound();
  }

  const updateAction = updateSponsorAction.bind(null, sponsor.id);

  return (
    <>
      <AdminPageHeader
        eyebrow="Sponsor Düzenleme"
        title={sponsor.name}
        description="Logo, web sitesi, açıklama, tier ve sıralama bilgilerini güncelleyin."
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/sponsorlar">
              <ArrowLeft aria-hidden="true" />
              Sponsor listesine dön
            </Link>
          </Button>
        }
      />

      <section className="mt-9 max-w-4xl rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-8">
        <SponsorAdminForm
          action={updateAction}
          tiers={tiers}
          submitLabel="Değişiklikleri kaydet"
          defaultValues={{
            name: sponsor.name,
            websiteUrl: sponsor.websiteUrl ?? "",
            description: sponsor.description ?? "",
            tierId: sponsor.tierId,
            logoUrl: sponsor.logoUrl,
            logoAlt: sponsor.logoAlt ?? `${sponsor.name} logosu`,
            order: sponsor.order,
          }}
        />
      </section>
    </>
  );
}
