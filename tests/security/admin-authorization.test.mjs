import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const adminRoot = path.join(root, "app", "admin");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    }),
  );
  return files.flat();
}

test("tüm admin Server Action'ları veri erişiminden önce requireAdmin çağırır", async () => {
  const files = (await walk(adminRoot)).filter((file) =>
    /(?:actions|social-actions)\.ts$/.test(file),
  );
  let actionCount = 0;

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const exports = [
      ...source.matchAll(/export\s+async\s+function\s+(\w+)/g),
    ];

    for (let index = 0; index < exports.length; index += 1) {
      actionCount += 1;
      const current = exports[index];
      const next = exports[index + 1];
      const body = source.slice(current.index, next?.index ?? source.length);
      const guardIndex = body.indexOf("await requireAdmin(");
      const prismaIndex = body.indexOf("prisma.");
      const uploadIndex = body.indexOf("saveImageUpload(");

      assert.notEqual(
        guardIndex,
        -1,
        `${path.relative(root, file)}:${current[1]} requireAdmin çağırmıyor`,
      );

      for (const sensitiveIndex of [prismaIndex, uploadIndex]) {
        if (sensitiveIndex !== -1) {
          assert.ok(
            guardIndex < sensitiveIndex,
            `${path.relative(root, file)}:${current[1]} guard öncesi hassas işlem yapıyor`,
          );
        }
      }

      if (/\w+Id:\s*number/.test(body) && /prisma\.[\s\S]*\.(?:update|delete)\(/.test(body)) {
        assert.match(
          body,
          /success:\s*false/,
          `${path.relative(root, file)}:${current[1]} kontrollü IDOR/not-found sonucu döndürmüyor`,
        );
      }
    }
  }

  assert.equal(actionCount, 37, "Beklenen admin action envanteri değişti");
});

test("admin panel layout'u doğrudan URL erişiminde de oturum ister", async () => {
  const source = await readFile(
    path.join(adminRoot, "(panel)", "layout.tsx"),
    "utf8",
  );
  assert.match(source, /await\s+requireAdmin\(\)/);
});

test("iş birliği maddesi güncellemeleri kulüp ilişkisini ID ile birlikte doğrular", async () => {
  const source = await readFile(
    path.join(adminRoot, "(panel)", "is-birlikleri", "actions.ts"),
    "utf8",
  );
  assert.match(
    source,
    /findFirst\([\s\S]*?id:\s*collaborationItemId[\s\S]*?partnerClubId[\s\S]*?\)/,
  );
});
