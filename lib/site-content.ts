import "server-only";

import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";

import contactContent from "@/content/contact.json";
import homeContent from "@/content/home.json";
import siteContent from "@/content/site.json";
import {
  getPublicClubSocialLinks,
  type PublicClubSocialLink,
} from "@/lib/club-social-links";
import { prisma } from "@/lib/prisma";
import { localizedValue } from "@/lib/localized-content";
import {
  siteContentDefaults,
  siteContentEnglishDefaults,
} from "@/lib/site-content-defaults";

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
  valueEn: string | null;
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
      platform: string;
      label: string;
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
        valueEn: true,
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
    revalidate: 86400,
    tags: ["site-content"],
  },
);

export function mergeSiteContent(rows: SiteContentRow[], locale = "tr") {
  const localeDefaults =
    locale === "en"
      ? { ...siteContentDefaults, ...siteContentEnglishDefaults }
      : siteContentDefaults;

  return {
    ...localeDefaults,
    ...Object.fromEntries(
      rows.map((row) => [
        row.key,
        localizedValue(locale, row.value, row.valueEn),
      ]),
    ),
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

export function getRawEnglishSiteContentMap(rows: SiteContentRow[]) {
  return Object.fromEntries(rows.map((row) => [row.key, row.valueEn ?? ""]));
}

export function getRawEnglishHomeTopics(rows: SiteContentRow[]) {
  return rows
    .filter(({ key }) => key.startsWith("home.hero.spotlight.topic."))
    .sort((first, second) => first.key.localeCompare(second.key, "tr"))
    .map((row) => row.valueEn ?? "");
}

export function getRawEnglishTimelineMilestones(rows: SiteContentRow[]) {
  return rows
    .filter(({ key }) => key.startsWith("about.timeline.milestone."))
    .sort((first, second) => first.key.localeCompare(second.key, "tr"))
    .flatMap((row) => {
      if (!row.valueEn) return [{ year: "", title: "", description: "" }];
      try {
        const value = JSON.parse(row.valueEn) as Record<string, unknown>;
        return [{
          year: typeof value.year === "string" ? value.year : "",
          title: typeof value.title === "string" ? value.title : "",
          description: typeof value.description === "string" ? value.description : "",
        }];
      } catch {
        return [{ year: "", title: "", description: "" }];
      }
    });
}

export function getHomeHeroContentFromRows(rows: SiteContentRow[], locale = "tr") {
  const values = mergeSiteContent(rows, locale);
  const topicsAreInitialized = rows.some(
    (row) => row.key === "home.hero.spotlight.topics.initialized",
  );
  const topicSource = topicsAreInitialized
    ? rows
    : Object.entries(
        locale === "en"
          ? { ...siteContentDefaults, ...siteContentEnglishDefaults }
          : siteContentDefaults,
      ).map(([key, value]) => ({
        key,
        value,
      }));
  const topics = topicSource
    .filter(({ key }) => key.startsWith("home.hero.spotlight.topic."))
    .sort((first, second) => first.key.localeCompare(second.key, "tr"))
    .map((row) =>
      "valueEn" in row
        ? localizedValue(locale, row.value, row.valueEn as string | null)
        : row.value,
    );

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

export function getAboutContentFromRows(rows: SiteContentRow[], locale = "tr") {
  const values = mergeSiteContent(rows, locale);
  const milestonesAreInitialized = rows.some(
    (row) => row.key === "about.timeline.milestones.initialized",
  );
  const milestoneSource = milestonesAreInitialized
    ? rows
    : Object.entries(
        locale === "en"
          ? { ...siteContentDefaults, ...siteContentEnglishDefaults }
          : siteContentDefaults,
      ).map(([key, value]) => ({
        key,
        value,
      }));
  const milestones = milestoneSource
    .filter(({ key }) => key.startsWith("about.timeline.milestone."))
    .sort((first, second) => first.key.localeCompare(second.key, "tr"))
    .flatMap((row) => {
      try {
        const value =
          "valueEn" in row
            ? localizedValue(locale, row.value, row.valueEn as string | null)
            : row.value;
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

export function getContactContentFromRows(
  rows: SiteContentRow[],
  socialLinks: PublicClubSocialLink[],
  locale = "tr",
) {
  const values = mergeSiteContent(rows, locale);

  return {
    ...contactContent,
    details: {
      ...contactContent.details,
      address: {
        ...contactContent.details.address,
        value: values["contact.address.value"],
      },
      socials: socialLinks.map((social) => ({
        platform: social.platform,
        label: social.label,
        href: social.url,
      })),
    },
  };
}

export async function getSiteChromeContent(locale = "tr"): Promise<SiteChromeContent> {
  const [rows, socialLinks] = await Promise.all([
    getPublicSiteContentRows(),
    getPublicClubSocialLinks(),
  ]);
  const values = mergeSiteContent(rows, locale);
  const t = await getTranslations({ locale });
  const items = navigationRoutes
    .map((item, fallbackIndex) => ({
      ...item,
      label: values[`header.nav.${item.id}.label`],
      order:
        Number.parseInt(values[`header.nav.${item.id}.order`], 10) ||
        fallbackIndex + 1,
    }))
    .sort((first, second) => first.order - second.order);

  const socials = socialLinks.map((social) => ({
    platform: social.platform,
    label: social.label,
    href: social.url,
  }));

  return {
    brand: {
      name: values["header.brand.name"],
      homeAriaLabel: t("nav.homeAriaLabel"),
    },
    navigation: {
      desktopAriaLabel: t("nav.desktopAriaLabel"),
      mobileAriaLabel: t("nav.mobileAriaLabel"),
      openMenuLabel: t("nav.openMenu"),
      closeMenuLabel: t("nav.closeMenu"),
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
