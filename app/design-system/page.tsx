import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { EventCard } from "@/components/shared/event-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { TeamMemberCard } from "@/components/shared/team-member-card";

export const metadata: Metadata = {
  title: "Tasarım Sistemi | Galata KGK",
  description: "Galata KGK web sitesi bileşen kontrol sayfası.",
  robots: {
    index: false,
    follow: false,
  },
};

const stats = [
  { value: "500+", label: "Topluluk üyesi" },
  { value: "24", label: "Yıllık etkinlik" },
  { value: "18", label: "Sektör iş birliği" },
];

const events = [
  {
    date: "12 Ekim",
    title: "Kariyer Buluşması",
    description:
      "Sektör profesyonelleriyle deneyim paylaşımı ve bağlantı kurma oturumu.",
  },
  {
    date: "24 Ekim",
    title: "Girişimcilik Atölyesi",
    description:
      "Fikirden ürüne uzanan süreci uygulamalı çalışmalarla keşfetme programı.",
  },
  {
    date: "08 Kasım",
    title: "Sektör Sohbetleri",
    description:
      "Farklı disiplinlerden konuklarla güncel iş dünyasına yakından bakış.",
  },
];

const teamMembers = [
  { name: "Ada Yılmaz", role: "Yönetim Kurulu Başkanı" },
  { name: "Mert Kaya", role: "Başkan Yardımcısı" },
  { name: "İpek Demir", role: "Etkinlik Koordinatörü" },
  { name: "Ege Arslan", role: "İletişim Koordinatörü" },
];

export default function DesignSystemPage() {
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
                  key={event.title}
                  {...event}
                  href="#"
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
                <TeamMemberCard key={member.name} {...member} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
