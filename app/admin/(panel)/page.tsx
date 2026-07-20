import {
  CalendarDays,
  Inbox,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SummaryCard } from "@/components/admin/summary-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    eventCount,
    teamMemberCount,
    unreadMessageCount,
    pendingApplicationCount,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.teamMember.count(),
    prisma.contactSubmission.count({
      where: {
        isRead: false,
      },
    }),
    prisma.membershipApplication.count({
      where: {
        status: "beklemede",
      },
    }),
  ]);

  const cards = [
    {
      label: "Toplam etkinlik",
      value: eventCount,
      helper: "Yayındaki geçmiş ve yaklaşan tüm etkinlikler",
      icon: CalendarDays,
    },
    {
      label: "Ekip üyesi",
      value: teamMemberCount,
      helper: "Departmanlarda listelenen aktif ekip üyeleri",
      icon: UsersRound,
    },
    {
      label: "Okunmamış mesaj",
      value: unreadMessageCount,
      helper: "İletişim formundan yanıt bekleyen mesajlar",
      icon: Inbox,
      tone: "accent" as const,
    },
    {
      label: "Bekleyen başvuru",
      value: pendingApplicationCount,
      helper: "Henüz değerlendirilmemiş kulüp katılım talepleri",
      icon: UserRoundCheck,
      tone: "accent" as const,
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Genel Bakış"
        title="Bugün neyi yönetiyoruz?"
        description="Kulübün içerik, iletişim ve başvuru akışındaki güncel durumu tek ekranda takip edin."
      />

      <section
        className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Yönetim özeti"
      >
        {cards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </section>

      <section className="mt-7 rounded-[1.5rem] border border-primary-100 bg-primary-950 p-6 text-white shadow-[0_20px_60px_-42px_rgba(27,42,94,0.8)] sm:p-8">
        <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-accent-300">
          Hızlı başlangıç
        </p>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em]">
          Sol menüden yönetmek istediğiniz alanı seçin.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-primary-200">
          Etkinlik ve ekip içeriklerini güncelleyebilir, mesajları okuyabilir,
          üyelik başvurularını değerlendirebilir ve anasayfa istatistiklerini
          düzenleyebilirsiniz.
        </p>
      </section>
    </>
  );
}
