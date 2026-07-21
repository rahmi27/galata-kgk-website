import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

const publicPaths = [
  "",
  "/hakkimizda",
  "/etkinliklerimiz",
  "/ekibimiz",
  "/sponsorlar",
  "/iletisim",
  "/katilim",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await prisma.event.findMany({
    select: {
      slug: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
  ];
}
