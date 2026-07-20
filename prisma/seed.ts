import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import eventsContent from "../content/events.json";
import homeContent from "../content/home.json";
import teamContent from "../content/team.json";
import { createNormalizedSlug } from "../lib/slug";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminUsername = "admin";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "ADMIN_SEED_PASSWORD tanımlı değil. Seed işleminden önce .env dosyasına güvenli bir parola ekleyin.",
    );
  }

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_SEED_PASSWORD en az 12 karakter olmalıdır.");
  }

  const passwordHash = await hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: {
      username: adminUsername,
    },
    update: {
      name: "Galata KGK Yöneticisi",
      passwordHash,
    },
    create: {
      username: adminUsername,
      name: "Galata KGK Yöneticisi",
      passwordHash,
    },
  });

  await prisma.$transaction([
    prisma.event.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.teamCategory.deleteMany(),
    prisma.siteStat.deleteMany(),
  ]);

  await prisma.event.createMany({
    data: eventsContent.events.map((event) => ({
      title: event.title,
      slug: event.slug,
      description: event.description,
      longDescription: event.longDescription,
      date: new Date(event.date),
      location: event.location,
      imageUrl: event.imageUrl,
      category: event.category,
    })),
  });

  const categoryNames = Array.from(
    new Set(teamContent.members.map((member) => member.department)),
  );
  const categoryIdByName = new Map<string, number>();

  for (const [index, name] of categoryNames.entries()) {
    const category = await prisma.teamCategory.create({
      data: {
        name,
        slug: createNormalizedSlug(name),
        order: index + 1,
      },
    });
    categoryIdByName.set(name, category.id);
  }

  await prisma.teamMember.createMany({
    data: teamContent.members.map((member) => ({
      name: member.name,
      role: member.role,
      categoryId: categoryIdByName.get(member.department)!,
      photoUrl: member.photoUrl,
      order: member.order,
    })),
  });

  await prisma.siteStat.createMany({
    data: homeContent.statsSection.items.map((stat, index) => ({
      label: stat.label,
      value: stat.value,
      order: index + 1,
    })),
  });

  const [eventCount, teamMemberCount, categoryCount, siteStatCount] =
    await Promise.all([
    prisma.event.count(),
    prisma.teamMember.count(),
    prisma.teamCategory.count(),
    prisma.siteStat.count(),
    ]);

  console.log(
    `Seed tamamlandı: ${eventCount} etkinlik, ${teamMemberCount} ekip üyesi, ${categoryCount} ekip kategorisi, ${siteStatCount} istatistik.`,
  );
  console.log(`Admin kullanıcı adı: ${adminUsername}`);
  console.log(`Admin geçici şifre: ${adminPassword}`);
  console.log("İlk girişten sonra bu şifreyi değiştirin.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
