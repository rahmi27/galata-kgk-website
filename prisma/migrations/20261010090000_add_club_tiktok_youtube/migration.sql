INSERT INTO "ClubSocialLink" ("platform", "label", "url", "order", "updatedAt")
VALUES
  ('tiktok', 'TikTok', 'https://www.tiktok.com/@galatakariyergiris', 2, CURRENT_TIMESTAMP),
  ('youtube', 'YouTube', 'https://www.youtube.com/@galatakariyergirisimcilik', 3, CURRENT_TIMESTAMP)
ON CONFLICT ("platform") DO NOTHING;
