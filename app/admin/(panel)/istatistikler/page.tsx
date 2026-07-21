import { BarChart3, GripVertical } from "lucide-react";

import { updateSiteStatAction } from "@/app/admin/(panel)/istatistikler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatAdminForm } from "@/components/admin/stat-admin-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const stats = await prisma.siteStat.findMany({
    orderBy: {
      order: "asc",
    },
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="Anasayfa İçeriği"
        title="İstatistik Kartları"
        description="Anasayfada kulübün etkisini anlatan sayı, etiket ve sıralamayı buradan yönetin. Düşük sıra değeri önce gösterilir."
      />

      <p className="mt-6 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm leading-6 text-primary-800">
        Editör notu: Kaydedilen değerler anasayfaya doğrudan yansır.
        Yalnızca kulübün doğrulanmış güncel rakamlarını kullanın; kesinleşmeyen
        sayılar için tahmin eklemeyin.
      </p>

      <section className="mt-9 space-y-4">
        {stats.length ? (
          stats.map((stat) => {
            const updateAction = updateSiteStatAction.bind(null, stat.id);

            return (
              <article
                key={stat.id}
                className="grid gap-5 rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7 lg:grid-cols-[12rem_1fr] lg:items-center"
              >
                <div className="flex items-center gap-4 rounded-2xl bg-primary-950 p-4 text-white lg:min-h-32 lg:flex-col lg:items-start lg:justify-between">
                  <BarChart3
                    className="size-5 text-accent-300"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-heading text-3xl font-bold tracking-[-0.04em]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-primary-300">{stat.label}</p>
                  </div>
                  <GripVertical
                    className="ml-auto size-4 text-primary-500 lg:ml-0"
                    aria-hidden="true"
                  />
                </div>
                <StatAdminForm
                  action={updateAction}
                  statId={stat.id}
                  label={stat.label}
                  value={stat.value}
                  order={stat.order}
                />
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-16 text-center">
            <BarChart3 className="mx-auto size-9 text-primary-300" />
            <p className="mt-3 text-sm font-semibold text-primary-600">
              Düzenlenecek istatistik kartı bulunmuyor.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
