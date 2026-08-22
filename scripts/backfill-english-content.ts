import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL ortam değişkeni tanımlanmalıdır.");
}

function enforcePostgresCertificateVerification(value: string) {
  const url = new URL(value);
  const sslMode = url.searchParams.get("sslmode");

  if (["prefer", "require", "verify-ca"].includes(sslMode ?? "")) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: enforcePostgresCertificateVerification(connectionString),
  }),
});

const eventTranslations = {
  "Galata GüzFest": {
    titleEn: "Galata Autumn Fest",
    descriptionEn:
      "We are kicking off the new term with energy, games, surprises and new friendships while giving students a closer look at the club.",
    longDescriptionEn:
      "Galata Autumn Fest offers a warm, energetic welcome to students joining Galata KGK for the new term. In a relaxed setting, we will introduce the club's vision, focus areas and plans for the year.\n\nWith costumed hosts, welcome packs, a photo booth and interactive games, the event is designed to make meeting new people feel effortless. Held at Bilim Beyoğlu, it is the perfect first step towards discovering the community and becoming part of it.",
    locationEn: "Bilim Beyoğlu",
    categoryEn: "Networking",
  },
  "Baret Töreni ve Mesleki İlham Buluşması": {
    titleEn: "Hard Hat Ceremony and Professional Inspiration Talk",
    descriptionEn:
      "A special ceremony that brings interior architecture students together with an experienced professional, strengthening their sense of belonging and motivation for the future.",
    longDescriptionEn:
      "The Hard Hat Ceremony and Professional Inspiration Talk is designed to mark a meaningful beginning in the professional journey of interior architecture students. During a conversation with a guest interior architect, we will explore the transition from education to industry, creative practice and professional responsibility.\n\nAt the end of the programme, signed hard hats will be presented to students. As a symbol of professional identity, this keepsake will celebrate their commitment to the goals they are working towards.",
    locationEn: "Venue to be announced",
    categoryEn: "Career",
  },
  "Galata Impact '26": {
    titleEn: "Galata Impact '26",
    descriptionEn:
      "Our annual summit brings industry professionals, entrepreneurs and content creators onto one stage, combining career insight with the energy of the digital world.",
    longDescriptionEn:
      "Galata Impact '26 is the flagship event of Istanbul Galata University Career and Entrepreneurship Club, bringing experienced voices from the professional world together with leading creators of the digital age.\n\nAcross the summit, industry professionals and entrepreneurs will discuss career planning, internship opportunities and routes into the world of work. Profession-focused and popular content creators will also share their journeys, approaches to personal branding and strategies for creating meaningful impact online.\n\nGalata Impact '26 gives students the opportunity to explore both established career paths and emerging professions, connect directly with inspiring people and turn their potential into momentum.",
    locationEn: "Venue to be announced",
    categoryEn: "Career",
  },
} as const;

const categoryTranslations: Record<string, string> = {
  "Yönetim Kurulu": "Executive Board",
  "Sponsor ve İş Birlikleri Koordinatörlüğü":
    "Sponsorship and Partnerships Coordination",
  "Etkinlik Koordinatörlüğü": "Events Coordination",
  "IT Koordinatörlüğü": "IT Coordination",
  "Tasarım Koordinatörlüğü": "Design Coordination",
  "Sosyal Medya Koordinatörlüğü": "Social Media Coordination",
  "Gastronomi Koordinatörlüğü": "Gastronomy Coordination",
  "Üye Koordinatörlüğü": "Membership Coordination",
  Sayman: "Treasurer",
  "Diş Hekimliği Koordinatörlüğü": "Dentistry Coordination",
  "Hemşirelik Koordinatörlüğü": "Nursing Coordination",
};

const departmentTranslations: Record<string, string> = {
  "İç Mimarlık ve Çevre Tasarımı":
    "Interior Architecture and Environmental Design",
  "İç Mimarlık": "Interior Architecture",
  "Gastronomi ve Mutfak Sanatları": "Gastronomy and Culinary Arts",
  "İletişim ve Tasarım": "Communication and Design",
  "Bilgisayar Mühendisliği": "Computer Engineering",
  Belirtilmedi: "Not specified",
};

