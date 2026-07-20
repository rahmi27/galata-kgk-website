import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import eventsContent from "../content/events.json";
import homeContent from "../content/home.json";
import teamContent from "../content/team.json";

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

  await prisma.teamMember.createMany({
    data: teamContent.members.map((member) => ({
      name: member.name,
      role: member.role,
      department: member.department,
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

  const [eventCount, teamMemberCount, siteStatCount] = await Promise.all([
    prisma.event.count(),
    prisma.teamMember.count(),
    prisma.siteStat.count(),
  ]);

  console.log(
    `Seed tamamlandı: ${eventCount} etkinlik, ${teamMemberCount} ekip üyesi, ${siteStatCount} istatistik.`,
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
