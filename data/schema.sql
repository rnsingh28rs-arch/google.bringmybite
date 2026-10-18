-- Google Tool Finder by Bring My Bite - Database Schema
-- Compatible with PostgreSQL, Supabase, Neon, and Vercel Postgres
-- Run this migration in your SQL console if using a relational database.

-- 1. Registered Users Table
CREATE TABLE IF NOT EXISTS gtf_users (
  uid VARCHAR(128) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  photo_url TEXT,
  provider VARCHAR(64) DEFAULT 'google.com',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  saved_tools JSONB DEFAULT '[]'::jsonb,
  custom_notes JSONB DEFAULT '{}'::jsonb,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_gtf_users_email ON gtf_users(email);

-- 2. Outbound Clicks Telemetry Table
CREATE TABLE IF NOT EXISTS gtf_outbound_clicks (
  id BIGSERIAL PRIMARY KEY,
  source_page VARCHAR(128) NOT NULL,
  product_slug VARCHAR(128) NOT NULL,
  destination TEXT NOT NULL,
  is_affiliate BOOLEAN DEFAULT FALSE,
  session_id VARCHAR(64),
  user_uid VARCHAR(128) REFERENCES gtf_users(uid) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  client_ip VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_gtf_clicks_slug ON gtf_outbound_clicks(product_slug);
CREATE INDEX IF NOT EXISTS idx_gtf_clicks_dest ON gtf_outbound_clicks(destination);
CREATE INDEX IF NOT EXISTS idx_gtf_clicks_time ON gtf_outbound_clicks(timestamp);

-- 3. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS gtf_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMPTZ,
  ip VARCHAR(64),
  provider_sync VARCHAR(64) DEFAULT 'local_only',
  status VARCHAR(32) DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_gtf_subscribers_email ON gtf_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_gtf_subscribers_status ON gtf_subscribers(status);

-- 4. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS gtf_contact_enquiries (
  confirmation_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  client_ip VARCHAR(64)
);

-- 5. Monetization Runtime Configuration Table
CREATE TABLE IF NOT EXISTS gtf_monetization_settings (
  key VARCHAR(64) PRIMARY KEY,
  config JSONB NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Assistant Query Telemetry
CREATE TABLE IF NOT EXISTS gtf_assistant_queries (
  id BIGSERIAL PRIMARY KEY,
  prompt_length INT NOT NULL,
  status VARCHAR(32) NOT NULL,
  matched_count INT DEFAULT 0,
  latency_ms INT,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================
-- Enforce database-level access controls so anonymous clients cannot
-- read administrative tables, read other users' data, or alter configs.

-- 1. gtf_users RLS
ALTER TABLE gtf_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to users" ON gtf_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. gtf_outbound_clicks RLS
ALTER TABLE gtf_outbound_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to clicks" ON gtf_outbound_clicks
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon insert clicks" ON gtf_outbound_clicks
  FOR INSERT TO anon WITH CHECK (true);

-- 3. gtf_subscribers RLS
ALTER TABLE gtf_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to subscribers" ON gtf_subscribers
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon insert subscribers" ON gtf_subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- 4. gtf_contact_enquiries RLS
ALTER TABLE gtf_contact_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to enquiries" ON gtf_contact_enquiries
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon insert enquiries" ON gtf_contact_enquiries
  FOR INSERT TO anon WITH CHECK (true);

-- 5. gtf_monetization_settings RLS
ALTER TABLE gtf_monetization_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to monetization" ON gtf_monetization_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read monetization config" ON gtf_monetization_settings
  FOR SELECT TO anon, authenticated USING (true);

-- 6. gtf_assistant_queries RLS
ALTER TABLE gtf_assistant_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to assistant telemetry" ON gtf_assistant_queries
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon insert assistant telemetry" ON gtf_assistant_queries
  FOR INSERT TO anon WITH CHECK (true);
