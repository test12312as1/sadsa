# Manual Snapshot Entry Guide

This is a temporary solution for entering casino analytics data manually (from Tanzanite Terminal) while building the automated on-chain aggregation system in the background.

## Historical Data Seeding

Historical data is already hardcoded in the codebase:
- **Daily**: Dec 31, 2025 - Jan 6, 2026 (7 days)
- **Monthly**: 3-day periods from Dec 10, 2025 - Jan 3, 2026 (9 periods)
- **Yearly**: Monthly periods from Feb 10, 2025 - Jan 6, 2026 (11 periods)

**Preview what will be seeded:**
```bash
GET /api/seed/historical
GET /api/seed/historical?type=daily
GET /api/seed/historical?type=monthly
GET /api/seed/historical?type=yearly
```

**Seed the database:**
```bash
# Seed all data
POST /api/seed/historical?secret=your-seed-secret

# Seed only daily data
POST /api/seed/historical?secret=your-seed-secret&type=daily

# Seed only monthly data
POST /api/seed/historical?secret=your-seed-secret&type=monthly

# Seed only yearly data
POST /api/seed/historical?secret=your-seed-secret&type=yearly
```

**Overwrite existing data:**
```bash
POST /api/seed/historical?secret=your-seed-secret&overwrite=true&type=all
```

Set `SEED_SECRET` in your environment variables.

## Setup

1. Set the `MANUAL_SNAPSHOT_SECRET` environment variable in your `.env.local`:
   ```
   MANUAL_SNAPSHOT_SECRET=your-secret-here
   ```

2. For production (Vercel), add it to your environment variables in the Vercel dashboard.

## Usage Methods

### Method 1: Admin Web Interface

Navigate to `/admin/snapshots` in your app to use the web form.

1. Enter the date (defaults to yesterday)
2. Enter your secret
3. Add casino data (click "+ Add Casino" for multiple)
4. Submit

### Method 2: API Endpoint (cURL/Postman)

**POST** `/api/snapshots/manual`

```bash
curl -X POST https://your-domain.com/api/snapshots/manual \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret-here",
    "date": "2026-01-08",
    "snapshots": [
      {
        "casino_name": "Stake",
        "total_volume": 1250000.50,
        "total_deposits": 15234,
        "unique_depositors": 8234,
        "new_depositors": 456,
        "avg_deposit_size": 82.15,
        "market_share": 25.5
      },
      {
        "casino_name": "Rollbit",
        "total_volume": 980000.00,
        "total_deposits": 12456,
        "unique_depositors": 6543,
        "new_depositors": 321,
        "avg_deposit_size": 78.65,
        "market_share": 20.0
      }
    ]
  }'
```

### Method 3: JavaScript/Node.js

```javascript
const response = await fetch('/api/snapshots/manual', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: process.env.MANUAL_SNAPSHOT_SECRET,
    date: '2026-01-08', // Optional, defaults to yesterday
    snapshots: [
      {
        casino_name: 'Stake',
        total_volume: 1250000.50,
        total_deposits: 15234,
        unique_depositors: 8234,
        new_depositors: 456,
        avg_deposit_size: 82.15,
        market_share: 25.5 // Optional, will be calculated if not provided
      }
      // ... more casinos
    ]
  })
});

const result = await response.json();
console.log(result);
```

## Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `casino_name` | string | Yes | Name of the casino (e.g., "Stake", "Rollbit") |
| `total_volume` | number | Yes | Total deposit volume in USD |
| `total_deposits` | number | Yes | Total number of deposits |
| `unique_depositors` | number | Yes | Number of unique wallet addresses that deposited |
| `new_depositors` | number | Yes | Number of first-time depositors |
| `avg_deposit_size` | number | No | Average deposit size in USD (calculated if not provided) |
| `market_share` | number | No | Market share percentage (calculated if not provided) |

## Notes

- **Date format**: Use `YYYY-MM-DD` (e.g., `2026-01-08`)
- **Market share**: If not provided, it will be automatically calculated based on total volume across all casinos in the same snapshot
- **Upsert behavior**: If a snapshot already exists for a casino on that date, it will be updated
- **Validation**: All numeric fields are validated and sanitized

## Viewing Recent Snapshots

**GET** `/api/snapshots/manual?date=2026-01-08&limit=10`

```bash
curl "https://your-domain.com/api/snapshots/manual?date=2026-01-08&limit=10"
```

## Daily Workflow

1. Visit Tanzanite Terminal: https://terminal.tanzanite.xyz/overview
2. Copy the casino data for the previous 24 hours
3. Navigate to `/admin/snapshots` or use the API
4. Enter the data and submit
5. Verify the data appears in your Casinos dashboard

## Future: Automated Scraping

Once the automated on-chain aggregation is ready, this manual system can be:
- Kept as a backup/override mechanism
- Used for historical data backfill
- Replaced entirely by automated scraping

## Security

- Always use a strong secret in production
- Consider adding IP whitelisting for the admin page
- The secret should be different from your other API secrets
