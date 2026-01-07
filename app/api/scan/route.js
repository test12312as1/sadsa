import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Force dynamic rendering (not static)
export const dynamic = 'force-dynamic';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

// Cache duration: 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

export async function POST(request) {
  try {
    const { address, chain = 'ETH', forceRefresh = false, walletType = 'personal' } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const normalizedAddress = address.toLowerCase().trim();
    console.log(`\n=== Scanning wallet: ${normalizedAddress} (type: ${walletType}) ===`);

    // 1. Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await getCachedWallet(normalizedAddress);
      if (cached && isRecentScan(cached.last_scanned)) {
        console.log('Returning cached result');
        return NextResponse.json({
          ...formatWalletResponse(cached),
          cached: true
        });
      }
    }

    let transactions = [];

    // 2. Different handling based on wallet type
    if (walletType === 'proxy') {
      // User entered their casino deposit address directly
      // Check if it's in known_proxies and get its casino
      const { data: proxyData } = await supabase
        .from('known_proxies')
        .select('casino_name')
        .eq('address', normalizedAddress)
        .single();

      if (proxyData) {
        console.log(`Wallet is a known proxy for ${proxyData.casino_name}`);
        // Fetch incoming transactions TO this proxy (deposits from personal wallets)
        transactions = await fetchIncomingDeposits(normalizedAddress, proxyData.casino_name);
      } else {
        console.log('Proxy address not found in known_proxies');
        return NextResponse.json({
          address: normalizedAddress,
          chain,
          riskScore: 0,
          status: 'NO_DATA',
          gamblerType: 'Unknown Proxy',
          message: 'This address is not recognized as a casino deposit address',
          totalDeposits: 0,
          totalVolumeUSD: 0
        });
      }
    } else {
      // Personal wallet - find gambling transactions
      const result = await findGamblingTransactions(normalizedAddress, chain);
      transactions = result.transactions;
      
      if (result.proxyAddresses.length === 0) {
        console.log('No gambling activity detected');
        return NextResponse.json({
          address: normalizedAddress,
          chain,
          riskScore: 0,
          status: 'NO_DATA',
          gamblerType: 'No Gambling Detected',
          message: 'No gambling transactions found for this wallet',
          totalDeposits: 0,
          totalVolumeUSD: 0
        });
      }
    }

    if (transactions.length === 0) {
      console.log('No transactions found');
      return NextResponse.json({
        address: normalizedAddress,
        chain,
        riskScore: 0,
        status: 'NO_DATA',
        gamblerType: 'No Gambling Detected',
        message: 'No deposit transactions found',
        totalDeposits: 0,
        totalVolumeUSD: 0
      });
    }

    console.log(`Processing ${transactions.length} gambling transactions`);

    // 3. Calculate behavioral metrics
    const metrics = calculateBehavioralMetrics(transactions);
    const riskScore = calculateRiskScore(metrics);
    const { status, gamblerType } = getStatusAndType(riskScore);

    // 4. Build full report
    const report = {
      address: normalizedAddress,
      chain,
      riskScore,
      status,
      gamblerType,
      ...metrics
    };

    // 5. Cache the result
    await cacheWalletReport(normalizedAddress, chain, report);

    console.log(`Scan complete: Risk ${riskScore}, ${transactions.length} txs, $${metrics.totalVolumeUSD}`);

    return NextResponse.json({
      ...report,
      cached: false
    });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan wallet', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// MAIN TRANSACTION FETCHING
// ============================================

async function findGamblingTransactions(personalWallet, chain) {
  if (chain === 'SOL') {
    console.log('Solana not yet supported');
    return { proxyAddresses: [], transactions: [] };
  }

  // Get all known proxy addresses from our database
  const { data: allProxies, error: proxyError } = await supabase
    .from('known_proxies')
    .select('address, casino_name');

  if (proxyError) {
    console.error('Error fetching proxies:', proxyError);
    return { proxyAddresses: [], transactions: [] };
  }

  if (!allProxies || allProxies.length === 0) {
    console.log('No known proxies in database');
    return { proxyAddresses: [], transactions: [] };
  }

  console.log(`Loaded ${allProxies.length} known proxies`);

  // Create a map for quick lookup
  const proxyMap = new Map(allProxies.map(p => [p.address.toLowerCase(), p.casino_name]));

  // Check if the wallet itself is a known proxy
  if (proxyMap.has(personalWallet)) {
    console.log(`Wallet IS a known proxy for ${proxyMap.get(personalWallet)}`);
    const transactions = await fetchIncomingDeposits(personalWallet, proxyMap.get(personalWallet));
    return {
      proxyAddresses: [{ address: personalWallet, casino: proxyMap.get(personalWallet) }],
      transactions
    };
  }

  // Fetch outgoing transactions from the personal wallet
  const transfers = await fetchOutgoingTransfers(personalWallet);
  console.log(`Fetched ${transfers.length} outgoing transfers`);

  if (transfers.length === 0) {
    return { proxyAddresses: [], transactions: [] };
  }

  // Filter to transactions going to known proxies
  const gamblingTxs = transfers.filter(tx => 
    tx.to && proxyMap.has(tx.to.toLowerCase())
  );

  console.log(`Found ${gamblingTxs.length} transactions to known casino proxies`);

  if (gamblingTxs.length === 0) {
    return { proxyAddresses: [], transactions: [] };
  }

  // Convert to our transaction format
  const transactions = gamblingTxs.map(tx => {
    const asset = tx.asset || 'ETH';
    const rawValue = parseFloat(tx.value) || 0;
    const { valueETH, valueUSD } = convertToUSD(asset, rawValue);

    return {
      hash: tx.hash,
      from: personalWallet,
      to: tx.to.toLowerCase(),
      casino: proxyMap.get(tx.to.toLowerCase()),
      value: valueETH,
      valueUSD: valueUSD,
      asset: asset,
      timestamp: new Date(tx.metadata?.blockTimestamp || Date.now()),
      blockNumber: parseInt(tx.blockNum, 16)
    };
  });

  // Extract unique proxy addresses
  const usedProxies = new Map();
  transactions.forEach(tx => {
    if (!usedProxies.has(tx.to)) {
      usedProxies.set(tx.to, { address: tx.to, casino: tx.casino });
    }
  });

  // Store for future lookups (async, don't wait)
  storeWalletLinks(personalWallet, transactions, proxyMap);
  storeTransactions(transactions, personalWallet);

  return {
    proxyAddresses: Array.from(usedProxies.values()),
    transactions
  };
}

async function fetchIncomingDeposits(proxyAddress, casinoName) {
  // Fetch incoming transactions TO this proxy address
  const transfers = [];
  let pageKey = undefined;

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
            toAddress: proxyAddress,
            category: ['external', 'erc20'],
            maxCount: '0x3E8',
            excludeZeroValue: true,
            withMetadata: true,
            pageKey
          }]
        })
      });

      const data = await response.json();
      if (data.error) {
        console.error('Alchemy error:', data.error);
        break;
      }

      const txs = data.result?.transfers || [];
      transfers.push(...txs);
      pageKey = data.result?.pageKey;

      if (!pageKey || transfers.length > 5000) break;
    } catch (e) {
      console.error('Fetch error:', e);
      break;
    }
  }

  console.log(`Fetched ${transfers.length} incoming deposits to proxy`);

  // Convert to our format
  return transfers.map(tx => {
    const asset = tx.asset || 'ETH';
    const rawValue = parseFloat(tx.value) || 0;
    const { valueETH, valueUSD } = convertToUSD(asset, rawValue);

    return {
      hash: tx.hash,
      from: tx.from.toLowerCase(),
      to: proxyAddress,
      casino: casinoName,
      value: valueETH,
      valueUSD: valueUSD,
      asset: asset,
      timestamp: new Date(tx.metadata?.blockTimestamp || Date.now()),
      blockNumber: parseInt(tx.blockNum, 16)
    };
  });
}

