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
  // Use yesterday's data - it's complete and avoids timezone/block estimation issues
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  
  const yesterdayUTC = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate()));
  const snapshotDate = yesterdayUTC.toISOString().split('T')[0]; // YYYY-MM-DD

  // Get all transactions from yesterday (UTC)
  const startOfDay = new Date(yesterdayUTC);
  const endOfDay = new Date(yesterdayUTC);
  endOfDay.setUTCHours(23, 59, 59, 999);

  console.log(`Aggregating snapshots for ${snapshotDate} (yesterday) from casino hot wallets`);
  console.log(`Date range (UTC): ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

  // Fetch deposits to each casino hot wallet for today
  const casinoMap = {};
  const allDepositors = new Set(); // Track all unique depositors across all casinos

  for (const [hotWallet, casinoName] of Object.entries(CASINO_HOT_WALLETS)) {
    console.log(`Fetching deposits for ${casinoName} (${hotWallet})...`);
    
    const deposits = await fetchDepositsToHotWallet(hotWallet, startOfDay, endOfDay);
    console.log(`   Found ${deposits.length} deposits for ${casinoName}`);
    
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
      const depositValue = deposit.value_usd || 0;
      casinoMap[casinoName].totalVolume += depositValue;
      allDepositors.add(deposit.from_address);
      
      // Debug: log first few deposits to verify values
      if (casinoMap[casinoName].deposits.length <= 3) {
        console.log(`   Sample deposit: ${deposit.from_address.slice(0, 10)}... value_usd: ${depositValue}, asset: ${deposit.asset}`);
      }
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
    
    // Debug: Check volume calculation
    const sampleDepositValues = casino.deposits.slice(0, 5).map(d => d.value_usd);
    console.log(`   ${casino.name}: ${totalDeposits} deposits, totalVolume: ${totalVolume}, sample values: ${sampleDepositValues.join(', ')}`);
    
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

async function getBlockNumberForDate(targetDate) {
  // Get current block number
  try {
    const response = await fetch(ALCHEMY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: []
      })
    });

    const data = await response.json();
    if (data.error || !data.result) {
      return null;
    }

    const currentBlock = parseInt(data.result, 16);
    const now = Date.now();
    const targetTime = targetDate.getTime();
    const timeDiff = now - targetTime;
    
    // Ethereum blocks are ~12 seconds apart on average
    const blocksPerSecond = 1 / 12;
    const blocksToGoBack = Math.floor(timeDiff / 1000 * blocksPerSecond);
    
    // Add 10% buffer to ensure we don't miss any blocks
    const estimatedBlock = currentBlock - Math.floor(blocksToGoBack * 1.1);
    
    // Ensure we don't go below block 0
    return Math.max(0, estimatedBlock);
  } catch (e) {
    console.error('Error getting block number:', e);
    return null;
  }
}

async function fetchDepositsToHotWallet(hotWallet, startDate, endDate) {
  const deposits = [];
  let pageKey = undefined;
  let page = 0;
  const MAX_PAGES = 500; // Safety limit to prevent timeouts

  // Don't use fromBlock - fetch all transfers and filter by date
  // This avoids block estimation errors and ensures we get all transfers in our date range
  console.log(`   Fetching all transfers (no block limit), filtering for ${startDate.toISOString()} to ${endDate.toISOString()}`);

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
            withMetadata: true, // Required to get blockTimestamp
            order: 'desc', // Newest first (descending order)
            // No fromBlock/toBlock - fetch all and filter by date
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

      // Log sample transfer dates and values for debugging (first page only)
      if (page === 0 && transfers.length > 0) {
        const sampleTransfer = transfers[0];
        console.log(`   Sample transfer structure:`, {
          hasMetadata: !!sampleTransfer.metadata,
          hasBlockTimestamp: !!sampleTransfer.metadata?.blockTimestamp,
          hasBlockNum: !!sampleTransfer.blockNum,
          category: sampleTransfer.category,
          asset: sampleTransfer.asset,
          value: sampleTransfer.value,
          valueType: typeof sampleTransfer.value,
          rawContract: sampleTransfer.rawContract ? {
            decimals: sampleTransfer.rawContract.decimals,
            decimalsType: typeof sampleTransfer.rawContract.decimals
          } : null
        });
        
        const sampleDates = transfers.slice(0, 3).map(t => {
          if (t.metadata?.blockTimestamp) {
            return new Date(t.metadata.blockTimestamp).toISOString();
          } else if (t.blockNum) {
            return `Block ${parseInt(t.blockNum, 16)} (no timestamp)`;
          }
          return 'N/A';
        });
        console.log(`   Sample transfer dates: ${sampleDates.join(', ')}`);
        
        // Test value conversion on first transfer
        if (sampleTransfer.value) {
          const testValue = typeof sampleTransfer.value === 'string' && sampleTransfer.value.startsWith('0x')
            ? parseInt(sampleTransfer.value, 16)
            : parseFloat(sampleTransfer.value) || 0;
          console.log(`   Sample value conversion: ${sampleTransfer.value} -> ${testValue} -> USD: ${testValue / 1e18 * 3300}`);
        }
      }

      let foundDepositsInPage = false;
      let allTransfersTooOld = true;
      let transfersChecked = 0;
      let transfersInRange = 0;
      let transfersTooOld = 0;
      let transfersTooNew = 0;

      // Filter transfers by date and process
      transfers.forEach(transfer => {
        try {
          transfersChecked++;
          
          // Skip transfers without metadata or blockTimestamp
          if (!transfer || !transfer.metadata || !transfer.metadata.blockTimestamp) {
            return; // Silently skip invalid transfers
          }

          const txDate = new Date(transfer.metadata.blockTimestamp);
          
          // Validate date
          if (isNaN(txDate.getTime())) {
            return; // Silently skip invalid dates
          }

          // Check if transfer is too old (before our date range)
          // Note: Transfers come in reverse chronological order (newest first)
          // So if we see a transfer that's too old, we need to check if we've already
          // found deposits in our range. If we have, we can stop. If not, we should continue.
          if (txDate < startDate) {
            transfersTooOld++;
            // Only mark as "all too old" if we haven't found any deposits yet
            // This allows us to continue searching through pages
            if (deposits.length === 0) {
              allTransfersTooOld = true;
            }
            return; // This transfer is too old
          }

          // Check if transfer is too new (after our date range)
          if (txDate > endDate) {
            transfersTooNew++;
            return; // This transfer is too new, skip it
          }
          
          // Transfer is within our date range
          transfersInRange++;
          foundDepositsInPage = true;
          allTransfersTooOld = false;
          
          // Convert value to USD - use same logic as scan/route.js
          const asset = transfer.asset || (transfer.category === 'external' ? 'ETH' : 'UNKNOWN');
          let rawValue = 0;
          
          // Parse value - Alchemy returns values as strings, could be hex or decimal
          if (transfer.value) {
            if (typeof transfer.value === 'string') {
              if (transfer.value.startsWith('0x')) {
                // Hex string
                rawValue = parseInt(transfer.value, 16);
              } else {
                // Decimal string
                rawValue = parseFloat(transfer.value) || 0;
              }
            } else {
              // Already a number
              rawValue = transfer.value;
            }
          }
          
          let valueUSD = 0;
          
          if (transfer.category === 'external') {
            // Native ETH transfer - value is in wei
            const ethValue = rawValue / 1e18;
            valueUSD = ethValue * 3300; // TODO: Use real price API
          } else if (transfer.category === 'erc20') {
            // ERC20 token transfer
            // Parse decimals - could be hex string or number
            let decimals = 18; // default
            if (transfer.rawContract?.decimals !== undefined) {
              if (typeof transfer.rawContract.decimals === 'string') {
                if (transfer.rawContract.decimals.startsWith('0x')) {
                  decimals = parseInt(transfer.rawContract.decimals, 16);
                } else {
                  decimals = parseInt(transfer.rawContract.decimals, 10);
                }
              } else {
                decimals = parseInt(transfer.rawContract.decimals);
              }
            }
            
            const adjustedValue = rawValue / Math.pow(10, decimals);
            
            // Check if it's a stablecoin
            const tokenSymbol = asset.toUpperCase();
            const stablecoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'USDP', 'GUSD', 'FRAX'];
            if (stablecoins.includes(tokenSymbol)) {
              valueUSD = adjustedValue; // 1:1 for stablecoins
            } else if (tokenSymbol === 'ETH' || tokenSymbol === 'WETH') {
              valueUSD = adjustedValue * 3300;
            } else {
              // Unknown token - set to 0 to avoid inflating totals
              // Log first few to see what tokens we're missing
              if (deposits.length < 5) {
                console.log(`   Unknown token: ${tokenSymbol}, value: ${adjustedValue}, setting USD to 0`);
              }
              valueUSD = 0;
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

      // Log page statistics
      if (page % 10 === 0 || transfersInRange > 0) {
        console.log(`   Page ${page}: Checked ${transfersChecked} transfers, ${transfersInRange} in range, ${transfersTooOld} too old, ${transfersTooNew} too new`);
      }

      // Early exit logic:
      // Since transfers come in reverse chronological order (newest first):
      // 1. If we found deposits in this page, continue to see if there are more
      // 2. If we found deposits previously but now all transfers are too old, we've passed our date range - stop
      // 3. If we haven't found any deposits and all transfers are too old, continue for a few pages
      //    in case there are transfers in our range on later pages (unlikely but possible)
      // 4. If we've checked many pages with no deposits and all are too old, stop
      
      if (foundDepositsInPage && allTransfersTooOld && deposits.length > 0) {
        // We found deposits but now seeing older transfers - we've passed our date range
        console.log(`   Found ${deposits.length} deposits total, now seeing older transfers - stopping for ${hotWallet}`);
        break;
      }
      
      if (!foundDepositsInPage && allTransfersTooOld) {
        // No deposits found yet, but all transfers in this page are too old
        // Continue for a few more pages in case there are transfers in range
        if (page >= 10) {
          // Checked 10+ pages, all too old, likely no transfers in range
          console.log(`   No deposits found after ${page} pages (all transfers too old), stopping for ${hotWallet}`);
          break;
        }
      }

      // Reset counters for next page
      transfersChecked = 0;
      transfersInRange = 0;
      transfersTooOld = 0;
      transfersTooNew = 0;

      // Safety limit: prevent infinite loops and timeouts
      if (page >= MAX_PAGES) {
        console.log(`   Reached max pages limit (${MAX_PAGES}) for ${hotWallet}, stopping`);
        break;
      }

      // Rate limit protection
      await new Promise(r => setTimeout(r, 200));

      if (!pageKey) {
        break;
      }

      page++;
      if (page % 10 === 0) {
        console.log(`   Processed ${page} pages, found ${deposits.length} deposits so far...`);
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

