-- CreateTable
CREATE TABLE "AdminLoginAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "AdminLoginAttempt_username_ipAddress_createdAt_idx" ON "AdminLoginAttempt"("username", "ipAddress", "createdAt");
