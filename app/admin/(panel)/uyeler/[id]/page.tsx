import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers3, UserRound } from "lucide-react";

import { createMembershipAction, updateMembershipAction, updatePersonAction } from "@/app/admin/(panel)/uyeler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteTeamMembershipButton } from "@/components/admin/delete-team-membership-button";
import { MembershipAssignmentForm } from "@/components/admin/membership-assignment-form";
import { MembershipEditForm } from "@/components/admin/membership-edit-form";
import { PersonAdminForm } from "@/components/admin/person-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PersonDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ durum?: string }> }) {
  const [{ id }, { durum }] = await Promise.all([params, searchParams]);
  const personId = Number(id);
  if (!Number.isInteger(personId) || personId <= 0) notFound();

  const [person, categories] = await Promise.all([
    prisma.person.findUnique({
      where: { id: personId },
      include: { memberships: { orderBy: [{ category: { order: "asc" } }, { order: "asc" }], include: { category: true } } },
    }),
    prisma.teamCategory.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], include: { _count: { select: { memberships: true } } } }),
  ]);
  if (!person) notFound();

  const updatePerson = updatePersonAction.bind(null, person.id);
  const createAssignment = createMembershipAction.bind(null, person.id);

  return (
    <>
      <AdminPageHeader eyebrow="Üye Profili" title={person.name} description="Temel kişi bilgilerini ve kategori bazındaki rol/sıra atamalarını birbirinden bağımsız yönetin." actions={<Button asChild variant="outline" className="rounded-xl"><Link href="/admin/uyeler"><ArrowLeft />Üyelere dön</Link></Button>} />
      {durum === "guncellendi" ? <p role="status" className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Kişi bilgileri güncellendi.</p> : null}
      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
        <section className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 dark:border-white/10 dark:bg-primary-950 sm:p-7">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary-950 dark:text-white"><UserRound className="size-5 text-accent-700" />Kişi bilgileri</h2>
          <div className="mt-6"><PersonAdminForm action={updatePerson} submitLabel="Kişiyi güncelle" defaultValues={{ name: person.name, department: person.department, photoUrl: person.photoUrl ?? "", photoAlt: person.photoAlt ?? "", socialPlatform: person.socialPlatform ?? "", socialUrl: person.socialUrl ?? "" }} /></div>
        </section>
        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 dark:border-white/10 dark:bg-primary-950 sm:p-7">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary-950 dark:text-white"><Layers3 className="size-5 text-accent-700" />Kategori ve roller</h2>
            <div className="mt-5 space-y-4">
              {person.memberships.length ? person.memberships.map((membership) => {
                const updateMembership = updateMembershipAction.bind(null, membership.id);
                return <article key={membership.id} className="rounded-xl border border-primary-100 bg-primary-50/70 p-4 dark:border-white/10 dark:bg-primary-900"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-heading font-bold text-primary-950 dark:text-white">{membership.category.name}</h3><p className="mt-1 text-xs text-primary-500 dark:text-primary-200">/{membership.category.slug}</p></div><DeleteTeamMembershipButton membershipId={membership.id} personName={person.name} categoryName={membership.category.name} /></div><MembershipEditForm action={updateMembership} role={membership.role} order={membership.order} membershipId={membership.id} /></article>;
              }) : <p className="rounded-xl border border-dashed border-primary-200 px-4 py-8 text-center text-sm font-medium text-primary-600 dark:border-white/15 dark:text-primary-200">Bu kişi henüz bir kategoriye atanmadı.</p>}
            </div>
          </section>
          <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 dark:border-white/10 dark:bg-primary-950 sm:p-7">
            <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">Yeni kategori ataması</h2>
            <p className="mt-2 text-sm text-primary-600 dark:text-primary-200">Aynı kişi başka kategorilere farklı rol ve sırayla eklenebilir.</p>
            <div className="mt-6"><MembershipAssignmentForm action={createAssignment} people={[]} fixedPerson={{ id: person.id, name: person.name, department: person.department }} categories={categories.map((category) => ({ id: category.id, name: category.name, nextOrder: category._count.memberships + 1 }))} /></div>
          </section>
        </div>
      </div>
    </>
  );
}
