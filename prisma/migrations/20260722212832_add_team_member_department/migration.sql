-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeamMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'Belirtilmedi',
    "photoUrl" TEXT,
    "photoAlt" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "TeamMember_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TeamCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TeamMember" ("categoryId", "createdAt", "id", "name", "order", "photoAlt", "photoUrl", "role") SELECT "categoryId", "createdAt", "id", "name", "order", "photoAlt", "photoUrl", "role" FROM "TeamMember";
DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
CREATE INDEX "TeamMember_categoryId_order_idx" ON "TeamMember"("categoryId", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
