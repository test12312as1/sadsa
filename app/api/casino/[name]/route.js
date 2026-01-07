import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request, { params }) {
  try {
    const { name } = params;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '30d'; // 7d, 30d, 90d, 1y

    if (!name) {
      return NextResponse.json({ error: 'Casino name is required' }, { status: 400 });
    }

    // Decode URL-encoded casino name
    const casinoName = decodeURIComponent(name);

    // Get current stats (today)
    const currentStats = await getCurrentStats(casinoName);

    // Get historical snapshots
    const historicalData = await getHistoricalSnapshots(casinoName, timeRange);

    // Get trend data (for charts)
    const trendData = await getTrendData(casinoName, timeRange);

    // Get market share over time
    const marketShareData = await getMarketShareData(casinoName, timeRange);

    return NextResponse.json({
      casino: casinoName,
      current: currentStats,
      historical: historicalData,
      trends: trendData,
      marketShare: marketShareData,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Casino detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch casino data', details: error.message },
      { status: 500 }
    );
  }
}

async function getCurrentStats(casinoName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.toISOString();
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Get today's snapshot if exists
  const { data: snapshot } = await supabase
    .from('platform_snapshots')
    .select('*')
    .eq('casino_name', casinoName)
    .eq('snapshot_date', today.toISOString().split('T')[0])
    .single();

  if (snapshot) {
    return {
      totalDeposits: snapshot.total_deposits || 0,
      uniqueDepositors: snapshot.unique_depositors || 0,
      newDepositors: snapshot.new_depositors || 0,
      totalVolume: snapshot.total_volume || 0,
      avgDepositSize: snapshot.avg_deposit_size || 0,
      marketShare: snapshot.market_share || 0
    };
  }

  // Fallback: aggregate from transactions if no snapshot
  const { data: transactions } = await supabase
    .from('transactions')
    .select('value_usd, from_address')
    .eq('casino_name', casinoName)
    .gte('block_timestamp', startOfDay)
    .lte('block_timestamp', endOfDay.toISOString());

  if (!transactions || transactions.length === 0) {
    return {
      totalDeposits: 0,
      uniqueDepositors: 0,
      newDepositors: 0,
      totalVolume: 0,
      avgDepositSize: 0,
      marketShare: 0
    };
  }

  const uniqueDepositors = new Set(transactions.map(tx => tx.from_address)).size;
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.value_usd || 0), 0);
  const totalDeposits = transactions.length;
  const avgDepositSize = totalDeposits > 0 ? totalVolume / totalDeposits : 0;

  // Calculate market share (total volume today / all casinos today)
  const { data: allTxs } = await supabase
    .from('transactions')
    .select('value_usd')
    .gte('block_timestamp', startOfDay)
    .lte('block_timestamp', endOfDay.toISOString());

  const totalMarketVolume = allTxs ? allTxs.reduce((sum, tx) => sum + (tx.value_usd || 0), 0) : 0;
  const marketShare = totalMarketVolume > 0 ? (totalVolume / totalMarketVolume) * 100 : 0;

  // Calculate new depositors (first-time depositors today)
  const { data: prevTxs } = await supabase
    .from('transactions')
    .select('from_address')
    .eq('casino_name', casinoName)
    .lt('block_timestamp', startOfDay);

  const previousDepositors = new Set(prevTxs ? prevTxs.map(tx => tx.from_address) : []);
  const todayDepositors = new Set(transactions.map(tx => tx.from_address));
  const newDepositors = Array.from(todayDepositors).filter(addr => !previousDepositors.has(addr)).length;

  return {
    totalDeposits,
    uniqueDepositors,
    newDepositors,
    totalVolume: Math.round(totalVolume * 100) / 100,
    avgDepositSize: Math.round(avgDepositSize * 100) / 100,
    marketShare: Math.round(marketShare * 100) / 100
  };
}

async function getHistoricalSnapshots(casinoName, timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: snapshots } = await supabase
    .from('platform_snapshots')
    .select('*')
    .eq('casino_name', casinoName)
    .gte('snapshot_date', startDate.toISOString().split('T')[0])
    .order('snapshot_date', { ascending: true });

  return snapshots || [];
}

async function getTrendData(casinoName, timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: snapshots } = await supabase
    .from('platform_snapshots')
    .select('snapshot_date, total_volume, total_deposits, unique_depositors')
    .eq('casino_name', casinoName)
    .gte('snapshot_date', startDate.toISOString().split('T')[0])
    .order('snapshot_date', { ascending: true });

  if (!snapshots || snapshots.length === 0) {
    return [];
  }

  return snapshots.map(s => ({
    date: s.snapshot_date,
    volume: s.total_volume || 0,
    deposits: s.total_deposits || 0,
    depositors: s.unique_depositors || 0
  }));
}

async function getMarketShareData(casinoName, timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get this casino's snapshots
  const { data: casinoSnapshots } = await supabase
    .from('platform_snapshots')
    .select('snapshot_date, market_share')
    .eq('casino_name', casinoName)
    .gte('snapshot_date', startDate.toISOString().split('T')[0])
    .order('snapshot_date', { ascending: true });

  return casinoSnapshots ? casinoSnapshots.map(s => ({
    date: s.snapshot_date,
    marketShare: s.market_share || 0
  })) : [];
}
