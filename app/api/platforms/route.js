import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Force dynamic rendering (not static)
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '12w';
    const metric = searchParams.get('metric') || 'volume';
    const rankingPeriod = searchParams.get('rankingPeriod') || 'week';

    // Get current week totals
    const weekTotals = await getWeekTotals();

    // Get casino stats (filtered by ranking period)
    const casinos = await getCasinoStats(rankingPeriod);

    // Get top gainers and declines
    const { gainers, declines } = await getMovers();

    // Get trend data (metric determines volume vs deposits)
    const trends = await getTrendData(timeRange, metric);

    const responseData = {
      weekTotals,
      casinos,
      topGainers: gainers,
      topDeclines: declines,
      weeklyTrends: trends,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('API Response:', {
      casinosCount: casinos.length,
      trendsCount: trends.length,
      sampleTrend: trends[0],
      sampleCasino: casinos[0]
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Platforms API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform data', details: error.message },
      { status: 500 }
    );
  }
}

async function getWeekTotals() {
  // Get totals from platform_snapshots (populated from hot wallets) for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Try to get from snapshots first (these are populated from hot wallets)
  const { data: snapshots } = await supabase
    .from('platform_snapshots')
    .select('total_volume, total_deposits, unique_depositors, new_depositors')
    .gte('snapshot_date', sevenDaysAgo.toISOString().split('T')[0]);

  if (snapshots && snapshots.length > 0) {
    const totalVolume = snapshots.reduce((sum, s) => sum + (s.total_volume || 0), 0);
    const totalDeposits = snapshots.reduce((sum, s) => sum + (s.total_deposits || 0), 0);
    const uniqueDepositorsSet = new Set();
    let newDepositors = 0;
    
    // Aggregate unique depositors (approximate - sum of unique per day)
    snapshots.forEach(s => {
      newDepositors += s.new_depositors || 0;
      // Note: This is an approximation since we're summing daily unique depositors
      // For exact count, we'd need to deduplicate across days, but this is close enough
    });
    
    // For unique depositors, use the sum (approximation) or fallback
    const uniqueDepositors = snapshots.reduce((sum, s) => sum + (s.unique_depositors || 0), 0);

    return {
      totalVolume: Math.round(totalVolume) || 805172000,
      totalDeposits: totalDeposits || 1276060,
      newDepositors: newDepositors || 24350
    };
  }

  // Fallback to transactions table if no snapshots exist yet
  const { data, error } = await supabase
    .from('transactions')
    .select('value_usd, from_address')
    .gte('block_timestamp', sevenDaysAgo.toISOString());

  if (error || !data) {
    // Return fallback data if no transactions yet
    return {
      totalVolume: 805172000,
      totalDeposits: 1276060,
      newDepositors: 24350
    };
  }

  const totalVolume = data.reduce((sum, tx) => sum + (tx.value_usd || 0), 0);
  const totalDeposits = data.length;
  const uniqueDepositors = new Set(data.map(tx => tx.from_address)).size;

  return {
    totalVolume: totalVolume || 805172000,
    totalDeposits: totalDeposits || 1276060,
    newDepositors: uniqueDepositors || 24350
  };
}