async function storeWalletLinks(personalWallet, transactions, proxyMap) {
  const linksMap = new Map();
  
  transactions.forEach(tx => {
    const proxyAddr = tx.to;
    if (!linksMap.has(proxyAddr)) {
      linksMap.set(proxyAddr, {
        personal_wallet: personalWallet,
        proxy_address: proxyAddr,
        casino_name: tx.casino,
        first_seen: tx.timestamp.toISOString(),
        tx_count: 1,
        total_value_eth: tx.value
      });
    } else {
      const existing = linksMap.get(proxyAddr);
      existing.tx_count++;
      existing.total_value_eth += tx.value;
    }
  });

  const links = Array.from(linksMap.values());
  if (links.length > 0) {
    const { error } = await supabase
      .from('wallet_links')
      .upsert(links, { onConflict: 'personal_wallet,proxy_address' });
    if (error) console.error('Error storing wallet links:', error);
  }
}

async function storeTransactions(transactions, personalWallet) {
  if (transactions.length === 0) return;

  const records = transactions.map(tx => ({
    tx_hash: tx.hash,
    from_address: personalWallet,
    to_address: tx.to,
    casino_name: tx.casino,
    value_eth: tx.value,
    value_usd: tx.valueUSD,
    asset: tx.asset,
    chain: 'ETH',
    block_number: tx.blockNumber,
    block_timestamp: tx.timestamp.toISOString()
  }));

  const { error } = await supabase
    .from('transactions')
    .upsert(records, { onConflict: 'tx_hash', ignoreDuplicates: true });

  if (error) console.error('Error storing transactions:', error);
}

