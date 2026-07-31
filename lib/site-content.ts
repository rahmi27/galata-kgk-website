import "server-only";

import { unstable_cache } from "next/cache";

import homeContent from "@/content/home.json";
import siteContent from "@/content/site.json";
import { prisma } from "@/lib/prisma";
import { siteContentDefaults } from "@/lib/site-content-defaults";

export const navigationRoutes = [
  { id: "anasayfa", href: "/" },
  { id: "hakkimizda", href: "/hakkimizda" },
  { id: "etkinliklerimiz", href: "/etkinliklerimiz" },
  { id: "ekibimiz", href: "/ekibimiz" },
  { id: "ortaklarimiz", href: "/sponsorlar" },
  { id: "iletisim", href: "/iletisim" },
] as const;

export type SiteContentRow = {
  key: string;
  value: string;
  type: "text" | "richtext" | "image";
  page: string;
  label: string;
};

export type SiteChromeContent = {
  brand: {
    name: string;
    homeAriaLabel: string;
  };
  navigation: {
    desktopAriaLabel: string;
    mobileAriaLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    items: Array<{
      id: (typeof navigationRoutes)[number]["id"];
      label: string;
      href: string;
      order: number;
    }>;
    joinCta: {
      label: string;
      href: string;
    };
  };
  footer: {
    description: string;
    quickLinksLabel: string;
    copyright: string;
    institution: string;
    institutionHref: string;
    socials: Array<{
      platform: "Instagram" | "LinkedIn" | "X";
      href: string;
    }>;
  };
};

async function readSiteContentRows() {
  try {
    return (await prisma.siteContent.findMany({
      select: {
        key: true,
        value: true,
        type: true,
        page: true,
        label: true,
      },
    })) as SiteContentRow[];
  } catch (error) {
    console.warn(
      "SiteContent tablosu okunamadı; statik varsayılanlar kullanılıyor.",
      error,
    );
    return [];
  }
}

const readCachedSiteContentRows = unstable_cache(
  readSiteContentRows,
  ["public-site-content-v1"],
  {
    revalidate: 300,
    tags: ["site-content"],
  },
);

export function mergeSiteContent(rows: SiteContentRow[]) {
  return {
    ...siteContentDefaults,
    ...Object.fromEntries(rows.map((row) => [row.key, row.value])),
  };
}

export async function getPublicSiteContentRows() {
  return readCachedSiteContentRows();
}

export async function getAdminSiteContentRows() {
  return readSiteContentRows();
}

export async function getAdminSiteContentMap() {
  return mergeSiteContent(await getAdminSiteContentRows());
}

export function getHomeHeroContentFromRows(rows: SiteContentRow[]) {
  const values = mergeSiteContent(rows);
  const topicsAreInitialized = rows.some(
    (row) => row.key === "home.hero.spotlight.topics.initialized",
  );
  const topicSource = topicsAreInitialized
    ? rows
    : Object.entries(siteContentDefaults).map(([key, value]) => ({
        key,
        value,
      }));
  const topics = topicSource
    .filter(({ key }) => key.startsWith("home.hero.spotlight.topic."))
    .sort((first, second) => first.key.localeCompare(second.key, "tr"))
    .map(({ value }) => value);

  return {
    eyebrow: values["home.hero.eyebrow"],
    title: values["home.hero.title"],
    emphasis: values["home.hero.emphasis"],
    description: values["home.hero.description"],
    primaryCta: {
      ...homeContent.hero.primaryCta,
      label: values["home.hero.primaryCta.label"],
    },
    secondaryCta: {
      ...homeContent.hero.secondaryCta,
      label: values["home.hero.secondaryCta.label"],
    },
    spotlight: {
      ...homeContent.hero.spotlight,
      calendarCta: {
        ...homeContent.hero.spotlight.calendarCta,
        label: values["home.hero.spotlight.calendarCta.label"],
      },
      eyebrow: values["home.hero.spotlight.eyebrow"],
      title: values["home.hero.spotlight.title"],
      description: values["home.hero.spotlight.description"],
      topics,
    },
  };
}