const roleTranslations: Record<string, string> = {
  "Yönetim Kurulu Başkanı": "Executive Board President",
  "Yönetim Kurulu Başkan Yardımcısı": "Executive Board Vice President",
  "Yönetim Kurulu Üyesi": "Executive Board Member",
  "Yönetim Kurulu Sayman Üyesi": "Executive Board Treasurer",
  "Etkinlik Koordinatörü": "Events Coordinator",
  "Etkinlik Koordinatörü Yardımcısı": "Assistant Events Coordinator",
  "IT Koordinatörü": "IT Coordinator",
  "IT Koordinatörü Yardımcısı": "Assistant IT Coordinator",
  "Tasarım Koordinatörü": "Design Coordinator",
  "Tasarım Koordinatörü Yardımcısı": "Assistant Design Coordinator",
  "Sosyal Medya Koordinatörü": "Social Media Coordinator",
  "Sosyal Medya Koordinatörü Yardımcısı":
    "Assistant Social Media Coordinator",
  "Üye Koordinatörü": "Membership Coordinator",
  "Sponsor ve İş Birlikleri Koordinatörü":
    "Sponsorship and Partnerships Coordinator",
  "Gastronomi Koordinatörü": "Gastronomy Coordinator",
  Sayman: "Treasurer",
};

const sponsorTierTranslations: Record<string, string> = {
  "Marka Sponsorlukları": "Brand Sponsorships",
  "Halk Sponsorlukları": "Community Sponsorships",
};

const statTranslations: Record<string, string> = {
  "Topluluk üyesi": "Community members",
  "Yıllık etkinlik": "Annual events",
  "Sektör iş birliği": "Industry partnerships",
};

const partnerTranslations = {
  "Örnek Girişimcilik Kulübü": {
    nameEn: "Sample Entrepreneurship Club",
    shortDescriptionEn:
      "A sample partner club bringing entrepreneurial ideas together through shared workshops and peer learning.",
  },
  "Örnek Kariyer Kulübü": {
    nameEn: "Sample Career Club",
    shortDescriptionEn:
      "A sample partner club connecting students from different disciplines through career-focused events.",
  },
} as const;

const collaborationTranslations = {
  "Ortak Girişimcilik Atölyesi": {
    titleEn: "Joint Entrepreneurship Workshop",
    descriptionEn:
      "A sample workshop where club members can practise developing and presenting ideas together.",
  },
  "Mentor Buluşması": {
    titleEn: "Mentor Meetup",
    descriptionEn:
      "A shared learning session with mentors from the entrepreneurship ecosystem.",
  },
  "Ortak Kariyer Günü": {
    titleEn: "Joint Career Day",
    descriptionEn:
      "A sample collaboration designed to connect students with industry representatives.",
  },
} as const;

function isBlank(value: string | null | undefined) {
  return !value?.trim();
}

