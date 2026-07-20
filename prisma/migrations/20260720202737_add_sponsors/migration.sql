-- CreateTable
CREATE TABLE "Sponsor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tierId" INTEGER NOT NULL,
    CONSTRAINT "Sponsor_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "SponsorTier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SponsorTier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Sponsor_tierId_order_idx" ON "Sponsor"("tierId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorTier_name_key" ON "SponsorTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorTier_slug_key" ON "SponsorTier"("slug");

-- CreateIndex
CREATE INDEX "SponsorTier_order_idx" ON "SponsorTier"("order");
