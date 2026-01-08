import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

// Verify this is called from Vercel Cron (or allow manual trigger with secret)
const CRON_SECRET = process.env.CRON_SECRET;

import { CASINO_HOT_WALLETS } from '../../utils/casino-hot-wallets';

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

    console.log('Starting platform snapshots aggregation from casino hot wallets...');
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

  console.log(`Aggregating snapshots for ${snapshotDate} from casino hot wallets`);

  // Fetch deposits to each casino hot wallet for today
  const casinoMap = {};
  const allDepositors = new Set(); // Track all unique depositors across all casinos

  for (const [hotWallet, casinoName] of Object.entries(CASINO_HOT_WALLETS)) {
    console.log(`Fetching deposits for ${casinoName} (${hotWallet})...`);
    
    const deposits = await fetchDepositsToHotWallet(hotWallet, startOfDay, endOfDay);
    
    if (!casinoMap[casinoName]) {
      casinoMap[casinoName] = {
        name: casinoName,
        deposits: [],
        depositors: new Set(),
        totalVolume: 0
      };
    }

    deposits.forEach(deposit => {
      casinoMap[casinoName].deposits.push(deposit);
      casinoMap[casinoName].depositors.add(deposit.from_address);
      casinoMap[casinoName].totalVolume += deposit.value_usd || 0;
      allDepositors.add(deposit.from_address);
    });
  }

  if (Object.keys(casinoMap).length === 0) {
    console.log('No deposits found for today');
    return {
      date: snapshotDate,
      casinosProcessed: 0,
      totalSnapshots: 0
    };
  }

  // Get all previous depositors for each casino (to calculate new depositors)
  const previousDepositorsMap = {};
  
  for (const casinoName of Object.keys(casinoMap)) {
    // Get all unique depositors before today from transactions table
    // (or we could query hot wallets historically, but transactions table is faster)
    const { data: prevTxs } = await supabase
      .from('transactions')
      .select('from_address')
      .eq('casino_name', casinoName)
      .lt('block_timestamp', startOfDay.toISOString());
    
    if (prevTxs) {
      previousDepositorsMap[casinoName] = new Set(prevTxs.map(tx => tx.from_address));
    } else {
      previousDepositorsMap[casinoName] = new Set();
    }
  }

  // Calculate total volume across all casinos for market share
  const totalVolumeAll = Object.values(casinoMap).reduce((sum, c) => sum + c.totalVolume, 0);

  // Prepare snapshots for insertion
  const snapshots = [];
  for (const casino of Object.values(casinoMap)) {
    const uniqueDepositors = casino.depositors.size;
    const totalDeposits = casino.deposits.length;
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
    casinosProcessed: Object.keys(casinoMap).length,
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

async function fetchDepositsToHotWallet(hotWallet, startDate, endDate) {
  const deposits = [];
  let pageKey = undefined;
  let page = 0;

  // Convert dates to Unix timestamps (Alchemy uses hex timestamps)
  const startTimestamp = `0x${Math.floor(startDate.getTime() / 1000).toString(16)}`;
  const endTimestamp = `0x${Math.floor(endDate.getTime() / 1000).toString(16)}`;

  while (true) {
    try {
      const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [{
            toAddress: hotWallet,
            category: ['external', 'erc20'],
            maxCount: '0x3E8', // 1000 per page
            excludeZeroValue: true,
            fromBlock: '0x0', // Start from beginning, filter by timestamp
            toBlock: 'latest',
            pageKey: pageKey
          }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error(`❌ Alchemy error for ${hotWallet}:`, data.error);
        break;
      }

      const transfers = data.result?.transfers || [];
      pageKey = data.result?.pageKey;

      if (transfers.length === 0) {
        break;
      }

      // Filter transfers by date and process
      transfers.forEach(transfer => {
        try {
          // Skip transfers without metadata or blockTimestamp
          if (!transfer || !transfer.metadata || !transfer.metadata.blockTimestamp) {
            return; // Silently skip invalid transfers
          }

          const txDate = new Date(transfer.metadata.blockTimestamp);
          
          // Validate date
          if (isNaN(txDate.getTime())) {
            return; // Silently skip invalid dates
          }
          
          // Only include transfers within our date range
          if (txDate >= startDate && txDate <= endDate) {
            // Convert value to USD (simplified - should use price API)
            let valueUSD = 0;
            if (transfer.asset === 'ETH' || transfer.category === 'external') {
              // ETH transfer
              const ethValue = parseFloat(transfer.value || 0) / 1e18;
              valueUSD = ethValue * 3300; // TODO: Use real price API
            } else if (transfer.category === 'erc20') {
              // ERC20 token transfer
              const tokenValue = parseFloat(transfer.value || 0);
              const decimals = transfer.rawContract?.decimals ? parseInt(transfer.rawContract.decimals, 16) : 18;
              const adjustedValue = tokenValue / Math.pow(10, decimals);
              
              // Check if it's a stablecoin
              const tokenSymbol = transfer.asset?.toUpperCase() || '';
              if (tokenSymbol === 'USDT' || tokenSymbol === 'USDC' || tokenSymbol === 'DAI') {
                valueUSD = adjustedValue; // 1:1 for stablecoins
              } else {
                // For other tokens, use ETH price as placeholder (TODO: use real price API)
                valueUSD = adjustedValue * 3300;
              }
            }

            // Ensure required fields exist
            if (!transfer.from || !transfer.hash) {
              return; // Silently skip transfers missing required fields
            }

            deposits.push({
              from_address: transfer.from.toLowerCase(),
              value_usd: valueUSD,
              block_timestamp: txDate.toISOString(),
              tx_hash: transfer.hash,
              asset: transfer.asset || 'ETH'
            });
          }
        } catch (transferError) {
          // Silently skip individual transfer errors to continue processing
          // Log only if it's not a common validation error
          if (!transferError.message?.includes('blockTimestamp') && 
              !transferError.message?.includes('null') &&
              !transferError.message?.includes('undefined')) {
            console.warn(`   ⚠️ Error processing transfer:`, transferError.message);
          }
        }
      });

      // Rate limit protection
      await new Promise(r => setTimeout(r, 200));

      if (!pageKey) {
        break;
      }

      page++;
      if (page % 10 === 0) {
        console.log(`   Processed ${page} pages for ${hotWallet}...`);
      }
    } catch (e) {
      // Check if it's a network/API error vs data validation error
      if (e.message && e.message.includes('blockTimestamp')) {
        // Data validation error - log and continue, don't retry
        console.warn(`   ⚠️ Data validation error for ${hotWallet}:`, e.message);
        console.log(`   Continuing with next page...`);
        // Skip this page and continue
        pageKey = undefined; // Force break on next iteration
        break;
      } else {
        // Network/API error - retry
        console.error(`   ❌ Network error for ${hotWallet}:`, e.message);
        console.log(`   Retrying in 2 seconds...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log(`   Found ${deposits.length} deposits for ${hotWallet}`);
  return deposits;
}

