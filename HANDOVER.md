# GamStart Project Handover

## Project Overview & Goal

GamStart is a diagnostic tool that scans cryptocurrency wallet addresses to detect patterns of compulsive gambling behavior. It interprets on-chain transactions to provide behavioral diagnoses (Safe, At-Risk, Critical) with a sarcastic/roast tone. The goal is virality through simple wallet scanning and shareable player reports. The MVP includes Player Reports (critical feature) and basic Platforms analytics dashboard.

## Key Decisions & Reasoning

• **Architecture: Personal Wallet → Proxy → Casino Hot Wallet**
  - Users scan their personal wallet (A), which sends funds to casino deposit proxies (B), which forward to casino hot wallets (C)
  - We index casino hot wallets to discover proxies (B), then match user's outgoing txs to those proxies

• **Database-First Approach for Proxies**
  - Index casino hot wallets once to populate `known_proxies` table (currently 1.2M+ proxies)
  - On scan: fetch user's outgoing txs, extract unique destinations, query DB for matches (not load all proxies into memory)
  - This scales to millions of proxies without memory issues

• **On-Demand Transaction Fetching**
  - First scan: Fetch from Alchemy, store in DB, return results directly (not re-query DB)
  - Subsequent scans: Use 1-hour cache from `wallets` table
  - Fixed race condition where we stored txs then immediately queried them

• **Wallet Type Handling**
  - `personal`: Fetch outgoing txs, match to known proxies
  - `proxy`: Fetch incoming txs (user entered their casino deposit address directly)
  - Auto-detect if scanned wallet is itself a known proxy

• **Token Value Conversion**
  - Stablecoins (USDT, USDC, etc.) → 1:1 USD (not multiplied by ETH price)
  - ETH/WETH → × $3,300 (placeholder, needs real price API)
  - Unknown tokens → $0 (safer than guessing)
  - Fixed bug where all tokens were multiplied by ETH price

• **Frontend: Dark Theme + Purple Branding**
  - Minimalist main page with centered input
  - Player report with risk score circle, info grid, behavioral traits (expandable)
  - Analytics view toggle (Traits vs Analytics)
  - Platforms tab with casino analytics dashboard

• **Tech Stack**
  - Next.js 14, React, Tailwind CSS
  - Supabase (PostgreSQL) for data storage
  - Alchemy for Ethereum transaction data
  - Vercel for deployment

## Current Code State

### Main Backend: `app/api/scan/route.js`

**Latest Version:** Optimized for 1.2M+ proxies with efficient DB queries

**Key Functions:**
- `POST()`: Main handler, checks cache, routes by wallet type
- `findGamblingTransactions()`: Fetches outgoing txs, extracts destinations, queries DB in batches (500 at a time) to find proxy matches
- `fetchIncomingDeposits()`: For proxy wallets, fetches incoming deposits
- `convertToUSD()`: Handles stablecoins, ETH, and unknown tokens correctly
- `calculateBehavioralMetrics()`: Computes all 6 behavioral traits + analytics
- `cacheWalletReport()`: Stores results with 1-hour cache duration

**Recent Changes:**
- Removed pagination of all proxies (was loading 1.2M into memory)
- Now queries only specific destination addresses against DB
- Fixed stablecoin USD conversion bug
- Added proper wallet type handling (personal vs proxy)
- Added `export const dynamic = 'force-dynamic'` for Next.js API routes

**Current Flow:**
```
1. Check cache (1 hour TTL)
2. If proxy type: Check if in known_proxies → fetch incoming txs
3. If personal type:
   a. Fetch outgoing transfers from Alchemy
   b. Extract unique destination addresses
   c. Query DB in batches: "Which of these addresses are in known_proxies?"
   d. Filter transfers to only matched proxies
   e. Convert to transaction format with proper USD values
4. Calculate behavioral metrics
5. Cache and return report
```

### Database Schema: `DATABASE_SCHEMA.sql`

**Tables:**
- `known_proxies`: Casino deposit addresses (1.2M+ rows), indexed by address
- `wallet_links`: Maps personal wallets → their proxies (A → B)
- `transactions`: Individual gambling transactions with USD values
- `wallets`: Cached reports (1-hour cache)
- `platform_snapshots`: Daily casino analytics (for Platforms tab)

### Frontend: `app/page.js`

**Features:**
- Main page: Wallet input with Personal/Proxy toggle
- Loading state: Sequential checklist animation
- Player Report: Risk score circle, info grid, 6 behavioral traits (expandable), Analytics view toggle
- Platforms Tab: Week totals, trend chart, gainers/declines, top 10 leaderboard
- Navbar: Players/Platforms toggle
- Footer: Social links

**State Management:**
- `walletType`: 'personal' or 'proxy'
- `reportView`: 'traits' or 'analytics'
- `activeTab`: 'players' or 'platforms'
- API integration with fallback to demo data

### Proxy Indexer: `scripts/index-proxies.js`

**Purpose:** One-time script to populate `known_proxies` table
- Fetches incoming transactions to casino hot wallets
- Stores sender addresses as known proxies
- Handles pagination and deduplication

## Open Items / Next

• **Solana Integration**
  - Currently ETH-only
  - Need to integrate Helius SDK for SOL transactions
  - User mentioned this is needed but not urgent

• **Real-Time Price API**
  - Currently using hardcoded $3,300/ETH
  - Should integrate CoinGecko or similar for accurate USD values
  - Also needed for historical price lookups

• **Platform Snapshots Cron Job**
  - `platform_snapshots` table exists but not populated
  - Need scheduled job to aggregate daily casino analytics
  - Currently Platforms tab uses mock/calculated data

• **Leaderboard Calculation**
  - Currently random placeholder
  - Need to calculate actual ranking based on risk_score or total_volume_usd

• **Testing & Edge Cases**
  - Wallet `0xF8C78A52b0B9E8c4FDd4f5aB0C7ea636E39de09F` showed proxy in DB but no gambling detected (may be fixed with latest changes)
  - Need to test with various wallet types and transaction volumes
  - Handle wallets with 0 transactions gracefully

• **Performance Optimization**
  - Current batch size is 500 addresses per DB query
  - May need tuning based on Supabase query limits
  - Consider caching proxy lookups if same addresses queried frequently

• **Error Handling**
  - Add retry logic for Alchemy API failures
  - Better error messages for users
  - Handle rate limiting gracefully

## Restart Instructions

The project is a Next.js 14 app deployed on Vercel with Supabase backend. The main work is in `app/api/scan/route.js` which handles wallet scanning. The latest optimization (querying specific addresses instead of loading all proxies) was just implemented to handle 1.2M+ proxies efficiently. To continue: check Vercel logs for any errors, test with real wallets, and implement the open items above. The frontend is complete for MVP; focus on backend reliability and missing features (Solana, price API, cron jobs).
