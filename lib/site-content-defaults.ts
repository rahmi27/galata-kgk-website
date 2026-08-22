import aboutContent from "@/content/about.json";
import contactContent from "@/content/contact.json";
import homeContent from "@/content/home.json";
import siteContent from "@/content/site.json";
import enMessages from "@/messages/en.json";

export type EditableContentType = "text" | "richtext" | "image";

export type SiteContentDefinition = {
  key: string;
  value: string;
  valueEn?: string | null;
  type: EditableContentType;
  page: "header" | "footer" | "anasayfa" | "hakkimizda" | "iletisim";
  label: string;
};

const navigationKeys = [
  "anasayfa",
  "hakkimizda",
  "etkinliklerimiz",
  "ekibimiz",
  "ortaklarimiz",
  "iletisim",
] as const;

export const headerNavigationDefinitions = siteContent.navigation.items
  .map((item, index): SiteContentDefinition[] => [
    {
      key: `header.nav.${navigationKeys[index]}.label`,
      value: item.label,
      type: "text",
      page: "header",
      label: `${item.label} menü metni`,
    },
    {
      key: `header.nav.${navigationKeys[index]}.order`,
      value: String(index + 1),
      type: "text",
      page: "header",
      label: `${item.label} menü sırası`,
    },
  ])
  .flat();

