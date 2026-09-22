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
    "/etkinlik": {tr: "/etkinlik", en: "/event"},
    "/etkinlik/panel": {tr: "/etkinlik/panel", en: "/event/hub"},
    "/etkinlik/panel/quiz": {tr: "/etkinlik/panel/quiz", en: "/event/hub/quiz"},
    "/etkinlik/panel/quiz/tablo": {tr: "/etkinlik/panel/quiz/tablo", en: "/event/hub/quiz/leaderboard"},
    "/etkinlik/panel/cekilis": {tr: "/etkinlik/panel/cekilis", en: "/event/hub/raffle"},
    "/etkinlik/panel/geri-bildirim": {tr: "/etkinlik/panel/geri-bildirim", en: "/event/hub/feedback"},
    "/etkinlik/panel/rozet": {tr: "/etkinlik/panel/rozet", en: "/event/hub/badge"},
    "/etkinlik/panel/anket": {tr: "/etkinlik/panel/anket", en: "/event/hub/poll"},
    "/etkinlik/ekran": {tr: "/etkinlik/ekran", en: "/event/screen"},
    "/cerez-politikasi": {
      tr: "/cerez-politikasi",
      en: "/cookie-policy",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
