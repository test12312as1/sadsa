import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { toPlatformSnapshots } from '../../utils/historical-snapshots';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Simple secret for seeding
const SEED_SECRET = process.env.SEED_SECRET || 'change-me-in-production';

/**
 * POST /api/seed/historical
 * Seed the database with historical snapshot data
 * 
 * Query params:
 * - secret: Your seed secret
 * - overwrite: true/false (default: false) - whether to overwrite existing snapshots
 */
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const overwrite = searchParams.get('overwrite') === 'true';
    const type = searchParams.get('type') || 'all'; // 'daily', 'monthly', 'yearly', or 'all'

    // Verify secret
    if (secret !== SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid secret' },
        { status: 401 }
      );
    }

    if (!['daily', 'monthly', 'yearly', 'all'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Use: daily, monthly, yearly, or all' },
        { status: 400 }
      );
    }

    console.log(`Starting historical data seed (type: ${type})...`);
    
    // Get all snapshots from historical data
    let snapshots = toPlatformSnapshots(type);
    
    console.log(`Prepared ${snapshots.length} snapshots across ${new Set(snapshots.map(s => s.snapshot_date)).size} dates`);

    // Check for existing snapshots if not overwriting
    if (!overwrite) {
      const dates = [...new Set(snapshots.map(s => s.snapshot_date))];
      const { data: existing } = await supabase
        .from('platform_snapshots')
        .select('snapshot_date, casino_name')
        .in('snapshot_date', dates);

      if (existing && existing.length > 0) {
        const existingSet = new Set(existing.map(e => `${e.snapshot_date}-${e.casino_name}`));
        const toInsert = snapshots.filter(s => 
          !existingSet.has(`${s.snapshot_date}-${s.casino_name}`)
        );

        if (toInsert.length === 0) {
          return NextResponse.json({
            success: true,
            message: 'All snapshots already exist. Use ?overwrite=true to replace them.',
            skipped: snapshots.length,
            inserted: 0
          });
        }

        console.log(`Skipping ${snapshots.length - toInsert.length} existing snapshots`);
        snapshots = toInsert;
      }
    }

    // Insert in batches to avoid timeout
    const batchSize = 50;
    let inserted = 0;
    let errors = [];

    for (let i = 0; i < snapshots.length; i += batchSize) {
      const batch = snapshots.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('platform_snapshots')
        .upsert(batch, {
          onConflict: 'snapshot_date,casino_name',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        console.error('Batch data sample:', batch.slice(0, 2));
        errors.push({ 
          batch: i / batchSize + 1, 
          error: error.message,
          details: error.details || error.hint || 'No additional details'
        });
      } else {
        inserted += data ? data.length : 0;
        console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(snapshots.length / batchSize)}: ${data ? data.length : 0} snapshots`);
      }
    }

    // Get summary by date (even if there were errors)
    const dates = [...new Set(snapshots.map(s => s.snapshot_date))].sort();

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Some batches failed',
        inserted,
        errors,
        total: snapshots.length,
        dates: dates.length,
        error_details: errors.map(e => e.error)
      }, { status: 207 }); // 207 Multi-Status
    }

    const summary = dates.map(date => {
      const dateSnapshots = snapshots.filter(s => s.snapshot_date === date);
      const totalVolume = dateSnapshots.reduce((sum, s) => sum + s.total_volume, 0);
      return {
        date,
        casinos: dateSnapshots.length,
        total_volume: Math.round(totalVolume)
      };
    });

    console.log(`Successfully seeded ${inserted} historical snapshots`);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted} historical snapshots (type: ${type})`,
      type,
      inserted,
      total: snapshots.length,
      dates: dates.length,
      summary
    });

  } catch (error) {
    console.error('Historical seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed historical data', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seed/historical
 * Preview what would be seeded (without inserting)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    if (!['daily', 'monthly', 'yearly', 'all'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Use: daily, monthly, yearly, or all' },
        { status: 400 }
      );
    }
    
    const snapshots = toPlatformSnapshots(type);
    const dates = [...new Set(snapshots.map(s => s.snapshot_date))].sort();
    
    const summary = dates.map(date => {
      const dateSnapshots = snapshots.filter(s => s.snapshot_date === date);
      const totalVolume = dateSnapshots.reduce((sum, s) => sum + s.total_volume, 0);
      return {
        date,
        casinos: dateSnapshots.length,
        total_volume: Math.round(totalVolume),
        sample_casinos: dateSnapshots.slice(0, 5).map(s => ({
          name: s.casino_name,
          volume: s.total_volume
        }))
      };
    });

    return NextResponse.json({
      preview: true,
      type,
      total_snapshots: snapshots.length,
      dates: dates.length,
      date_range: {
        from: dates[0],
        to: dates[dates.length - 1]
      },
      summary,
      note: 'Use POST with ?secret=your-secret&type=daily|monthly|yearly|all to actually seed the data'
    });

  } catch (error) {
    console.error('Historical seed preview error:', error);
    return NextResponse.json(
      { error: 'Failed to preview historical data', details: error.message },
      { status: 500 }
    );
  }
}
