import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Verify this is called from Vercel Cron (or allow manual trigger with secret)
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request) {
  try {
    // Verify cron secret if provided
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      // Allow manual trigger if no secret is set, or if secret matches
      const url = new URL(request.url);
      const secret = url.searchParams.get('secret');
      if (secret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    console.log('Starting platform snapshots aggregation...');
    const result = await aggregatePlatformSnapshots();
    
    return NextResponse.json({
      success: true,
      message: 'Platform snapshots aggregated successfully',
      ...result
    });

  } catch (error) {
    console.error('Platform snapshots cron error:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate snapshots', details: error.message },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request) {
  return GET(request);
}

async function aggregatePlatformSnapshots() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snapshotDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // Get all transactions from today
  const startOfDay = new Date(today);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  console.log(`Aggregating snapshots for ${snapshotDate}`);

  // Fetch all transactions for today
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('casino_name, value_usd, from_address, block_timestamp')
    .gte('block_timestamp', startOfDay.toISOString())
    .lte('block_timestamp', endOfDay.toISOString());

  if (txError) {
    throw new Error(`Failed to fetch transactions: ${txError.message}`);
  }

  if (!transactions || transactions.length === 0) {
    console.log('No transactions found for today');
    return {
      date: snapshotDate,
      casinosProcessed: 0,
      totalSnapshots: 0
    };
  }

  // Group by casino
  const casinoMap = {};
  transactions.forEach(tx => {
    if (!tx.casino_name) return;
    
    const casino = tx.casino_name;
    if (!casinoMap[casino]) {
      casinoMap[casino] = {
        name: casino,
        transactions: [],
        depositors: new Set(),
        totalVolume: 0
      };
    }
    
    casinoMap[casino].transactions.push(tx);
    casinoMap[casino].depositors.add(tx.from_address);
    casinoMap[casino].totalVolume += tx.value_usd || 0;
  });

  // Get all previous depositors for each casino (to calculate new depositors)
  const allCasinos = Object.keys(casinoMap);
  const previousDepositorsMap = {};
  
  for (const casino of allCasinos) {
    // Get all unique depositors before today
    const { data: prevTxs } = await supabase
      .from('transactions')
      .select('from_address')
      .eq('casino_name', casino)
      .lt('block_timestamp', startOfDay.toISOString());
    
    if (prevTxs) {
      previousDepositorsMap[casino] = new Set(prevTxs.map(tx => tx.from_address));
    } else {
      previousDepositorsMap[casino] = new Set();
    }
  }

  // Calculate total volume across all casinos for market share
  const totalVolumeAll = Object.values(casinoMap).reduce((sum, c) => sum + c.totalVolume, 0);

  // Prepare snapshots for insertion
  const snapshots = [];
  for (const casino of Object.values(casinoMap)) {
    const uniqueDepositors = casino.depositors.size;
    const totalDeposits = casino.transactions.length;
    const totalVolume = casino.totalVolume;
    
    // Calculate new depositors (addresses that haven't deposited to this casino before)
    const previousDepositors = previousDepositorsMap[casino.name] || new Set();
    const newDepositors = Array.from(casino.depositors).filter(
      addr => !previousDepositors.has(addr)
    ).length;
    
    const avgDepositSize = totalDeposits > 0 ? totalVolume / totalDeposits : 0;
    const marketShare = totalVolumeAll > 0 ? (totalVolume / totalVolumeAll) * 100 : 0;

    snapshots.push({
      snapshot_date: snapshotDate,
      casino_name: casino.name,
      total_volume: Math.round(totalVolume * 100) / 100, // Round to 2 decimals
      total_deposits: totalDeposits,
      unique_depositors: uniqueDepositors,
      new_depositors: newDepositors,
      avg_deposit_size: Math.round(avgDepositSize * 100) / 100,
      market_share: Math.round(marketShare * 100) / 100
    });
  }

  // Upsert snapshots (insert or update if exists)
  const { data: inserted, error: insertError } = await supabase
    .from('platform_snapshots')
    .upsert(snapshots, {
      onConflict: 'snapshot_date,casino_name',
      ignoreDuplicates: false
    })
    .select();

  if (insertError) {
    throw new Error(`Failed to insert snapshots: ${insertError.message}`);
  }

  console.log(`Successfully created ${snapshots.length} snapshots for ${snapshotDate}`);

  return {
    date: snapshotDate,
    casinosProcessed: allCasinos.length,
    totalSnapshots: snapshots.length,
    snapshots: snapshots.map(s => ({
      casino: s.casino_name,
      deposits: s.total_deposits,
      uniqueDepositors: s.unique_depositors,
      newDepositors: s.new_depositors,
      volume: s.total_volume
    }))
  };
}
