'use client';

import { useState } from 'react';
import { Search, Clock, DollarSign, Activity, Share2, Wallet, Trophy, Target, Flame, Timer, ExternalLink, ChevronRight, TrendingUp, TrendingDown, BarChart3, PieChart, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Twitter/X Icon
const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Discord Icon
const DiscordIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

// Demo wallet data with different risk levels
const DEMO_WALLETS = {
  critical: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    riskScore: 87,
    status: 'CRITICAL',
    gamblerType: 'The Compulsive Chaser',
    favoriteCasino: { name: 'Stake', url: 'https://stake.com' },
    primaryPattern: 'Loss Chasing',
    leaderboardPlace: 142,
    depositVelocity: {
      rate: 12.4,
      safeBaseline: 2.0,
      unit: 'txns/hour',
      description: 'Your deposit frequency is 6.2x higher than average. This indicates panic-depositing behavior.'
    },
    midnightFactor: {
      percentage: 68,
      transactions: 142,
      totalTransactions: 209,
      description: '68% of your transactions occur between midnight and 5 AM. This correlates strongly with impulsive gambling.'
    },
    chaseBehavior: {
      percentage: 92,
      avgResponseTime: 3.2,
      description: '92% of deposits occur within minutes of a previous deposit, suggesting aggressive loss-chasing.'
    },
    sessionLength: {
      avgHours: 4.2,
      longestSession: 11.5,
      description: 'Your average gambling session lasts 4.2 hours. Your longest was 11.5 hours straight.'
    },
    biggestBet: {
      amount: 2.4,
      amountUSD: 7920,
      description: 'Your largest single deposit was 2.4 ETH ($7,920). This is 8x your average bet size.'
    },
    longestStreak: {
      deposits: 23,
      timespan: '4 hours',
      description: '23 consecutive deposits in 4 hours. This is a clear tilt pattern.'
    },
    financialImpact: {
      totalETH: 24.567,
      totalUSD: 81071,
      totalSOL: 0
    },
    chain: 'ETH',
    // Analytics data for the new analytics view
    analytics: {
      totalDeposits: 209,
      avgDepositValue: 388,
      firstDeposit: '2024-03-15',
      lastDeposit: '2026-01-05',
      activeDays: 142,
      depositsByCrypto: [
        { crypto: 'ETH', amount: 24.567, usd: 81071, percentage: 85 },
        { crypto: 'USDT', amount: 3200, usd: 3200, percentage: 10 },
        { crypto: 'USDC', amount: 1600, usd: 1600, percentage: 5 }
      ],
      depositsByCasino: [
        { casino: 'Stake', amount: 58400, percentage: 68 },
        { casino: 'Rollbit', amount: 15200, percentage: 18 },
        { casino: 'Shuffle', amount: 8500, percentage: 10 },
        { casino: 'Duel', amount: 3400, percentage: 4 }
      ],
      monthlyDeposits: [
        { month: 'Feb 25', amount: 4200 },
        { month: 'Mar 25', amount: 5800 },
        { month: 'Apr 25', amount: 3200 },
        { month: 'May 25', amount: 7100 },
        { month: 'Jun 25', amount: 8400 },
        { month: 'Jul 25', amount: 6200 },
        { month: 'Aug 25', amount: 9100 },
        { month: 'Sep 25', amount: 7800 },
        { month: 'Oct 25', amount: 11200 },
        { month: 'Nov 25', amount: 8900 },
        { month: 'Dec 25', amount: 12400 },
        { month: 'Jan 26', amount: 6771 }
      ]
    }
  },
  warning: {
    address: '0x8ba1f109551bD432803012645Hac136c22C929C',
    riskScore: 54,
    status: 'WARNING',
    gamblerType: 'The Weekend Warrior',
    favoriteCasino: { name: 'Rollbit', url: 'https://rollbit.com' },
    primaryPattern: 'Irregular Sessions',
    leaderboardPlace: 1247,
    depositVelocity: {
      rate: 4.2,
      safeBaseline: 2.0,
      unit: 'txns/hour',
      description: 'Your deposit frequency is 2.1x higher than average. Moderate risk detected.'
    },
    midnightFactor: {
      percentage: 38,
      transactions: 23,
      totalTransactions: 61,
      description: '38% of transactions occur late night. This is above average but not critical.'
    },
    chaseBehavior: {
      percentage: 45,
      avgResponseTime: 12.4,
      description: '45% of deposits show chase patterns. Room for improvement.'
    },
    sessionLength: {
      avgHours: 2.1,
      longestSession: 5.5,
      description: 'Your average session is 2.1 hours. Moderate, but watch for escalation.'
    },
    biggestBet: {
      amount: 0.8,
      amountUSD: 2640,
      description: 'Your largest deposit was 0.8 ETH ($2,640). Within reasonable limits.'
    },
    longestStreak: {
      deposits: 8,
      timespan: '2 hours',
      description: '8 deposits in 2 hours. Occasional tilt behavior detected.'
    },
    financialImpact: {
      totalETH: 8.234,
      totalUSD: 27172,
      totalSOL: 0
    },
    chain: 'ETH',
    analytics: {
      totalDeposits: 61,
      avgDepositValue: 445,
      firstDeposit: '2024-08-22',
      lastDeposit: '2026-01-03',
      activeDays: 38,
      depositsByCrypto: [
        { crypto: 'ETH', amount: 8.234, usd: 27172, percentage: 92 },
        { crypto: 'SOL', amount: 12.5, usd: 2200, percentage: 8 }
      ],
      depositsByCasino: [
        { casino: 'Rollbit', amount: 18200, percentage: 62 },
        { casino: 'Stake', amount: 8100, percentage: 28 },
        { casino: 'Duel', amount: 2900, percentage: 10 }
      ],
      monthlyDeposits: [
        { month: 'Feb 25', amount: 1200 },
        { month: 'Mar 25', amount: 2100 },
        { month: 'Apr 25', amount: 1800 },
        { month: 'May 25', amount: 2400 },
        { month: 'Jun 25', amount: 1900 },
        { month: 'Jul 25', amount: 3200 },
        { month: 'Aug 25', amount: 2800 },
        { month: 'Sep 25', amount: 2100 },
        { month: 'Oct 25', amount: 3400 },
        { month: 'Nov 25', amount: 2900 },
        { month: 'Dec 25', amount: 2100 },
        { month: 'Jan 26', amount: 1252 }
      ]
    }
  },
  optimal: {
    address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    riskScore: 18,
    status: 'OPTIMAL',
    gamblerType: 'The Disciplined Player',
    favoriteCasino: { name: 'Duel', url: 'https://duel.win' },
    primaryPattern: 'Controlled Betting',
    leaderboardPlace: 8934,
    depositVelocity: {
      rate: 1.1,
      safeBaseline: 2.0,
      unit: 'txns/hour',
      description: 'Your deposit frequency is below average. Healthy gambling pattern.'
    },
    midnightFactor: {
      percentage: 12,
      transactions: 3,
      totalTransactions: 25,
      description: 'Only 12% late-night activity. Good decision-making patterns.'
    },
    chaseBehavior: {
      percentage: 8,
      avgResponseTime: 48.2,
      description: 'Minimal chase behavior. You take time between deposits.'
    },
    sessionLength: {
      avgHours: 0.8,
      longestSession: 2.0,
      description: 'Short, controlled sessions. Excellent discipline.'
    },
    biggestBet: {
      amount: 0.3,
      amountUSD: 990,
      description: 'Your largest bet is within healthy limits relative to your activity.'
    },
    longestStreak: {
      deposits: 3,
      timespan: '45 min',
      description: 'Maximum 3 deposits in a session. No tilt patterns detected.'
    },
    financialImpact: {
      totalETH: 2.145,
      totalUSD: 7079,
      totalSOL: 0
    },
    chain: 'ETH',
    analytics: {
      totalDeposits: 25,
      avgDepositValue: 283,
      firstDeposit: '2025-06-10',
      lastDeposit: '2025-12-28',
      activeDays: 18,
      depositsByCrypto: [
        { crypto: 'ETH', amount: 2.145, usd: 7079, percentage: 100 }
      ],
      depositsByCasino: [
        { casino: 'Duel', amount: 5200, percentage: 73 },
        { casino: 'Shuffle', amount: 1879, percentage: 27 }
      ],
      monthlyDeposits: [
        { month: 'Feb 25', amount: 0 },
        { month: 'Mar 25', amount: 0 },
        { month: 'Apr 25', amount: 0 },
        { month: 'May 25', amount: 0 },
        { month: 'Jun 25', amount: 800 },
        { month: 'Jul 25', amount: 1200 },
        { month: 'Aug 25', amount: 900 },
        { month: 'Sep 25', amount: 1100 },
        { month: 'Oct 25', amount: 1400 },
        { month: 'Nov 25', amount: 1000 },
        { month: 'Dec 25', amount: 679 },
        { month: 'Jan 26', amount: 0 }
      ]
    }
  }
};