async function fetchOutgoingTransfers(address) {
  const transfers = [];
  let pageKey = undefined;

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
            fromAddress: address,
            category: ['external', 'erc20'],
            maxCount: '0x3E8',
            excludeZeroValue: true,
            withMetadata: true,
            pageKey
          }]
        })
      });

      const data = await response.json();
      if (data.error) {
        console.error('Alchemy error:', data.error);
        break;
      }

      const txs = data.result?.transfers || [];
      transfers.push(...txs);
      pageKey = data.result?.pageKey;

      if (!pageKey || transfers.length > 10000) break;
    } catch (e) {
      console.error('Fetch error:', e);
      break;
    }
  }

  return transfers;
}

// Convert different tokens to USD value
function convertToUSD(asset, rawValue) {
  const assetUpper = asset?.toUpperCase() || 'ETH';
  
  // Stablecoins - 1:1 with USD
  const stablecoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'USDP', 'GUSD', 'FRAX'];
  if (stablecoins.includes(assetUpper)) {
    return {
      valueETH: rawValue / 3300, // Convert to ETH equivalent for consistency
      valueUSD: rawValue
    };
  }
  
  // ETH and WETH
  if (assetUpper === 'ETH' || assetUpper === 'WETH') {
    return {
      valueETH: rawValue,
      valueUSD: rawValue * 3300
    };
  }
  
  // Other tokens - try to estimate (conservative approach)
  // For unknown tokens, we'll use a very low estimate to avoid inflation
  // In production, you'd want to use a price API
  const knownTokenPrices = {
    'WBTC': 95000,
    'LINK': 15,
    'UNI': 8,
    'AAVE': 200,
    'MKR': 1500,
    'SHIB': 0.00001,
    'PEPE': 0.00001,
    'APE': 1.5,
  };
  
  if (knownTokenPrices[assetUpper]) {
    const usdValue = rawValue * knownTokenPrices[assetUpper];
    return {
      valueETH: usdValue / 3300,
      valueUSD: usdValue
    };
  }
  
  // Unknown token - assume $0 to avoid inflating totals
  // Better to undercount than overcount
  console.log(`Unknown token: ${asset}, value: ${rawValue} - skipping USD conversion`);
  return {
    valueETH: 0,
    valueUSD: 0
  };
}

