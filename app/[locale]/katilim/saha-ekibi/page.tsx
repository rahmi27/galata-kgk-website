import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicClubSocialLinks } from "@/lib/club-social-links";
import { createPageMetadata, localizedPublicPath } from "@/lib/site-metadata";
import { getOpenPositions } from "@/lib/open-positions";
import { TeamWizard } from "@/components/join/team-wizard";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metadata = createPageMetadata({ title: locale === "en" ? "Team applications | Galata KGK" : "Saha Ekibine Başvur | Galata KGK", description: locale === "en" ? "Team application information." : "Açık saha ekibi pozisyonlarını keşfet ve başvur.", path: "/katilim/saha-ekibi", locale });
  return {
    ...metadata,
    alternates: { canonical: localizedPublicPath("/katilim/saha-ekibi", locale === "en" ? "en" : "tr"), languages: {} },
    robots: { index: false, follow: true },
  };
}
export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const positions = await getOpenPositions();
  if (!positions.length) redirect(locale === "en" ? "/en/join" : "/katilim");
  if (locale === "en") return <main className="mx-auto max-w-3xl px-5 py-24"><h1 className="font-heading text-3xl font-bold">Team applications</h1><p className="mt-5 text-muted-foreground">Applications are currently handled in Turkish for İstanbul Galata University students.</p><Link href="/katilim/saha-ekibi" locale="tr" className="mt-7 inline-block font-bold text-accent-700 underline dark:text-accent-300">Open Turkish form →</Link></main>;
  const [departments, links] = await Promise.all([
    prisma.department.findMany({ where: { isActive: true }, orderBy: [{ order: "asc" }, { name: "asc" }], select: { name: true } }), getPublicClubSocialLinks(),
  ]);
  return <main className="mx-auto max-w-5xl px-5 py-16"><TeamWizard positions={positions.map((position) => ({ ...position, deadline: position.deadline?.toISOString() || null }))} departments={departments.map((item) => item.name)} socials={links.filter((link) => ["whatsapp", "instagram", "tiktok", "youtube"].includes(link.platform))} /></main>;
}
