import Link from "next/link";
import {
  FolderCog,
  ListOrdered,
  Pencil,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

import { createMembershipAction } from "@/app/admin/(panel)/uyeler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteTeamMembershipButton } from "@/components/admin/delete-team-membership-button";
import { MembershipAssignmentForm } from "@/components/admin/membership-assignment-form";
import { PersonAvatar } from "@/components/admin/person-avatar";
import { SocialPlatformIcon } from "@/components/shared/social-platform-icon";
import { Button } from "@/components/ui/button";
import { sortPeopleByMembershipPriority } from "@/lib/person-priority";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const [categories, peopleWithMemberships] = await Promise.all([
    prisma.teamCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        memberships: {
          orderBy: [{ order: "asc" }, { person: { name: "asc" } }],
          include: { person: true },
        },
      },
    }),
    prisma.person.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        department: true,
        memberships: {
          select: {
            order: true,
            category: { select: { order: true } },
          },
        },
      },
    }),
  ]);
  const people = sortPeopleByMembershipPriority(peopleWithMemberships).map(
    ({ id, name, department }) => ({ id, name, department }),
  );
  const membershipCount = categories.reduce(
    (total, category) => total + category.memberships.length,
    0,
  );
  const createAssignment = createMembershipAction.bind(null, null);

  return (
    <>
      <AdminPageHeader
        eyebrow="İnsan ve Ekip"
        title="Ekip Yönetimi"
        description={`${categories.length} kategori içindeki ${membershipCount} görev atamasını yönetin. Aynı kişi farklı kategorilerde farklı rollerle yer alabilir.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/admin/uyeler/kisiler">
                <UserRoundCog aria-hidden="true" />
                Üyeleri Yönet
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/admin/uyeler/kategoriler">
                <FolderCog aria-hidden="true" />
                Kategorileri Yönet
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,0.62fr)]">
        <section className="min-w-0 space-y-5">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7"
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-primary-50 pb-4 dark:border-white/10">
                <div>
                  <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-primary-600 dark:text-primary-200">
                    {category.memberships.length} üye · kategori sırası {category.order}
                  </p>
                </div>
              </div>

              {category.memberships.length ? (
                <div className="divide-y divide-primary-50 dark:divide-white/10">
                  {category.memberships.map((membership) => (
                    <div
                      key={membership.id}
                      className="flex flex-col gap-4 py-4 first:pt-5 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <PersonAvatar
                          name={membership.person.name}
                          photoUrl={membership.person.photoUrl}
                          photoAlt={membership.person.photoAlt}
                          size={44}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading font-bold text-primary-950 dark:text-white">
                              {membership.person.name}
                            </h3>
                            {membership.person.socialPlatform &&
                            membership.person.socialUrl ? (
                              <SocialPlatformIcon
                                platform={membership.person.socialPlatform}
                                className="size-4 text-accent-700 dark:text-accent-300"
                              />
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-primary-700 dark:text-primary-100">
                            {membership.role}
                          </p>
                          <p className="mt-1 text-xs text-primary-500 dark:text-primary-300">
                            {membership.person.department}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-800 dark:text-primary-100">
                            <ListOrdered className="size-3.5" aria-hidden="true" />
                            Sıra {membership.order}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="rounded-lg"
                        >
                          <Link href={`/admin/uyeler/${membership.person.id}`}>
                            <Pencil aria-hidden="true" />
                            Düzenle
                          </Link>
                        </Button>
                        <DeleteTeamMembershipButton
                          membershipId={membership.id}
                          personName={membership.person.name}
                          categoryName={category.name}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <UsersRound className="mx-auto size-7 text-primary-300 dark:text-primary-500" />
                  <p className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-200">
                    Bu kategoride henüz üye yok.
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7 xl:sticky xl:top-7">
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Yeni ekip üyesi
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-600 dark:text-primary-200">
            Yeni bir kişi oluşturun veya mevcut bir kişiyi seçilen kategoriye
            yeni rolüyle ekleyin.
          </p>
          <div className="mt-6">
            <MembershipAssignmentForm
              action={createAssignment}
              people={people}
              categories={categories.map((category) => ({
                id: category.id,
                name: category.name,
                nextOrder: category.memberships.length + 1,
              }))}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