// ============================================
// BEHAVIORAL CALCULATIONS
// ============================================

function calculateBehavioralMetrics(transactions) {
  if (transactions.length === 0) {
    return getEmptyMetrics();
  }

  // Sort by timestamp
  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  
  // Basic stats
  const totalDeposits = sorted.length;
  const totalVolumeETH = sorted.reduce((sum, tx) => sum + (tx.value || 0), 0);
  const totalVolumeUSD = sorted.reduce((sum, tx) => sum + (tx.valueUSD || tx.value * 3300), 0);
  const avgDepositValue = totalVolumeUSD / totalDeposits;

  // Time range
  const firstDeposit = sorted[0].timestamp;
  const lastDeposit = sorted[sorted.length - 1].timestamp;
  
  // Active days (unique dates)
  const uniqueDays = new Set(sorted.map(tx => tx.timestamp.toISOString().split('T')[0]));
  const activeDays = uniqueDays.size;

  // Favorite casino
  const casinoCounts = {};
  const casinoVolumes = {};
  sorted.forEach(tx => {
    const casino = tx.casino || 'Unknown';
    casinoCounts[casino] = (casinoCounts[casino] || 0) + 1;
    casinoVolumes[casino] = (casinoVolumes[casino] || 0) + (tx.value || 0);
  });
  const favoriteCasino = Object.entries(casinoVolumes)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  // Deposit velocity (txns per hour during active sessions)
  const depositVelocity = calculateDepositVelocity(sorted);

  // Midnight factor (% between 12am-5am UTC)
  const midnightFactor = calculateMidnightFactor(sorted);

  // Chase behavior (% of deposits within 1 hour of previous)
  const chaseBehavior = calculateChaseBehavior(sorted);

  // Session analysis
  const sessionStats = calculateSessionStats(sorted);

  // Biggest deposit
  const biggestDeposit = Math.max(...sorted.map(tx => tx.value || 0));
  const biggestDepositUSD = biggestDeposit * 3300;

  // Longest streak (consecutive deposits within 1 hour)
  const longestStreak = calculateLongestStreak(sorted);

  // Deposits by casino
  const depositsByCasino = Object.entries(casinoVolumes).map(([casino, volume]) => ({
    casino,
    amount: Math.round(volume * 3300),
    percentage: Math.round((volume / totalVolumeETH) * 100) || 0
  })).sort((a, b) => b.amount - a.amount);

  // Deposits by crypto (simplified - assuming all ETH for now)
  const depositsByCrypto = [
    { crypto: 'ETH', amount: totalVolumeETH, usd: Math.round(totalVolumeUSD), percentage: 100 }
  ];

  // Monthly deposits (last 12 months)
  const monthlyDeposits = calculateMonthlyDeposits(sorted);

  return {
    totalDeposits,
    totalVolumeETH: parseFloat(totalVolumeETH.toFixed(4)),
    totalVolumeUSD: Math.round(totalVolumeUSD),
    avgDepositValue: Math.round(avgDepositValue),
    firstDeposit: firstDeposit.toISOString().split('T')[0],
    lastDeposit: lastDeposit.toISOString().split('T')[0],
    activeDays,
    favoriteCasino: {
      name: favoriteCasino,
      url: getCasinoUrl(favoriteCasino)
    },
    
    // Behavioral metrics
    depositVelocity: {
      rate: depositVelocity,
      safeBaseline: 2.0,
      unit: 'txns/hour',
      description: getVelocityDescription(depositVelocity)
    },
    midnightFactor: {
      percentage: midnightFactor,
      transactions: sorted.filter(tx => isMidnightHour(tx.timestamp)).length,
      totalTransactions: totalDeposits,
      description: getMidnightDescription(midnightFactor)
    },
    chaseBehavior: {
      percentage: chaseBehavior,
      avgResponseTime: sessionStats.avgTimeBetweenDeposits,
      description: getChaseDescription(chaseBehavior)
    },
    sessionLength: {
      avgHours: sessionStats.avgSessionLength,
      longestSession: sessionStats.longestSession,
      description: getSessionDescription(sessionStats.avgSessionLength)
    },
    biggestBet: {
      amount: parseFloat(biggestDeposit.toFixed(4)),
      amountUSD: Math.round(biggestDepositUSD),
      description: getBiggestBetDescription(biggestDepositUSD, avgDepositValue)
    },
    longestStreak: {
      deposits: longestStreak.count,
      timespan: longestStreak.timespan,
      description: getStreakDescription(longestStreak.count)
    },

    // Analytics data
    analytics: {
      totalDeposits,
      avgDepositValue: Math.round(avgDepositValue),
      firstDeposit: firstDeposit.toISOString().split('T')[0],
      lastDeposit: lastDeposit.toISOString().split('T')[0],
      activeDays,
      depositsByCrypto,
      depositsByCasino,
      monthlyDeposits
    },

    // For compatibility with existing UI
    financialImpact: {
      totalETH: parseFloat(totalVolumeETH.toFixed(4)),
      totalUSD: Math.round(totalVolumeUSD),
      totalSOL: 0
    },
    primaryPattern: getPrimaryPattern(depositVelocity, chaseBehavior, midnightFactor),
    leaderboardPlace: Math.floor(Math.random() * 10000) + 100 // TODO: Calculate real ranking
  };
}