// Demo platform data for Platforms tab
const PLATFORM_DATA = {
  weekTotals: {
    totalVolume: 805172000,
    totalDeposits: 1276060,
    newDepositors: 24350
  },
  topGainers: [
    { name: 'Duel', change: 35200000, percentChange: 117.3, from: 30000000, to: 65200000 },
    { name: 'Chips.gg', change: 1080000, percentChange: 101.9, from: 1060000, to: 2140000 },
    { name: 'Yolo.com', change: 3420000, percentChange: 65.5, from: 5220000, to: 8640000 },
    { name: 'Yeet', change: 3140000, percentChange: 56.9, from: 5520000, to: 8660000 },
    { name: 'Rollbit', change: 6000000, percentChange: 54.5, from: 11000000, to: 17000000 }
  ],
  topDeclines: [
    { name: 'BC.Game', change: -13690000, percentChange: -68.5, from: 20000000, to: 6310000 },
    { name: 'Whale.io', change: -2700000, percentChange: -54.9, from: 4950000, to: 2230000 },
    { name: 'StakeUS', change: -11400000, percentChange: -43.5, from: 26200000, to: 14800000 },
    { name: '500 Casino', change: -3700000, percentChange: -36.8, from: 10000000, to: 6300000 },
    { name: 'Stake', change: -184000000, percentChange: -29.4, from: 625000000, to: 441000000 }
  ],
  casinos: [
    { name: 'Stake', volume: 441000000, marketShare: 54.8, deposits: 666000, color: '#22c55e' },
    { name: 'Duel', volume: 65200000, marketShare: 8.1, deposits: 89000, color: '#f97316' },
    { name: 'Shuffle', volume: 40000000, marketShare: 5.0, deposits: 108000, color: '#ec4899' },
    { name: 'Gamdom', volume: 36800000, marketShare: 4.6, deposits: 28500, color: '#eab308' },
    { name: 'Rainbet', volume: 33900000, marketShare: 4.2, deposits: 157000, color: '#06b6d4' },
    { name: 'Roobet', volume: 93400000, marketShare: 11.6, deposits: 142000, color: '#8b5cf6' },
    { name: 'Rollbit', volume: 17000000, marketShare: 2.1, deposits: 36300, color: '#ef4444' },
    { name: 'StakeUS', volume: 14800000, marketShare: 1.8, deposits: 62600, color: '#f472b6' },
    { name: 'Yeet', volume: 8660000, marketShare: 1.1, deposits: 12400, color: '#fbbf24' },
    { name: 'BC.Game', volume: 6310000, marketShare: 0.8, deposits: 24000, color: '#3b82f6' }
  ],
  // Weekly trend data for chart
  weeklyTrends: [
    { week: 'Oct 20', stake: 580, duel: 28, shuffle: 38, roobet: 95, gamdom: 42 },
    { week: 'Oct 27', stake: 560, duel: 30, shuffle: 40, roobet: 98, gamdom: 44 },
    { week: 'Nov 3', stake: 590, duel: 32, shuffle: 42, roobet: 102, gamdom: 45 },
    { week: 'Nov 10', stake: 620, duel: 35, shuffle: 44, roobet: 105, gamdom: 46 },
    { week: 'Nov 17', stake: 650, duel: 38, shuffle: 45, roobet: 108, gamdom: 47 },
    { week: 'Nov 24', stake: 680, duel: 42, shuffle: 43, roobet: 110, gamdom: 48 },
    { week: 'Dec 1', stake: 625, duel: 30, shuffle: 44, roobet: 111, gamdom: 47 },
    { week: 'Dec 8', stake: 600, duel: 32, shuffle: 42, roobet: 108, gamdom: 45 },
    { week: 'Dec 15', stake: 580, duel: 35, shuffle: 40, roobet: 105, gamdom: 44 },
    { week: 'Dec 22', stake: 720, duel: 45, shuffle: 42, roobet: 100, gamdom: 46 },
    { week: 'Dec 29', stake: 625, duel: 30, shuffle: 40, roobet: 93, gamdom: 47 },
    { week: 'Jan 5', stake: 441, duel: 65, shuffle: 40, roobet: 93, gamdom: 37 }
  ]
};

