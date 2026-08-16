import Link from "next/link";
import { FolderCog, ListOrdered, Pencil, UserRound, UsersRound } from "lucide-react";

import { createMembershipAction, createPersonAction } from "@/app/admin/(panel)/uyeler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MembershipAssignmentForm } from "@/components/admin/membership-assignment-form";
import { PersonAdminForm } from "@/components/admin/person-admin-form";
import { SocialPlatformIcon } from "@/components/shared/social-platform-icon";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPeoplePage() {
  const [people, categories] = await Promise.all([
    prisma.person.findMany({
      orderBy: [{ name: "asc" }],
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
  const createAssignment = createMembershipAction.bind(null, null);

  return (
    <>
      <AdminPageHeader
        eyebrow="İnsan ve Ekip"
        title="Üyeler"
        description={`${people.length} gerçek kişiyi tekil kayıtlarla yönetin; her kişiye birden fazla kategoride ayrı rol ve sıra atayın.`}
        actions={<Button asChild variant="outline" className="rounded-xl"><Link href="/admin/uyeler/kategoriler"><FolderCog />Kategorileri yönet</Link></Button>}
      />

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,0.62fr)]">
        <section className="min-w-0 space-y-4">
          {people.length ? people.map((person) => (
            <article key={person.id} className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-50 font-heading text-sm font-bold text-primary-700 dark:bg-primary-800 dark:text-primary-100">
                    {person.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("tr-TR")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-lg font-bold text-primary-950 dark:text-white">{person.name}</h2>
                      {person.socialPlatform && person.socialUrl ? <span title="Profil bağlantısı mevcut" className="text-accent-700 dark:text-accent-300"><SocialPlatformIcon platform={person.socialPlatform} className="size-4" /></span> : null}
                    </div>
                    <p className="mt-1 text-sm text-primary-600 dark:text-primary-200">{person.department}</p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="rounded-lg"><Link href={`/admin/uyeler/${person.id}`}><Pencil />Düzenle</Link></Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-primary-50 pt-4 dark:border-white/10">
                {person.memberships.length ? person.memberships.map((membership) => (
                  <span key={membership.id} className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800 dark:border-white/10 dark:bg-primary-800 dark:text-primary-100">
                    {membership.category.name}
                    <span className="text-primary-500 dark:text-primary-300">· {membership.role}</span>
                    <span className="inline-flex items-center gap-1 text-accent-800 dark:text-accent-300"><ListOrdered className="size-3" />{membership.order}</span>
                  </span>
                )) : <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Henüz kategori ataması yok.</span>}
              </div>
            </article>
          )) : (
            <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-16 text-center dark:border-white/15 dark:bg-primary-950"><UserRound className="mx-auto size-8 text-primary-400" /><p className="mt-3 text-sm font-semibold text-primary-700 dark:text-primary-100">Henüz kişi kaydı bulunmuyor.</p></div>
          )}
        </section>

        <aside className="space-y-6 xl:sticky xl:top-7 xl:h-fit">
          <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary-950 dark:text-white"><UserRound className="size-5 text-accent-700" />Yeni kişi</h2>
            <p className="mt-2 text-sm leading-6 text-primary-600 dark:text-primary-200">Kişinin temel kaydını oluşturun. Kategori ataması ayrı yapılır.</p>
            <div className="mt-6"><PersonAdminForm action={createPersonAction} submitLabel="Kişiyi oluştur" resetOnSuccess /></div>
          </section>
          <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] dark:border-white/10 dark:bg-primary-950 sm:p-7">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary-950 dark:text-white"><UsersRound className="size-5 text-accent-700" />Kategori ataması</h2>
            <p className="mt-2 text-sm leading-6 text-primary-600 dark:text-primary-200">Var olan kişiyi arayın veya aynı akışta yeni bir kişi oluşturun.</p>
            <div className="mt-6"><MembershipAssignmentForm action={createAssignment} people={people.map(({ id, name, department }) => ({ id, name, department }))} categories={categories.map((category) => ({ id: category.id, name: category.name, nextOrder: category._count.memberships + 1 }))} /></div>
          </section>
        </aside>
      </div>
    </>
  );
}
