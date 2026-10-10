import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicClubSocialLinks } from "@/lib/club-social-links";
import { createPageMetadata } from "@/lib/site-metadata";
import { MemberForm } from "@/components/join/member-form";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return createPageMetadata({ title: locale === "en" ? "Become a member | Galata KGK" : "Üye Ol | Galata KGK", description: locale === "en" ? "Club membership information." : "Galata KGK kulübüne hemen üye ol.", path: "/katilim/uye", locale }); }
export default async function MemberPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  if (locale === "en") return <main className="mx-auto max-w-3xl px-5 py-24"><h1 className="font-heading text-3xl font-bold">Become a member</h1><p className="mt-5 text-muted-foreground">Applications are currently handled in Turkish for İstanbul Galata University students.</p><Link href="/katilim/uye" locale="tr" className="mt-7 inline-block font-bold text-accent-700 underline dark:text-accent-300">Open Turkish form →</Link></main>;
  const [departments, links] = await Promise.all([prisma.department.findMany({ where: { isActive: true }, orderBy: [{ order: "asc" }, { name: "asc" }], select: { name: true } }), getPublicClubSocialLinks()]);
  return <main className="mx-auto max-w-4xl px-5 py-16"><MemberForm departments={departments.map((item) => item.name)} socials={links.filter((link) => ["whatsapp", "instagram", "tiktok", "youtube"].includes(link.platform))} /></main>;
}
