import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

// Preview environment variables may point to the production database.
// A feature-branch push must never migrate or seed that database implicitly.
if (process.env.VERCEL_ENV === "preview") {
  console.log("Preview build: veritabanı migration ve içerik seed işlemleri atlandı.");
  process.exit(0);
}

for (const args of [["exec", "--", "prisma", "migrate", "deploy"], ["run", "db:seed-content"]]) {
  const npmCli = process.env.npm_execpath || join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  const result = existsSync(npmCli)
    ? spawnSync(process.execPath, [npmCli, ...args], { stdio: "inherit" })
    : spawnSync("npm", args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
