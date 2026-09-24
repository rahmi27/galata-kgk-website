CREATE TYPE "PosterOrientation" AS ENUM ('portrait', 'landscape');

ALTER TABLE "EventSession"
ADD COLUMN "posterOrientation" "PosterOrientation" NOT NULL DEFAULT 'portrait';
