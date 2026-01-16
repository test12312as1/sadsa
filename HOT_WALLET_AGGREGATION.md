# Hot Wallet Aggregation Implementation

## Overview

The casino analytics system now aggregates data directly from deposits to casino hot wallets instead of using the `transactions` table. This provides more accurate and direct data collection.

## Architecture Change

**Before:**
- Aggregated from `transactions` table (user deposits to proxy addresses)

**After:**
- Fetches deposits directly to casino hot wallets via Alchemy API
- Stores aggregated data in `platform_snapshots` table
- APIs use snapshots (populated from hot wallets) with fallback to transactions

## Changes Made

### 1. Platform Snapshots Cron Job (`app/api/cron/snapshots/route.js`)
- **Updated**: Now fetches deposits directly from Alchemy API for each casino hot wallet
- **Process**:
  1. Iterates through all casino hot wallets
  2. Fetches all deposits TO each hot wallet for today
  3. Aggregates by casino: total deposits, unique depositors, new depositors, volume
  4. Stores results in `platform_snapshots` table

### 2. Casino Hot Wallets Configuration (`app/api/utils/casino-hot-wallets.js`)
- **New file**: Centralized configuration for casino hot wallets
- Contains mapping of hot wallet addresses to casino names
- Provides utility functions for lookup

### 3. Platforms API (`app/api/platforms/route.js`)
- **Updated**: Now prefers `platform_snapshots` table over `transactions` table
- `getWeekTotals()`: Uses snapshots for last 7 days
- `getCasinoStats()`: Uses most recent snapshot for each casino
- `getMovers()`: Compares this week vs last week from snapshots
- Falls back to transactions table if snapshots don't exist yet

### 4. Casino Detail API (`app/api/casino/[name]/route.js`)
- **Already using snapshots**: No changes needed
- Uses today's snapshot if available
- Falls back to transactions if snapshot doesn't exist

## Casino Hot Wallets

Currently configured hot wallets:
```javascript
{
  "0x68416debc20d13e5ef694cdcac9506f4c1a20184": "500 Casino",
  "0x014435b1e39945cf4f5f0c3cbb5833195a95cc9b": "Duelbits",
  "0x580450dff316ae00d0fbef9621a304020a046ce2": "Gamdom",
  "0x7b09fc3bdd9a1eb0059f0c9d391f5d684e0f9918": "Duel",
  "0xcbd6832ebc203e49e2b771897067fce3c58575ac": "Rollbit",
  "0xc94ebb328ac25b95db0e0aa968371885fa516215": "Roobet",
  "0xa26148ae51fa8e787df319c04137602cc018b521": "Roobet"
}
```

## Data Flow

```
Casino Hot Wallets (Alchemy API)
    ↓
Cron Job (daily at midnight UTC)
    ↓
Fetch deposits TO hot wallets for today
    ↓
Aggregate by casino
    ↓
Store in platform_snapshots table
    ↓
APIs read from platform_snapshots
    ↓
Frontend displays analytics
```

## Benefits

1. **More Accurate**: Directly tracks deposits to final destination (hot wallets)
2. **Simpler**: No need to track through proxy addresses
3. **Real-time**: Can fetch latest data directly from blockchain
4. **Scalable**: Snapshots table provides fast aggregated queries

## Token Value Conversion

Currently uses placeholder prices:
- ETH: $3,300 (hardcoded - TODO: use CoinGecko API)
- Stablecoins (USDT, USDC, DAI): 1:1 USD
- Other tokens: Uses ETH price as placeholder

**TODO**: Integrate CoinGecko API for accurate real-time prices.

## Adding New Casino Hot Wallets

To add a new casino:

1. Add to `app/api/utils/casino-hot-wallets.js`:
```javascript
export const CASINO_HOT_WALLETS = {
  // ... existing wallets
  "0xNEW_WALLET_ADDRESS": "New Casino Name"
};
```

2. The cron job will automatically include it in the next run

## Testing

1. **Manual Cron Trigger**:
   ```bash
   curl -X GET "https://your-domain.vercel.app/api/cron/snapshots?secret=YOUR_SECRET"
   ```

2. **Verify Snapshots**:
   - Check `platform_snapshots` table in Supabase
   - Should have one row per casino per day

3. **Test APIs**:
   - `/api/platforms` - Should use snapshots
   - `/api/casino/Stake` - Should use today's snapshot

## Notes

- The cron job fetches ALL deposits to hot wallets for the day (may be large volume)
- Pagination is handled automatically via Alchemy API
- Rate limiting: 200ms delay between pages
- New depositors calculation still uses `transactions` table for historical comparison (could be optimized)