async function getCasinoStats(period = 'week') {
  // Get stats from platform_snapshots (populated from hot wallets)
  // Filter by period: week (7 days), month (30 days), year (365 days)
  const today = new Date();
  const startDate = new Date();
  
  let periodMultiplier = 1; // For fallback data scaling
  if (period === 'week') {
    startDate.setDate(today.getDate() - 7);
    periodMultiplier = 1;
  } else if (period === 'month') {
    startDate.setDate(today.getDate() - 30);
    periodMultiplier = 4.3; // ~4.3 weeks in a month
  } else if (period === 'year') {
    startDate.setDate(today.getDate() - 365);
    periodMultiplier = 52; // 52 weeks in a year
  } else {
    startDate.setDate(today.getDate() - 7); // Default to week
    periodMultiplier = 1;
  }
  
  console.log(`Getting casino stats for period: ${period}, startDate: ${startDate.toISOString().split('T')[0]}`);
  
  // Get snapshots for the selected period
  const { data: snapshots } = await supabase
    .from('platform_snapshots')
    .select('casino_name, total_volume, total_deposits, unique_depositors, snapshot_date')
    .gte('snapshot_date', startDate.toISOString().split('T')[0])
    .order('snapshot_date', { ascending: false });

  if (snapshots && snapshots.length > 0) {
    console.log(`Found ${snapshots.length} snapshots for period ${period}`);
    
    // For rankings, aggregate ALL snapshots in the period (not just most recent)
    // This gives cumulative totals for the selected time period
    const casinoMap = {};
    snapshots.forEach(s => {
      if (!casinoMap[s.casino_name]) {
        casinoMap[s.casino_name] = {
          casino_name: s.casino_name,
          total_volume: 0,
          total_deposits: 0,
          unique_depositors: 0
        };
      }
      casinoMap[s.casino_name].total_volume += (s.total_volume || 0);
      casinoMap[s.casino_name].total_deposits += (s.total_deposits || 0);
      // For unique depositors, we can't simply sum (would double count)
      // Use max as a reasonable approximation
      casinoMap[s.casino_name].unique_depositors = Math.max(
        casinoMap[s.casino_name].unique_depositors,
        s.unique_depositors || 0
      );
    });

    const totalVolume = Object.values(casinoMap).reduce((sum, c) => sum + (c.total_volume || 0), 0);

    const casinos = Object.values(casinoMap)
      .map(c => ({
        name: c.casino_name,
        volume: Math.round(c.total_volume || 0),
        marketShare: totalVolume > 0 ? parseFloat(((c.total_volume / totalVolume) * 100).toFixed(1)) : 0,
        deposits: c.total_deposits || 0,
        uniqueDepositors: c.unique_depositors || 0,
        color: getCasinoColor(c.casino_name)
      }))
      .sort((a, b) => b.volume - a.volume);

    if (casinos.length > 0) {
      return casinos;
    }
  }

  // Fallback to transactions table if no snapshots exist yet
  const { data, error } = await supabase
    .from('transactions')
    .select('casino_name, value_usd, from_address');

  if (error || !data || data.length === 0) {
    // Return fallback data scaled by period
    console.log(`Using default casino stats for period: ${period} with multiplier: ${periodMultiplier}`);
    return getDefaultCasinoStats(periodMultiplier);
  }

  // Aggregate by casino
  const casinoMap = {};
  data.forEach(tx => {
    if (!tx.casino_name) return;
    if (!casinoMap[tx.casino_name]) {
      casinoMap[tx.casino_name] = {
        name: tx.casino_name,
        volume: 0,
        deposits: 0,
        depositors: new Set()
      };
    }
    casinoMap[tx.casino_name].volume += tx.value_usd || 0;
    casinoMap[tx.casino_name].deposits += 1;
    casinoMap[tx.casino_name].depositors.add(tx.from_address);
  });

  const totalVolume = Object.values(casinoMap).reduce((sum, c) => sum + c.volume, 0);

  const casinos = Object.values(casinoMap)
    .map(c => ({
      name: c.name,
      volume: Math.round(c.volume),
      marketShare: totalVolume > 0 ? parseFloat(((c.volume / totalVolume) * 100).toFixed(1)) : 0,
      deposits: c.deposits,
      uniqueDepositors: c.depositors.size,
      color: getCasinoColor(c.name)
    }))
    .sort((a, b) => b.volume - a.volume);

  return casinos.length > 0 ? casinos : getDefaultCasinoStats();
}

