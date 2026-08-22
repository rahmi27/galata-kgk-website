import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");

test("public routes use a daily ISR fallback instead of five-minute rewrites", () => {
  const files = [
    "app/[locale]/layout.tsx",
    "app/[locale]/page.tsx",
    "app/[locale]/hakkimizda/page.tsx",
    "app/[locale]/iletisim/page.tsx",
    "app/[locale]/ekibimiz/page.tsx",
    "app/[locale]/etkinliklerimiz/page.tsx",
    "app/[locale]/etkinliklerimiz/[slug]/page.tsx",
    "app/[locale]/is-birlikleri/page.tsx",
    "app/[locale]/is-birlikleri/[slug]/page.tsx",
    "app/[locale]/sponsorlar/page.tsx",
    "app/sitemap.ts",
  ];

  for (const file of files) {
    assert.match(
      read(file),
      /export const revalidate = 86400;/,
      `${file} must keep the daily fallback`,
    );
  }

  for (const file of [
    "app/[locale]/etkinliklerimiz/page.tsx",
    "lib/site-content.ts",
    "lib/club-social-links.ts",
  ]) {
    assert.doesNotMatch(read(file), /revalidate:\s*300\b/);
  }
});

test("collaboration item mutations invalidate only their detail page", () => {
  const source = read("app/admin/(panel)/is-birlikleri/actions.ts");
  const itemActions = source.slice(
    source.indexOf("export async function createCollaborationItemAction"),
  );

  assert.doesNotMatch(itemActions, /refreshPartnerClubPages\(/);
  assert.equal(
    (itemActions.match(/refreshCollaborationItemPage\(/g) ?? []).length,
    3,
  );
});

test("sitemap invalidation is limited to event and partner URL changes", () => {
  const events = read("app/admin/(panel)/etkinlikler/actions.ts");
  const collaborations = read("app/admin/(panel)/is-birlikleri/actions.ts");

  assert.match(events, /if \(options\.revalidateSitemap\)/);
  assert.match(events, /revalidateSitemap: existingEvent\.slug !== slug/);
  assert.match(
    collaborations,
    /revalidateSitemap: partnerClub\.slug !== slug/,
  );
});

test("repository has no Vercel cron that can trigger revalidation", () => {
  const vercel = JSON.parse(read("vercel.json"));
  assert.equal(vercel.crons, undefined);
});
