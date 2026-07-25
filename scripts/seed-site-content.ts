import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";
import { siteContentDefinitions } from "../lib/site-content-defaults";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL ortam değişkeni tanımlanmalıdır.");
}

function enforceCertificateVerification(value: string) {
  const url = new URL(value);
  const sslMode = url.searchParams.get("sslmode");

  if (["prefer", "require", "verify-ca"].includes(sslMode ?? "")) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}

const adapter = new PrismaPg({
  connectionString: enforceCertificateVerification(connectionString),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const content of siteContentDefinitions) {
    await prisma.siteContent.upsert({
      where: {
        key: content.key,
      },
      update: {
        label: content.label,
        page: content.page,
        type: content.type,
      },
      create: content,
    });
  }

  console.log(
    `SiteContent hazır: ${await prisma.siteContent.count()} düzenlenebilir içerik kaydı.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