export const staticSiteContentDefinitions: SiteContentDefinition[] = [
  {
    key: "header.brand.name",
    value: siteContent.brand.name,
    type: "text",
    page: "header",
    label: "Logo yanındaki kulüp adı",
  },
  ...headerNavigationDefinitions,
  {
    key: "header.cta.label",
    value: siteContent.navigation.joinCta.label,
    type: "text",
    page: "header",
    label: "Kulübe Katıl buton metni",
  },
  {
    key: "footer.description",
    value: siteContent.footer.description,
    type: "richtext",
    page: "footer",
    label: "Footer açıklaması",
  },
  {
    key: "footer.quickLinksLabel",
    value: siteContent.footer.quickLinksLabel,
    type: "text",
    page: "footer",
    label: "Hızlı linkler başlığı",
  },
  {
    key: "footer.copyright",
    value: siteContent.footer.copyright,
    type: "text",
    page: "footer",
    label: "Telif hakkı satırı",
  },
  {
    key: "footer.institution",
    value: siteContent.footer.institution,
    type: "text",
    page: "footer",
    label: "Üniversite bağlantı metni",
  },
  {
    key: "footer.institutionHref",
    value: siteContent.footer.institutionHref,
    type: "text",
    page: "footer",
    label: "Üniversite bağlantı adresi",
  },
  {
    key: "footer.social.instagram",
    value:
      siteContent.footer.socials.find(
        (social) => social.platform === "Instagram",
      )?.href ?? "",
    type: "text",
    page: "footer",
    label: "Instagram adresi",
  },
  {
    key: "footer.social.linkedin",
    value: "",
    type: "text",
    page: "footer",
    label: "LinkedIn adresi",
  },
  {
    key: "footer.social.x",
    value: "",
    type: "text",
    page: "footer",
    label: "X adresi",
  },
  {
    key: "contact.address.value",
    value: contactContent.details.address.value,
    type: "text",
    page: "iletisim",
    label: "İletişim adresi",
  },
  {
    key: "home.hero.eyebrow",
    value: homeContent.hero.eyebrow,
    type: "text",
    page: "anasayfa",
    label: "Hero rozet metni",
  },
  {
    key: "home.hero.title",
    value: homeContent.hero.title,
    type: "text",
    page: "anasayfa",
    label: "Hero ana başlığı",
  },
  {
    key: "home.hero.emphasis",
    value: homeContent.hero.emphasis,
    type: "text",
    page: "anasayfa",
    label: "Hero vurgulu başlık bölümü",
  },
  {
    key: "home.hero.description",
    value: homeContent.hero.description,
    type: "richtext",
    page: "anasayfa",
    label: "Hero açıklaması",
  },
  {
    key: "home.hero.primaryCta.label",
    value: homeContent.hero.primaryCta.label,
    type: "text",
    page: "anasayfa",
    label: "Birincil hero butonu",
  },
  {
    key: "home.hero.secondaryCta.label",
    value: homeContent.hero.secondaryCta.label,
    type: "text",
    page: "anasayfa",
    label: "İkincil hero butonu",
  },
  {
    key: "home.hero.spotlight.calendarCta.label",
    value: homeContent.hero.spotlight.calendarCta.label,
    type: "text",
    page: "anasayfa",
    label: "Takvim ipucu metni",
  },
  {
    key: "home.hero.spotlight.eyebrow",
    value: homeContent.hero.spotlight.eyebrow,
    type: "text",
    page: "anasayfa",
    label: "Odak kartı üst etiketi",
  },
  {
    key: "home.hero.spotlight.title",
    value: homeContent.hero.spotlight.title,
    type: "text",
    page: "anasayfa",
    label: "Odak kartı başlığı",
  },
  {
    key: "home.hero.spotlight.description",
    value: homeContent.hero.spotlight.description,
    type: "richtext",
    page: "anasayfa",
    label: "Odak kartı açıklaması",
  },
  {
    key: "about.hero.eyebrow",
    value: aboutContent.hero.eyebrow,
    type: "text",
    page: "hakkimizda",
    label: "Hakkımızda üst etiketi",
  },
  {
    key: "about.hero.title",
    value: aboutContent.hero.title,
    type: "text",
    page: "hakkimizda",
    label: "Hakkımızda ana başlığı",
  },
  {
    key: "about.hero.description",
    value: aboutContent.hero.description,
    type: "richtext",
    page: "hakkimizda",
    label: "Hakkımızda giriş açıklaması",
  },
  {
    key: "about.introduction.eyebrow",
    value: aboutContent.introduction.eyebrow,
    type: "text",
    page: "hakkimizda",
    label: "Biz Kimiz üst etiketi",
  },
  {
    key: "about.introduction.title",
    value: aboutContent.introduction.title,
    type: "text",
    page: "hakkimizda",
    label: "Biz Kimiz başlığı",
  },
  {
    key: "about.introduction.paragraphs",
    value: aboutContent.introduction.paragraphs.join("\n\n"),
    type: "richtext",
    page: "hakkimizda",
    label: "Biz Kimiz metni",
  },
  {
    key: "about.introduction.principle.label",
    value: aboutContent.introduction.principle.label,
    type: "text",
    page: "hakkimizda",
    label: "Alıntı kutusu etiketi",
  },
  {
    key: "about.introduction.principle.text",
    value: aboutContent.introduction.principle.text,
    type: "richtext",
    page: "hakkimizda",
    label: "Alıntı kutusu metni",
  },
  {
    key: "about.vision.eyebrow",
    value: aboutContent.visionMission.vision.eyebrow,
    type: "text",
    page: "hakkimizda",
    label: "Vizyon üst etiketi",
  },
  {
    key: "about.vision.title",
    value: aboutContent.visionMission.vision.title,
    type: "text",
    page: "hakkimizda",
    label: "Vizyon başlığı",
  },
  {
    key: "about.vision.description",
    value: aboutContent.visionMission.vision.description,
    type: "richtext",
    page: "hakkimizda",
    label: "Vizyon metni",
  },
  {
    key: "about.mission.eyebrow",
    value: aboutContent.visionMission.mission.eyebrow,
    type: "text",
    page: "hakkimizda",
    label: "Misyon üst etiketi",
  },
  {
    key: "about.mission.title",
    value: aboutContent.visionMission.mission.title,
    type: "text",
    page: "hakkimizda",
    label: "Misyon başlığı",
  },
  {
    key: "about.mission.description",
    value: aboutContent.visionMission.mission.description,
    type: "richtext",
    page: "hakkimizda",
    label: "Misyon metni",
  },
  {
    key: "about.timeline.eyebrow",
    value: aboutContent.timelineSection.eyebrow,
    type: "text",
    page: "hakkimizda",
    label: "Zaman tüneli üst etiketi",
  },
  {
    key: "about.timeline.title",
    value: aboutContent.timelineSection.title,
    type: "text",
    page: "hakkimizda",
    label: "Zaman tüneli başlığı",
  },
  {
    key: "about.timeline.description",
    value: aboutContent.timelineSection.description,
    type: "richtext",
    page: "hakkimizda",
    label: "Zaman tüneli açıklaması",
  },
];

