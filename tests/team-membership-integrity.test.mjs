import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => readFile(path.join(root, ...parts), "utf8");

test("kişi ve kategori üyeliği şeması tekrar kaydı engeller", async () => {
  const schema = await read("prisma", "schema.prisma");
  assert.match(schema, /model Person[\s\S]*normalizedName\s+String\s+@unique/);
  assert.match(schema, /model TeamMembership[\s\S]*@@unique\(\[personId, categoryId\]\)/);
  assert.match(schema, /person\s+Person[\s\S]*onDelete: Cascade/);
  assert.doesNotMatch(schema, /model TeamMember\s*\{/);
});

test("üye action'ları IDOR ve eşzamanlı tekrar kayıtlarını kontrollü karşılar", async () => {
  const actions = await read("app", "admin", "(panel)", "uyeler", "actions.ts");

  assert.match(actions, /export async function deletePersonAction/);
  assert.match(actions, /Silmek istediğiniz kişi bulunamadı/);
  assert.match(actions, /Atamak istediğiniz kişi bulunamadı/);
  assert.match(actions, /Seçilen ekip kategorisi bulunamadı/);
  assert.match(actions, /hasPrismaErrorCode\(error, "P2002"\)/);
  assert.match(actions, /zaten “\$\{category\.name\}” kategorisinde/);
});

test("kişi araması istemcide filtrelenir ve yeni bir sorgu endpoint'i açmaz", async () => {
  const form = await read("components", "admin", "membership-assignment-form.tsx");

  assert.match(form, /useMemo/);
  assert.match(form, /\.includes\(query\)/);
  assert.doesNotMatch(form, /fetch\(/);
});

test("veri migration'ı doğrulamadan eski tabloyu kaldırmaz", async () => {
  const migration = await read(
    "prisma",
    "migrations",
    "20260816223000_person_team_memberships",
    "migration.sql",
  );
  const assertionIndex = migration.indexOf("Person migration count mismatch");
  const dropIndex = migration.indexOf('DROP TABLE "TeamMember"');
  assert.ok(assertionIndex >= 0);
  assert.ok(dropIndex > assertionIndex);
  assert.match(migration, /lost_role_count/);
});

test("Ekibimiz ISR kalır ve admin değişiklikleri iki dilde önbelleği yeniler", async () => {
  const publicPage = await read("app", "[locale]", "ekibimiz", "page.tsx");
  const actions = await read("app", "admin", "(panel)", "uyeler", "actions.ts");
  assert.match(publicPage, /export const revalidate = 86400/);
  assert.match(publicPage, /memberships:[\s\S]*person: true/);
  assert.doesNotMatch(publicPage, /force-dynamic/);
  assert.match(actions, /revalidatePublicPath\("\/ekibimiz"\)/);
});

test("merge öncesi main sürümü yeni tekil veri kaynağına uyumlu kalır", async () => {
  const compatibility = await read(
    "prisma",
    "migrations",
    "20260816233000_legacy_team_member_compatibility",
    "migration.sql",
  );
  assert.match(compatibility, /CREATE VIEW "TeamMember"/);
  assert.match(compatibility, /JOIN "Person" person/);
  assert.match(compatibility, /INSTEAD OF INSERT ON "TeamMember"/);
  assert.match(compatibility, /INSTEAD OF UPDATE ON "TeamMember"/);
  assert.match(compatibility, /INSTEAD OF DELETE ON "TeamMember"/);
});

test("sağlık koordinatörlükleri boş hazırlanır ve public sayfada gizlenir", async () => {
  const migration = await read(
    "prisma",
    "migrations",
    "20260817093000_prepare_empty_health_categories",
    "migration.sql",
  );
  const seed = await read("prisma", "seed.ts");
  const publicPage = await read("app", "[locale]", "ekibimiz", "page.tsx");

  assert.match(migration, /Diş Hekimliği Koordinatörlüğü/);
  assert.match(migration, /Hemşirelik Koordinatörlüğü/);
  assert.match(migration, /normalizedName" IN \('eklenecekuye', 'ekleneceküye'\)/);
  assert.match(migration, /migration stopped to prevent data loss/);
  assert.match(seed, /slug: "dis-hekimligi-koordinatorlugu"/);
  assert.match(seed, /slug: "hemsirelik-koordinatorlugu"/);
  assert.match(publicPage, /memberships:\s*\{\s*some: \{\}/);
});
