import Link from "next/link";
import { ArrowLeft, FolderCog, UsersRound } from "lucide-react";

import { createTeamCategoryAction, updateTeamCategoryAction } from "@/app/admin/(panel)/uyeler/kategoriler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteTeamCategoryButton } from "@/components/admin/delete-team-category-button";
import { TeamCategoryForm } from "@/components/admin/team-category-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TeamCategoriesPage() {
  const categories = await prisma.teamCategory.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], include: { _count: { select: { memberships: true } } } });
  const nextOrder = categories.reduce((highest, category) => Math.max(highest, category.order), 0) + 1;
  return (
    <>
      <AdminPageHeader eyebrow="Ekip Yapısı" title="Ekip Kategorileri" description="Kategori adlarını ve halka açık Ekibimiz sayfasındaki bölüm sıralarını yönetin." actions={<Button asChild variant="outline" className="rounded-xl"><Link href="/admin/uyeler"><ArrowLeft />Üyelere dön</Link></Button>} />
      <section className="mt-9 rounded-[1.5rem] border border-primary-100 bg-white p-5 dark:border-white/10 dark:bg-primary-950 sm:p-7">
        <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700"><FolderCog className="size-5" /></div><div><h2 className="font-heading text-lg font-bold text-primary-950 dark:text-white">Yeni kategori oluştur</h2><p className="mt-1 text-xs text-primary-600 dark:text-primary-200">Büyük/küçük harf farkı aynı kategori sayılır.</p></div></div>
        <div className="mt-6"><TeamCategoryForm action={createTeamCategoryAction} defaultOrder={nextOrder} submitLabel="Kategori ekle" resetOnSuccess /></div>
      </section>
      <section className="mt-6 space-y-4">
        {categories.map((category) => {
          const updateAction = updateTeamCategoryAction.bind(null, category.id);
          return <article key={category.id} className="rounded-[1.5rem] border border-primary-100 bg-white p-5 dark:border-white/10 dark:bg-primary-950 sm:p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-primary-50 pb-4 dark:border-white/10"><div><p className="font-heading font-bold text-primary-950 dark:text-white">{category.name}</p><p className="mt-1 text-xs text-primary-600 dark:text-primary-200">/{category.slug}</p></div><div className="flex items-center gap-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-800 dark:text-primary-100"><UsersRound className="size-3.5" />{category._count.memberships} atama</span><DeleteTeamCategoryButton categoryId={category.id} categoryName={category.name} memberCount={category._count.memberships} /></div></div><TeamCategoryForm action={updateAction} defaultName={category.name} defaultNameEn={category.nameEn} defaultOrder={category.order} submitLabel="Kaydet" /></article>;
        })}
      </section>
    </>
  );
}
