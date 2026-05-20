-- Cache for AI venue search results
-- Avoids repeated AI calls for the same city+category (7-day TTL)

CREATE TABLE IF NOT EXISTS venue_search_cache (
  cache_key  text PRIMARY KEY,           -- e.g. "restaurant:rome"
  result     jsonb        NOT NULL,
  created_at timestamptz  DEFAULT now(),
  expires_at timestamptz  DEFAULT now() + interval '7 days'
);

CREATE INDEX IF NOT EXISTS venue_search_cache_expires_idx
  ON venue_search_cache (expires_at);

ALTER TABLE venue_search_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read cached results (they're public venue info)
CREATE POLICY "public read cache"
  ON venue_search_cache FOR SELECT
  USING (true);

-- Only service role can write (server functions use supabaseAdmin)
CREATE POLICY "service write cache"
  ON venue_search_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "service update cache"
  ON venue_search_cache FOR UPDATE
  USING (true);
