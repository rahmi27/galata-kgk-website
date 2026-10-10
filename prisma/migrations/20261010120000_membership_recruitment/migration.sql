CREATE TYPE "AdminRole" AS ENUM ('FULL');
CREATE TYPE "PositionQuestionType" AS ENUM ('YES_NO', 'SHORT_TEXT', 'LONG_TEXT', 'FILE', 'LINK');
CREATE TYPE "PositionApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

ALTER TABLE "AdminUser" ADD COLUMN "role" "AdminRole" NOT NULL DEFAULT 'FULL';

CREATE TABLE "Department" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");
CREATE INDEX "Department_isActive_order_idx" ON "Department"("isActive", "order");

CREATE TABLE "ClubMember" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "departmentName" TEXT NOT NULL,
  "classYear" TEXT NOT NULL,
  "studentNumber" TEXT NOT NULL,
  "motivation" VARCHAR(500),
  "consentAcceptedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "ClubMember_studentNumber_key" ON "ClubMember"("studentNumber");
CREATE INDEX "ClubMember_createdAt_idx" ON "ClubMember"("createdAt");
CREATE INDEX "ClubMember_departmentName_classYear_idx" ON "ClubMember"("departmentName", "classYear");

CREATE TABLE "RecruitmentPosition" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "detailMarkdown" TEXT NOT NULL,
  "isOpen" BOOLEAN NOT NULL DEFAULT false,
  "deadline" TIMESTAMP(3),
  "quota" INTEGER,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isArchived" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "RecruitmentPosition_slug_key" ON "RecruitmentPosition"("slug");
CREATE INDEX "RecruitmentPosition_isArchived_isOpen_order_idx" ON "RecruitmentPosition"("isArchived", "isOpen", "order");

CREATE TABLE "RecruitmentPositionMedia" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "positionId" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "alt" TEXT NOT NULL,
  "caption" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "RecruitmentPositionMedia_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "RecruitmentPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "RecruitmentPositionMedia_positionId_order_idx" ON "RecruitmentPositionMedia"("positionId", "order");

CREATE TABLE "PositionQuestion" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "positionId" INTEGER NOT NULL,
  "label" TEXT NOT NULL,
  "helpText" TEXT,
  "type" "PositionQuestionType" NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "maxLength" INTEGER,
  "minFiles" INTEGER,
  "maxFiles" INTEGER,
  "anyOfGroup" TEXT,
  CONSTRAINT "PositionQuestion_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "RecruitmentPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "PositionQuestion_positionId_isActive_order_idx" ON "PositionQuestion"("positionId", "isActive", "order");

CREATE TABLE "PositionApplication" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "positionId" INTEGER NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "departmentName" TEXT NOT NULL,
  "classYear" TEXT NOT NULL,
  "studentNumber" TEXT NOT NULL,
  "consentAcceptedAt" TIMESTAMP(3) NOT NULL,
  "status" "PositionApplicationStatus" NOT NULL DEFAULT 'NEW',
  "adminNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PositionApplication_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "RecruitmentPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "PositionApplication_positionId_studentNumber_key" ON "PositionApplication"("positionId", "studentNumber");
CREATE INDEX "PositionApplication_status_createdAt_idx" ON "PositionApplication"("status", "createdAt");

CREATE TABLE "ApplicationAnswer" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "applicationId" INTEGER NOT NULL,
  "questionId" INTEGER,
  "questionLabel" TEXT NOT NULL,
  "questionType" "PositionQuestionType" NOT NULL,
  "order" INTEGER NOT NULL,
  "textValue" TEXT,
  "boolValue" BOOLEAN,
  CONSTRAINT "ApplicationAnswer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PositionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PositionQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "ApplicationAnswer_applicationId_order_idx" ON "ApplicationAnswer"("applicationId", "order");

CREATE TABLE "ApplicationFile" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "applicationId" INTEGER NOT NULL,
  "answerId" INTEGER NOT NULL,
  "storagePathname" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationFile_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PositionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationFile_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "ApplicationAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ApplicationFile_storagePathname_key" ON "ApplicationFile"("storagePathname");

CREATE TABLE "PendingUpload" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "pathname" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "attachedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX "PendingUpload_pathname_key" ON "PendingUpload"("pathname");
CREATE INDEX "PendingUpload_attachedAt_createdAt_idx" ON "PendingUpload"("attachedAt", "createdAt");

CREATE TABLE "ApplicationRateAttempt" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "scope" TEXT NOT NULL,
  "ipHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ApplicationRateAttempt_scope_ipHash_createdAt_idx" ON "ApplicationRateAttempt"("scope", "ipHash", "createdAt");