function calculateDepositVelocity(transactions) {
  if (transactions.length < 2) return 0;

  // Group transactions into sessions (gaps > 2 hours = new session)
  const sessions = [];
  let currentSession = [transactions[0]];

  for (let i = 1; i < transactions.length; i++) {
    const gap = (transactions[i].timestamp - transactions[i-1].timestamp) / (1000 * 60 * 60);
    if (gap > 2) {
      sessions.push(currentSession);
      currentSession = [transactions[i]];
    } else {
      currentSession.push(transactions[i]);
    }
  }
  sessions.push(currentSession);

  // Calculate average txns per hour during sessions
  const velocities = sessions
    .filter(s => s.length > 1)
    .map(session => {
      const duration = (session[session.length - 1].timestamp - session[0].timestamp) / (1000 * 60 * 60);
      return duration > 0 ? session.length / duration : session.length;
    });

  return velocities.length > 0 
    ? parseFloat((velocities.reduce((a, b) => a + b, 0) / velocities.length).toFixed(1))
    : parseFloat((transactions.length / 24).toFixed(1));
}

function calculateMidnightFactor(transactions) {
  const midnightTxs = transactions.filter(tx => isMidnightHour(tx.timestamp));
  return Math.round((midnightTxs.length / transactions.length) * 100);
}

function isMidnightHour(date) {
  const hour = date.getUTCHours();
  return hour >= 0 && hour < 5;
}

function calculateChaseBehavior(transactions) {
  if (transactions.length < 2) return 0;

  let chaseCount = 0;
  for (let i = 1; i < transactions.length; i++) {
    const gap = (transactions[i].timestamp - transactions[i-1].timestamp) / (1000 * 60);
    if (gap <= 60) { // Within 1 hour
      chaseCount++;
    }
  }

  return Math.round((chaseCount / (transactions.length - 1)) * 100);
}

