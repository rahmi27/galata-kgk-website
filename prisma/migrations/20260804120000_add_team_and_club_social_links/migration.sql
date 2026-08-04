ALTER TABLE "TeamMember"
ADD COLUMN "socialPlatform" TEXT,
ADD COLUMN "socialUrl" TEXT;

CREATE TABLE "ClubSocialLink" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubSocialLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClubSocialLink_platform_key" ON "ClubSocialLink"("platform");
CREATE INDEX "ClubSocialLink_order_idx" ON "ClubSocialLink"("order");

INSERT INTO "ClubSocialLink" ("platform", "label", "url", "order", "updatedAt")
SELECT 'instagram', 'Instagram', "value", 1, CURRENT_TIMESTAMP
FROM "SiteContent"
WHERE "key" = 'footer.social.instagram' AND LENGTH(TRIM("value")) > 0
ON CONFLICT ("platform") DO NOTHING;

INSERT INTO "ClubSocialLink" ("platform", "label", "url", "order", "updatedAt")
SELECT 'linkedin', 'LinkedIn', "value", 2, CURRENT_TIMESTAMP
FROM "SiteContent"
WHERE "key" = 'footer.social.linkedin' AND LENGTH(TRIM("value")) > 0
ON CONFLICT ("platform") DO NOTHING;

INSERT INTO "ClubSocialLink" ("platform", "label", "url", "order", "updatedAt")
SELECT 'x', 'X / Twitter', "value", 3, CURRENT_TIMESTAMP
FROM "SiteContent"
WHERE "key" = 'footer.social.x' AND LENGTH(TRIM("value")) > 0
ON CONFLICT ("platform") DO NOTHING;
