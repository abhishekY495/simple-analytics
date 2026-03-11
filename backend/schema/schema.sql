CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- users
CREATE TABLE IF NOT EXISTS users (
  "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "full_name"  text        NOT NULL,
  "email"      text        NOT NULL UNIQUE,
  "password"   text        NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);




-- user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  "id"                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "refresh_token_hash" TEXT        NOT NULL UNIQUE,
  "expires_at"         TIMESTAMPTZ NOT NULL,
  "created_at"         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);




-- websites
CREATE TABLE IF NOT EXISTS websites (
  "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "name"       TEXT        NOT NULL,
  "domain"     TEXT        NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);




-- visitors (unique users per website)
CREATE TABLE IF NOT EXISTS visitors (
  "id"           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "website_id"   UUID        NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  "visitor_hash" TEXT        NOT NULL,
  "country"      TEXT        NOT NULL,
  "first_seen"   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_seen"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Prevent duplicate visitor rows for same site
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_visitor ON visitors(website_id, visitor_hash);




-- visits (sessions)
-- One visit = one continuous browsing session.
CREATE TABLE IF NOT EXISTS visits (
  "id"               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "website_id"       UUID        NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  "visitor_id"       UUID        NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  "referrer"         TEXT        NOT NULL,
  "started_at"       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ended_at"         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);




-- pageviews (analytics events)
CREATE TABLE IF NOT EXISTS pageviews (
  "id"          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "website_id"  UUID        NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  "visitor_id"  UUID        NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  "visit_id"    UUID        NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  "path"        TEXT        NOT NULL,
  "referrer"    TEXT        NOT NULL,
  "browser"     TEXT        NOT NULL,
  "os"          TEXT        NOT NULL,
  "device_type" TEXT        NOT NULL,
  "country"     TEXT        NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--
CREATE INDEX IF NOT EXISTS idx_pageviews_website_created ON pageviews(website_id, created_at);