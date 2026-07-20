ALTER TABLE "AdminUser" RENAME COLUMN "email" TO "username";

UPDATE "AdminUser"
SET "username" = CASE
  WHEN "username" = 'admin@galata.edu.tr' THEN 'admin'
  ELSE lower(substr("username", 1, instr("username", '@') - 1))
END;

DROP INDEX "AdminUser_email_key";
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
