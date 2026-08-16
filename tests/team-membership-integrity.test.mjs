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
  assert.doesNotMatch(schema, /model TeamMember\s*\{/);
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

test("Ekibimiz ISR kalır ve admin değişiklikleri önbelleği yeniler", async () => {
  const publicPage = await read("app", "ekibimiz", "page.tsx");
  const actions = await read("app", "admin", "(panel)", "uyeler", "actions.ts");
  assert.match(publicPage, /export const revalidate = 300/);
  assert.match(publicPage, /memberships:[\s\S]*person: true/);
  assert.doesNotMatch(publicPage, /force-dynamic/);
  assert.match(actions, /revalidatePath\("\/ekibimiz"\)/);
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
