-- CreateTable
CREATE TABLE "EventSession" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "linkedEventId" INTEGER,
    "title" TEXT NOT NULL,
    "quizEnabled" BOOLEAN NOT NULL DEFAULT false,
    "raffleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "joinButtonEnabled" BOOLEAN NOT NULL DEFAULT false,
    "feedbackEnabled" BOOLEAN NOT NULL DEFAULT false,
    "badgeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pollEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventParticipant" (
    "id" SERIAL NOT NULL,
    "eventSessionId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "consentAcceptedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "eventSessionId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuizQuestion" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctOptionIndex" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuizAnswer" (
    "id" SERIAL NOT NULL,
    "participantId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOptionIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RaffleEntry" (
    "id" SERIAL NOT NULL,
    "eventSessionId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,
    "consentAcceptedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RaffleEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RaffleWinner" (
    "id" SERIAL NOT NULL,
    "eventSessionId" INTEGER NOT NULL,
    "raffleEntryId" INTEGER NOT NULL,
    "drawnAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RaffleWinner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "eventSessionId" INTEGER NOT NULL,
    "participantId" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "eventSessionId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PollOption" (
    "id" SERIAL NOT NULL,
    "pollId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PollVote" (
    "id" SERIAL NOT NULL,
    "pollId" INTEGER NOT NULL,
    "pollOptionId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PollVote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EventSession_isActive_idx" ON "EventSession"("isActive");
CREATE INDEX "EventSession_linkedEventId_idx" ON "EventSession"("linkedEventId");
CREATE UNIQUE INDEX "EventParticipant_eventSessionId_email_key" ON "EventParticipant"("eventSessionId", "email");
CREATE INDEX "EventParticipant_eventSessionId_createdAt_idx" ON "EventParticipant"("eventSessionId", "createdAt");
CREATE INDEX "Quiz_eventSessionId_isActive_idx" ON "Quiz"("eventSessionId", "isActive");
CREATE INDEX "QuizQuestion_quizId_order_idx" ON "QuizQuestion"("quizId", "order");
CREATE UNIQUE INDEX "QuizAnswer_participantId_questionId_key" ON "QuizAnswer"("participantId", "questionId");
CREATE INDEX "QuizAnswer_questionId_isCorrect_idx" ON "QuizAnswer"("questionId", "isCorrect");
CREATE UNIQUE INDEX "RaffleEntry_eventSessionId_participantId_key" ON "RaffleEntry"("eventSessionId", "participantId");
CREATE INDEX "RaffleEntry_eventSessionId_createdAt_idx" ON "RaffleEntry"("eventSessionId", "createdAt");
CREATE UNIQUE INDEX "RaffleWinner_raffleEntryId_key" ON "RaffleWinner"("raffleEntryId");
CREATE INDEX "RaffleWinner_eventSessionId_drawnAt_idx" ON "RaffleWinner"("eventSessionId", "drawnAt");
CREATE INDEX "Feedback_eventSessionId_createdAt_idx" ON "Feedback"("eventSessionId", "createdAt");
CREATE INDEX "Feedback_participantId_idx" ON "Feedback"("participantId");
CREATE INDEX "Poll_eventSessionId_isActive_idx" ON "Poll"("eventSessionId", "isActive");
CREATE INDEX "PollOption_pollId_order_idx" ON "PollOption"("pollId", "order");
CREATE UNIQUE INDEX "PollVote_pollId_participantId_key" ON "PollVote"("pollId", "participantId");
CREATE INDEX "PollVote_pollOptionId_idx" ON "PollVote"("pollOptionId");

ALTER TABLE "EventSession" ADD CONSTRAINT "EventSession_linkedEventId_fkey" FOREIGN KEY ("linkedEventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "EventSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "EventSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "EventParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaffleEntry" ADD CONSTRAINT "RaffleEntry_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "EventSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaffleEntry" ADD CONSTRAINT "RaffleEntry_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "EventParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaffleWinner" ADD CONSTRAINT "RaffleWinner_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "EventSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaffleWinner" ADD CONSTRAINT "RaffleWinner_raffleEntryId_fkey" FOREIGN KEY ("raffleEntryId") REFERENCES "RaffleEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "EventSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "EventParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_eventSessionId_fkey" FOREIGN KEY ("eventSessionId") REFERENCES "EventSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_pollOptionId_fkey" FOREIGN KEY ("pollOptionId") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "EventParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
