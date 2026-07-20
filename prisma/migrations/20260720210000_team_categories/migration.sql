PRAGMA foreign_keys=OFF;

CREATE TABLE "TeamCategory" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

INSERT INTO "TeamCategory" ("name", "slug", "order")
SELECT
  "department",
  lower(
    replace(
      replace(
        replace(
          replace(
            replace(
              replace(
                replace(
                  replace(
                    replace(
                      replace(
                        replace(
                          replace(trim("department"), 'Ç', 'c'),
                          'ç',
                          'c'
                        ),
                        'Ğ',
                        'g'
                      ),
                      'ğ',
                      'g'
                    ),
                    'İ',
                    'i'
                  ),
                  'ı',
                  'i'
                ),
                'Ö',
                'o'
              ),
              'ö',
              'o'
            ),
            'Ş',
            's'
          ),
          'ş',
          's'
        ),
        'Ü',
        'u'
      ),
      'ü',
      'u'
    )
  ),
  min("order")
FROM "TeamMember"
GROUP BY lower("department");

UPDATE "TeamCategory"
SET "slug" = replace(
  replace(
    replace(
      replace("slug", ' ', '-'),
      '/',
      '-'
    ),
    '.',
    ''
  ),
  '--',
  '-'
);

CREATE UNIQUE INDEX "TeamCategory_name_key" ON "TeamCategory"("name");
CREATE UNIQUE INDEX "TeamCategory_slug_key" ON "TeamCategory"("slug");
CREATE INDEX "TeamCategory_order_idx" ON "TeamCategory"("order");

CREATE TABLE "new_TeamMember" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "photoUrl" TEXT,
  "order" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "categoryId" INTEGER NOT NULL,
  CONSTRAINT "TeamMember_categoryId_fkey"
    FOREIGN KEY ("categoryId")
    REFERENCES "TeamCategory" ("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

INSERT INTO "new_TeamMember" (
  "id",
  "name",
  "role",
  "photoUrl",
  "order",
  "createdAt",
  "categoryId"
)
SELECT
  member."id",
  member."name",
  member."role",
  member."photoUrl",
  member."order",
  member."createdAt",
  category."id"
FROM "TeamMember" AS member
INNER JOIN "TeamCategory" AS category
  ON lower(category."name") = lower(member."department");

DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
CREATE INDEX "TeamMember_categoryId_order_idx"
  ON "TeamMember"("categoryId", "order");

PRAGMA foreign_keys=ON;
