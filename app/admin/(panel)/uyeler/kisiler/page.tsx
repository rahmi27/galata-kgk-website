import Link from "next/link";
import { ArrowLeft, ListOrdered, Pencil, UserRound } from "lucide-react";

import {
  createMembershipAction,
  createPersonAction,
} from "@/app/admin/(panel)/uyeler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeletePersonButton } from "@/components/admin/delete-person-button";
import { DeleteTeamMembershipButton } from "@/components/admin/delete-team-membership-button";
import { PersonAdminForm } from "@/components/admin/person-admin-form";
import { PersonAvatar } from "@/components/admin/person-avatar";
import { PersonMembershipDialog } from "@/components/admin/person-membership-dialog";
import { SocialPlatformIcon } from "@/components/shared/social-platform-icon";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PeopleManagementPage() {
  const [people, categories] = await Promise.all([
    prisma.person.findMany({
      orderBy: { name: "asc" },
      include: {
        memberships: {
          orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
          include: { category: true },
        },
      },
    }),
    prisma.teamCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { _count: { select: { memberships: true } } },
    }),
  ]);
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
    nextOrder: category._count.memberships + 1,
  }));

  return (
    <>
      <AdminPageHeader
        eyebrow="Tekil Kişi Kayıtları"
        title="Üyeleri Yönet"
        description={`${people.length} kişinin fotoğraf, bölüm ve kategori görevlerini merkezi olarak yönetin.`}
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/uyeler">
              <ArrowLeft aria-hidden="true" />
              Ekip yönetimine dön
            </Link>
          </Button>
        }
      />

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.55fr)]">
        <section className="min-w-0 space-y-4">
          {people.length ? (
            people.map((person) => (
              <article
                key={person.id}
                className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <PersonAvatar
                      name={person.name}
                      photoUrl={person.photoUrl}
                      photoAlt={person.photoAlt}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-heading text-lg font-bold text-primary-950 dark:text-white">
                          {person.name}
                        </h2>
                        {person.socialPlatform && person.socialUrl ? (
                          <SocialPlatformIcon
                            platform={person.socialPlatform}
                            className="size-4 text-accent-700 dark:text-accent-300"
                          />
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-primary-600 dark:text-primary-200">
                        {person.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PersonMembershipDialog
                      action={createMembershipAction.bind(null, person.id)}
                      person={{
                        id: person.id,
                        name: person.name,
                        department: person.department,
                      }}
                      categories={categoryOptions}
                    />
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                      <Link href={`/admin/uyeler/${person.id}`}>
                        <Pencil aria-hidden="true" />
                        Temel bilgileri düzenle
                      </Link>
                    </Button>
                    <DeletePersonButton
                      personId={person.id}
                      personName={person.name}
                      membershipCount={person.memberships.length}
                    />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-primary-50 pt-4 dark:border-white/10">
                  {person.memberships.length ? (
                    person.memberships.map((membership) => (
                      <div
                        key={membership.id}
                        className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-primary-100 bg-primary-50 py-1 pl-3 pr-1 text-xs font-semibold text-primary-800 dark:border-white/10 dark:bg-primary-800 dark:text-primary-100"
                      >
                        <span>{membership.category.name}</span>
                        <span className="text-primary-500 dark:text-primary-300">· {membership.role}</span>
                        <span className="inline-flex items-center gap-1 text-accent-800 dark:text-accent-300"><ListOrdered className="size-3" aria-hidden="true" />{membership.order}</span>
                        <DeleteTeamMembershipButton
                          membershipId={membership.id}
                          personName={person.name}
                          categoryName={membership.category.name}
                        />
                      </div>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Henüz kategori ataması yok.
                    </span>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-16 text-center dark:border-white/15 dark:bg-primary-950">
              <UserRound className="mx-auto size-8 text-primary-400" />
              <p className="mt-3 text-sm font-semibold text-primary-700 dark:text-primary-100">
                Henüz kişi kaydı bulunmuyor.
              </p>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7 xl:sticky xl:top-7">
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Kategorisiz yeni kişi
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-600 dark:text-primary-200">
            Kişiyi merkezi listeye ekleyin; kategori ve rol atamasını kişi
            detayından veya Ekip Yönetimi ekranından yapın.
          </p>
          <div className="mt-6">
            <PersonAdminForm
              action={createPersonAction}
              submitLabel="Kişiyi oluştur"
              resetOnSuccess
            />
          </div>
        </aside>
      </div>
    </>
  );
}
