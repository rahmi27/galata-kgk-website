import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { localizedPublicPath, siteUrl } from "@/lib/site-metadata";

export const revalidate = 3600;

const publicPaths = [
  "/",
  "/hakkimizda",
  "/etkinliklerimiz",
  "/ekibimiz",
  "/sponsorlar",
  "/is-birlikleri",
  "/iletisim",
  "/katilim",
  "/cerez-politikasi",
];

function localizedEntries(path: string, options: { lastModified?: Date; priority: number; changeFrequency: "weekly" | "monthly" }) {
  const trPath = localizedPublicPath(path, "tr");
  const enPath = localizedPublicPath(path, "en");
  const languages = {
    tr: new URL(trPath, siteUrl).toString(),
    en: new URL(enPath, siteUrl).toString(),
    "x-default": new URL(trPath, siteUrl).toString(),
  };
  return ([trPath, enPath] as const).map((localizedPath) => ({
    url: new URL(localizedPath, siteUrl).toString(),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, partnerClubs] = await Promise.all([
    prisma.event.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.partnerClub.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return [
    ...publicPaths.flatMap((path) => localizedEntries(path, { changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : 0.8 })),
    ...events.flatMap((event) => localizedEntries(`/etkinliklerimiz/${event.slug}`, { lastModified: event.createdAt, changeFrequency: "monthly", priority: 0.7 })),
    ...partnerClubs.flatMap((partnerClub) => localizedEntries(`/is-birlikleri/${partnerClub.slug}`, { lastModified: partnerClub.createdAt, changeFrequency: "monthly", priority: 0.7 })),
  ];
}
