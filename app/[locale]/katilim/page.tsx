import { ArrowRight, UserRoundPlus, UsersRound } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return createPageMetadata({ title: locale === "en" ? "Join the club | Galata KGK" : "Kulübe Katıl | Galata KGK", description: locale === "en" ? "Become a member or apply for an open team role." : "Kulübe hemen üye ol veya açık saha ekibi pozisyonlarına başvur.", path: "/katilim", locale });
}

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const positions = await prisma.recruitmentPosition.findMany({ where: { isOpen: true, isArchived: false, OR: [{ deadline: null }, { deadline: { gt: new Date() } }] }, select: { id: true }, take: 1 });
  const open = positions.length > 0;
  const en = locale === "en";
  return <main className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
    <p className="text-xs font-bold uppercase tracking-[.2em] text-accent-700 dark:text-accent-300">GALATA KGK</p>
    <h1 className="mt-3 font-heading text-4xl font-bold text-primary-950 dark:text-white sm:text-5xl">{en ? "Find your place in the club" : "Kulübe katıl, birlikte üretelim"}</h1>
    <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{en ? "Choose the path that suits you. Club membership is immediate; team roles are reviewed separately." : "Sana uygun yolu seç. Kulüp üyeliğin hemen başlar; saha ekibi başvuruları ayrı değerlendirilir."}</p>
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      <Link href="/katilim/uye" locale={locale} className="group rounded-[2rem] border border-primary/10 bg-card p-8 shadow-lg transition-transform hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent dark:border-white/10">
        <UserRoundPlus className="size-11 text-accent-700 dark:text-accent-300" /><h2 className="mt-8 font-heading text-3xl font-bold">{en ? "Become a member" : "Üye ol"}</h2><p className="mt-4 text-muted-foreground">{en ? "Join the Galata KGK community in a few minutes, without an approval step." : "Onay beklemeden, birkaç dakikada kulüp topluluğuna katıl."}</p><span className="mt-8 inline-flex items-center gap-2 font-bold text-accent-700 dark:text-accent-300">{en ? "Get started" : "Hemen üye ol"}<ArrowRight className="size-4" /></span>
      </Link>
      {open ? <Link href="/katilim/saha-ekibi" locale={locale} className="group rounded-[2rem] border border-primary/10 bg-card p-8 shadow-lg transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent dark:border-white/10"><UsersRound className="size-11 text-accent-700 dark:text-accent-300" /><h2 className="mt-8 font-heading text-3xl font-bold">{en ? "Apply to the field team" : "Saha ekibine başvur"}</h2><p className="mt-4 text-muted-foreground">{en ? "Explore open roles and tell us what you can bring to the team." : "Açık pozisyonları incele, becerilerini ve fikirlerini bizimle paylaş."}</p><span className="mt-8 inline-flex items-center gap-2 font-bold text-accent-700 dark:text-accent-300">{en ? "See open roles" : "Pozisyonları gör"}<ArrowRight className="size-4" /></span></Link> : <div aria-disabled="true" className="rounded-[2rem] border border-dashed border-primary/20 bg-card/50 p-8 opacity-65 dark:border-white/20"><UsersRound className="size-11" /><h2 className="mt-8 font-heading text-3xl font-bold">{en ? "Apply to the field team" : "Saha ekibine başvur"}</h2><p className="mt-4 text-muted-foreground">{en ? "No roles are accepting applications right now." : "Şu an başvuru alınan pozisyon yok."}</p></div>}
    </div>
  </main>;
}
