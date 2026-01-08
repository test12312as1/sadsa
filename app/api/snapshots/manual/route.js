import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Simple secret for manual input (you can enhance this later)
const MANUAL_SECRET = process.env.MANUAL_SNAPSHOT_SECRET || 'change-me-in-production';

/**
 * POST /api/snapshots/manual
 * Manually input snapshot data (from Tanzanite or other sources)
 * 
 * Body format:
 * {
 *   secret: "your-secret",
 *   date: "2026-01-08", // Optional, defaults to yesterday
 *   snapshots: [
 *     {
 *       casino_name: "Stake",
 *       total_volume: 1250000.50,
 *       total_deposits: 15234,
 *       unique_depositors: 8234,
 *       new_depositors: 456,
 *       avg_deposit_size: 82.15,
 *       market_share: 25.5
 *     },
 *     ...
 *   ]
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify secret
    if (body.secret !== MANUAL_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid secret' },
        { status: 401 }
      );
    }

    // Get date (default to yesterday)
    let snapshotDate = body.date;
    if (!snapshotDate) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      snapshotDate = yesterday.toISOString().split('T')[0];
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate snapshots array
    if (!Array.isArray(body.snapshots) || body.snapshots.length === 0) {
      return NextResponse.json(
        { error: 'snapshots must be a non-empty array' },
        { status: 400 }
      );
    }

    // Prepare snapshots for insertion
    const snapshots = body.snapshots.map(snapshot => ({
      snapshot_date: snapshotDate,
      casino_name: snapshot.casino_name,
      total_volume: parseFloat(snapshot.total_volume || 0),
      total_deposits: parseInt(snapshot.total_deposits || 0),
      unique_depositors: parseInt(snapshot.unique_depositors || 0),
      new_depositors: parseInt(snapshot.new_depositors || 0),
      avg_deposit_size: parseFloat(snapshot.avg_deposit_size || 0),
      market_share: parseFloat(snapshot.market_share || 0)
    }));

    // Calculate market share if not provided
    const totalVolume = snapshots.reduce((sum, s) => sum + s.total_volume, 0);
    if (totalVolume > 0) {
      snapshots.forEach(snapshot => {
        if (!snapshot.market_share || snapshot.market_share === 0) {
          snapshot.market_share = Math.round((snapshot.total_volume / totalVolume) * 100 * 100) / 100;
        }
      });
    }

    // Upsert snapshots
    const { data: inserted, error: insertError } = await supabase
      .from('platform_snapshots')
      .upsert(snapshots, {
        onConflict: 'snapshot_date,casino_name',
        ignoreDuplicates: false
      })
      .select();

    if (insertError) {
      console.error('Failed to insert snapshots:', insertError);
      return NextResponse.json(
        { error: 'Failed to insert snapshots', details: insertError.message },
        { status: 500 }
      );
    }

    console.log(`Successfully inserted ${inserted.length} manual snapshots for ${snapshotDate}`);

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${inserted.length} snapshots`,
      date: snapshotDate,
      snapshots: inserted.map(s => ({
        casino: s.casino_name,
        volume: s.total_volume,
        deposits: s.total_deposits,
        uniqueDepositors: s.unique_depositors,
        newDepositors: s.new_depositors
      }))
    });

  } catch (error) {
    console.error('Manual snapshot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process manual snapshot', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/snapshots/manual
 * Get recent snapshots (for verification)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('platform_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(limit);

    if (date) {
      query = query.eq('snapshot_date', date);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch snapshots', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      snapshots: data
    });

  } catch (error) {
    console.error('Manual snapshot GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snapshots', details: error.message },
      { status: 500 }
    );
  }
}