export function getAboutContentFromRows(rows: SiteContentRow[]) {
  const values = mergeSiteContent(rows);
  const milestonesAreInitialized = rows.some(
    (row) => row.key === "about.timeline.milestones.initialized",
  );
  const milestoneSource = milestonesAreInitialized
    ? rows
    : Object.entries(siteContentDefaults).map(([key, value]) => ({
        key,
        value,
      }));
  const milestones = milestoneSource
    .filter(({ key }) => key.startsWith("about.timeline.milestone."))
    .sort((first, second) => first.key.localeCompare(second.key, "tr"))
    .flatMap(({ value }) => {
      try {
        const milestone = JSON.parse(value) as {
          year?: unknown;
          title?: unknown;
          description?: unknown;
        };

        if (
          typeof milestone.year === "string" &&
          typeof milestone.title === "string" &&
          typeof milestone.description === "string"
        ) {
          return [
            {
              year: milestone.year,
              title: milestone.title,
              description: milestone.description,
            },
          ];
        }
      } catch {
        // Hatalı tek kayıt tüm zaman tünelini bozmasın.
      }

      return [];
    });

  return {
    hero: {
      eyebrow: values["about.hero.eyebrow"],
      title: values["about.hero.title"],
      description: values["about.hero.description"],
    },
    introduction: {
      eyebrow: values["about.introduction.eyebrow"],
      title: values["about.introduction.title"],
      paragraphs: values["about.introduction.paragraphs"]
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      principle: {
        label: values["about.introduction.principle.label"],
        text: values["about.introduction.principle.text"],
      },
    },
    visionMission: {
      vision: {
        eyebrow: values["about.vision.eyebrow"],
        title: values["about.vision.title"],
        description: values["about.vision.description"],
      },
      mission: {
        eyebrow: values["about.mission.eyebrow"],
        title: values["about.mission.title"],
        description: values["about.mission.description"],
      },
    },
    timelineSection: {
      eyebrow: values["about.timeline.eyebrow"],
      title: values["about.timeline.title"],
      description: values["about.timeline.description"],
      milestones,
    },
  };
}

export async function getSiteChromeContent(): Promise<SiteChromeContent> {
  const values = mergeSiteContent(await getPublicSiteContentRows());
  const items = navigationRoutes
    .map((item, fallbackIndex) => ({
      ...item,
      label: values[`header.nav.${item.id}.label`],
      order:
        Number.parseInt(values[`header.nav.${item.id}.order`], 10) ||
        fallbackIndex + 1,
    }))
    .sort((first, second) => first.order - second.order);

  const socials = [
    {
      platform: "Instagram" as const,
      href: values["footer.social.instagram"],
    },
    {
      platform: "LinkedIn" as const,
      href: values["footer.social.linkedin"],
    },
    {
      platform: "X" as const,
      href: values["footer.social.x"],
    },
  ].filter((social) => social.href.trim().length > 0);

  return {
    brand: {
      name: values["header.brand.name"],
      homeAriaLabel: siteContent.brand.homeAriaLabel,
    },
    navigation: {
      desktopAriaLabel: siteContent.navigation.desktopAriaLabel,
      mobileAriaLabel: siteContent.navigation.mobileAriaLabel,
      openMenuLabel: siteContent.navigation.openMenuLabel,
      closeMenuLabel: siteContent.navigation.closeMenuLabel,
      items,
      joinCta: {
        label: values["header.cta.label"],
        href: siteContent.navigation.joinCta.href,
      },
    },
    footer: {
      description: values["footer.description"],
      quickLinksLabel: values["footer.quickLinksLabel"],
      copyright: values["footer.copyright"],
      institution: values["footer.institution"],
      institutionHref: values["footer.institutionHref"],
      socials,
    },
  };
}
