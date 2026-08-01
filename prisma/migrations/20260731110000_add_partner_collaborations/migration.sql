CREATE TABLE "PartnerClub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "logoAlt" TEXT,
    "shortDescription" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerClub_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CollaborationItem" (
    "id" SERIAL NOT NULL,
    "partnerClubId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollaborationItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PartnerClub_slug_key" ON "PartnerClub"("slug");
CREATE INDEX "PartnerClub_order_idx" ON "PartnerClub"("order");
CREATE INDEX "CollaborationItem_partnerClubId_date_order_idx" ON "CollaborationItem"("partnerClubId", "date", "order");

ALTER TABLE "CollaborationItem"
ADD CONSTRAINT "CollaborationItem_partnerClubId_fkey"
FOREIGN KEY ("partnerClubId") REFERENCES "PartnerClub"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