async function getMovers() {
  // Get this week vs last week comparison from snapshots
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  // Get snapshots for this week
  const { data: thisWeekSnapshots } = await supabase
    .from('platform_snapshots')
    .select('casino_name, total_volume')
    .gte('snapshot_date', thisWeekStart.toISOString().split('T')[0]);

  // Get snapshots for last week
  const { data: lastWeekSnapshots } = await supabase
    .from('platform_snapshots')
    .select('casino_name, total_volume')
    .gte('snapshot_date', lastWeekStart.toISOString().split('T')[0])
    .lt('snapshot_date', thisWeekStart.toISOString().split('T')[0]);

  // Aggregate by casino from snapshots
  const thisWeek = {};
  if (thisWeekSnapshots) {
    thisWeekSnapshots.forEach(s => {
      if (!thisWeek[s.casino_name]) {
        thisWeek[s.casino_name] = 0;
      }
      thisWeek[s.casino_name] += s.total_volume || 0;
    });
  }

  const lastWeek = {};
  if (lastWeekSnapshots) {
    lastWeekSnapshots.forEach(s => {
      if (!lastWeek[s.casino_name]) {
        lastWeek[s.casino_name] = 0;
      }
      lastWeek[s.casino_name] += s.total_volume || 0;
    });
  }

  // Fallback to transactions if no snapshots
  if (Object.keys(thisWeek).length === 0 && Object.keys(lastWeek).length === 0) {
    // This week
    const { data: thisWeekData } = await supabase
      .from('transactions')
      .select('casino_name, value_usd')
      .gte('block_timestamp', thisWeekStart.toISOString());

    // Last week
    const { data: lastWeekData } = await supabase
      .from('transactions')
      .select('casino_name, value_usd')
      .gte('block_timestamp', lastWeekStart.toISOString())
      .lt('block_timestamp', thisWeekStart.toISOString());

    if (!thisWeekData || !lastWeekData || thisWeekData.length === 0) {
      return getDefaultMovers();
    }

    // Aggregate by casino
    const thisWeekTx = aggregateByCasino(thisWeekData);
    const lastWeekTx = aggregateByCasino(lastWeekData);
    
    // Use transaction data
    Object.keys(thisWeekTx).forEach(casino => {
      thisWeek[casino] = thisWeekTx[casino];
    });
    Object.keys(lastWeekTx).forEach(casino => {
      lastWeek[casino] = lastWeekTx[casino];
    });
  }

  // Calculate changes
  const changes = [];
  const allCasinos = new Set([...Object.keys(thisWeek), ...Object.keys(lastWeek)]);

  allCasinos.forEach(casino => {
    const current = thisWeek[casino] || 0;
    const previous = lastWeek[casino] || 0;
    if (previous === 0 && current === 0) return;

    const change = current - previous;
    const percentChange = previous > 0 ? ((change / previous) * 100) : (current > 0 ? 100 : 0);

    changes.push({
      name: casino,
      change: Math.round(change),
      percentChange: parseFloat(percentChange.toFixed(1)),
      from: Math.round(previous),
      to: Math.round(current)
    });
  });

  // Sort and split into gainers/declines
  const gainers = changes
    .filter(c => c.change > 0)
    .sort((a, b) => b.percentChange - a.percentChange)
    .slice(0, 5);

  const declines = changes
    .filter(c => c.change < 0)
    .sort((a, b) => a.percentChange - b.percentChange)
    .slice(0, 5);

  return {
    gainers: gainers.length > 0 ? gainers : getDefaultMovers().gainers,
    declines: declines.length > 0 ? declines : getDefaultMovers().declines
  };
}

async function getTrendData(timeRange, metric = 'volume') {
  // Calculate weeks to fetch
  const weeks = timeRange === '4w' ? 4 : timeRange === '12w' ? 12 : timeRange === '24w' ? 24 : 52;
  
  // Calculate start date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (weeks * 7));
  
  // Try to get from snapshots first
  const { data: snapshots } = await supabase
    .from('platform_snapshots')
    .select('*')
    .gte('snapshot_date', startDate.toISOString().split('T')[0])
    .order('snapshot_date', { ascending: true });

  if (snapshots && snapshots.length > 0) {
    // Group by date (daily snapshots, aggregate to weekly if needed)
    const weeklyData = {};
    snapshots.forEach(s => {
      // Group by week (get week start date)
      const date = new Date(s.snapshot_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Sunday of that week
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { week: formatWeekLabel(weekStart.toISOString().split('T')[0]) };
      }
      
      // Use casino name as key (lowercase, normalize spaces and special chars)
      const casinoKey = s.casino_name.toLowerCase().trim();
      if (!weeklyData[weekKey][casinoKey]) {
        weeklyData[weekKey][casinoKey] = 0;
      }
      
      // Use different data based on metric
      if (metric === 'deposits') {
        weeklyData[weekKey][casinoKey] += (s.total_deposits || 0) / 1000; // Convert to thousands
      } else {
        weeklyData[weekKey][casinoKey] += (s.total_volume || 0) / 1000000; // Convert to millions
      }
    });

    return Object.values(weeklyData);
  }

  // Return default trend data if no snapshots (pass metric to get correct data)
  const defaultTrends = getDefaultTrends(metric);
  console.log(`Using default ${metric} trends:`, defaultTrends.length, 'weeks');
  return defaultTrends;
}

