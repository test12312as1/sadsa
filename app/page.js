'use client';

import { useState } from 'react';
import { Search, ChevronDown, Clock, TrendingUp, DollarSign, Activity, Share2, Info } from 'lucide-react';

// Demo wallet data with different risk levels
const DEMO_WALLETS = {
  critical: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    riskScore: 87,
    status: 'CRITICAL',
    diagnosis: "This wallet exhibits severe 'Chase Behavior'. 92% of deposits occur immediately after a detected loss, with an average response time of 3.2 minutes. Transaction patterns indicate compulsive gambling with clear signs of tilt.",
    depositVelocity: {
      rate: 12.4,
      safeBaseline: 2.0,
      unit: 'txns/hour'
    },
    midnightFactor: {
      percentage: 68,
      transactions: 142,
      totalTransactions: 209
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
    diagnosis: "This wallet shows moderate risk patterns. 45% of deposits occur after losses, suggesting occasional chase behavior. Late-night activity (38% between midnight-5am) indicates potential sleep disruption related to gambling.",
    depositVelocity: {
      rate: 4.2,
      safeBaseline: 2.0,
      unit: 'txns/hour'
    },
    midnightFactor: {
      percentage: 38,
      transactions: 23,
      totalTransactions: 61
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
    diagnosis: "This wallet shows healthy gambling patterns. Deposits are evenly distributed with no clear chase behavior. Transaction timing suggests controlled, recreational gambling with minimal risk indicators.",
    depositVelocity: {
      rate: 1.1,
      safeBaseline: 2.0,
      unit: 'txns/hour'
    },
    midnightFactor: {
      percentage: 12,
      transactions: 3,
      totalTransactions: 25
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

export default function GamStart() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ETH');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [expandedMetric, setExpandedMetric] = useState(null);

  const getRiskColor = (score) => {
    if (score >= 70) return { bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-400', accent: 'text-red-500' };
    if (score >= 40) return { bg: 'bg-yellow-950', border: 'border-yellow-800', text: 'text-yellow-400', accent: 'text-yellow-500' };
    return { bg: 'bg-green-950', border: 'border-green-800', text: 'text-green-400', accent: 'text-green-500' };
  };

  const getStatusColor = (status) => {
    if (status === 'CRITICAL') return 'text-red-500';
    if (status === 'WARNING') return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleScan = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    setLoadingStep(0);
    setResults(null);

    // Simulate loading with sequential checks
    for (let i = 0; i < LOADING_CHECKS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingStep(i + 1);
    }

    // Determine which demo wallet to use
    const addressLower = address.toLowerCase();
    let demoData;
    
    if (addressLower.includes('critical') || addressLower.includes('87')) {
      demoData = DEMO_WALLETS.critical;
    } else if (addressLower.includes('warning') || addressLower.includes('54')) {
      demoData = DEMO_WALLETS.warning;
    } else if (addressLower.includes('optimal') || addressLower.includes('18')) {
      demoData = DEMO_WALLETS.optimal;
    } else {
      // Default to critical for demo
      demoData = DEMO_WALLETS.critical;
    }

    // Use the input address
    demoData = { ...demoData, address: address.trim() };

    await new Promise(resolve => setTimeout(resolve, 500));
    setResults(demoData);
        setLoading(false);
    setLoadingStep(0);
  };

  const handleShare = () => {
    if (!results) return;
    const shareText = `🎰 GamStart Diagnostic Report\n\nRisk Score: ${results.riskScore}/100\nStatus: ${results.status}\n\n${results.diagnosis}\n\nView full report: gamstart.vercel.app`;
    
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

  const colors = results ? getRiskColor(results.riskScore) : { 
    bg: 'bg-slate-950', 
    border: 'border-slate-800', 
    text: 'text-slate-400', 
    accent: 'text-slate-500' 
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${colors.bg} text-white`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {!results && !loading && (
          /* MAIN PAGE - INPUT TERMINAL */
          <div className="text-center space-y-8">
            {/* Logo/Title */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                GamStart
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto">
                A diagnostic tool that scans your cryptocurrency wallet to detect patterns of compulsive gambling behavior.
              </p>
            </div>

            {/* Input Terminal */}
            <div className="mt-12 space-y-4">
              <div className={`bg-slate-900/50 ${colors.border} border-2 rounded-2xl p-6 backdrop-blur-sm`}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Chain Selector */}
                  <div className="relative">
                    <select
                      value={chain}
                      onChange={(e) => setChain(e.target.value)}
                      className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white font-medium cursor-pointer hover:bg-slate-750 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>

                  {/* Address Input */}
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    placeholder={chain === 'ETH' ? '0x...' : 'Enter SOL address'}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Scan Button */}
                  <button
                    onClick={handleScan}
                    disabled={!address.trim()}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Search size={20} />
                    Scan
                  </button>
                </div>
              </div>

              {/* Demo Hint */}
              <p className="text-sm text-slate-500">
                Try: "critical", "warning", "optimal", or any address for demo
              </p>
            </div>
          </div>
        )}

        {loading && (
          /* LOADING STATE - THEATRICAL CHECKLIST */
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Forensic Scan in Progress</h2>
              <p className="text-slate-400">Analyzing wallet behavior patterns...</p>
            </div>

            <div className={`bg-slate-900/50 ${colors.border} border-2 rounded-2xl p-8 space-y-4`}>
              {LOADING_CHECKS.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index < loadingStep
                      ? 'text-green-400'
                      : index === loadingStep
                      ? 'text-blue-400 animate-pulse'
                      : 'text-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    index < loadingStep
                      ? 'border-green-400 bg-green-400/20'
                      : index === loadingStep
                      ? 'border-blue-400 bg-blue-400/20'
                      : 'border-slate-600'
                  }`}>
                    {index < loadingStep && (
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    )}
                    {index === loadingStep && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="font-medium">{check}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {results && !loading && (
          /* RESULTS PAGE - DIAGNOSTIC REPORT */
          <div className="space-y-8">
            {/* Header with Share */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">GamStart</h1>
                <p className="text-slate-400 font-mono text-sm">{formatAddress(results.address)}</p>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Verdict Header */}
            <div className={`${colors.border} border-2 rounded-2xl p-8 bg-slate-900/30 backdrop-blur-sm`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                <div>
                  <div className="text-sm text-slate-400 mb-2">Risk Score</div>
                  <div className={`text-6xl font-bold ${colors.text}`}>
                    {results.riskScore}
                    <span className="text-3xl text-slate-500">/100</span>
          </div>
            </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 mb-2">Status</div>
                  <div className={`text-4xl font-bold ${getStatusColor(results.status)}`}>
                    {results.status}
        </div>
                </div>
              </div>
              
              {/* Diagnosis */}
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <Info className={`${colors.accent} mt-1 flex-shrink-0`} size={20} />
                  <div>
                    <div className="text-sm text-slate-400 mb-2">The Diagnosis</div>
                    <p className="text-lg leading-relaxed">{results.diagnosis}</p>
                  </div>
              </div>
              </div>
            </div>

            {/* Behavioral Metrics */}
                <div className="space-y-4">
              <h2 className="text-2xl font-bold">Behavioral Metrics</h2>

              {/* Deposit Velocity */}
              <div className={`${colors.border} border-2 rounded-xl overflow-hidden bg-slate-900/30 backdrop-blur-sm`}>
                <button
                  onClick={() => setExpandedMetric(expandedMetric === 'velocity' ? null : 'velocity')}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
                      <Activity className={colors.accent} size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Deposit Velocity</div>
                      <div className="text-sm text-slate-400">The "Panic" Detector</div>
                    </div>
                          </div>
                          <div className="text-right">
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {results.depositVelocity.rate} {results.depositVelocity.unit}
                          </div>
                    <div className="text-xs text-slate-500">Safe: {results.depositVelocity.safeBaseline} {results.depositVelocity.unit}</div>
                        </div>
                </button>
                {expandedMetric === 'velocity' && (
                  <div className="p-6 pt-0 border-t border-slate-800 space-y-4">
                    <p className="text-slate-400 text-sm">
                      Number of transactions sent to casinos per hour during active sessions. 
                      High velocity indicates "tilting" or panic-depositing to win back losses.
                    </p>
                    {/* Speedometer visualization */}
                    <div className="relative h-32 flex items-end justify-center gap-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-24 border-4 border-slate-700 rounded-t-full border-b-0"></div>
                        <div 
                          className="absolute w-48 h-24 border-4 rounded-t-full border-b-0 transition-all duration-1000"
                            style={{ 
                            borderColor: results.riskScore >= 70 ? '#ef4444' : results.riskScore >= 40 ? '#eab308' : '#22c55e',
                            clipPath: `inset(0 0 ${100 - (results.depositVelocity.rate / 15 * 100)}% 0)`
                          }}
                        ></div>
                      </div>
                      <div className="relative z-10 mt-8">
                        <div className={`text-3xl font-bold ${colors.text}`}>
                          {results.depositVelocity.rate}x
                        </div>
                      </div>
                </div>
              </div>
            )}
          </div>

              {/* Midnight Factor */}
              <div className={`${colors.border} border-2 rounded-xl overflow-hidden bg-slate-900/30 backdrop-blur-sm`}>
                <button
                  onClick={() => setExpandedMetric(expandedMetric === 'midnight' ? null : 'midnight')}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
                      <Clock className={colors.accent} size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">The Midnight Factor</div>
                      <div className="text-sm text-slate-400">The "Bender" Detector</div>
                    </div>
                              </div>
                              <div className="text-right">
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {results.midnightFactor.percentage}%
                    </div>
                    <div className="text-xs text-slate-500">{results.midnightFactor.transactions} of {results.midnightFactor.totalTransactions} txns</div>
                  </div>
                </button>
                {expandedMetric === 'midnight' && (
                  <div className="p-6 pt-0 border-t border-slate-800 space-y-4">
                    <p className="text-slate-400 text-sm">
                      Percentage of gambling transactions that occur between 12:00 AM and 5:00 AM local time. 
                      Late-night gambling correlates highly with addiction and poor decision-making.
                    </p>
                    {/* 24-hour clock visualization */}
                    <div className="relative w-full h-64 flex items-center justify-center">
                      <div className="relative w-56 h-56 rounded-full border-4 border-slate-700">
                        {/* Danger zone highlight */}
                        <div 
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(
                              ${results.midnightFactor.percentage > 50 ? '#ef4444' : results.midnightFactor.percentage > 30 ? '#eab308' : '#22c55e'} 0deg ${(results.midnightFactor.percentage / 100) * 360}deg,
                              transparent ${(results.midnightFactor.percentage / 100) * 360}deg 360deg
                            )`,
                            mask: 'radial-gradient(circle at center, transparent 40%, black 40%)',
                            WebkitMask: 'radial-gradient(circle at center, transparent 40%, black 40%)'
                          }}
                        ></div>
                        {/* Hour markers */}
                        {[...Array(24)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute"
                            style={{
                              top: '50%',
                              left: '50%',
                              transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-100px)`,
                            }}
                          >
                            <div className={`w-1 h-3 ${i >= 0 && i < 5 ? 'bg-red-500' : 'bg-slate-600'} rounded-full`}></div>
                          </div>
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`text-3xl font-bold ${colors.text}`}>
                            {results.midnightFactor.percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-slate-400">
                      <span className="text-red-500">Red zone (12 AM - 5 AM)</span> indicates high-risk timing
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Impact */}
              <div className={`${colors.border} border-2 rounded-xl overflow-hidden bg-slate-900/30 backdrop-blur-sm`}>
                <button
                  onClick={() => setExpandedMetric(expandedMetric === 'financial' ? null : 'financial')}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
                      <DollarSign className={colors.accent} size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Financial Impact</div>
                      <div className="text-sm text-slate-400">The "Reality Check"</div>
                            </div>
                          </div>
                          <div className="text-right">
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      ${results.financialImpact.totalUSD.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{results.financialImpact.totalETH} ETH</div>
                  </div>
                </button>
                {expandedMetric === 'financial' && (
                  <div className="p-6 pt-0 border-t border-slate-800 space-y-4">
                    <p className="text-slate-400 text-sm">
                      Total volume (in Crypto and USD) sent to casino addresses. 
                      This visualizes the scale of the loss.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-1">Total Volume (USD)</div>
                        <div className={`text-2xl font-bold ${colors.text}`}>
                          ${results.financialImpact.totalUSD.toLocaleString()}
                        </div>
                          </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-1">Total Volume (ETH)</div>
                        <div className={`text-2xl font-bold ${colors.text} font-mono`}>
                          {results.financialImpact.totalETH} ETH
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setResults(null);
                setAddress('');
                setExpandedMetric(null);
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors font-medium"
            >
              Scan Another Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
