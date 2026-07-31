import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Handshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import collaborationContent from "@/content/collaborations.json";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

type CollaborationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

const getPartnerClub = cache((slug: string) =>
  prisma.partnerClub.findUnique({
    where: { slug },
    include: {
      collaborations: {
        orderBy: [{ date: "desc" }, { order: "asc" }, { title: "asc" }],
      },
    },
  }),
);

export const revalidate = 300;

export async function generateStaticParams() {
  return prisma.partnerClub.findMany({
    select: { slug: true },
  });
}

export async function generateMetadata({
  params,
}: CollaborationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const partnerClub = await getPartnerClub(slug);

  if (!partnerClub) {
    return createPageMetadata({
      title: "Partner Kulüp Bulunamadı | Galata KGK",
      description: "Aradığınız partner kulüp kaydı bulunamadı.",
      path: "/is-birlikleri",
    });
  }

  return createPageMetadata({
    title: `${partnerClub.name} İş Birlikleri | Galata KGK`,
    description: partnerClub.shortDescription,
    path: `/is-birlikleri/${partnerClub.slug}`,
    keywords: [partnerClub.name, "kulüp iş birliği", "Galata KGK partnerleri"],
  });
}

export default async function CollaborationDetailPage({
  params,
}: CollaborationDetailPageProps) {
  const { slug } = await params;
  const partnerClub = await getPartnerClub(slug);

  if (!partnerClub) {
    notFound();
  }

  const datedCollaborations = partnerClub.collaborations.filter(
    (item) => item.date,
  );
  const ongoingCollaborations = partnerClub.collaborations.filter(
    (item) => !item.date,
  );

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-16 dark:border-white/10 dark:bg-primary-900/30 sm:py-20">
        <div
          className="absolute -right-28 -top-40 size-80 rounded-full border-[52px] border-accent/10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <Button asChild variant="ghost" className="-ml-4 w-fit">
            <Link href="/is-birlikleri">
              <ArrowLeft aria-hidden="true" />
              {collaborationContent.detail.backLabel}
            </Link>
          </Button>

          <div className="mt-9 grid gap-7 sm:grid-cols-[9rem_1fr] sm:items-center">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.75rem] border border-primary/10 bg-white p-5 shadow-[0_22px_60px_-42px_rgba(27,42,94,0.6)] dark:border-white/10">
              <Image
                src={partnerClub.logoUrl}
                alt={partnerClub.logoAlt ?? `${partnerClub.name} logosu`}
                width={240}
                height={240}
                priority
                sizes="144px"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
                Partner kulüp
              </p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.06] tracking-[-0.05em] text-primary sm:text-5xl dark:text-white">
                {partnerClub.name}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                {partnerClub.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl space-y-16 px-5 sm:px-8 lg:px-10">
          {partnerClub.collaborations.length ? (
            <>
              {datedCollaborations.length ? (
                <CollaborationGroup
                  title={collaborationContent.detail.datedTitle}
                  items={datedCollaborations}
                />
              ) : null}
              {ongoingCollaborations.length ? (
                <CollaborationGroup
                  title={collaborationContent.detail.ongoingTitle}
                  items={ongoingCollaborations}
                />
              ) : null}
            </>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-primary-200 bg-primary-50/60 px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.035]">
              <Handshake
                className="mx-auto size-8 text-accent-600 dark:text-accent-300"
                aria-hidden="true"
              />
              <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
                {collaborationContent.detail.emptyItems}
              </p>
            </div>
          )}

          <Button asChild variant="outline">
            <Link href="/is-birlikleri">
              <ArrowLeft aria-hidden="true" />
              {collaborationContent.detail.backLabel}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function CollaborationGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{
    id: number;
    title: string;
    description: string;
    date: Date | null;
  }>;
}) {
  return (
    <section aria-labelledby={`collaboration-group-${items[0]?.id}`}>
      <div className="flex items-center gap-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent/15 dark:text-accent-300">
          <Handshake className="size-4" aria-hidden="true" />
        </span>
        <h2
          id={`collaboration-group-${items[0]?.id}`}
          className="font-heading text-2xl font-bold tracking-[-0.035em] text-primary sm:text-3xl dark:text-white"
        >
          {title}
        </h2>
      </div>

      <ol className="relative mt-8 space-y-5 border-l border-primary-200 pl-7 dark:border-white/15 sm:pl-9">
        {items.map((item) => (
          <li
            key={item.id}
            className="relative rounded-[1.5rem] border border-primary/10 bg-card p-6 shadow-[0_20px_60px_-48px_rgba(27,42,94,0.65)] dark:border-white/10 dark:bg-white/[0.035] sm:p-7"
          >
            <span
              className="absolute -left-[2.15rem] top-8 size-3 rounded-full bg-accent ring-4 ring-background sm:-left-[2.65rem]"
              aria-hidden="true"
            />
            {item.date ? (
              <time
                dateTime={item.date.toISOString()}
                className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-accent-700 dark:text-accent-300"
              >
                <CalendarDays className="size-4" aria-hidden="true" />
                {dateFormatter.format(item.date)}
              </time>
            ) : null}
            <h3 className="mt-3 font-heading text-xl font-bold tracking-[-0.025em] text-primary dark:text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