function calculateSessionStats(transactions) {
  if (transactions.length < 2) {
    return { avgSessionLength: 0, longestSession: 0, avgTimeBetweenDeposits: 0 };
  }

  // Group into sessions (2 hour gap threshold)
  const sessions = [];
  let currentSession = [transactions[0]];

  for (let i = 1; i < transactions.length; i++) {
    const gap = (transactions[i].timestamp - transactions[i-1].timestamp) / (1000 * 60 * 60);
    if (gap > 2) {
      sessions.push(currentSession);
      currentSession = [transactions[i]];
          } else {
      currentSession.push(transactions[i]);
    }
  }
  sessions.push(currentSession);

  // Calculate session lengths
  const sessionLengths = sessions.map(s => {
    if (s.length < 2) return 0;
    return (s[s.length - 1].timestamp - s[0].timestamp) / (1000 * 60 * 60);
  });

  const avgSessionLength = sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
  const longestSession = Math.max(...sessionLengths);

  // Average time between deposits (in minutes)
  let totalGap = 0;
  for (let i = 1; i < transactions.length; i++) {
    totalGap += (transactions[i].timestamp - transactions[i-1].timestamp) / (1000 * 60);
  }
  const avgTimeBetweenDeposits = totalGap / (transactions.length - 1);

  return {
    avgSessionLength: parseFloat(avgSessionLength.toFixed(1)),
    longestSession: parseFloat(longestSession.toFixed(1)),
    avgTimeBetweenDeposits: parseFloat(avgTimeBetweenDeposits.toFixed(1))
  };
}

function calculateLongestStreak(transactions) {
  if (transactions.length < 2) {
    return { count: transactions.length, timespan: '0 min' };
  }

  let maxStreak = 1;
  let maxStreakStart = 0;
  let maxStreakEnd = 0;
  let currentStreak = 1;
  let streakStart = 0;

  for (let i = 1; i < transactions.length; i++) {
    const gap = (transactions[i].timestamp - transactions[i-1].timestamp) / (1000 * 60);
    if (gap <= 60) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        maxStreakStart = streakStart;
        maxStreakEnd = i;
      }
    } else {
      currentStreak = 1;
      streakStart = i;
    }
  }

  // Calculate timespan
  const duration = (transactions[maxStreakEnd].timestamp - transactions[maxStreakStart].timestamp) / (1000 * 60);
  let timespan;
  if (duration < 60) {
    timespan = `${Math.round(duration)} min`;
  } else {
    timespan = `${(duration / 60).toFixed(1)} hours`;
  }

  return { count: maxStreak, timespan };
}

