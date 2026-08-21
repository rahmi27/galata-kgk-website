import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updatePartnerClubAction } from "@/app/admin/(panel)/is-birlikleri/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnerClubAdminForm } from "@/components/admin/partner-club-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditPartnerClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partnerClubId = Number(id);

  if (!Number.isInteger(partnerClubId)) {
    notFound();
  }

  const partnerClub = await prisma.partnerClub.findUnique({
    where: { id: partnerClubId },
  });

  if (!partnerClub) {
    notFound();
  }

  const updateAction = updatePartnerClubAction.bind(null, partnerClub.id);

  return (
    <>
      <AdminPageHeader
        eyebrow="Partner Kulüp Düzenleme"
        title={partnerClub.name}
        description="Kulüp adını, logosunu, açıklamasını ve liste sırasını güncelleyin."
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/admin/is-birlikleri/${partnerClub.id}`}>
              <ArrowLeft aria-hidden="true" />
              Kulüp detayına dön
            </Link>
          </Button>
        }
      />

      <section className="mt-9 max-w-4xl rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950 sm:p-8">
        <PartnerClubAdminForm
          action={updateAction}
          submitLabel="Değişiklikleri kaydet"
          defaultValues={{
            name: partnerClub.name,
            nameEn: partnerClub.nameEn,
            shortDescription: partnerClub.shortDescription,
            shortDescriptionEn: partnerClub.shortDescriptionEn,
            logoUrl: partnerClub.logoUrl,
            logoAlt: partnerClub.logoAlt ?? "",
            logoAltEn: partnerClub.logoAltEn,
            order: partnerClub.order,
          }}
        />
      </section>
    </>
  );
}
