import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-metadata";

export const revalidate = 3600;

const publicPaths = [
  "",
  "/hakkimizda",
  "/etkinliklerimiz",
  "/ekibimiz",
  "/sponsorlar",
  "/is-birlikleri",
  "/iletisim",
  "/katilim",
  "/cerez-politikasi",
];

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
    ...publicPaths.map((path) => ({
      url: new URL(path || "/", siteUrl).toString(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...events.map((event) => ({
      url: new URL(`/etkinliklerimiz/${event.slug}`, siteUrl).toString(),
      lastModified: event.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...partnerClubs.map((partnerClub) => ({
      url: new URL(`/is-birlikleri/${partnerClub.slug}`, siteUrl).toString(),
      lastModified: partnerClub.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