function calculateMonthlyDeposits(transactions) {
  const months = {};
  const now = new Date();

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.toLocaleString('en', { month: 'short' })} ${String(date.getFullYear()).slice(2)}`;
    months[key] = 0;
  }

  // Sum deposits by month
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp);
    const key = `${date.toLocaleString('en', { month: 'short' })} ${String(date.getFullYear()).slice(2)}`;
    if (months.hasOwnProperty(key)) {
      months[key] += (tx.valueUSD || tx.value * 3300);
    }
  });

  return Object.entries(months).map(([month, amount]) => ({
    month,
    amount: Math.round(amount)
  }));
}

// ============================================
// RISK SCORE CALCULATION
// ============================================

function calculateRiskScore(metrics) {
  let score = 0;

  // Deposit velocity (0-25 points)
  const velocityScore = Math.min(25, (metrics.depositVelocity.rate / 10) * 25);
  score += velocityScore;

  // Midnight factor (0-20 points)
  const midnightScore = Math.min(20, (metrics.midnightFactor.percentage / 50) * 20);
  score += midnightScore;

  // Chase behavior (0-25 points)
  const chaseScore = Math.min(25, (metrics.chaseBehavior.percentage / 80) * 25);
  score += chaseScore;

  // Session length (0-15 points)
  const sessionScore = Math.min(15, (metrics.sessionLength.avgHours / 4) * 15);
  score += sessionScore;

  // Streak behavior (0-15 points)
  const streakScore = Math.min(15, (metrics.longestStreak.deposits / 15) * 15);
  score += streakScore;

  return Math.round(Math.min(100, score));
}

function getStatusAndType(riskScore) {
  if (riskScore >= 70) {
    return { status: 'CRITICAL', gamblerType: 'The Compulsive Chaser' };
  }
  if (riskScore >= 40) {
    return { status: 'WARNING', gamblerType: 'The Weekend Warrior' };
  }
  return { status: 'OPTIMAL', gamblerType: 'The Disciplined Player' };
}

function getPrimaryPattern(velocity, chase, midnight) {
  if (chase > 70) return 'Loss Chasing';
  if (velocity > 8) return 'Panic Depositing';
  if (midnight > 50) return 'Night Owl Betting';
  if (velocity > 4) return 'Irregular Sessions';
  return 'Controlled Betting';
}

// ============================================
// DESCRIPTION GENERATORS
// ============================================

function getVelocityDescription(rate) {
  if (rate > 8) return `Your deposit frequency is ${(rate / 2).toFixed(1)}x higher than average. This indicates panic-depositing behavior.`;
  if (rate > 4) return `Your deposit frequency is ${(rate / 2).toFixed(1)}x higher than average. Moderate risk detected.`;
  return 'Your deposit frequency is within normal range. Healthy gambling pattern.';
}

function getMidnightDescription(percentage) {
  if (percentage > 50) return `${percentage}% of your transactions occur between midnight and 5 AM. This correlates strongly with impulsive gambling.`;
  if (percentage > 25) return `${percentage}% of transactions occur late night. This is above average but not critical.`;
  return `Only ${percentage}% late-night activity. Good decision-making patterns.`;
}

function getChaseDescription(percentage) {
  if (percentage > 70) return `${percentage}% of deposits occur within an hour of a previous deposit, suggesting aggressive loss-chasing.`;
  if (percentage > 40) return `${percentage}% of deposits show chase patterns. Room for improvement.`;
  return 'Minimal chase behavior. You take time between deposits.';
}

function getSessionDescription(avgHours) {
  if (avgHours > 4) return `Your average gambling session lasts ${avgHours} hours. Consider setting time limits.`;
  if (avgHours > 2) return `Your average session is ${avgHours} hours. Moderate, but watch for escalation.`;
  return 'Short, controlled sessions. Excellent discipline.';
}

function getBiggestBetDescription(amountUSD, avgDeposit) {
  const ratio = avgDeposit > 0 ? amountUSD / avgDeposit : 1;
  if (ratio > 5) return `Your largest deposit was $${amountUSD.toLocaleString()}. This is ${ratio.toFixed(0)}x your average deposit size.`;
  return `Your largest deposit is within healthy limits relative to your activity.`;
}

function getStreakDescription(count) {
  if (count > 10) return `${count} consecutive deposits in a session. This is a clear tilt pattern.`;
  if (count > 5) return `${count} deposits in a session. Occasional tilt behavior detected.`;
  return `Maximum ${count} deposits in a session. No tilt patterns detected.`;
}

function getCasinoUrl(name) {
  const urls = {
    'Stake': 'https://stake.com',
    'Rollbit': 'https://rollbit.com',
    'Duel': 'https://duel.win',
    'Roobet': 'https://roobet.com',
    'Gamdom': 'https://gamdom.com',
    'Duelbits': 'https://duelbits.com',
    '500 Casino': 'https://500.casino',
    'Shuffle': 'https://shuffle.com',
    'Rainbet': 'https://rainbet.com',
    'BC.Game': 'https://bc.game'
  };
  return urls[name] || '#';
}

function getEmptyMetrics() {
  return {
    totalDeposits: 0,
    totalVolumeETH: 0,
    totalVolumeUSD: 0,
    avgDepositValue: 0,
    firstDeposit: null,
    lastDeposit: null,
    activeDays: 0,
    favoriteCasino: { name: 'None', url: '#' },
    depositVelocity: { rate: 0, safeBaseline: 2.0, unit: 'txns/hour', description: '' },
    midnightFactor: { percentage: 0, transactions: 0, totalTransactions: 0, description: '' },
    chaseBehavior: { percentage: 0, avgResponseTime: 0, description: '' },
    sessionLength: { avgHours: 0, longestSession: 0, description: '' },
    biggestBet: { amount: 0, amountUSD: 0, description: '' },
    longestStreak: { deposits: 0, timespan: '0 min', description: '' },
    analytics: {
      totalDeposits: 0,
      avgDepositValue: 0,
      firstDeposit: null,
      lastDeposit: null,
      activeDays: 0,
      depositsByCrypto: [],
      depositsByCasino: [],
      monthlyDeposits: []
    },
    financialImpact: { totalETH: 0, totalUSD: 0, totalSOL: 0 },
    primaryPattern: 'No Activity',
    leaderboardPlace: 0
  };
}

// ============================================
// CACHING
// ============================================

async function getCachedWallet(address) {
  const { data } = await supabase
    .from('wallets')
    .select('*')
    .eq('address', address)
    .single();
  return data;
}

function isRecentScan(lastScanned) {
  if (!lastScanned) return false;
  const scanTime = new Date(lastScanned).getTime();
  return Date.now() - scanTime < CACHE_DURATION;
}

async function cacheWalletReport(address, chain, report) {
  const { error } = await supabase
    .from('wallets')
    .upsert({
      address,
      chain,
      risk_score: report.riskScore,
      status: report.status,
      gambler_type: report.gamblerType,
      total_deposits: report.totalDeposits,
      total_volume_usd: report.totalVolumeUSD,
      total_volume_eth: report.totalVolumeETH,
      favorite_casino: report.favoriteCasino?.name,
      first_deposit: report.firstDeposit,
      last_deposit: report.lastDeposit,
      active_days: report.activeDays,
      deposit_velocity: report.depositVelocity?.rate,
      midnight_factor: report.midnightFactor?.percentage,
      chase_behavior: report.chaseBehavior?.percentage,
      avg_session_hours: report.sessionLength?.avgHours,
      biggest_deposit_eth: report.biggestBet?.amount,
      biggest_deposit_usd: report.biggestBet?.amountUSD,
      longest_streak: report.longestStreak?.deposits,
      data: report.analytics,
      last_scanned: new Date().toISOString(),
      scan_count: 1
    }, {
      onConflict: 'address'
    });

  if (error) {
    console.error('Cache error:', error);
  }
}

function formatWalletResponse(cached) {
  return {
    address: cached.address,
    chain: cached.chain,
    riskScore: cached.risk_score,
    status: cached.status,
    gamblerType: cached.gambler_type,
    totalDeposits: cached.total_deposits,
    totalVolumeUSD: cached.total_volume_usd,
    totalVolumeETH: cached.total_volume_eth,
    favoriteCasino: {
      name: cached.favorite_casino,
      url: getCasinoUrl(cached.favorite_casino)
    },
    firstDeposit: cached.first_deposit,
    lastDeposit: cached.last_deposit,
    activeDays: cached.active_days,
    depositVelocity: {
      rate: cached.deposit_velocity,
      safeBaseline: 2.0,
      unit: 'txns/hour',
      description: getVelocityDescription(cached.deposit_velocity)
    },
    midnightFactor: {
      percentage: cached.midnight_factor,
      transactions: 0,
      totalTransactions: cached.total_deposits,
      description: getMidnightDescription(cached.midnight_factor)
    },
    chaseBehavior: {
      percentage: cached.chase_behavior,
      avgResponseTime: 0,
      description: getChaseDescription(cached.chase_behavior)
    },
    sessionLength: {
      avgHours: cached.avg_session_hours,
      longestSession: 0,
      description: getSessionDescription(cached.avg_session_hours)
    },
    biggestBet: {
      amount: cached.biggest_deposit_eth,
      amountUSD: cached.biggest_deposit_usd,
      description: ''
    },
    longestStreak: {
      deposits: cached.longest_streak,
      timespan: '',
      description: getStreakDescription(cached.longest_streak)
    },
    analytics: cached.data,
    financialImpact: {
      totalETH: cached.total_volume_eth,
      totalUSD: cached.total_volume_usd,
      totalSOL: 0
    },
    primaryPattern: getPrimaryPattern(cached.deposit_velocity, cached.chase_behavior, cached.midnight_factor),
    leaderboardPlace: Math.floor(Math.random() * 10000) + 100
  };
}
