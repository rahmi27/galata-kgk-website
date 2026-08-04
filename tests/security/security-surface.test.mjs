import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

const root = process.cwd();

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

test("uygulama kodunda raw veya unsafe Prisma sorgusu yoktur", async () => {
  const roots = ["app", "components", "lib"].map((item) => path.join(root, item));
  const files = (await Promise.all(roots.map(walk)))
    .flat()
    .filter((file) => /\.(?:ts|tsx)$/.test(file) && !file.includes(`${path.sep}generated${path.sep}`));

  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(
      source,
      /\$(?:queryRaw|executeRaw)(?:Unsafe)?\b/,
      `${path.relative(root, file)} raw Prisma sorgusu içeriyor`,
    );
  }
});

test("dangerouslySetInnerHTML yalnızca güvenli JSON-LD bileşeninde kullanılır", async () => {
  const files = (await Promise.all(
    ["app", "components", "lib"].map((item) => walk(path.join(root, item))),
  ))
    .flat()
    .filter((file) => /\.(?:ts|tsx)$/.test(file) && !file.includes(`${path.sep}generated${path.sep}`));
  const matches = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (source.includes("dangerouslySetInnerHTML")) {
      matches.push({ file, source });
    }
  }

  assert.equal(matches.length, 1);
  assert.equal(
    path.relative(root, matches[0].file).replaceAll("\\", "/"),
    "components/seo/organization-json-ld.tsx",
  );
  assert.match(matches[0].source, /JSON\.stringify\([\s\S]*?\.replace\(\/<\/g/);
});

test("production güvenlik başlıkları zorunlu direktifleri içerir", async () => {
  const configUrl = pathToFileURL(path.join(root, "next.config.mjs"));
  configUrl.searchParams.set("security-test", String(Date.now()));
  const config = await import(configUrl.href);
  const entries = await config.default.headers();
  const headers = Object.fromEntries(
    entries[0].headers.map(({ key, value }) => [key, value]),
  );

  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.match(headers["Content-Security-Policy"], /object-src 'none'/);
  assert.match(headers["Content-Security-Policy"], /maps\.google\.com/);
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(headers["Strict-Transport-Security"], /includeSubDomains/);
});

test("image uploads enforce size, type, signature, and destination checks", async () => {
  const source = await readFile(path.join(root, "lib", "image-upload.ts"), "utf8");

  assert.match(source, /MAX_IMAGE_SIZE\s*=\s*5\s*\*\s*1024\s*\*\s*1024/);
  assert.match(source, /"image\/jpeg"/);
  assert.match(source, /"image\/png"/);
  assert.match(source, /"image\/webp"/);
  assert.ok(
    source.indexOf("matchesSignature(buffer)") < source.indexOf("await put("),
    "The file signature must be validated before the Blob upload",
  );
  assert.match(source, /randomUUID\(\)/);
  assert.match(source, /hostname\.endsWith\("\.blob\.vercel-storage\.com"\)/);
});

test("Auth.js session cookies and password checks are hardened", async () => {
  const source = await readFile(path.join(root, "auth.ts"), "utf8");

  assert.match(source, /useSecureCookies\s*=\s*process\.env\.NODE_ENV\s*===\s*"production"/);
  assert.match(source, /httpOnly:\s*true/);
  assert.match(source, /sameSite:\s*"lax"/);
  assert.match(source, /secure:\s*useSecureCookies/);
  assert.match(source, /admin\?\.passwordHash\s*\?\?\s*DUMMY_ADMIN_PASSWORD_HASH/);
});