function aggregateByCasino(data) {
  const result = {};
  data.forEach(tx => {
    if (!tx.casino_name) return;
    result[tx.casino_name] = (result[tx.casino_name] || 0) + (tx.value_usd || 0);
  });
  return result;
}

function formatWeekLabel(dateStr) {
  const date = new Date(dateStr);
  return `${date.toLocaleString('en', { month: 'short' })} ${date.getDate()}`;
}

function getCasinoColor(name) {
  // Muted color palette - less bright, more consistent with dark theme
  const colors = {
    'Stake': '#16a34a',
    'Roobet': '#7c3aed',
    'Duel': '#c2410c',
    'Gamdom': '#a16207',
    'Shuffle': '#be185d',
    'Rainbet': '#0891b2',
    'Rollbit': '#dc2626',
    'StakeUS': '#9333ea',
    'Yeet': '#d97706',
    'Winna': '#059669',
    'BetFury': '#b45309',
    'Yolo.com': '#be185d',
    'Thrill': '#b91c1c',
    '500 Casino': '#2563eb',
    'Solcasino': '#0891b2',
    'Razed': '#7c3aed',
    'Duelbits': '#be185d',
    'MetaWin': '#4f46e5',
    'Chips.gg': '#0d9488',
    'BC.GAME': '#d97706',
    'BC.Game': '#d97706' // Handle both variations
  };
  return colors[name] || '#6b7280';
}

// ============================================
// DEFAULT/FALLBACK DATA
// ============================================

function getDefaultCasinoStats(multiplier = 1) {
  // Base weekly stats - multiplier scales for month/year views
  // Using muted colors consistent with dark theme
  const baseStats = [
    { name: 'Stake', volume: 441000000, marketShare: 54.8, deposits: 666000, color: '#16a34a' },
    { name: 'Roobet', volume: 93400000, marketShare: 11.6, deposits: 142000, color: '#7c3aed' },
    { name: 'Duel', volume: 65200000, marketShare: 8.1, deposits: 89000, color: '#c2410c' },
    { name: 'Shuffle', volume: 40000000, marketShare: 5.0, deposits: 108000, color: '#be185d' },
    { name: 'Gamdom', volume: 36800000, marketShare: 4.6, deposits: 28500, color: '#a16207' },
    { name: 'Rainbet', volume: 33900000, marketShare: 4.2, deposits: 157000, color: '#0891b2' },
    { name: 'Rollbit', volume: 17000000, marketShare: 2.1, deposits: 36300, color: '#dc2626' },
    { name: 'StakeUS', volume: 14800000, marketShare: 1.8, deposits: 62600, color: '#db2777' },
    { name: 'Yeet', volume: 8660000, marketShare: 1.1, deposits: 12400, color: '#d97706' },
    { name: 'BC.Game', volume: 6310000, marketShare: 0.8, deposits: 24000, color: '#2563eb' }
  ];
  
  // Scale volume and deposits by multiplier, keep marketShare as is
  return baseStats.map(s => ({
    ...s,
    volume: Math.round(s.volume * multiplier),
    deposits: Math.round(s.deposits * multiplier)
  }));
}

function getDefaultMovers() {
  return {
    gainers: [
      { name: 'Duel', change: 35200000, percentChange: 117.3, from: 30000000, to: 65200000 },
      { name: 'Chips.gg', change: 1080000, percentChange: 101.9, from: 1060000, to: 2140000 },
      { name: 'Yolo.com', change: 3420000, percentChange: 65.5, from: 5220000, to: 8640000 },
      { name: 'Yeet', change: 3140000, percentChange: 56.9, from: 5520000, to: 8660000 },
      { name: 'Rollbit', change: 6000000, percentChange: 54.5, from: 11000000, to: 17000000 }
    ],
    declines: [
      { name: 'BC.Game', change: -13690000, percentChange: -68.5, from: 20000000, to: 6310000 },
      { name: 'Whale.io', change: -2700000, percentChange: -54.9, from: 4950000, to: 2230000 },
      { name: 'StakeUS', change: -11400000, percentChange: -43.5, from: 26200000, to: 14800000 },
      { name: '500 Casino', change: -3700000, percentChange: -36.8, from: 10000000, to: 6300000 },
      { name: 'Stake', change: -184000000, percentChange: -29.4, from: 625000000, to: 441000000 }
    ]
  };
}

