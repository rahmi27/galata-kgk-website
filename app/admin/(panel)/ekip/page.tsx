import Link from "next/link";
import { FolderCog, ListOrdered, Pencil, UserRound } from "lucide-react";

import { createTeamMemberAction } from "@/app/admin/(panel)/ekip/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteTeamMemberButton } from "@/components/admin/delete-team-member-button";
import { TeamMemberAdminForm } from "@/components/admin/team-member-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const [{ durum }, categories] = await Promise.all([
    searchParams,
    prisma.teamCategory.findMany({
      orderBy: [
        {
          order: "asc",
        },
        {
          name: "asc",
        },
      ],
      include: {
        members: {
          orderBy: [
            {
              order: "asc",
            },
            {
              name: "asc",
            },
          ],
        },
      },
    }),
  ]);

  const memberCount = categories.reduce(
    (total, category) => total + category.members.length,
    0,
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="İnsan ve Ekip"
        title="Ekip Yönetimi"
        description={`${memberCount} ekip üyesini kategorileriyle birlikte yönetin ve halka açık listedeki sıralarını belirleyin.`}
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/ekip/kategoriler">
              <FolderCog aria-hidden="true" />
              Kategorileri yönet
            </Link>
          </Button>
        }
      />

      {durum === "guncellendi" ? (
        <p
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          Ekip üyesi başarıyla güncellendi.
        </p>
      ) : null}

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,0.65fr)]">
        <section className="min-w-0 space-y-5">
          {categories.length ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7"
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-primary-950">
                      {category.name}
                    </h2>
                    <p className="mt-1 text-sm text-primary-400">
                      {category.members.length} ekip üyesi · kategori sırası{" "}
                      {category.order}
                    </p>
                  </div>
                </div>

                <div className="mt-5 divide-y divide-primary-50">
                  {category.members.map((member) => (
                    <article
                      key={member.id}
                      className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 font-heading text-sm font-bold text-primary-700">
                          {member.name
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toLocaleUpperCase("tr-TR")}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-heading font-bold text-primary-950">
                            {member.name}
                          </h3>
                          <p className="mt-1 text-sm text-primary-500">
                            {member.role}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-500">
                            <ListOrdered className="size-3.5" aria-hidden="true" />
                            Sıra {member.order}
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
                          <Link href={`/admin/ekip/${member.id}/duzenle`}>
                            <Pencil aria-hidden="true" />
                            Düzenle
                          </Link>
                        </Button>
                        <DeleteTeamMemberButton
                          memberId={member.id}
                          memberName={member.name}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-16 text-center">
              <UserRound className="mx-auto size-8 text-primary-300" />
              <p className="mt-3 text-sm font-semibold text-primary-600">
                Henüz ekip üyesi bulunmuyor.
              </p>
            </div>
          )}
        </section>

        <section className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7 xl:sticky xl:top-7">
          <h2 className="font-heading text-xl font-bold text-primary-950">
            Yeni ekip üyesi
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-400">
            Var olan bir kategori seçin veya formun içinden yeni kategori
            oluşturun.
          </p>
          <div className="mt-6">
            <TeamMemberAdminForm
              action={createTeamMemberAction}
              categories={categories.map((category) => ({
                id: category.id,
                name: category.name,
              }))}
              submitLabel="Ekip üyesi ekle"
              resetOnSuccess
            />
          </div>
        </section>
      </div>
    </>
  );
}
