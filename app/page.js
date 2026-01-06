'use client';

import { useState } from 'react';
import { Search, Clock, DollarSign, Activity, Share2, Wallet, Trophy, Target, Flame, Timer, ExternalLink, ChevronRight } from 'lucide-react';

// Featured influencer/streamer wallets for main page
const FEATURED_INFLUENCERS = [
  {
    id: 'roshtein',
    name: 'Roshtein',
    handle: '@roikiboy',
    avatar: 'R',
    avatarColor: '#ef4444',
    address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    riskScore: 94,
    gamblerType: 'The High Roller',
    totalDeposited: '$2.4M',
    favoriteCasino: 'Stake'
  },
  {
    id: 'trainwrecks',
    name: 'Trainwrecks',
    handle: '@trainwreckstv',
    avatar: 'T',
    avatarColor: '#8b5cf6',
    address: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
    riskScore: 89,
    gamblerType: 'The Night Owl',
    totalDeposited: '$1.8M',
    favoriteCasino: 'Stake'
  },
  {
    id: 'xposed',
    name: 'Xposed',
    handle: '@xaboraz',
    avatar: 'X',
    avatarColor: '#3b82f6',
    address: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    riskScore: 76,
    gamblerType: 'The Grinder',
    totalDeposited: '$890K',
    favoriteCasino: 'Rollbit'
  },
  {
    id: 'adin',
    name: 'Adin Ross',
    handle: '@adinross',
    avatar: 'A',
    avatarColor: '#22c55e',
    address: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    riskScore: 67,
    gamblerType: 'The Showman',
    totalDeposited: '$560K',
    favoriteCasino: 'Stake'
  }
];

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
    chain: 'ETH'
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
    chain: 'ETH'
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
    chain: 'ETH'
  }
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
    chain: walletResults[0].chain
  };
};

