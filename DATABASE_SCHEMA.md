# Database Schema

This project requires the following Supabase tables:

## 1. `known_proxies` (already exists)
Stores known casino proxy addresses.

```sql
CREATE TABLE known_proxies (
  address TEXT PRIMARY KEY,
  casino_name TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. `wallet_searches` (new - required for stats)
Stores search history for aggregate statistics.

```sql
CREATE TABLE wallet_searches (
  id BIGSERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  total_eth NUMERIC NOT NULL DEFAULT 0,
  casino_data JSONB,
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wallet_searches_address ON wallet_searches(address);
CREATE INDEX idx_wallet_searches_searched_at ON wallet_searches(searched_at DESC);
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL above to create the `wallet_searches` table
4. Make sure your environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY` (for seed endpoint)
