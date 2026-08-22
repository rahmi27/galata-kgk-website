import "server-only";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getSafeHttpUrl } from "@/lib/url-security";

export type PublicClubSocialLink = {
  id: number;
  platform: string;
  label: string;
  url: string;
  order: number;
};

async function readClubSocialLinks(): Promise<PublicClubSocialLink[]> {
  const links = await prisma.clubSocialLink.findMany({
    orderBy: [{ order: "asc" }, { platform: "asc" }],
    select: {
      id: true,
      platform: true,
      label: true,
      url: true,
      order: true,
    },
  });

  return links.flatMap((link) => {
    const safeUrl = getSafeHttpUrl(link.url);
    return safeUrl ? [{ ...link, url: safeUrl }] : [];
  });
}

const readCachedClubSocialLinks = unstable_cache(
  readClubSocialLinks,
  ["public-club-social-links-v1"],
  {
    revalidate: 86400,
    tags: ["club-social-links"],
  },
);

export function getPublicClubSocialLinks() {
  return readCachedClubSocialLinks();
}

export function getAdminClubSocialLinks() {
  return readClubSocialLinks();
}
