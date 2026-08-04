ALTER TABLE "ContactSubmission" ADD COLUMN "ipHash" TEXT;
ALTER TABLE "MembershipApplication" ADD COLUMN "ipHash" TEXT;

CREATE INDEX "ContactSubmission_ipHash_createdAt_idx"
ON "ContactSubmission"("ipHash", "createdAt");

CREATE INDEX "MembershipApplication_ipHash_createdAt_idx"
ON "MembershipApplication"("ipHash", "createdAt");
