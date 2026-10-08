UPDATE "CollaborationItem"
SET "titleEn" = 'Galata GüzFest Poster Design',
    "descriptionEn" = 'Gönül Özkaplan, a Public Relations and Advertising student, created the poster for our Galata GüzFest event.'
WHERE "partnerClubId" IN (SELECT "id" FROM "PartnerClub" WHERE "slug" = 'gonul-ozkaplan')
  AND "title" = 'Galata GüzFest Poster Tasarımı'
  AND "titleEn" IS NULL
  AND "descriptionEn" IS NULL;
