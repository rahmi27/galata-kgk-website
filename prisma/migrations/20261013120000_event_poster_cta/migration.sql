CREATE TYPE "PosterCtaTarget" AS ENUM ('linkedEvent', 'eventMode', 'join', 'joinMember', 'events', 'contact');

ALTER TABLE "EventSession"
ADD COLUMN "posterCtaTarget" "PosterCtaTarget" NOT NULL DEFAULT 'linkedEvent',
ADD COLUMN "posterCtaLabel" TEXT,
ADD COLUMN "posterCtaLabelEn" TEXT;