async function main() {
  const updated = {
    events: 0,
    categories: 0,
    people: 0,
    memberships: 0,
    sponsorTiers: 0,
    sponsors: 0,
    partners: 0,
    collaborations: 0,
    stats: 0,
    siteContent: 0,
  };

  await prisma.$transaction(async (tx) => {
    const events = await tx.event.findMany();

    for (const event of events) {
      const translation =
        eventTranslations[event.title as keyof typeof eventTranslations];

      if (!translation) continue;

      const data: {
        titleEn?: string;
        descriptionEn?: string;
        longDescriptionEn?: string;
        locationEn?: string;
        imageAltEn?: string;
        categoryEn?: string;
      } = {};

      if (isBlank(event.titleEn)) data.titleEn = translation.titleEn;
      if (isBlank(event.descriptionEn)) {
        data.descriptionEn = translation.descriptionEn;
      }
      if (isBlank(event.longDescriptionEn)) {
        data.longDescriptionEn = translation.longDescriptionEn;
      }
      if (isBlank(event.locationEn)) data.locationEn = translation.locationEn;
      if (isBlank(event.categoryEn)) data.categoryEn = translation.categoryEn;
      if (event.imageUrl && isBlank(event.imageAltEn)) {
        data.imageAltEn = `${translation.titleEn} event image`;
      }

      if (Object.keys(data).length) {
        await tx.event.update({ where: { id: event.id }, data });
        updated.events += 1;
      }
    }

    const categories = await tx.teamCategory.findMany();
    for (const category of categories) {
      const nameEn = categoryTranslations[category.name];
      if (nameEn && isBlank(category.nameEn)) {
        await tx.teamCategory.update({
          where: { id: category.id },
          data: { nameEn },
        });
        updated.categories += 1;
      }
    }

    const people = await tx.person.findMany();
    for (const person of people) {
      const data: {
        nameEn?: string;
        departmentEn?: string;
        photoAltEn?: string;
      } = {};

      if (isBlank(person.nameEn)) data.nameEn = person.name;
      if (isBlank(person.departmentEn)) {
        data.departmentEn =
          departmentTranslations[person.department] ?? person.department;
      }
      if (isBlank(person.photoAltEn)) {
        data.photoAltEn = `${person.name} portrait`;
      }

      if (Object.keys(data).length) {
        await tx.person.update({ where: { id: person.id }, data });
        updated.people += 1;
      }
    }

    const memberships = await tx.teamMembership.findMany();
    for (const membership of memberships) {
      const roleEn = roleTranslations[membership.role];
      if (roleEn && isBlank(membership.roleEn)) {
        await tx.teamMembership.update({
          where: { id: membership.id },
          data: { roleEn },
        });
        updated.memberships += 1;
      }
    }

    const sponsorTiers = await tx.sponsorTier.findMany();
    for (const tier of sponsorTiers) {
      const nameEn = sponsorTierTranslations[tier.name];
      if (nameEn && isBlank(tier.nameEn)) {
        await tx.sponsorTier.update({
          where: { id: tier.id },
          data: { nameEn },
        });
        updated.sponsorTiers += 1;
      }
    }

    const sponsors = await tx.sponsor.findMany();
    for (const sponsor of sponsors) {
      const data: { nameEn?: string; logoAltEn?: string } = {};
      if (isBlank(sponsor.nameEn)) data.nameEn = sponsor.name;
      if (isBlank(sponsor.logoAltEn)) {
        data.logoAltEn = `${sponsor.name} logo`;
      }
      if (Object.keys(data).length) {
        await tx.sponsor.update({ where: { id: sponsor.id }, data });
        updated.sponsors += 1;
      }
    }

    const partners = await tx.partnerClub.findMany();
    for (const partner of partners) {
      const translation =
        partnerTranslations[partner.name as keyof typeof partnerTranslations];
      const data: {
        nameEn?: string;
        shortDescriptionEn?: string;
        logoAltEn?: string;
      } = {};

      if (translation) {
        if (isBlank(partner.nameEn)) data.nameEn = translation.nameEn;
        if (isBlank(partner.shortDescriptionEn)) {
          data.shortDescriptionEn = translation.shortDescriptionEn;
        }
      } else {
        if (isBlank(partner.nameEn)) data.nameEn = partner.name;
        if (isBlank(partner.shortDescriptionEn)) {
          data.shortDescriptionEn = partner.shortDescription;
        }
      }
      if (isBlank(partner.logoAltEn)) {
        data.logoAltEn = `${data.nameEn ?? partner.nameEn ?? partner.name} logo`;
      }

      if (Object.keys(data).length) {
        await tx.partnerClub.update({ where: { id: partner.id }, data });
        updated.partners += 1;
      }
    }

    const collaborations = await tx.collaborationItem.findMany();
    for (const collaboration of collaborations) {
      const translation =
        collaborationTranslations[
          collaboration.title as keyof typeof collaborationTranslations
        ];
      if (!translation) continue;

      const data: { titleEn?: string; descriptionEn?: string } = {};
      if (isBlank(collaboration.titleEn)) data.titleEn = translation.titleEn;
      if (isBlank(collaboration.descriptionEn)) {
        data.descriptionEn = translation.descriptionEn;
      }
      if (Object.keys(data).length) {
        await tx.collaborationItem.update({
          where: { id: collaboration.id },
          data,
        });
        updated.collaborations += 1;
      }
    }

    const stats = await tx.siteStat.findMany();
    for (const stat of stats) {
      const labelEn = statTranslations[stat.label];
      if (labelEn && isBlank(stat.labelEn)) {
        await tx.siteStat.update({
          where: { id: stat.id },
          data: { labelEn },
        });
        updated.stats += 1;
      }
    }

    const siteContentTranslations: Record<string, string> = {
      "footer.social.instagram":
        "https://www.instagram.com/galatakariyergirisimcilik/",
      "header.nav.anasayfa.order": "1",
      "header.nav.hakkimizda.order": "2",
      "header.nav.etkinliklerimiz.order": "3",
      "header.nav.ekibimiz.order": "4",
      "header.nav.ortaklarimiz.order": "5",
      "header.nav.sponsorlar.label": "Sponsors",
      "header.nav.sponsorlar.order": "5",
      "header.nav.iletisim.order": "6",
    };

    for (const [key, valueEn] of Object.entries(siteContentTranslations)) {
      const result = await tx.siteContent.updateMany({
        where: { key, OR: [{ valueEn: null }, { valueEn: "" }] },
        data: { valueEn },
      });
      updated.siteContent += result.count;
    }
  }, { maxWait: 10_000, timeout: 30_000 });

  console.log("İngilizce içerik doldurma işlemi tamamlandı:");
  console.table(updated);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
