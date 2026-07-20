-- CreateTable
CREATE TABLE "MembershipApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "studentNumber" TEXT,
    "department" TEXT NOT NULL,
    "phone" TEXT,
    "motivation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'beklemede'
);