export default function GamStart() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [expandedMetric, setExpandedMetric] = useState(null);

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
      // Auto-detect chain based on address format
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

  // Risk-based accent colors for results page
  const getAccentColor = (score) => {
    if (score >= 70) return '#ef4444'; // red
    if (score >= 40) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  // Get trait card style based on risk score - more subtle colors
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
    <div className="min-h-screen bg-[#0f0f1a]">
      <div className={`${results ? 'max-w-5xl' : 'max-w-2xl'} mx-auto px-4 sm:px-6 lg:px-8 ${results ? 'py-8' : 'py-24'}`}>
        
        {!results && !loading && (
          /* MAIN PAGE - Dark theme */
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
            <div className="text-center space-y-6">
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-white">
                GamStart
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-xl mx-auto">
                A diagnostic tool that scans your cryptocurrency wallet to detect patterns of compulsive gambling behavior.
              </p>
            </div>

<div className="w-full space-y-6">
              {/* Clean Input Field */}
              <div className="relative">
                <div className="flex items-center bg-[#0a0a12] border border-gray-800 rounded-full overflow-hidden focus-within:border-gray-600 transition-colors">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleScan();
                      }
                    }}
                    placeholder="Enter ETH or SOL Address..."
                    className="flex-1 bg-transparent px-6 py-4 text-white font-mono placeholder-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={handleScan}
                    disabled={!address.trim()}
                    className="m-2 px-6 py-2 bg-white hover:bg-gray-100 text-black rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search size={18} />
                    ANALYZE
                  </button>
                </div>
              </div>

              {/* Demo hint */}
              <p className="text-sm text-gray-600 text-center">
                Try: "critical", "warning", "optimal", or any address for demo
              </p>

              {/* Featured Wallets - Text Links */}
              <div className="text-center text-sm">
                <span className="text-gray-600">or check: </span>
                {FEATURED_INFLUENCERS.map((influencer, i) => (
                  <span key={influencer.id}>
                    <button
                      onClick={() => setAddress(influencer.address)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {influencer.handle}
                    </button>
                    {i < FEATURED_INFLUENCERS.length - 1 && <span className="text-gray-700"> · </span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          /* LOADING STATE - Dark theme */
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Forensic Scan in Progress</h2>
              <p className="text-gray-400">Analyzing wallet behavior patterns...</p>
            </div>

            <div className="bg-[#1a1a2e] border border-purple-500/20 rounded-2xl p-8 space-y-4">
              {LOADING_CHECKS.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index < loadingStep
                      ? 'text-green-400'
                      : index === loadingStep
                      ? 'text-purple-400 animate-pulse'
                      : 'text-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    index < loadingStep
                      ? 'border-green-500 bg-green-500/20'
                      : index === loadingStep
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600'
                  }`}>
                    {index < loadingStep && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                    {index === loadingStep && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="font-medium">{check}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {results && !loading && (
          /* RESULTS PAGE - Dark + Purple Theme */
          <div className="space-y-8 text-white">
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

            {/* Main Info Section - Score on left, Details on right */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Score Circle - Top Left */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-40 h-40 rounded-full border-4 flex items-center justify-center mb-4"
                  style={{ 
                    borderColor: getAccentColor(results.riskScore),
                    background: `radial-gradient(circle at center, ${getAccentColor(results.riskScore)}15 0%, transparent 70%)`
                  }}
                >
                  <div className="text-center">
                    <div className="text-5xl font-bold" style={{ color: getAccentColor(results.riskScore) }}>
                      {results.riskScore}
          </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Risk Score</div>
            </div>
        </div>
                {/* Gambler Type - Below Score */}
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-200">{results.gamblerType}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">{results.status}</div>
                </div>
              </div>
              
              {/* Info Grid - Right of Score */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Favorite Casino */}
                <a 
                  href={results.favoriteCasino.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a2e] border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-colors group"
                >
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Favorite Casino</div>
                  <div className="text-lg font-medium text-purple-300 flex items-center gap-2 group-hover:text-purple-200">
                    {results.favoriteCasino.name}
                    <ExternalLink size={14} className="opacity-50" />
                  </div>
                </a>

                {/* Financial Impact */}
                <div className="bg-[#1a1a2e] border border-purple-500/20 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Financial Impact</div>
                  <div className="text-lg font-medium text-white">
                    ${results.financialImpact.totalUSD.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{results.financialImpact.totalETH} ETH</div>
                </div>

                {/* Primary Pattern */}
                <div className="bg-[#1a1a2e] border border-purple-500/20 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Primary Pattern</div>
                  <div className="text-lg font-medium" style={{ color: getAccentColor(results.riskScore) }}>{results.primaryPattern}</div>
              </div>
              
                {/* Leaderboard Place */}
                <div className="bg-[#1a1a2e] border border-purple-500/20 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Leaderboard</div>
                  <div className="text-lg font-medium text-purple-300 flex items-center gap-2">
                    <Trophy size={16} />
                    #{results.leaderboardPlace.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Traits Section */}
                <div className="space-y-4">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Behavioral Traits</h2>
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Deposit Velocity */}
                <div 
                  className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'velocity' ? `ring-1 ${traitStyle.ring}` : ''}`}
                  onClick={() => setExpandedMetric(expandedMetric === 'velocity' ? null : 'velocity')}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                        <Activity className={traitStyle.iconColor} size={18} />
                          </div>
                      <div className={`text-sm ${traitStyle.labelColor}`}>Deposit Velocity</div>
                      <ChevronRight size={14} className={`ml-auto text-gray-500 transition-transform ${expandedMetric === 'velocity' ? 'rotate-90' : ''}`} />
                          </div>
                    <div className="text-3xl font-bold text-white">{results.depositVelocity.rate}</div>
                    <div className="text-xs text-gray-500">{results.depositVelocity.unit}</div>
                        </div>
                  {expandedMetric === 'velocity' && (
                    <div className={`px-5 pb-5 pt-2 border-t ${traitStyle.divider}`}>
                      <p className="text-sm text-gray-400">{results.depositVelocity.description}</p>
                          </div>
                        )}
                </div>

                {/* Midnight Factor */}
                <div 
                  className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'midnight' ? `ring-1 ${traitStyle.ring}` : ''}`}
                  onClick={() => setExpandedMetric(expandedMetric === 'midnight' ? null : 'midnight')}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                        <Clock className={traitStyle.iconColor} size={18} />
                      </div>
                      <div className={`text-sm ${traitStyle.labelColor}`}>Midnight Factor</div>
                      <ChevronRight size={14} className={`ml-auto text-gray-500 transition-transform ${expandedMetric === 'midnight' ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="text-3xl font-bold text-white">{results.midnightFactor.percentage}%</div>
                    <div className="text-xs text-gray-500">{results.midnightFactor.transactions} of {results.midnightFactor.totalTransactions} txns</div>
                </div>
                  {expandedMetric === 'midnight' && (
                    <div className={`px-5 pb-5 pt-2 border-t ${traitStyle.divider}`}>
                      <p className="text-sm text-gray-400">{results.midnightFactor.description}</p>
              </div>
            )}
                </div>

                {/* Chase Behavior */}
                <div 
                  className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'chase' ? `ring-1 ${traitStyle.ring}` : ''}`}
                  onClick={() => setExpandedMetric(expandedMetric === 'chase' ? null : 'chase')}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                        <Target className={traitStyle.iconColor} size={18} />
                      </div>
                      <div className={`text-sm ${traitStyle.labelColor}`}>Chase Behavior</div>
                      <ChevronRight size={14} className={`ml-auto text-gray-500 transition-transform ${expandedMetric === 'chase' ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="text-3xl font-bold text-white">{results.chaseBehavior.percentage}%</div>
                    <div className="text-xs text-gray-500">avg {results.chaseBehavior.avgResponseTime} min response</div>
                  </div>
                  {expandedMetric === 'chase' && (
                    <div className={`px-5 pb-5 pt-2 border-t ${traitStyle.divider}`}>
                      <p className="text-sm text-gray-400">{results.chaseBehavior.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Session Length */}
                <div 
                  className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'session' ? `ring-1 ${traitStyle.ring}` : ''}`}
                  onClick={() => setExpandedMetric(expandedMetric === 'session' ? null : 'session')}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                        <Timer className={traitStyle.iconColor} size={18} />
                    </div>
                      <div className={`text-sm ${traitStyle.labelColor}`}>Session Length</div>
                      <ChevronRight size={14} className={`ml-auto text-gray-500 transition-transform ${expandedMetric === 'session' ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="text-3xl font-bold text-white">{results.sessionLength.avgHours}h</div>
                    <div className="text-xs text-gray-500">avg session</div>
                  </div>
                  {expandedMetric === 'session' && (
                    <div className={`px-5 pb-5 pt-2 border-t ${traitStyle.divider}`}>
                      <p className="text-sm text-gray-400">{results.sessionLength.description}</p>
                  </div>
                  )}
                </div>

                {/* Biggest Single Bet */}
                <div 
                  className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'bigbet' ? `ring-1 ${traitStyle.ring}` : ''}`}
                  onClick={() => setExpandedMetric(expandedMetric === 'bigbet' ? null : 'bigbet')}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                        <DollarSign className={traitStyle.iconColor} size={18} />
                              </div>
                      <div className={`text-sm ${traitStyle.labelColor}`}>Biggest Single Bet</div>
                      <ChevronRight size={14} className={`ml-auto text-gray-500 transition-transform ${expandedMetric === 'bigbet' ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="text-3xl font-bold text-white">{results.biggestBet.amount}</div>
                    <div className="text-xs text-gray-500">ETH (${results.biggestBet.amountUSD.toLocaleString()})</div>
                  </div>
                  {expandedMetric === 'bigbet' && (
                    <div className={`px-5 pb-5 pt-2 border-t ${traitStyle.divider}`}>
                      <p className="text-sm text-gray-400">{results.biggestBet.description}</p>
                  </div>
                )}
                </div>

                {/* Longest Streak */}
                <div 
                  className={`${traitStyle.bg} border ${traitStyle.border} ${traitStyle.borderHover} rounded-xl overflow-hidden cursor-pointer transition-all ${expandedMetric === 'streak' ? `ring-1 ${traitStyle.ring}` : ''}`}
                  onClick={() => setExpandedMetric(expandedMetric === 'streak' ? null : 'streak')}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${traitStyle.iconBg} rounded-lg`}>
                        <Flame className={traitStyle.iconColor} size={18} />
                          </div>
                      <div className={`text-sm ${traitStyle.labelColor}`}>Longest Streak</div>
                      <ChevronRight size={14} className={`ml-auto text-gray-500 transition-transform ${expandedMetric === 'streak' ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="text-3xl font-bold text-white">{results.longestStreak.deposits}</div>
                    <div className="text-xs text-gray-500">deposits in {results.longestStreak.timespan}</div>
                  </div>
                  {expandedMetric === 'streak' && (
                    <div className={`px-5 pb-5 pt-2 border-t ${traitStyle.divider}`}>
                      <p className="text-sm text-gray-400">{results.longestStreak.description}</p>
                    </div>
                  )}
                  </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setResults(null);
                  setAddress('');
                  setExpandedMetric(null);
                }}
                className="px-8 py-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-colors font-medium text-purple-300"
              >
                Scan Another Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
