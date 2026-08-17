-- Prepare two future coordination categories without inventing member data.
-- Only the legacy placeholder person is eligible for removal. If a real
-- membership appeared meanwhile, the assertion below aborts the migration
-- instead of deleting that data.
INSERT INTO "TeamCategory" ("name", "slug", "order")
VALUES
  ('Diş Hekimliği Koordinatörlüğü', 'dis-hekimligi-koordinatorlugu', 11),
  ('Hemşirelik Koordinatörlüğü', 'hemsirelik-koordinatorlugu', 12)
ON CONFLICT ("slug") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "order" = EXCLUDED."order";

DELETE FROM "TeamMembership" AS membership
USING "Person" AS person, "TeamCategory" AS category
WHERE membership."personId" = person."id"
  AND membership."categoryId" = category."id"
  AND category."slug" IN (
    'dis-hekimligi-koordinatorlugu',
    'hemsirelik-koordinatorlugu'
  )
  AND person."normalizedName" = 'eklenecekuye';

DELETE FROM "Person" AS person
WHERE person."normalizedName" = 'eklenecekuye'
  AND NOT EXISTS (
    SELECT 1
    FROM "TeamMembership" AS membership
    WHERE membership."personId" = person."id"
  );

DO $$
DECLARE
  health_category_count INTEGER;
  unexpected_membership_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO health_category_count
  FROM "TeamCategory"
  WHERE "slug" IN (
    'dis-hekimligi-koordinatorlugu',
    'hemsirelik-koordinatorlugu'
  );

  IF health_category_count <> 2 THEN
    RAISE EXCEPTION 'Health coordination category creation mismatch: expected 2, found %', health_category_count;
  END IF;

  SELECT COUNT(*)
  INTO unexpected_membership_count
  FROM "TeamMembership" AS membership
  JOIN "TeamCategory" AS category ON category."id" = membership."categoryId"
  WHERE category."slug" IN (
    'dis-hekimligi-koordinatorlugu',
    'hemsirelik-koordinatorlugu'
  );

  IF unexpected_membership_count <> 0 THEN
    RAISE EXCEPTION 'Health coordination categories contain real memberships; migration stopped to prevent data loss';
  END IF;
END $$;
