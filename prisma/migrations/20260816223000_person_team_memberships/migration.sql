CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "photoAlt" TEXT,
    "department" TEXT NOT NULL DEFAULT 'Belirtilmedi',
    "socialPlatform" TEXT,
    "socialUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TeamMembership" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMembership_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Person_normalizedName_key" ON "Person"("normalizedName");
CREATE INDEX "Person_name_idx" ON "Person"("name");
CREATE UNIQUE INDEX "TeamMembership_personId_categoryId_key" ON "TeamMembership"("personId", "categoryId");
CREATE INDEX "TeamMembership_categoryId_order_idx" ON "TeamMembership"("categoryId", "order");
CREATE INDEX "TeamMembership_personId_idx" ON "TeamMembership"("personId");

ALTER TABLE "TeamMembership"
ADD CONSTRAINT "TeamMembership_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TeamMembership"
ADD CONSTRAINT "TeamMembership_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "TeamCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

WITH normalized_members AS (
    SELECT
        tm.*,
        translate(
            lower(regexp_replace(trim(tm."name"), '\s+', '', 'g')),
            'İIı',
            'iii'
        ) AS normalized_name
    FROM "TeamMember" tm
), grouped_people AS (
    SELECT
        normalized_name,
        (array_agg("name" ORDER BY "createdAt", "id"))[1] AS chosen_name,
        (array_agg("photoUrl" ORDER BY ("photoUrl" IS NOT NULL) DESC, "createdAt", "id") FILTER (WHERE "photoUrl" IS NOT NULL))[1] AS chosen_photo_url,
        (array_agg("photoAlt" ORDER BY ("photoAlt" IS NOT NULL) DESC, "createdAt", "id") FILTER (WHERE "photoAlt" IS NOT NULL))[1] AS chosen_photo_alt,
        COALESCE(
            (array_agg("department" ORDER BY (trim("department") <> '' AND "department" <> 'Belirtilmedi') DESC, "createdAt", "id") FILTER (WHERE trim("department") <> ''))[1],
            'Belirtilmedi'
        ) AS chosen_department,
        (array_agg("socialPlatform" ORDER BY ("socialPlatform" IS NOT NULL) DESC, "createdAt", "id") FILTER (WHERE "socialPlatform" IS NOT NULL))[1] AS chosen_social_platform,
        (array_agg("socialUrl" ORDER BY ("socialUrl" IS NOT NULL) DESC, "createdAt", "id") FILTER (WHERE "socialUrl" IS NOT NULL))[1] AS chosen_social_url,
        min("createdAt") AS first_created_at
    FROM normalized_members
    GROUP BY normalized_name
)
INSERT INTO "Person" (
    "name",
    "normalizedName",
    "photoUrl",
    "photoAlt",
    "department",
    "socialPlatform",
    "socialUrl",
    "createdAt"
)
SELECT
    chosen_name,
    normalized_name,
    chosen_photo_url,
    chosen_photo_alt,
    chosen_department,
    chosen_social_platform,
    chosen_social_url,
    first_created_at
FROM grouped_people;

WITH normalized_members AS (
    SELECT
        tm.*,
        translate(
            lower(regexp_replace(trim(tm."name"), '\s+', '', 'g')),
            'İIı',
            'iii'
        ) AS normalized_name
    FROM "TeamMember" tm
)
INSERT INTO "TeamMembership" (
    "personId",
    "categoryId",
    "role",
    "order",
    "createdAt"
)
SELECT
    p."id",
    nm."categoryId",
    string_agg(trim(nm."role"), ' / ' ORDER BY nm."order", nm."id"),
    min(nm."order"),
    min(nm."createdAt")
FROM normalized_members nm
JOIN "Person" p ON p."normalizedName" = nm.normalized_name
GROUP BY p."id", nm."categoryId";

DO $$
DECLARE
    source_person_count INTEGER;
    migrated_person_count INTEGER;
    source_membership_count INTEGER;
    migrated_membership_count INTEGER;
    lost_role_count INTEGER;
BEGIN
    SELECT count(DISTINCT translate(lower(regexp_replace(trim("name"), '\s+', '', 'g')), 'İIı', 'iii'))
    INTO source_person_count
    FROM "TeamMember";

    SELECT count(*) INTO migrated_person_count FROM "Person";

    SELECT count(*)
    INTO source_membership_count
    FROM (
        SELECT DISTINCT
            translate(lower(regexp_replace(trim("name"), '\s+', '', 'g')), 'İIı', 'iii') AS normalized_name,
            "categoryId"
        FROM "TeamMember"
    ) source_memberships;

    SELECT count(*) INTO migrated_membership_count FROM "TeamMembership";

    SELECT count(*)
    INTO lost_role_count
    FROM "TeamMember" tm
    JOIN "Person" p
      ON p."normalizedName" = translate(lower(regexp_replace(trim(tm."name"), '\s+', '', 'g')), 'İIı', 'iii')
    JOIN "TeamMembership" membership
      ON membership."personId" = p."id"
     AND membership."categoryId" = tm."categoryId"
    WHERE position(trim(tm."role") IN membership."role") = 0;

    IF source_person_count <> migrated_person_count THEN
        RAISE EXCEPTION 'Person migration count mismatch: source %, migrated %', source_person_count, migrated_person_count;
    END IF;

    IF source_membership_count <> migrated_membership_count THEN
        RAISE EXCEPTION 'Membership migration count mismatch: source %, migrated %', source_membership_count, migrated_membership_count;
    END IF;

    IF lost_role_count <> 0 THEN
        RAISE EXCEPTION 'Membership migration lost % role values', lost_role_count;
    END IF;
END $$;

DROP TABLE "TeamMember";
