-- Manual migration: change account_id and provider_id from uuid to text
-- Down migration left as comment (would require casting back and failing rows removed)

ALTER TABLE "accounts"
  ALTER COLUMN "account_id" TYPE text USING "account_id"::text,
  ALTER COLUMN "provider_id" TYPE text USING "provider_id"::text;
