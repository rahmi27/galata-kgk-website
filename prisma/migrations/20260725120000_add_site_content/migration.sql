CREATE TYPE "SiteContentType" AS ENUM ('text', 'richtext', 'image');

CREATE TABLE "SiteContent" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "SiteContentType" NOT NULL DEFAULT 'text',
    "page" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteContent_key_key" ON "SiteContent"("key");
CREATE INDEX "SiteContent_page_idx" ON "SiteContent"("page");
