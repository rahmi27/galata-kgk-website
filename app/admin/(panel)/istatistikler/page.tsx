import { BarChart3, GripVertical } from "lucide-react";

import { updateSiteStatAction } from "@/app/admin/(panel)/istatistikler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CreateStatButton } from "@/components/admin/create-stat-button";
import { DeleteStatButton } from "@/components/admin/delete-stat-button";
import { StatAdminForm } from "@/components/admin/stat-admin-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const stats = await prisma.siteStat.findMany({
    orderBy: {
      order: "asc",
    },
  });
  const suggestedOrder =
    stats.reduce((highestOrder, stat) => Math.max(highestOrder, stat.order), 0) +
    1;

  return (
    <>
      <AdminPageHeader
        eyebrow="Anasayfa İçeriği"
        title="İstatistik Kartları"
        description="Anasayfada kulübün etkisini anlatan sayı, etiket ve sıralamayı buradan yönetin. Düşük sıra değeri önce gösterilir."
        actions={<CreateStatButton suggestedOrder={suggestedOrder} />}
      />

      <p className="mt-6 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm leading-6 text-primary-800 dark:border-accent-700/60 dark:bg-accent-900/25 dark:text-primary-100">
        <strong className="font-semibold text-primary-950 dark:text-white">
          Editör notu:
        </strong>{" "}
        Kaydedilen değerler anasayfaya doğrudan yansır.
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
                <div>
                  <StatAdminForm
                    action={updateAction}
                    statId={stat.id}
                    label={stat.label}
                    labelEn={stat.labelEn}
                    value={stat.value}
                    order={stat.order}
                  />
                  <div className="mt-4 flex justify-end border-t border-primary-100 pt-4 dark:border-white/10">
                    <DeleteStatButton
                      statId={stat.id}
                      statLabel={stat.label}
                    />
                  </div>
                </div>
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
