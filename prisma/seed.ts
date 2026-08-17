import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import eventsContent from "../content/events.json";
import homeContent from "../content/home.json";
import teamContent from "../content/team.json";
import { normalizePersonName } from "../lib/person-name";
import { siteContentDefinitions } from "../lib/site-content-defaults";
import { createNormalizedSlug } from "../lib/slug";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL ortam değişkeni tanımlanmalıdır.");
}

const adapter = new PrismaPg({ connectionString });
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
    prisma.teamMembership.deleteMany(),
    prisma.person.deleteMany(),
    prisma.teamCategory.deleteMany(),
    prisma.siteStat.deleteMany(),
  ]);

  await prisma.event.createMany({
    data: eventsContent.events.map((event) => ({
      title: event.title,
      slug: event.slug,
      description: event.description,
      longDescription: event.longDescription,
      date: event.date ? new Date(event.date) : null,
      location: event.location,
      imageUrl: event.imageUrl,
      imageAlt: event.imageUrl ? `${event.title} etkinliği görseli` : null,
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

  await prisma.teamCategory.createMany({
    data: [
      {
        name: "Diş Hekimliği Koordinatörlüğü",
        slug: "dis-hekimligi-koordinatorlugu",
        order: 11,
      },
      {
        name: "Hemşirelik Koordinatörlüğü",
        slug: "hemsirelik-koordinatorlugu",
        order: 12,
      },
    ],
  });

  const personIdByNormalizedName = new Map<string, number>();

  for (const member of teamContent.members) {
    const normalizedName = normalizePersonName(member.name);

    if (personIdByNormalizedName.has(normalizedName)) {
      continue;
    }

    const person = await prisma.person.create({
      data: {
        name: member.name,
        normalizedName,
        department: "Belirtilmedi",
        photoUrl: member.photoUrl,
        photoAlt: member.photoUrl ? `${member.name} portresi` : null,
      },
    });
    personIdByNormalizedName.set(normalizedName, person.id);
  }

  const membershipsByPersonAndCategory = new Map<
    string,
    {
      personId: number;
      categoryId: number;
      roles: string[];
      order: number;
    }
  >();

  for (const member of teamContent.members) {
    const personId = personIdByNormalizedName.get(
      normalizePersonName(member.name),
    )!;
    const categoryId = categoryIdByName.get(member.department)!;
    const membershipKey = `${personId}:${categoryId}`;
    const existingMembership = membershipsByPersonAndCategory.get(membershipKey);

    if (existingMembership) {
      existingMembership.roles.push(member.role);
      existingMembership.order = Math.min(existingMembership.order, member.order);
    } else {
      membershipsByPersonAndCategory.set(membershipKey, {
        personId,
        categoryId,
        roles: [member.role],
        order: member.order,
      });
    }
  }

  await prisma.teamMembership.createMany({
    data: Array.from(membershipsByPersonAndCategory.values()).map(
      (membership) => ({
        personId: membership.personId,
        categoryId: membership.categoryId,
        role: membership.roles.join(" / "),
        order: membership.order,
      }),
    ),
  });

  await prisma.siteStat.createMany({
    data: homeContent.statsSection.items.map((stat, index) => ({
      label: stat.label,
      value: stat.value,
      order: index + 1,
    })),
  });

  const entrepreneurshipClub = await prisma.partnerClub.upsert({
    where: { slug: "ornek-girisimcilik-kulubu" },
    update: {
      name: "Örnek Girişimcilik Kulübü",
      logoUrl: "/brand/galata-kgk-logo.webp",
      logoAlt: "Örnek Girişimcilik Kulübü logosu",
      shortDescription:
        "Girişimci fikirleri ortak atölyeler ve deneyim paylaşımıyla buluşturan örnek partner kulüp.",
      order: 1,
    },
    create: {
      name: "Örnek Girişimcilik Kulübü",
      slug: "ornek-girisimcilik-kulubu",
      logoUrl: "/brand/galata-kgk-logo.webp",
      logoAlt: "Örnek Girişimcilik Kulübü logosu",
      shortDescription:
        "Girişimci fikirleri ortak atölyeler ve deneyim paylaşımıyla buluşturan örnek partner kulüp.",
      order: 1,
    },
  });

  const careerClub = await prisma.partnerClub.upsert({
    where: { slug: "ornek-kariyer-kulubu" },
    update: {
      name: "Örnek Kariyer Kulübü",
      logoUrl: "/brand/galata-kgk-logo.webp",
      logoAlt: "Örnek Kariyer Kulübü logosu",
      shortDescription:
        "Farklı disiplinlerden öğrencileri kariyer buluşmalarında bir araya getiren örnek partner kulüp.",
      order: 2,
    },
    create: {
      name: "Örnek Kariyer Kulübü",
      slug: "ornek-kariyer-kulubu",
      logoUrl: "/brand/galata-kgk-logo.webp",
      logoAlt: "Örnek Kariyer Kulübü logosu",
      shortDescription:
        "Farklı disiplinlerden öğrencileri kariyer buluşmalarında bir araya getiren örnek partner kulüp.",
      order: 2,
    },
  });

  const collaborationSeeds = [
    {
      partnerClubId: entrepreneurshipClub.id,
      title: "Ortak Girişimcilik Atölyesi",
      description:
        "Kulüp üyelerinin fikir geliştirme ve sunum becerilerini birlikte deneyimleyeceği örnek atölye planı.",
      date: null,
      order: 1,
    },
    {
      partnerClubId: entrepreneurshipClub.id,
      title: "Mentor Buluşması",
      description:
        "Girişimcilik ekosisteminden mentorlarla ortak bir deneyim paylaşımı oturumu.",
      date: null,
      order: 2,
    },
    {
      partnerClubId: careerClub.id,
      title: "Ortak Kariyer Günü",
      description:
        "Sektör temsilcileriyle öğrencileri buluşturmayı amaçlayan örnek etkinlik iş birliği.",
      date: null,
      order: 1,
    },
  ];

  for (const collaboration of collaborationSeeds) {
    const existing = await prisma.collaborationItem.findFirst({
      where: {
        partnerClubId: collaboration.partnerClubId,
        title: collaboration.title,
      },
    });

    if (existing) {
      await prisma.collaborationItem.update({
        where: { id: existing.id },
        data: collaboration,
      });
    } else {
      await prisma.collaborationItem.create({ data: collaboration });
    }
  }

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

  const [
    eventCount,
    personCount,
    membershipCount,
    categoryCount,
    siteStatCount,
    siteContentCount,
    partnerClubCount,
    collaborationCount,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.person.count(),
    prisma.teamMembership.count(),
    prisma.teamCategory.count(),
    prisma.siteStat.count(),
    prisma.siteContent.count(),
    prisma.partnerClub.count(),
    prisma.collaborationItem.count(),
  ]);

  console.log(
    `Seed tamamlandı: ${eventCount} etkinlik, ${personCount} kişi, ${membershipCount} ekip üyeliği, ${categoryCount} ekip kategorisi, ${siteStatCount} istatistik, ${siteContentCount} düzenlenebilir içerik, ${partnerClubCount} partner kulüp, ${collaborationCount} iş birliği maddesi.`,
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
