ALTER TABLE "Event"
  ADD COLUMN "titleEn" TEXT,
  ADD COLUMN "descriptionEn" TEXT,
  ADD COLUMN "longDescriptionEn" TEXT,
  ADD COLUMN "locationEn" TEXT,
  ADD COLUMN "imageAltEn" TEXT,
  ADD COLUMN "categoryEn" TEXT;

ALTER TABLE "Person"
  ADD COLUMN "nameEn" TEXT,
  ADD COLUMN "photoAltEn" TEXT,
  ADD COLUMN "departmentEn" TEXT;

ALTER TABLE "TeamMembership"
  ADD COLUMN "roleEn" TEXT;

ALTER TABLE "TeamCategory"
  ADD COLUMN "nameEn" TEXT;

ALTER TABLE "Sponsor"
  ADD COLUMN "nameEn" TEXT,
  ADD COLUMN "logoAltEn" TEXT,
  ADD COLUMN "descriptionEn" TEXT;

ALTER TABLE "SponsorTier"
  ADD COLUMN "nameEn" TEXT;

ALTER TABLE "PartnerClub"
  ADD COLUMN "nameEn" TEXT,
  ADD COLUMN "logoAltEn" TEXT,
  ADD COLUMN "shortDescriptionEn" TEXT;

ALTER TABLE "CollaborationItem"
  ADD COLUMN "titleEn" TEXT,
  ADD COLUMN "descriptionEn" TEXT;

ALTER TABLE "SiteStat"
  ADD COLUMN "labelEn" TEXT;

ALTER TABLE "SiteContent"
  ADD COLUMN "valueEn" TEXT;
