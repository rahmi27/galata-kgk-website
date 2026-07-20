import { ShieldCheck, UserRound } from "lucide-react";

import { auth } from "@/auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminUserForm } from "@/components/admin/admin-user-form";
import { DeleteAdminUserButton } from "@/components/admin/delete-admin-user-button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
});

export default async function AdminUsersPage() {
  const [session, users] = await Promise.all([
    auth(),
    prisma.adminUser.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
      },
    }),
  ]);

  const currentUsername = session?.user.username ?? "";

  return (
    <>
      <AdminPageHeader
        eyebrow="Erişim Yönetimi"
        title="Admin Kullanıcılar"
        description="Yönetim paneline erişebilen hesapları görüntüleyin, yeni kullanıcı oluşturun veya artık kullanılmayan hesapları kaldırın."
      />

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.62fr)]">
        <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7">
          <div>
            <h2 className="font-heading text-xl font-bold text-primary-950">
              Yetkili hesaplar
            </h2>
            <p className="mt-1 text-sm text-primary-500">
              Toplam {users.length} admin kullanıcı
            </p>
          </div>

          <div className="mt-6 divide-y divide-primary-50">
            {users.map((user) => {
              const isCurrentUser = user.username === currentUsername;

              return (
                <article
                  key={user.id}
                  className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <UserRound className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-bold text-primary-950">
                          @{user.username}
                        </h3>
                        {isCurrentUser ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-700">
                            Aktif hesabınız
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-primary-500">
                        {user.name} · {dateFormatter.format(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <DeleteAdminUserButton
                    userId={user.id}
                    username={user.username}
                    disabled={isCurrentUser}
                  />
                </article>
              );
            })}
          </div>
        </section>

        <section className="h-fit rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7 xl:sticky xl:top-7">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-bold text-primary-950">
            Yeni admin ekle
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-500">
            Şifre kayıt sırasında bcrypt ile hashlenir ve daha sonra panelde
            gösterilmez.
          </p>
          <div className="mt-6">
            <AdminUserForm />
          </div>
        </section>
      </div>
    </>
  );
}