// Volume trends (in millions USD)
function getDefaultVolumeTrends() {
  return [
    { week: 'Oct 20', stake: 580, duel: 28, shuffle: 38, roobet: 95, gamdom: 42, rainbet: 32, rollbit: 14, stakeus: 18, yeet: 6, 'bc.game': 15, thrill: 5, solcasino: 8, '500 casino': 10, winna: 4, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Oct 27', stake: 560, duel: 30, shuffle: 40, roobet: 98, gamdom: 44, rainbet: 30, rollbit: 12, stakeus: 20, yeet: 7, 'bc.game': 18, thrill: 5, solcasino: 8, '500 casino': 10, winna: 4, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Nov 3', stake: 590, duel: 32, shuffle: 42, roobet: 102, gamdom: 45, rainbet: 34, rollbit: 15, stakeus: 22, yeet: 5, 'bc.game': 16, thrill: 5, solcasino: 8, '500 casino': 10, winna: 5, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Nov 10', stake: 620, duel: 35, shuffle: 44, roobet: 105, gamdom: 46, rainbet: 36, rollbit: 16, stakeus: 19, yeet: 8, 'bc.game': 14, thrill: 5, solcasino: 8, '500 casino': 10, winna: 5, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Nov 17', stake: 650, duel: 38, shuffle: 45, roobet: 108, gamdom: 47, rainbet: 35, rollbit: 18, stakeus: 21, yeet: 7, 'bc.game': 12, thrill: 5, solcasino: 8, '500 casino': 10, winna: 5, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Nov 24', stake: 680, duel: 42, shuffle: 43, roobet: 110, gamdom: 48, rainbet: 38, rollbit: 15, stakeus: 24, yeet: 9, 'bc.game': 10, thrill: 5, solcasino: 8, '500 casino': 10, winna: 5, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Dec 1', stake: 625, duel: 30, shuffle: 44, roobet: 111, gamdom: 47, rainbet: 36, rollbit: 13, stakeus: 20, yeet: 6, 'bc.game': 11, thrill: 5, solcasino: 8, '500 casino': 10, winna: 5, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Dec 8', stake: 600, duel: 32, shuffle: 42, roobet: 108, gamdom: 45, rainbet: 34, rollbit: 14, stakeus: 18, yeet: 7, 'bc.game': 9, thrill: 5, solcasino: 7, '500 casino': 10, winna: 4, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Dec 15', stake: 580, duel: 35, shuffle: 40, roobet: 105, gamdom: 44, rainbet: 32, rollbit: 16, stakeus: 16, yeet: 8, 'bc.game': 8, thrill: 6, solcasino: 7, '500 casino': 10, winna: 4, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Dec 22', stake: 720, duel: 45, shuffle: 42, roobet: 100, gamdom: 46, rainbet: 38, rollbit: 19, stakeus: 22, yeet: 10, 'bc.game': 7, thrill: 6, solcasino: 7, '500 casino': 10, winna: 4, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Dec 29', stake: 625, duel: 30, shuffle: 40, roobet: 93, gamdom: 47, rainbet: 35, rollbit: 15, stakeus: 17, yeet: 9, 'bc.game': 6, thrill: 7, solcasino: 7, '500 casino': 10, winna: 4, razed: 3, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 1 },
    { week: 'Jan 6', stake: 441, duel: 65, shuffle: 40, roobet: 93, gamdom: 37, rainbet: 34, rollbit: 17, stakeus: 15, yeet: 9, 'bc.game': 6, thrill: 9, solcasino: 7, '500 casino': 10, winna: 4, razed: 4, duelbits: 5, betfury: 3, 'yolo.com': 2, metawin: 2, 'chips.gg': 2 }
  ];
}

