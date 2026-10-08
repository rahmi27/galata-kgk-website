UPDATE "PartnerClub"
SET "shortDescription" = 'Gönül Özkaplan, Galata GüzFest etkinliğimizin afişini tasarladı.',
    "shortDescriptionEn" = 'Gönül Özkaplan designed the poster for our Galata GüzFest event.',
    "logoAlt" = CASE WHEN "logoAlt" = 'Halkla İlişkiler ve Reklamcılık Öğrencisi'
      THEN 'Galata GüzFest afiş tasarımı' ELSE "logoAlt" END,
    "logoAltEn" = CASE WHEN "logoAltEn" IS NULL
      THEN 'Galata GüzFest poster design' ELSE "logoAltEn" END
WHERE "slug" = 'gonul-ozkaplan'
  AND "shortDescription" = 'Halkla İlişkiler ve Reklamcılık öğrencisi Gönül Özkaplan, Galata GüzFest etkinliğimizin afiş tasarımını hazırladı.';
