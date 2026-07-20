-- CreateIndex
CREATE INDEX "ContactSubmission_email_createdAt_idx" ON "ContactSubmission"("email", "createdAt");

-- CreateIndex
CREATE INDEX "MembershipApplication_email_createdAt_idx" ON "MembershipApplication"("email", "createdAt");
