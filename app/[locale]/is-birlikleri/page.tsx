import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";

import { PartnerClubCard } from "@/components/collaborations/partner-club-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import collaborationContent from "@/content/collaborations.json";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: collaborationContent.meta.title,
  description: collaborationContent.meta.description,
  path: "/is-birlikleri",
  keywords: [
    "Galata KGK iş birlikleri",
    "üniversite kulüpleri",
    "öğrenci kulübü ortaklıkları",
  ],
});

export const revalidate = 300;

export default async function CollaborationsPage() {
  const partnerClubs = await prisma.partnerClub.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
        <div
          className="absolute -right-32 -top-48 size-[32rem] rounded-full border-[72px] border-accent/10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            as="h1"
            eyebrow={collaborationContent.hero.eyebrow}
            title={collaborationContent.hero.title}
            description={collaborationContent.hero.description}
          />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {partnerClubs.length ? (
            <div className="stagger-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partnerClubs.map((club) => (
                <PartnerClubCard
                  key={club.id}
                  name={club.name}
                  slug={club.slug}
                  logoUrl={club.logoUrl}
                  logoAlt={club.logoAlt}
                  shortDescription={club.shortDescription}
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-primary-200 bg-primary-50/60 px-6 py-16 text-center dark:border-white/15 dark:bg-white/[0.035] sm:px-12 sm:py-20">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-900 text-accent-300">
                <Handshake className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-heading text-3xl font-bold tracking-[-0.04em] text-primary dark:text-white">
                {collaborationContent.emptyState.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
                {collaborationContent.emptyState.description}
              </p>
              <Button asChild variant="secondary" className="mt-8">
                <Link href="/iletisim">
                  {collaborationContent.emptyState.cta}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
