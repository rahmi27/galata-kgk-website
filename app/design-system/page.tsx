import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { EventCard } from "@/components/shared/event-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { TeamMemberCard } from "@/components/shared/team-member-card";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tasarım Sistemi | Galata KGK",
  description: "Galata KGK web sitesi bileşen kontrol sayfası.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function DesignSystemPage() {
  const [stats, events, teamMembers] = await Promise.all([
    prisma.siteStat.findMany({
      orderBy: {
        order: "asc",
      },
      take: 3,
    }),
    prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
      take: 3,
    }),
    prisma.teamMember.findMany({
      orderBy: {
        order: "asc",
      },
      take: 4,
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="border-b border-primary/10 bg-primary-50/70 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Tasarım Sistemi"
              title="Kurumsal güven, genç ve enerjik bir ritim."
              description="Bu sayfa, Galata KGK arayüz bileşenlerini gerçek sayfa içeriğinden bağımsız olarak kontrol etmek için hazırlanmıştır."
            />
          </div>
        </section>

        <section className="border-b border-primary/10 py-16 dark:border-white/10 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Aksiyonlar"
              title="Net hiyerarşi, ölçülü vurgu."
              description="Lacivert ana aksiyonu taşır; turuncu yalnızca seçili vurgu noktalarında devreye girer."
            />
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button variant="primary">
                Ana Aksiyon
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button variant="secondary">
                Vurgu Aksiyonu
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button variant="outline">Çerçeveli</Button>
              <Button variant="ghost">Sessiz Aksiyon</Button>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="İstatistikler"
              title="Ölçülebilir etkiyi sade biçimde öne çıkarın."
              description="Büyük rakamlar ve kısa etiketlerle topluluğun ölçeğini hızlıca anlatan kartlar."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-primary/10 bg-primary-50/45 py-20 dark:border-white/10 dark:bg-white/[0.02] sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Etkinlik Kartları"
              title="Her buluşma için net bir hikâye alanı."
              description="Görsel, tarih ve kısa özetin dengeli biçimde bir araya geldiği etkinlik kartları."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  date={formatEventDate(event.date)}
                  title={event.title}
                  description={event.description}
                  imageSrc={event.imageUrl ?? undefined}
                  category={event.category}
                  href={`/etkinliklerimiz/${event.slug}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Ekip Kartları"
              title="İsimleri ve rolleri ön plana alan temiz portreler."
              description="Gerçek fotoğraflar eklenene kadar tutarlı bir placeholder sistemi kullanılır."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  imageSrc={member.photoUrl ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
