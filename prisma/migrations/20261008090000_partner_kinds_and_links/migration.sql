CREATE TYPE "PartnerKind" AS ENUM ('CLUB', 'PERSON', 'ORGANIZATION');

ALTER TABLE "PartnerClub"
  ADD COLUMN "kind" "PartnerKind" NOT NULL DEFAULT 'CLUB',
  ADD COLUMN "subtitle" TEXT,
  ADD COLUMN "subtitleEn" TEXT,
  ADD COLUMN "websiteUrl" TEXT,
  ADD COLUMN "linkedinUrl" TEXT,
  ADD COLUMN "instagramUrl" TEXT;

-- Move the published social URLs into structured links and replace the
-- link-only blurb with a concise profile. The linked collaboration is retained.
UPDATE "PartnerClub"
SET "kind" = 'PERSON',
    "subtitle" = 'Halkla İlişkiler ve Reklamcılık öğrencisi',
    "subtitleEn" = 'Public Relations and Advertising student',
    "shortDescription" = CASE WHEN "shortDescription" LIKE '%linkedin.com/in/%'
      THEN 'Halkla İlişkiler ve Reklamcılık öğrencisi Gönül Özkaplan, Galata GüzFest etkinliğimizin afiş tasarımını hazırladı.'
      ELSE "shortDescription" END,
    "shortDescriptionEn" = CASE WHEN "shortDescriptionEn" IS NULL
      THEN 'Gönül Özkaplan, a Public Relations and Advertising student, designed the poster for our Galata GüzFest event.'
      ELSE "shortDescriptionEn" END,
    "linkedinUrl" = 'https://www.linkedin.com/in/gönül-özkaplan-33b7562bb',
    "instagramUrl" = 'https://www.instagram.com/ozkaplangonull'
WHERE "slug" = 'gonul-ozkaplan';
