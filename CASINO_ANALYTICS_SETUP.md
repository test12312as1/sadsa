# Casino Analytics Page MVP - Setup Guide

## What Was Implemented

### 1. Platform Snapshots Cron Job
- **File**: `app/api/cron/snapshots/route.js`
- **Purpose**: Daily aggregation of casino analytics from transactions table
- **Metrics Calculated**:
  - Total deposits (count of transactions per casino per day)
  - Unique depositors (count of distinct `from_address` per casino per day)
  - New depositors (first-time depositors to each casino)
  - Total volume (sum of USD values)
  - Average deposit size
  - Market share

### 2. Casino Detail API
- **File**: `app/api/casino/[name]/route.js`
- **Endpoint**: `GET /api/casino/[casinoName]?range=30d`
- **Returns**:
  - Current stats (today's metrics)
  - Historical snapshots
  - Trend data for charts
  - Market share over time

### 3. Casino Detail Page
- **File**: `app/casino/[name]/page.js`
- **Route**: `/casino/[casinoName]`
- **Features**:
  - Key metrics cards (Volume, Deposits, Unique Depositors, New Depositors)
  - Historical trend charts (volume, deposits, depositors)
  - Time range selector (7d, 30d, 90d, 1y)
  - Market share display
  - Back navigation to Platforms dashboard

### 4. Platforms Dashboard Updates
- **File**: `app/page.js`
- **Changes**:
  - Made casino names clickable in leaderboard table
  - Added clickable links in Top Gainers/Declines sections
  - Added detail link (→) next to casino selection buttons
  - Fixed to use `platformData.casinos` instead of hardcoded `PLATFORM_DATA`

### 5. Platforms API Updates
- **File**: `app/api/platforms/route.js`
- **Changes**:
  - Added `uniqueDepositors` to casino stats response
  - Fixed `getTrendData()` to use correct column name (`total_volume` instead of `deposit_volume_usd`)
  - Removed non-existent `snapshot_type` filter
  - Improved date range handling for snapshots

## Setup Instructions

### 1. Vercel Cron Configuration
The `vercel.json` file has been created with cron configuration:
```json
{
  "crons": [
    {
      "path": "/api/cron/snapshots",
      "schedule": "0 0 * * *"
    }
  ]
}
```

This will run daily at midnight UTC. After deploying to Vercel, the cron job will automatically start.

### 2. Manual Trigger (For Testing)
You can manually trigger the snapshot aggregation:
```bash
# With secret (if CRON_SECRET is set)
curl -X GET "https://your-domain.vercel.app/api/cron/snapshots?secret=YOUR_SECRET"

# Or POST request
curl -X POST "https://your-domain.vercel.app/api/cron/snapshots?secret=YOUR_SECRET"
```

### 3. Environment Variables
Optional: Add to `.env` or Vercel environment variables:
```
CRON_SECRET=your-secret-key-here
```

If `CRON_SECRET` is not set, the endpoint can be called without authentication (useful for testing, but secure it in production).

### 4. Initial Data Population
To populate historical data, you can:
1. Run the cron job manually multiple times (it will create snapshots for today)
2. Or create a script to backfill historical snapshots from existing transactions

## Database Schema
The `platform_snapshots` table should have these columns:
- `snapshot_date` (DATE)
- `casino_name` (TEXT)
- `total_volume` (NUMERIC)
- `total_deposits` (BIGINT)
- `unique_depositors` (BIGINT)
- `new_depositors` (BIGINT)
- `avg_deposit_size` (NUMERIC)
- `market_share` (NUMERIC)

## Testing

1. **Test Cron Job**:
   - Manually trigger: `GET /api/cron/snapshots?secret=YOUR_SECRET`
   - Check Supabase `platform_snapshots` table for new rows

2. **Test Casino Detail API**:
   - `GET /api/casino/Stake?range=30d`
   - Should return current stats and historical data

3. **Test Casino Detail Page**:
   - Navigate to `/casino/Stake`
   - Should display metrics and charts
   - Test time range selector

4. **Test Platforms Dashboard Links**:
   - Click casino names in leaderboard
   - Click casino names in Top Gainers/Declines
   - Should navigate to casino detail pages

## Next Steps

1. Deploy to Vercel to activate cron job
2. Run initial snapshot aggregation manually
3. Test all links and navigation
4. Verify historical data appears in charts
5. Consider backfilling historical snapshots if needed

## Notes

- The cron job aggregates data for the current day (today)
- Historical snapshots will accumulate over time as the cron runs daily
- If no snapshots exist, the casino detail page will show "No historical data available yet"
- The platforms dashboard will use fallback data if snapshots don't exist yet
