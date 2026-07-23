import Link from "next/link";
import { BarChart3, Cookie, LockKeyhole, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Çerez ve Analitik Bilgilendirmesi | Galata KGK",
  description:
    "İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü web sitesinde kullanılan zorunlu oturum teknolojileri ve anonim performans ölçümleri hakkında bilgi.",
  path: "/cerez-politikasi",
  keywords: ["çerez politikası", "Vercel Analytics", "Galata KGK gizlilik"],
});

const sections = [
  {
    icon: LockKeyhole,
    title: "Zorunlu oturum teknolojileri",
    description:
      "Halka açık sayfalarda kullanıcı hesabı veya kalıcı tercih çerezi kullanılmaz. Yalnızca yetkili yöneticilerin giriş yaptığı admin panelinde, güvenli oturumun sürdürülebilmesi için teknik olarak zorunlu Auth.js oturum çerezi kullanılır.",
  },
  {
    icon: BarChart3,
    title: "Anonim web analitiği",
    description:
      "Vercel Web Analytics; sayfa görüntüleme, genel cihaz ve yönlendiren kaynak gibi toplu kullanım verilerini ölçer. Vercel'in açıklamasına göre bu hizmet ziyaretçileri farklı günler veya siteler arasında takip eden çerezler kullanmaz ve verileri anonimleştirilmiş biçimde işler.",
  },
  {
    icon: ShieldCheck,
    title: "Performans ölçümü",
    description:
      "Vercel Speed Insights; sitenin açılış hızı ve Core Web Vitals metriklerini ölçerek teknik iyileştirmelere yardımcı olur. Analitik ve performans betikleri admin paneli ile tasarım kontrol sayfasında yüklenmez.",
  },
  {
    icon: Cookie,
    title: "Reklam ve pazarlama çerezleri",
    description:
      "Bu sitede reklam ağı, sosyal medya takip pikseli, kişiselleştirilmiş reklam veya davranışsal profilleme amacıyla çerez kullanılmaz. İleride bu durum değişirse bilgilendirme güncellenir ve gerekli tercih mekanizması ayrıca sunulur.",
  },
] as const;

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow="Gizlilik"
              title="Çerez ve analitik bilgilendirmesi"
              description="Sitenin çalışması ve performansının ölçülmesi sırasında kullanılan teknik araçları şeffaf biçimde açıklıyoruz."
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
            <p className="text-sm font-medium text-muted-foreground">
              Son güncelleme: 23 Temmuz 2026
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.title}
                    className="rounded-[1.5rem] border border-primary/10 bg-card p-6 dark:border-white/10 sm:p-8"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent-700 dark:text-accent-300">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 font-heading text-xl font-bold text-primary dark:text-white">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {section.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-primary/10 bg-primary-900 p-6 text-primary-100 sm:p-8">
              <h2 className="font-heading text-xl font-bold text-white">
                Daha fazla bilgi
              </h2>
              <p className="mt-3 leading-7 text-primary-200">
                Kişisel verilerin işlenmesine ilişkin talepler için{" "}
                <Link
                  href="mailto:dataprivacy@galatauni.edu.tr"
                  className="font-semibold text-accent-300 underline underline-offset-4"
                >
                  dataprivacy@galatauni.edu.tr
                </Link>{" "}
                adresinden İstanbul Galata Üniversitesi’ne ulaşabilirsiniz.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <Link
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-300 underline underline-offset-4"
                >
                  Vercel Analytics gizlilik açıklaması
                </Link>
                <Link
                  href="https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-300 underline underline-offset-4"
                >
                  KVKK Çerez Uygulamaları Rehberi
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
