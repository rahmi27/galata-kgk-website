-- The deployed main revision may keep reading TeamMember until this feature is
-- merged. This view keeps that revision operational without duplicating data:
-- Person and TeamMembership remain the only source of truth.
CREATE VIEW "TeamMember" AS
SELECT
    membership."id",
    person."name",
    membership."role",
    person."department",
    person."photoUrl",
    person."photoAlt",
    membership."order",
    membership."createdAt",
    membership."categoryId",
    person."socialPlatform",
    person."socialUrl"
FROM "TeamMembership" membership
JOIN "Person" person ON person."id" = membership."personId";

CREATE FUNCTION legacy_team_member_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    normalized_name TEXT;
    target_person_id INTEGER;
BEGIN
    normalized_name := translate(
        lower(regexp_replace(trim(NEW."name"), '\s+', '', 'g')),
        'İIı',
        'iii'
    );

    SELECT "id" INTO target_person_id
    FROM "Person"
    WHERE "normalizedName" = normalized_name;

    IF target_person_id IS NULL THEN
        INSERT INTO "Person" (
            "name", "normalizedName", "department", "photoUrl", "photoAlt",
            "socialPlatform", "socialUrl", "createdAt"
        ) VALUES (
            NEW."name", normalized_name, NEW."department", NEW."photoUrl",
            NEW."photoAlt", NEW."socialPlatform", NEW."socialUrl",
            COALESCE(NEW."createdAt", CURRENT_TIMESTAMP)
        )
        RETURNING "id" INTO target_person_id;
    ELSE
        UPDATE "Person"
        SET
            "department" = NEW."department",
            "photoUrl" = COALESCE(NEW."photoUrl", "photoUrl"),
            "photoAlt" = COALESCE(NEW."photoAlt", "photoAlt"),
            "socialPlatform" = COALESCE(NEW."socialPlatform", "socialPlatform"),
            "socialUrl" = COALESCE(NEW."socialUrl", "socialUrl")
        WHERE "id" = target_person_id;
    END IF;

    INSERT INTO "TeamMembership" (
        "personId", "categoryId", "role", "order", "createdAt"
    ) VALUES (
        target_person_id, NEW."categoryId", NEW."role", NEW."order",
        COALESCE(NEW."createdAt", CURRENT_TIMESTAMP)
    )
    RETURNING "id", "createdAt" INTO NEW."id", NEW."createdAt";

    RETURN NEW;
END;
$$;

CREATE FUNCTION legacy_team_member_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    target_person_id INTEGER;
    normalized_name TEXT;
BEGIN
    SELECT "personId" INTO target_person_id
    FROM "TeamMembership"
    WHERE "id" = OLD."id";

    IF target_person_id IS NULL THEN
        RETURN NULL;
    END IF;

    normalized_name := translate(
        lower(regexp_replace(trim(NEW."name"), '\s+', '', 'g')),
        'İIı',
        'iii'
    );

    UPDATE "Person"
    SET
        "name" = NEW."name",
        "normalizedName" = normalized_name,
        "department" = NEW."department",
        "photoUrl" = NEW."photoUrl",
        "photoAlt" = NEW."photoAlt",
        "socialPlatform" = NEW."socialPlatform",
        "socialUrl" = NEW."socialUrl"
    WHERE "id" = target_person_id;

    UPDATE "TeamMembership"
    SET
        "categoryId" = NEW."categoryId",
        "role" = NEW."role",
        "order" = NEW."order"
    WHERE "id" = OLD."id";

    RETURN NEW;
END;
$$;

CREATE FUNCTION legacy_team_member_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    target_person_id INTEGER;
BEGIN
    DELETE FROM "TeamMembership"
    WHERE "id" = OLD."id"
    RETURNING "personId" INTO target_person_id;

    IF target_person_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM "TeamMembership" WHERE "personId" = target_person_id
    ) THEN
        DELETE FROM "Person" WHERE "id" = target_person_id;
    END IF;

    RETURN OLD;
END;
$$;

CREATE TRIGGER legacy_team_member_insert_trigger
INSTEAD OF INSERT ON "TeamMember"
FOR EACH ROW EXECUTE FUNCTION legacy_team_member_insert();

CREATE TRIGGER legacy_team_member_update_trigger
INSTEAD OF UPDATE ON "TeamMember"
FOR EACH ROW EXECUTE FUNCTION legacy_team_member_update();

CREATE TRIGGER legacy_team_member_delete_trigger
INSTEAD OF DELETE ON "TeamMember"
FOR EACH ROW EXECUTE FUNCTION legacy_team_member_delete();
