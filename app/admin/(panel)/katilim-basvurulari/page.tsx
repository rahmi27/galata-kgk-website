import {
  BookOpen,
  Mail,
  Phone,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteMembershipApplicationButton } from "@/components/admin/delete-membership-application-button";
import { MembershipStatusSelect } from "@/components/admin/membership-status-select";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
});

const statusStyles: Record<string, string> = {
  beklemede: "bg-amber-100 text-amber-800",
  onaylandı: "bg-emerald-100 text-emerald-700",
  reddedildi: "bg-red-100 text-red-700",
};

export default async function AdminMembershipApplicationsPage() {
  const applications = await prisma.membershipApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = applications.filter(
    (application) => application.status === "beklemede",
  ).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Topluluk Başvuruları"
        title="Katılım Başvuruları"
        description="Adayların motivasyonlarını inceleyin ve değerlendirme durumlarını güncel tutun."
      />

      <div className="mt-7 flex flex-wrap gap-3">
        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm ring-1 ring-primary-100">
          Toplam {applications.length} başvuru
        </span>
        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
          {pendingCount} bekliyor
        </span>
      </div>

      <section className="mt-7 space-y-5">
        {applications.length ? (
          applications.map((application) => (
            <article
              key={application.id}
              className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-7"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-heading text-xl font-bold text-primary-950">
                      {application.fullName}
                    </h2>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-bold",
                        statusStyles[application.status] ??
                          "bg-primary-100 text-primary-700",
                      )}
                    >
                      {application.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-primary-400">
                    {dateFormatter.format(application.createdAt)}
                  </p>
                </div>
                <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-primary-400">
                    Başvuru durumu
                  </label>
                  <MembershipStatusSelect
                    applicationId={application.id}
                    currentStatus={application.status}
                  />
                  <DeleteMembershipApplicationButton
                    applicationId={application.id}
                    applicantName={application.fullName}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-y border-primary-50 py-5 text-sm text-primary-600 sm:grid-cols-2 xl:grid-cols-4">
                <a
                  href={`mailto:${application.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent-700"
                >
                  <Mail className="size-4 text-accent-600" aria-hidden="true" />
                  <span className="truncate">{application.email}</span>
                </a>
                <span className="flex items-center gap-2">
                  <BookOpen
                    className="size-4 text-accent-600"
                    aria-hidden="true"
                  />
                  {application.department}
                </span>
                <span className="flex items-center gap-2">
                  <UserRoundCheck
                    className="size-4 text-accent-600"
                    aria-hidden="true"
                  />
                  {application.studentNumber ?? "Öğrenci no paylaşılmadı"}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="size-4 text-accent-600" aria-hidden="true" />
                  {application.phone ?? "Telefon paylaşılmadı"}
                </span>
              </div>

              <div className="mt-5">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary-400">
                  Katılım motivasyonu
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-primary-700">
                  {application.motivation}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-primary-200 bg-white px-5 py-16 text-center">
            <UsersRound className="mx-auto size-9 text-primary-300" />
            <p className="mt-3 text-sm font-semibold text-primary-600">
              Henüz katılım başvurusu bulunmuyor.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
