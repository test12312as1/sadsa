# Seed Historical Data - Quick Guide

## Step 1: Set Environment Variable

Add to your `.env.local` (or Vercel environment variables):

```bash
SEED_SECRET=your-secret-here
```

## Step 2: Seed the Data

### Option A: Using cURL (Local Development)

```bash
# Preview what will be seeded
curl http://localhost:3000/api/seed/historical

# Seed all historical data (daily + monthly + yearly)
curl -X POST "http://localhost:3000/api/seed/historical?secret=your-secret-here"

# Or seed just daily data
curl -X POST "http://localhost:3000/api/seed/historical?secret=your-secret-here&type=daily"
```

### Option B: Using Browser (After Deploying)

1. Deploy your code to Vercel/GitHub
2. Visit: `https://your-domain.com/api/seed/historical?secret=your-secret-here`
3. Or use the POST endpoint with a tool like Postman/Insomnia

### Option C: Using the Admin Page (Coming Soon)

Navigate to `/admin/snapshots` for a web interface (currently for manual entry only).

## Step 3: Verify Data is Seeded

Check your Supabase `platform_snapshots` table - you should see:
- **Daily**: 7 days × 20 casinos = 140 snapshots
- **Monthly**: 9 periods × 20 casinos = 180 snapshots  
- **Yearly**: 11 periods × 20 casinos = 220 snapshots
- **Total**: ~540 snapshots

## Step 4: View on Casinos Page

Once seeded, visit your Casinos page (`/?tab=platforms`) and you should see:
- Real volume data from your historical snapshots
- Market share calculations
- Casino rankings
- Trend charts

## Troubleshooting

**No data showing?**
1. Check that snapshots were inserted: `SELECT COUNT(*) FROM platform_snapshots;`
2. Check the date range - the platforms API looks for data in the last 7 days
3. Make sure you seeded daily data (or data within the last 7 days)

**Want to seed specific date range?**
The seed endpoint seeds all available historical data. If you want specific dates, use the manual entry API at `/api/snapshots/manual`.

## Data Included

- **Daily**: Dec 31, 2025 - Jan 6, 2026
- **Monthly**: 3-day periods from Dec 10, 2025 - Jan 3, 2026
- **Yearly**: Monthly periods from Feb 10, 2025 - Jan 6, 2026

All data includes:
- Total volume (USD)
- Estimated deposits, unique depositors, new depositors
- Calculated market share
- Average deposit size
