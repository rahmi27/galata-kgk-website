-- Keep the newest active session if inconsistent legacy data exists.
WITH ranked_active_sessions AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" DESC, "id" DESC) AS position
  FROM "EventSession"
  WHERE "isActive" = true
)
UPDATE "EventSession"
SET "isActive" = false
WHERE "id" IN (
  SELECT "id" FROM ranked_active_sessions WHERE position > 1
);

-- PostgreSQL partial uniqueness guarantees that concurrent admin actions
-- cannot leave more than one live event session active.
CREATE UNIQUE INDEX "EventSession_single_active_key"
ON "EventSession" ("isActive")
WHERE "isActive" = true;