export const repeatableSiteContentDefinitions: SiteContentDefinition[] = [
  {
    key: "home.hero.spotlight.topics.initialized",
    value: "true",
    type: "text",
    page: "anasayfa",
    label: "Odak etiketleri başlangıç işareti",
  },
  ...homeContent.hero.spotlight.topics.map(
    (topic, index): SiteContentDefinition => ({
      key: `home.hero.spotlight.topic.${String(index + 1).padStart(3, "0")}`,
      value: topic,
      type: "text",
      page: "anasayfa",
      label: "Odak etiketi",
    }),
  ),
  {
    key: "about.timeline.milestones.initialized",
    value: "true",
    type: "text",
    page: "hakkimizda",
    label: "Zaman tüneli başlangıç işareti",
  },
  ...aboutContent.timelineSection.milestones.map(
    (milestone, index): SiteContentDefinition => ({
      key: `about.timeline.milestone.${String(index + 1).padStart(3, "0")}`,
      value: JSON.stringify(milestone),
      type: "richtext",
      page: "hakkimizda",
      label: "Zaman tüneli kilometre taşı",
    }),
  ),
];

const englishValues: Record<string, string> = {
  "header.brand.name": enMessages.nav.brand,
  "header.nav.anasayfa.label": enMessages.nav.home,
  "header.nav.hakkimizda.label": enMessages.nav.about,
  "header.nav.etkinliklerimiz.label": enMessages.nav.events,
  "header.nav.ekibimiz.label": enMessages.nav.team,
  "header.nav.ortaklarimiz.label": enMessages.nav.partners,
  "header.nav.iletisim.label": enMessages.nav.contact,
  "header.cta.label": enMessages.nav.join,
  "footer.description": enMessages.footer.description,
  "footer.quickLinksLabel": enMessages.footer.quickLinks,
  "footer.copyright": enMessages.footer.copyright,
  "footer.institution": enMessages.footer.institution,
  "footer.institutionHref": siteContent.footer.institutionHref,
  "contact.address.value": contactContent.details.address.value,
  "home.hero.eyebrow": enMessages.home.hero.eyebrow,
  "home.hero.title": enMessages.home.hero.title,
  "home.hero.emphasis": enMessages.home.hero.emphasis,
  "home.hero.description": enMessages.home.hero.description,
  "home.hero.primaryCta.label": enMessages.home.hero.primaryCta,
  "home.hero.secondaryCta.label": enMessages.home.hero.secondaryCta,
  "home.hero.spotlight.calendarCta.label": enMessages.home.hero.calendarCta,
  "home.hero.spotlight.eyebrow": enMessages.home.hero.spotlightEyebrow,
  "home.hero.spotlight.title": enMessages.home.hero.spotlightTitle,
  "home.hero.spotlight.description": enMessages.home.hero.spotlightDescription,
  "about.hero.eyebrow": enMessages.about.heroEyebrow,
  "about.hero.title": enMessages.about.heroTitle,
  "about.hero.description": enMessages.about.heroDescription,
  "about.introduction.eyebrow": enMessages.about.introEyebrow,
  "about.introduction.title": enMessages.about.introTitle,
  "about.introduction.paragraphs": enMessages.about.introParagraphs,
  "about.introduction.principle.label": enMessages.about.principleLabel,
  "about.introduction.principle.text": enMessages.about.principleText,
  "about.vision.eyebrow": enMessages.about.visionEyebrow,
  "about.vision.title": enMessages.about.visionTitle,
  "about.vision.description": enMessages.about.visionDescription,
  "about.mission.eyebrow": enMessages.about.missionEyebrow,
  "about.mission.title": enMessages.about.missionTitle,
  "about.mission.description": enMessages.about.missionDescription,
  "about.timeline.eyebrow": enMessages.about.timelineEyebrow,
  "about.timeline.title": enMessages.about.timelineTitle,
  "about.timeline.description": enMessages.about.timelineDescription,
};

Object.assign(englishValues, {
  "home.hero.spotlight.topics.initialized": "true",
  "home.hero.spotlight.topic.001": enMessages.home.hero.topic1,
  "home.hero.spotlight.topic.002": enMessages.home.hero.topic2,
  "home.hero.spotlight.topic.003": enMessages.home.hero.topic3,
  "about.timeline.milestones.initialized": "true",
  ...Object.fromEntries(
    enMessages.about.milestones.map((milestone, index) => [
      `about.timeline.milestone.${String(index + 1).padStart(3, "0")}`,
      JSON.stringify(milestone),
    ]),
  ),
});

export const siteContentDefinitions = [
  ...staticSiteContentDefinitions,
  ...repeatableSiteContentDefinitions,
].map((definition) => ({
  ...definition,
  valueEn: englishValues[definition.key] ?? null,
}));

export const siteContentDefaults = Object.fromEntries(
  siteContentDefinitions.map((definition) => [
    definition.key,
    definition.value,
  ]),
) as Record<string, string>;

export const siteContentEnglishDefaults = Object.fromEntries(
  Object.entries(englishValues),
) as Record<string, string>;
