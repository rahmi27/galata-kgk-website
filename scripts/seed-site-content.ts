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
    const existing = await prisma.siteContent.findUnique({
      where: { key: content.key },
      select: {
        label: true,
        page: true,
        type: true,
        valueEn: true,
      },
    });

    if (!existing) {
      await prisma.siteContent.create({ data: content });
      continue;
    }

    const update: {
      label?: string;
      page?: string;
      type?: typeof content.type;
      valueEn?: string;
    } = {};

    if (existing.label !== content.label) update.label = content.label;
    if (existing.page !== content.page) update.page = content.page;
    if (existing.type !== content.type) update.type = content.type;
    if (content.valueEn && existing.valueEn === null) {
      update.valueEn = content.valueEn;
    }

    if (Object.keys(update).length > 0) {
      await prisma.siteContent.update({
        where: { key: content.key },
        data: update,
      });
    }
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
