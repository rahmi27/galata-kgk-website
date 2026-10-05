CREATE TYPE "EventMediaType" AS ENUM ('image', 'video');

CREATE TABLE "EventMedia" (
  "id" SERIAL NOT NULL,
  "eventId" INTEGER NOT NULL,
  "type" "EventMediaType" NOT NULL,
  "url" TEXT NOT NULL,
  "caption" TEXT,
  "captionEn" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EventMedia_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EventMedia_url_key" ON "EventMedia"("url");
CREATE INDEX "EventMedia_eventId_order_id_idx" ON "EventMedia"("eventId", "order", "id");

ALTER TABLE "EventMedia" ADD CONSTRAINT "EventMedia_eventId_fkey"
FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
