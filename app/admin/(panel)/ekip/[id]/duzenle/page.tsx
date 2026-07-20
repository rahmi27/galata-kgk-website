import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateTeamMemberAction } from "@/app/admin/(panel)/ekip/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamMemberAdminForm } from "@/components/admin/team-member-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memberId = Number(id);

  if (!Number.isInteger(memberId)) {
    notFound();
  }

  const member = await prisma.teamMember.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    notFound();
  }

  const updateAction = updateTeamMemberAction.bind(null, member.id);

  return (
    <>
      <AdminPageHeader
        eyebrow="Ekip Üyesi Düzenleme"
        title={member.name}
        description="Görev, departman, fotoğraf ve sıralama bilgisini güncelleyin."
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/ekip">
              <ArrowLeft aria-hidden="true" />
              Ekip listesine dön
            </Link>
          </Button>
        }
      />

      <section className="mt-9 max-w-4xl rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-8">
        <TeamMemberAdminForm
          action={updateAction}
          submitLabel="Değişiklikleri kaydet"
          defaultValues={{
            name: member.name,
            role: member.role,
            department: member.department,
            photoUrl: member.photoUrl ?? "",
            order: member.order,
          }}
        />
      </section>
    </>
  );
}
