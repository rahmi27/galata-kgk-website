import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localeDetection: false,
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/hakkimizda": {tr: "/hakkimizda", en: "/about"},
    "/etkinliklerimiz": {tr: "/etkinliklerimiz", en: "/events"},
    "/etkinliklerimiz/[slug]": {
      tr: "/etkinliklerimiz/[slug]",
      en: "/events/[slug]",
    },
    "/ekibimiz": {tr: "/ekibimiz", en: "/team"},
    "/sponsorlar": {tr: "/sponsorlar", en: "/sponsors"},
    "/is-birlikleri": {tr: "/is-birlikleri", en: "/collaborations"},
    "/is-birlikleri/[slug]": {
      tr: "/is-birlikleri/[slug]",
      en: "/collaborations/[slug]",
    },
    "/iletisim": {tr: "/iletisim", en: "/contact"},
    "/katilim": {tr: "/katilim", en: "/join"},
    "/cerez-politikasi": {
      tr: "/cerez-politikasi",
      en: "/cookie-policy",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
