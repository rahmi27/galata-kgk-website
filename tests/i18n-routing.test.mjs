import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {test} from "node:test";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => readFile(path.join(root, ...parts), "utf8");

function leafKeys(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const current = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child)
      ? leafKeys(child, current)
      : [current];
  });
}

test("Türkçe ve İngilizce mesaj katalogları aynı anahtarlara sahiptir", async () => {
  const [tr, en] = await Promise.all([
    read("messages", "tr.json").then(JSON.parse),
    read("messages", "en.json").then(JSON.parse),
  ]);

  assert.deepEqual(leafKeys(en).sort(), leafKeys(tr).sort());
  assert.ok(leafKeys(en).length > 150, "tam site çeviri kataloğu bekleniyor");
});

test("locale yönlendirmesi varsayılan Türkçe ve anlamlı İngilizce path'leri korur", async () => {
  const routing = await read("i18n", "routing.ts");
  const expected = [
    'localePrefix: "as-needed"',
    'defaultLocale: "tr"',
    'en: "/about"',
    'en: "/events"',
    'en: "/events/[slug]"',
    'en: "/team"',
    'en: "/sponsors"',
    'en: "/collaborations"',
    'en: "/collaborations/[slug]"',
    'en: "/contact"',
    'en: "/join"',
  ];

  for (const fragment of expected) assert.ok(routing.includes(fragment), fragment);
});

test("admin locale middleware dışında ve genel sayfalar iki dilde ISR'dır", async () => {
  const [proxy, localeLayout, revalidation] = await Promise.all([
    read("proxy.ts"),
    read("app", "[locale]", "layout.tsx"),
    read("lib", "revalidate-public.ts"),
  ]);

  assert.match(proxy, /pathname\.startsWith\("\/admin"\)/);
  assert.match(proxy, /return NextResponse\.next\(\)/);
  assert.match(localeLayout, /export const dynamic = "force-static"/);
  assert.match(localeLayout, /routing\.locales\.map/);
  assert.match(revalidation, /localizedPublicPath\(path, "tr"\)/);
  assert.match(revalidation, /localizedPublicPath\(path, "en"\)/);
});

test("SEO yardımcıları canonical ve tr/en/x-default hreflang üretir", async () => {
  const metadata = await read("lib", "site-metadata.ts");
  const sitemap = await read("app", "sitemap.ts");

  assert.match(metadata, /"\/hakkimizda": "\/en\/about"/);
  assert.match(metadata, /"\/etkinliklerimiz": "\/en\/events"/);
  assert.match(metadata, /"x-default": turkishPath/);
  assert.match(sitemap, /alternates:\s*\{\s*languages/);
  assert.match(sitemap, /localizedPublicPath\(path, "en"\)/);
});

test("dinamik içerik şeması İngilizce alanları ve Türkçe fallback yardımcısı içerir", async () => {
  const [schema, helper] = await Promise.all([
    read("prisma", "schema.prisma"),
    read("lib", "localized-content.ts"),
  ]);

  for (const model of [
    "Event",
    "Person",
    "TeamMembership",
    "TeamCategory",
    "Sponsor",
    "SponsorTier",
    "PartnerClub",
    "CollaborationItem",
    "SiteContent",
  ]) {
    assert.match(schema, new RegExp(`model ${model}[^]*?\\w+En\\s+String\\?`), model);
  }
  assert.match(helper, /locale === "en"/);
  assert.match(helper, /englishValue\?\.trim\(\)/);
  assert.match(helper, /turkishValue/);
});