// Loading checklist items
const LOADING_CHECKS = [
  'Connecting to Mainnet...',
  'Querying Known Casino Hot Wallets (Stake, Rollbit, Duel)...',
  'Analyzing Timestamp Patterns...',
  'Calculating Risk Velocity...',
  'Generating Behavioral Diagnosis...'
];

// Helper function to parse multiple addresses
const parseAddresses = (input) => {
  return input
    .split(/[,\n]/)
    .map(addr => addr.trim())
    .filter(addr => addr.length > 0);
};

// Helper function to aggregate results from multiple wallets
const aggregateResults = (walletResults) => {
  if (walletResults.length === 0) return null;
  if (walletResults.length === 1) return walletResults[0];

  const totalRiskScore = walletResults.reduce((sum, w) => sum + w.riskScore, 0) / walletResults.length;
  const totalETH = walletResults.reduce((sum, w) => sum + w.financialImpact.totalETH, 0);
  const totalUSD = walletResults.reduce((sum, w) => sum + w.financialImpact.totalUSD, 0);
  const totalTransactions = walletResults.reduce((sum, w) => sum + w.midnightFactor.totalTransactions, 0);
  const totalMidnightTxns = walletResults.reduce((sum, w) => sum + w.midnightFactor.transactions, 0);
  const avgDepositVelocity = walletResults.reduce((sum, w) => sum + w.depositVelocity.rate, 0) / walletResults.length;

  let status = 'OPTIMAL';
  let gamblerType = 'The Disciplined Player';
  if (totalRiskScore >= 70) { status = 'CRITICAL'; gamblerType = 'The Compulsive Chaser'; }
  else if (totalRiskScore >= 40) { status = 'WARNING'; gamblerType = 'The Weekend Warrior'; }

  return {
    addresses: walletResults.map(w => w.address),
    isMultiple: true,
    riskScore: Math.round(totalRiskScore),
    status,
    gamblerType,
    favoriteCasino: walletResults[0].favoriteCasino,
    primaryPattern: walletResults[0].primaryPattern,
    leaderboardPlace: Math.min(...walletResults.map(w => w.leaderboardPlace)),
    depositVelocity: {
      rate: parseFloat(avgDepositVelocity.toFixed(1)),
      safeBaseline: 2.0,
      unit: 'txns/hour',
      description: `Combined analysis of ${walletResults.length} wallets shows ${avgDepositVelocity > 5 ? 'high' : 'moderate'} deposit velocity.`
    },
    midnightFactor: {
      percentage: Math.round((totalMidnightTxns / totalTransactions) * 100),
      transactions: totalMidnightTxns,
      totalTransactions,
      description: `${Math.round((totalMidnightTxns / totalTransactions) * 100)}% of combined transactions occur late night.`
    },
    chaseBehavior: walletResults[0].chaseBehavior,
    sessionLength: walletResults[0].sessionLength,
    biggestBet: walletResults.reduce((max, w) => w.biggestBet.amount > max.amount ? w.biggestBet : max, walletResults[0].biggestBet),
    longestStreak: walletResults.reduce((max, w) => w.longestStreak.deposits > max.deposits ? w.longestStreak : max, walletResults[0].longestStreak),
    financialImpact: {
      totalETH: parseFloat(totalETH.toFixed(3)),
      totalUSD: Math.round(totalUSD),
      totalSOL: 0
    },
    chain: walletResults[0].chain,
    analytics: walletResults[0].analytics
  };
};

