ALTER TABLE "ContactSubmission"
ADD COLUMN "privacyNoticeVersion" TEXT,
ADD COLUMN "privacyAcknowledgedAt" TIMESTAMP(3);

ALTER TABLE "MembershipApplication"
ADD COLUMN "privacyNoticeVersion" TEXT,
ADD COLUMN "privacyAcknowledgedAt" TIMESTAMP(3);
