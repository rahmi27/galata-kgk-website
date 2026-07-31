import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateCollaborationItemAction } from "@/app/admin/(panel)/is-birlikleri/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollaborationItemAdminForm } from "@/components/admin/collaboration-item-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditCollaborationItemPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;
  const partnerClubId = Number(id);
  const collaborationItemId = Number(itemId);

  if (!Number.isInteger(partnerClubId) || !Number.isInteger(collaborationItemId)) {
    notFound();
  }

  const item = await prisma.collaborationItem.findFirst({
    where: { id: collaborationItemId, partnerClubId },
    include: { partnerClub: { select: { name: true } } },
  });

  if (!item) {
    notFound();
  }

  const updateAction = updateCollaborationItemAction.bind(
    null,
    partnerClubId,
    item.id,
  );

  return (
    <>
      <AdminPageHeader
        eyebrow={item.partnerClub.name}
        title={item.title}
        description="İş birliği maddesinin başlık, açıklama, tarih ve sıralama bilgilerini güncelleyin."
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/admin/is-birlikleri/${partnerClubId}`}>
              <ArrowLeft aria-hidden="true" />
              Kulüp detayına dön
            </Link>
          </Button>
        }
      />

      <section className="mt-9 max-w-4xl rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950 sm:p-8">
        <CollaborationItemAdminForm
          action={updateAction}
          submitLabel="Değişiklikleri kaydet"
          defaultValues={{
            title: item.title,
            description: item.description,
            date: item.date ? item.date.toISOString().slice(0, 10) : "",
            order: item.order,
          }}
        />
      </section>
    </>
  );
}