// Simple line chart component
const SimpleLineChart = ({ data, dataKey, color, height = 120 }) => {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  const minValue = Math.min(...data.map(d => d[dataKey]));
  const range = maxValue - minValue || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d[dataKey] - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default function GamStart() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [expandedMetric, setExpandedMetric] = useState(null);
  const [activeTab, setActiveTab] = useState('players');
  const [walletType, setWalletType] = useState('personal'); // 'personal' or 'proxy'
  const [reportView, setReportView] = useState('traits'); // 'traits' or 'analytics'
  const [selectedMetric, setSelectedMetric] = useState('volume');
  const [selectedTimeRange, setSelectedTimeRange] = useState('12w');
  const [selectedCasinos, setSelectedCasinos] = useState(['Stake', 'Duel', 'Roobet', 'Shuffle', 'Gamdom']);

  const handleScan = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    setLoadingStep(0);
    setResults(null);

    const addresses = parseAddresses(address);
    if (addresses.length === 0) {
        setLoading(false);
      return;
    }

    for (let i = 0; i < LOADING_CHECKS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingStep(i + 1);
    }

    const walletResults = addresses.map(addr => {
      const addrLower = addr.toLowerCase();
      let demoData;
      
      if (addrLower.includes('critical') || addrLower.includes('87')) {
        demoData = { ...DEMO_WALLETS.critical };
      } else if (addrLower.includes('warning') || addrLower.includes('54')) {
        demoData = { ...DEMO_WALLETS.warning };
      } else if (addrLower.includes('optimal') || addrLower.includes('18')) {
        demoData = { ...DEMO_WALLETS.optimal };
      } else {
        demoData = { ...DEMO_WALLETS.critical };
      }

      demoData.address = addr;
      demoData.chain = addr.startsWith('0x') ? 'ETH' : 'SOL';
      return demoData;
    });

    const finalResults = aggregateResults(walletResults);

    await new Promise(resolve => setTimeout(resolve, 500));
    setResults(finalResults);
        setLoading(false);
    setLoadingStep(0);
  };

  const handleShare = () => {
    if (!results) return;
    const shareText = `🎰 GamStart Report\n\nRisk Score: ${results.riskScore}/100\nType: ${results.gamblerType}\nStatus: ${results.status}\n\nCheck your gambling behavior: gamstart.vercel.app`;
    
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {
        navigator.clipboard.writeText(shareText);
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num}`;
  };

  const getAccentColor = (score) => {
    if (score >= 70) return '#ef4444';
    if (score >= 40) return '#eab308';
    return '#22c55e';
  };

  const getTraitStyle = (score) => {
    if (score >= 70) return {
      bg: 'bg-[#1a1a2e]',
      border: 'border-red-500/20',
      borderHover: 'hover:border-red-500/40',
      ring: 'ring-red-500/50',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400/80',
      labelColor: 'text-red-300/80',
      divider: 'border-red-500/20'
    };
    if (score >= 40) return {
      bg: 'bg-[#1a1a2e]',
      border: 'border-yellow-500/20',
      borderHover: 'hover:border-yellow-500/40',
      ring: 'ring-yellow-500/50',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400/80',
      labelColor: 'text-yellow-300/80',
      divider: 'border-yellow-500/20'
    };
    return {
      bg: 'bg-[#1a1a2e]',
      border: 'border-green-500/20',
      borderHover: 'hover:border-green-500/40',
      ring: 'ring-green-500/50',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-400/80',
      labelColor: 'text-green-300/80',
      divider: 'border-green-500/20'
    };
  };

  const traitStyle = results ? getTraitStyle(results.riskScore) : null;

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => { setResults(null); setAddress(''); setExpandedMetric(null); setReportView('traits'); }}
                className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity"
              >
                <span className="text-purple-500">◈</span>
                GamStart
              </button>
              
              <div className="flex items-center bg-[#1a1a2e] rounded-lg p-0.5">
                <button
                  onClick={() => { setActiveTab('players'); setResults(null); setAddress(''); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'players'
                      ? 'bg-[#2a2a3e] text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Players
                </button>
                <button
                  onClick={() => { setActiveTab('platforms'); setResults(null); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'platforms'
                      ? 'bg-[#2a2a3e] text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Platforms
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                <TwitterIcon size={18} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                <DiscordIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* PLATFORMS TAB */}
        {activeTab === 'platforms' && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <BarChart3 className="text-purple-400" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Casino Analytics</h1>
                  <p className="text-sm text-gray-500">Weekly deposit volume and market trends</p>
                </div>
              </div>
            </div>

            {/* Week Totals - Horizontal cards with purple accent */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <DollarSign className="text-purple-400" size={18} />
                  </div>
            <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Weekly Volume</div>
                    <div className="text-xl font-bold text-white">{formatNumber(PLATFORM_DATA.weekTotals.totalVolume)}</div>
            </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Activity className="text-purple-400" size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Total Deposits</div>
                    <div className="text-xl font-bold text-white">{PLATFORM_DATA.weekTotals.totalDeposits.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Users className="text-purple-400" size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">New Depositors</div>
                    <div className="text-xl font-bold text-white">{PLATFORM_DATA.weekTotals.newDepositors.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls - Compact inline design */}
            <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Metric Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide whitespace-nowrap">Metric:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['volume', 'marketShare', 'deposits', 'newDepositors'].map((metric) => (
              <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          selectedMetric === metric
                            ? 'bg-purple-500 text-white'
                            : 'bg-[#1a1a2e] text-gray-400 hover:text-white hover:bg-[#252540]'
                        }`}
                      >
                        {metric === 'volume' ? 'Volume' : 
                         metric === 'marketShare' ? 'Share' :
                         metric === 'deposits' ? 'Deposits' : 'New Users'}
              </button>
                    ))}
                  </div>
          </div>

                <div className="hidden lg:block w-px h-6 bg-gray-700" />

                {/* Time Range */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide whitespace-nowrap">Range:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: '4w', label: '4W' },
                      { value: '12w', label: '12W' },
                      { value: '24w', label: '24W' },
                      { value: '52w', label: '1Y' }
                    ].map((range) => (
              <button 
                        key={range.value}
                        onClick={() => setSelectedTimeRange(range.value)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          selectedTimeRange === range.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-[#1a1a2e] text-gray-400 hover:text-white hover:bg-[#252540]'
                        }`}
                      >
                        {range.label}
              </button>
                    ))}
                  </div>
            </div>
          </div>

              {/* Casino Selection */}
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Casino Selection</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCasinos(['Stake', 'Duel', 'Roobet', 'Shuffle', 'Gamdom'])}
                      className="px-2 py-1 text-[10px] bg-[#1a1a2e] text-gray-400 hover:text-white rounded transition-colors"
                    >
                      Top 5
                    </button>
                    <button
                      onClick={() => setSelectedCasinos(PLATFORM_DATA.casinos.map(c => c.name))}
                      className="px-2 py-1 text-[10px] bg-[#1a1a2e] text-gray-400 hover:text-white rounded transition-colors"
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedCasinos([])}
                      className="px-2 py-1 text-[10px] bg-[#1a1a2e] text-gray-400 hover:text-white rounded transition-colors"
                    >
                      Clear
                    </button>
            </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PLATFORM_DATA.casinos.map((casino) => (
                    <button
                      key={casino.name}
                      onClick={() => {
                        if (selectedCasinos.includes(casino.name)) {
                          setSelectedCasinos(selectedCasinos.filter(c => c !== casino.name));
                        } else {
                          setSelectedCasinos([...selectedCasinos, casino.name]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                        selectedCasinos.includes(casino.name)
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                          : 'bg-[#1a1a2e] text-gray-500 hover:text-gray-300 border border-transparent'
                      }`}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: selectedCasinos.includes(casino.name) ? casino.color : '#4b5563' }} 
                      />
                      {casino.name}
                    </button>
                  ))}
                </div>
              </div>
        </div>

            {/* Trend Chart - Redesigned */}
            <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-white">Volume Trends</div>
                  <div className="text-xs text-gray-500">Week over week deposit volume</div>
                </div>
                <div className="text-xs text-purple-400">Jan 5, 2026</div>
              </div>
              
              {/* Chart with gradient area */}
              <div className="h-44 relative mb-3">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] text-gray-600">
                  <span>$800M</span>
                  <span>$600M</span>
                  <span>$400M</span>
                  <span>$200M</span>
                  <span>$0</span>
                </div>
                {/* Chart area */}
                <div className="absolute left-14 right-0 top-0 bottom-0 flex items-end justify-between gap-0.5">
                  {PLATFORM_DATA.weeklyTrends.map((week, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="w-full relative">
                        <div 
                          className="w-full bg-gradient-to-t from-purple-500/60 to-purple-400/20 rounded-t transition-all group-hover:from-purple-500/80 group-hover:to-purple-400/40"
                          style={{ height: `${(week.stake / 720) * 140}px` }}
                        />
                      </div>
                      <div className="text-[8px] text-gray-600 truncate w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">{week.week}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs border-t border-gray-800/50 pt-3">
                {PLATFORM_DATA.casinos.filter(c => selectedCasinos.includes(c.name)).slice(0, 5).map((casino) => (
                  <div key={casino.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: casino.color }} />
                    <span className="text-gray-400">{casino.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gainers and Declines - Side by side compact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Top Gainers */}
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="text-green-400" size={16} />
                  <span className="text-sm font-medium text-white">Top Gainers</span>
                </div>
                <div className="space-y-2">
                  {PLATFORM_DATA.topGainers.slice(0, 4).map((casino, i) => (
                    <div key={casino.name} className="flex items-center justify-between py-1.5 border-b border-gray-800/30 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-4">{i + 1}</span>
                        <span className="text-sm text-white">{casino.name}</span>
                      </div>
                      <div className="text-sm text-green-400 font-medium">
                        +{casino.percentChange}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biggest Declines */}
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="text-red-400" size={16} />
                  <span className="text-sm font-medium text-white">Biggest Declines</span>
                </div>
                <div className="space-y-2">
                  {PLATFORM_DATA.topDeclines.slice(0, 4).map((casino, i) => (
                    <div key={casino.name} className="flex items-center justify-between py-1.5 border-b border-gray-800/30 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-4">{i + 1}</span>
                        <span className="text-sm text-white">{casino.name}</span>
                      </div>
                      <div className="text-sm text-red-400 font-medium">
                        {casino.percentChange}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Casino Leaderboard - Cleaner table */}
            <div className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800/50">
                <div className="flex items-center gap-2">
                  <Trophy className="text-purple-400" size={16} />
                  <span className="text-sm font-medium text-white">Top 10 by Volume</span>
                          </div>
                          </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-gray-500 uppercase bg-[#0f0f1a]">
                      <th className="text-left px-4 py-2 font-medium">#</th>
                      <th className="text-left px-4 py-2 font-medium">Casino</th>
                      <th className="text-right px-4 py-2 font-medium">Volume</th>
                      <th className="text-right px-4 py-2 font-medium">Share</th>
                      <th className="text-right px-4 py-2 font-medium">Deposits</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {PLATFORM_DATA.casinos.map((casino, i) => (
                      <tr key={casino.name} className="border-t border-gray-800/30 hover:bg-[#1a1a2e]/50 transition-colors">
                        <td className="px-4 py-2.5 text-gray-500 text-xs">{i + 1}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: casino.color }} />
                            <span className="text-white">{casino.name}</span>
                        </div>
                        </td>
                        <td className="px-4 py-2.5 text-right text-white font-medium">{formatNumber(casino.volume)}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-purple-400">{casino.marketShare}%</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-400">{casino.deposits.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PLAYERS TAB */}
        {activeTab === 'players' && (
          <div className={`${results ? 'max-w-5xl' : 'max-w-2xl'} mx-auto px-4 sm:px-6 lg:px-8 ${results ? 'py-8' : 'py-16'}`}>
          
            {!results && !loading && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
                <h1 className="text-4xl md:text-5xl font-semibold text-white">
                  GamStart
                </h1>
                
                <p className="text-gray-400 text-center max-w-lg leading-relaxed">
                  Scan your cryptocurrency wallet to detect patterns of<br className="hidden sm:block" />
                  compulsive gambling behavior and get your risk diagnosis.
                </p>

                {/* Wallet Type Switch */}
                <div className="flex items-center gap-3 text-sm">
                  <span className={walletType === 'personal' ? 'text-white' : 'text-gray-500'}>Personal Wallet</span>
                  <button
                    onClick={() => setWalletType(walletType === 'personal' ? 'proxy' : 'personal')}
                    className="relative w-12 h-6 bg-[#1a1a2e] rounded-full transition-colors"
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-purple-500 rounded-full transition-all ${
                        walletType === 'proxy' ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                  <span className={walletType === 'proxy' ? 'text-white' : 'text-gray-500'}>Casino Proxy</span>
                </div>

                <div className="w-full max-w-xl">
                  <div className="flex items-center bg-[#0a0a14] border border-gray-800 rounded-lg overflow-hidden focus-within:border-gray-700 transition-colors">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleScan();
                        }
                      }}
                      placeholder={walletType === 'personal' ? "Enter your ETH or SOL address..." : "Enter casino deposit address..."}
                      className="flex-1 bg-transparent px-5 py-4 text-white placeholder-gray-600 focus:outline-none"
                    />
                    <button
                      onClick={handleScan}
                      disabled={!address.trim()}
                      className="m-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Scan
                      <ChevronRight size={16} />
                    </button>
                        </div>
                  <p className="text-xs text-gray-500 mt-2 text-center h-4">
                    {walletType === 'proxy' 
                      ? 'Enter the deposit address provided by your casino (e.g., Stake, Rollbit)'
                      : 'Your personal wallet used to send funds to casinos'
                    }
                  </p>
                </div>

                <button
                  onClick={() => setAddress('demo')}
                  className="text-purple-400 hover:text-purple-300 text-sm underline underline-offset-4 transition-colors"
                >
                  I want to see how it works
                </button>
                          </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
                <h1 className="text-4xl md:text-5xl font-semibold text-white">
                  Scanning...
                </h1>
                
                <div className="w-full max-w-md space-y-3">
                  {LOADING_CHECKS.map((check, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-all duration-300 ${
                        index < loadingStep
                          ? 'text-purple-400'
                          : index === loadingStep
                          ? 'text-gray-300 animate-pulse'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        index < loadingStep
                          ? 'border-purple-500 bg-purple-500'
                          : index === loadingStep
                          ? 'border-gray-500'
                          : 'border-gray-700'
                      }`}>
                        {index < loadingStep && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results && !loading && (
              <div className="space-y-6 text-white">
                {/* Header Row */}
                        <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Wallet size={14} />
                    {results.isMultiple ? (
                      <span>{results.addresses.length} wallets scanned</span>
                    ) : (
                      <span className="font-mono">{formatAddress(results.address)}</span>
                    )}
                </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-colors text-purple-300"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
              </div>
              
                {/* Main Info Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start bg-[#12121c] rounded-2xl p-6 border border-gray-800/50">
                  <div className="flex flex-col items-center min-w-[180px]">
                    <div 
                      className="w-36 h-36 rounded-full border-4 flex items-center justify-center mb-3"
                      style={{ 
                        borderColor: getAccentColor(results.riskScore),
                        background: `radial-gradient(circle at center, ${getAccentColor(results.riskScore)}15 0%, transparent 70%)`
                      }}
                    >
                      <div className="text-center">
                        <div className="text-5xl font-bold" style={{ color: getAccentColor(results.riskScore) }}>
                          {results.riskScore}
                            </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Risk Score</div>
                          </div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-medium text-gray-200">{results.gamblerType}</div>
                      <div 
                        className="text-xs font-semibold uppercase tracking-wider mt-0.5"
                        style={{ color: getAccentColor(results.riskScore) }}
                      >
                        {results.status}
                      </div>
                    </div>
              </div>
              
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <a 
                      href={results.favoriteCasino.url}
                              target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0f0f1a] rounded-lg p-4 hover:bg-[#16162a] transition-colors group"
                    >
                      <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">Favorite Casino</div>
                      <div className="text-base font-medium text-purple-300 flex items-center gap-2 group-hover:text-purple-200">
                        {results.favoriteCasino.name}
                        <ExternalLink size={12} className="opacity-50" />
              </div>
                    </a>

                    <div className="bg-[#0f0f1a] rounded-lg p-4">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">Total Deposited</div>
                      <div className="text-base font-medium text-white">
                        ${results.financialImpact.totalUSD.toLocaleString()}
                          </div>
                      <div className="text-[11px] text-gray-600 font-mono">{results.financialImpact.totalETH} ETH</div>
                        </div>

                    <div className="bg-[#0f0f1a] rounded-lg p-4">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">Primary Pattern</div>
                      <div className="text-base font-medium" style={{ color: getAccentColor(results.riskScore) }}>{results.primaryPattern}</div>
                      </div>
                  
                    <div className="bg-[#0f0f1a] rounded-lg p-4">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">Leaderboard</div>
                      <div className="text-base font-medium text-gray-300 flex items-center gap-2">
                        <Trophy size={14} className="text-purple-400" />
                        #{results.leaderboardPlace.toLocaleString()}
                </div>
              </div>
          </div>
                    </div>

                {/* View Toggle */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {reportView === 'traits' ? 'Behavioral Analysis' : 'Detailed Analytics'}
                  </h2>
                  <div className="flex items-center bg-[#1a1a2e] rounded-lg p-0.5">
                    <button
                      onClick={() => setReportView('traits')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        reportView === 'traits'
                          ? 'bg-[#2a2a3e] text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Traits
                    </button>
                    <button
                      onClick={() => setReportView('analytics')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        reportView === 'analytics'
                          ? 'bg-[#2a2a3e] text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Analytics
                    </button>
                    </div>
                  </div>
                  
                {/* TRAITS VIEW */}
                {reportView === 'traits' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div 
                        className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'velocity' ? `ring-1 ${traitStyle.ring}` : ''}`}
                        onClick={() => setExpandedMetric(expandedMetric === 'velocity' ? null : 'velocity')}
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                              <Activity className={traitStyle.iconColor} size={16} />
                          </div>
                            <div>
                              <div className={`text-sm font-medium ${traitStyle.labelColor}`}>Deposit Velocity</div>
                              <div className="text-[10px] text-gray-500">How fast you reload</div>
                          </div>
                            <ChevronRight size={14} className={`ml-auto text-gray-600 transition-transform ${expandedMetric === 'velocity' ? 'rotate-90' : ''}`} />
                        </div>
                          <div className="text-2xl font-bold text-white">{results.depositVelocity.rate}</div>
                          <div className="text-[11px] text-gray-500">{results.depositVelocity.unit}</div>
                        </div>
                        {expandedMetric === 'velocity' && (
                          <div className={`px-4 pb-4 pt-2 border-t ${traitStyle.divider}`}>
                            <p className="text-sm text-gray-400">{results.depositVelocity.description}</p>
                          </div>
                        )}
                  </div>
                  
                      <div 
                        className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'midnight' ? `ring-1 ${traitStyle.ring}` : ''}`}
                        onClick={() => setExpandedMetric(expandedMetric === 'midnight' ? null : 'midnight')}
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                              <Clock className={traitStyle.iconColor} size={16} />
                  </div>
                            <div>
                              <div className={`text-sm font-medium ${traitStyle.labelColor}`}>Midnight Factor</div>
                              <div className="text-[10px] text-gray-500">Late night activity</div>
                            </div>
                            <ChevronRight size={14} className={`ml-auto text-gray-600 transition-transform ${expandedMetric === 'midnight' ? 'rotate-90' : ''}`} />
                          </div>
                          <div className="text-2xl font-bold text-white">{results.midnightFactor.percentage}%</div>
                          <div className="text-[11px] text-gray-500">{results.midnightFactor.transactions} of {results.midnightFactor.totalTransactions} txns</div>
                        </div>
                        {expandedMetric === 'midnight' && (
                          <div className={`px-4 pb-4 pt-2 border-t ${traitStyle.divider}`}>
                            <p className="text-sm text-gray-400">{results.midnightFactor.description}</p>
              </div>
            )}
                </div>

                      <div 
                        className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'chase' ? `ring-1 ${traitStyle.ring}` : ''}`}
                        onClick={() => setExpandedMetric(expandedMetric === 'chase' ? null : 'chase')}
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                              <Target className={traitStyle.iconColor} size={16} />
                              </div>
                            <div>
                              <div className={`text-sm font-medium ${traitStyle.labelColor}`}>Chase Behavior</div>
                              <div className="text-[10px] text-gray-500">Rapid re-deposits</div>
                              </div>
                            <ChevronRight size={14} className={`ml-auto text-gray-600 transition-transform ${expandedMetric === 'chase' ? 'rotate-90' : ''}`} />
                            </div>
                          <div className="text-2xl font-bold text-white">{results.chaseBehavior.percentage}%</div>
                          <div className="text-[11px] text-gray-500">avg {results.chaseBehavior.avgResponseTime} min response</div>
                        </div>
                        {expandedMetric === 'chase' && (
                          <div className={`px-4 pb-4 pt-2 border-t ${traitStyle.divider}`}>
                            <p className="text-sm text-gray-400">{results.chaseBehavior.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div 
                        className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'session' ? `ring-1 ${traitStyle.ring}` : ''}`}
                        onClick={() => setExpandedMetric(expandedMetric === 'session' ? null : 'session')}
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                              <Timer className={traitStyle.iconColor} size={16} />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${traitStyle.labelColor}`}>Session Length</div>
                              <div className="text-[10px] text-gray-500">Avg gambling duration</div>
                          </div>
                            <ChevronRight size={14} className={`ml-auto text-gray-600 transition-transform ${expandedMetric === 'session' ? 'rotate-90' : ''}`} />
                    </div>
                          <div className="text-2xl font-bold text-white">{results.sessionLength.avgHours}h</div>
                          <div className="text-[11px] text-gray-500">avg session</div>
                        </div>
                        {expandedMetric === 'session' && (
                          <div className={`px-4 pb-4 pt-2 border-t ${traitStyle.divider}`}>
                            <p className="text-sm text-gray-400">{results.sessionLength.description}</p>
                  </div>
                )}
                      </div>

                      <div 
                        className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'bigbet' ? `ring-1 ${traitStyle.ring}` : ''}`}
                        onClick={() => setExpandedMetric(expandedMetric === 'bigbet' ? null : 'bigbet')}
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                              <DollarSign className={traitStyle.iconColor} size={16} />
                          </div>
                            <div>
                              <div className={`text-sm font-medium ${traitStyle.labelColor}`}>Biggest Deposit</div>
                              <div className="text-[10px] text-gray-500">Largest single send</div>
                          </div>
                            <ChevronRight size={14} className={`ml-auto text-gray-600 transition-transform ${expandedMetric === 'bigbet' ? 'rotate-90' : ''}`} />
                        </div>
                          <div className="text-2xl font-bold text-white">{results.biggestBet.amount} ETH</div>
                          <div className="text-[11px] text-gray-500">${results.biggestBet.amountUSD.toLocaleString()}</div>
                    </div>
                        {expandedMetric === 'bigbet' && (
                          <div className={`px-4 pb-4 pt-2 border-t ${traitStyle.divider}`}>
                            <p className="text-sm text-gray-400">{results.biggestBet.description}</p>
                  </div>
                )}
          </div>

                      <div 
                        className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'streak' ? `ring-1 ${traitStyle.ring}` : ''}`}
                        onClick={() => setExpandedMetric(expandedMetric === 'streak' ? null : 'streak')}
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                              <Flame className={traitStyle.iconColor} size={16} />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${traitStyle.labelColor}`}>Deposit Streak</div>
                              <div className="text-[10px] text-gray-500">Consecutive deposits</div>
                          </div>
                            <ChevronRight size={14} className={`ml-auto text-gray-600 transition-transform ${expandedMetric === 'streak' ? 'rotate-90' : ''}`} />
                          </div>
                          <div className="text-2xl font-bold text-white">{results.longestStreak.deposits}</div>
                          <div className="text-[11px] text-gray-500">in {results.longestStreak.timespan}</div>
                        </div>
                        {expandedMetric === 'streak' && (
                          <div className={`px-4 pb-4 pt-2 border-t ${traitStyle.divider}`}>
                            <p className="text-sm text-gray-400">{results.longestStreak.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ANALYTICS VIEW */}
                {reportView === 'analytics' && results.analytics && (
                  <div className="space-y-4">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                        <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">Total Deposits</div>
                        <div className="text-xl font-bold text-white">{results.analytics.totalDeposits}</div>
                        <div className="text-[10px] text-gray-500">transactions</div>
                      </div>
                      <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                        <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">Avg Deposit</div>
                        <div className="text-xl font-bold text-white">${results.analytics.avgDepositValue}</div>
                        <div className="text-[10px] text-gray-500">per transaction</div>
                      </div>
                      <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                        <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">Active Days</div>
                        <div className="text-xl font-bold text-white">{results.analytics.activeDays}</div>
                        <div className="text-[10px] text-gray-500">days with deposits</div>
                      </div>
                      <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                        <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">First Deposit</div>
                        <div className="text-xl font-bold text-white">{results.analytics.firstDeposit.split('-').slice(1).join('/')}</div>
                        <div className="text-[10px] text-gray-500">{results.analytics.firstDeposit.split('-')[0]}</div>
                      </div>
                  </div>
                  
                    {/* Deposits Over Time Chart */}
                    <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">Deposits Over Time (12 Months)</div>
                      <div className="h-32 relative">
                        <SimpleLineChart 
                          data={results.analytics.monthlyDeposits} 
                          dataKey="amount" 
                          color="#8b5cf6"
                          height={128}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                        {results.analytics.monthlyDeposits.filter((_, i) => i % 3 === 0).map((d, i) => (
                          <span key={i}>{d.month}</span>
                        ))}
                  </div>
                </div>

                    {/* Breakdown Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* By Crypto */}
                      <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">Deposits by Crypto</div>
                        <div className="space-y-3">
                          {results.analytics.depositsByCrypto.map((crypto) => (
                            <div key={crypto.crypto}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-white font-medium">{crypto.crypto}</span>
                                <span className="text-gray-400">${crypto.usd.toLocaleString()} ({crypto.percentage}%)</span>
                              </div>
                              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${crypto.percentage}%` }}
                                />
                              </div>
                              </div>
                          ))}
                            </div>
                      </div>

                      {/* By Casino */}
                      <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">Deposits by Casino</div>
                        <div className="space-y-3">
                          {results.analytics.depositsByCasino.map((casino, i) => (
                            <div key={casino.casino}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-white font-medium">{casino.casino}</span>
                                <span className="text-gray-400">${casino.amount.toLocaleString()} ({casino.percentage}%)</span>
                              </div>
                              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                    width: `${casino.percentage}%`,
                                    backgroundColor: ['#22c55e', '#8b5cf6', '#ec4899', '#f97316'][i % 4]
                                }}
                              />
                            </div>
                          </div>
                          ))}
                    </div>
                  </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">Activity Summary</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">Last Deposit</div>
                          <div className="text-white font-medium">{results.analytics.lastDeposit}</div>
                          </div>
                        <div>
                          <div className="text-gray-500 mb-1">Deposits/Day (Active)</div>
                          <div className="text-white font-medium">{(results.analytics.totalDeposits / results.analytics.activeDays).toFixed(1)}</div>
                          </div>
                        <div>
                          <div className="text-gray-500 mb-1">Max Monthly</div>
                          <div className="text-white font-medium">${Math.max(...results.analytics.monthlyDeposits.map(d => d.amount)).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Casinos Used</div>
                          <div className="text-white font-medium">{results.analytics.depositsByCasino.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Back Button */}
                <div className="flex justify-center pt-4">
                  <button
                          onClick={() => {
                      setResults(null);
                      setAddress('');
                      setExpandedMetric(null);
                      setReportView('traits');
                    }}
                    className="px-8 py-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-colors font-medium text-purple-300"
                  >
                    Scan Another Wallet
                  </button>
                            </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="text-gray-500 text-sm">
              © 2026 GamStart
      </div>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <TwitterIcon size={16} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <DiscordIcon size={16} />
              </a>
          </div>
      </div>
        </div>
      </footer>
    </div>
  );
}