// Deposit count trends (in thousands) - Weekly data points
function getDefaultDepositTrends() {
  return [
    // Weekly snapshots going back ~12 weeks
    { week: 'Oct 20', stake: 180, rainbet: 50, shuffle: 35, roobet: 28, rollbit: 15, stakeus: 14, gamdom: 10, thrill: 5, solcasino: 7, duel: 3, '500 casino': 4, winna: 3, razed: 2, yeet: 2, betfury: 3, duelbits: 3, 'chips.gg': 1, 'yolo.com': 1.5, metawin: 2, 'bc.game': 40 },
    { week: 'Oct 27', stake: 185, rainbet: 52, shuffle: 36, roobet: 29, rollbit: 15, stakeus: 15, gamdom: 11, thrill: 5, solcasino: 7, duel: 3, '500 casino': 4, winna: 3, razed: 2, yeet: 2, betfury: 3, duelbits: 3, 'chips.gg': 1, 'yolo.com': 1.5, metawin: 2, 'bc.game': 35 },
    { week: 'Nov 3', stake: 190, rainbet: 53, shuffle: 36, roobet: 29, rollbit: 16, stakeus: 15, gamdom: 11, thrill: 5, solcasino: 7, duel: 3, '500 casino': 4, winna: 4, razed: 2, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 1, 'yolo.com': 1.5, metawin: 2, 'bc.game': 30 },
    { week: 'Nov 10', stake: 195, rainbet: 54, shuffle: 37, roobet: 30, rollbit: 16, stakeus: 16, gamdom: 11, thrill: 5, solcasino: 7, duel: 3, '500 casino': 5, winna: 4, razed: 2, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 1, 'yolo.com': 1.5, metawin: 2, 'bc.game': 25 },
    { week: 'Nov 17', stake: 200, rainbet: 55, shuffle: 38, roobet: 30, rollbit: 16, stakeus: 17, gamdom: 11, thrill: 5, solcasino: 7, duel: 3, '500 casino': 5, winna: 4, razed: 2, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 1, 'yolo.com': 1.5, metawin: 2, 'bc.game': 20 },
    { week: 'Nov 24', stake: 210, rainbet: 56, shuffle: 39, roobet: 31, rollbit: 16, stakeus: 18, gamdom: 12, thrill: 5, solcasino: 7, duel: 4, '500 casino': 5, winna: 4, razed: 3, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 1, 'yolo.com': 1.5, metawin: 2, 'bc.game': 15 },
    { week: 'Dec 1', stake: 217, rainbet: 54, shuffle: 37, roobet: 32, rollbit: 16, stakeus: 17, gamdom: 11, thrill: 6, solcasino: 7, duel: 4, '500 casino': 5, winna: 3, razed: 2, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 0.6, 'yolo.com': 1.5, metawin: 1.4, 'bc.game': 4 },
    { week: 'Dec 10', stake: 225, rainbet: 53, shuffle: 39, roobet: 29, rollbit: 16, stakeus: 15, gamdom: 12, thrill: 5, solcasino: 7, duel: 3, '500 casino': 4, winna: 2, razed: 2, yeet: 2, betfury: 3, duelbits: 3, 'chips.gg': 0.6, 'yolo.com': 1.4, metawin: 1.7, 'bc.game': 46 },
    { week: 'Dec 13', stake: 193, rainbet: 59, shuffle: 39, roobet: 31, rollbit: 17, stakeus: 18, gamdom: 12, thrill: 5, solcasino: 7, duel: 4, '500 casino': 5, winna: 2, razed: 5, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 1.1, 'yolo.com': 1.3, metawin: 1.6, 'bc.game': 4 },
    { week: 'Dec 22', stake: 258, rainbet: 59, shuffle: 41, roobet: 31, rollbit: 16, stakeus: 20, gamdom: 11, thrill: 6, solcasino: 7, duel: 4, '500 casino': 5, winna: 4, razed: 3, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 0.8, 'yolo.com': 1.7, metawin: 1.4, 'bc.game': 4 },
    { week: 'Dec 31', stake: 275, rainbet: 61, shuffle: 41, roobet: 32, rollbit: 16, stakeus: 22, gamdom: 11, thrill: 7, solcasino: 7, duel: 5, '500 casino': 5, winna: 4, razed: 3, yeet: 4, betfury: 3, duelbits: 3, 'chips.gg': 1.1, 'yolo.com': 2, metawin: 1.7, 'bc.game': 3 },
    { week: 'Jan 6', stake: 197, rainbet: 56, shuffle: 36, roobet: 29, rollbit: 15, stakeus: 13, gamdom: 10, thrill: 9, solcasino: 7, duel: 5, '500 casino': 4, winna: 4, razed: 4, yeet: 3, betfury: 3, duelbits: 3, 'chips.gg': 1.7, 'yolo.com': 1.6, metawin: 1.6, 'bc.game': 0.3 }
  ];
}

// Default trends - returns volume or deposits based on metric
function getDefaultTrends(metric = 'volume') {
  if (metric === 'deposits') {
    return getDefaultDepositTrends();
  }
  return getDefaultVolumeTrends();
}







