'use client';

import { useState } from 'react';
import { Search, ChevronDown, Clock, DollarSign, Activity, Share2, Info, Wallet } from 'lucide-react';

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

  // Aggregate multiple wallet results
  const totalRiskScore = walletResults.reduce((sum, w) => sum + w.riskScore, 0) / walletResults.length;
  const totalETH = walletResults.reduce((sum, w) => sum + w.financialImpact.totalETH, 0);
  const totalUSD = walletResults.reduce((sum, w) => sum + w.financialImpact.totalUSD, 0);
  const totalTransactions = walletResults.reduce((sum, w) => sum + w.midnightFactor.totalTransactions, 0);
  const totalMidnightTxns = walletResults.reduce((sum, w) => sum + w.midnightFactor.transactions, 0);
  const avgDepositVelocity = walletResults.reduce((sum, w) => sum + w.depositVelocity.rate, 0) / walletResults.length;

  // Determine overall status
  let status = 'OPTIMAL';
  if (totalRiskScore >= 70) status = 'CRITICAL';
  else if (totalRiskScore >= 40) status = 'WARNING';

  // Aggregate diagnosis
  const diagnosis = `Analysis of ${walletResults.length} wallet${walletResults.length > 1 ? 's' : ''} shows ${status === 'CRITICAL' ? 'severe' : status === 'WARNING' ? 'moderate' : 'minimal'} risk patterns. Combined deposits total ${totalETH.toFixed(2)} ETH ($${totalUSD.toLocaleString()}). ${totalMidnightTxns > totalTransactions * 0.4 ? 'High late-night activity detected across wallets.' : 'Transaction timing patterns appear controlled.'}`;

  return {
    addresses: walletResults.map(w => w.address),
    isMultiple: true,
    riskScore: Math.round(totalRiskScore),
    status,
    diagnosis,
    depositVelocity: {
      rate: parseFloat(avgDepositVelocity.toFixed(1)),
      safeBaseline: 2.0,
      unit: 'txns/hour'
    },
    midnightFactor: {
      percentage: Math.round((totalMidnightTxns / totalTransactions) * 100),
      transactions: totalMidnightTxns,
      totalTransactions
    },
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

    // Parse addresses (support comma or newline separated)
    const addresses = parseAddresses(address);
    if (addresses.length === 0) {
        setLoading(false);
      return;
    }

    // Simulate loading with sequential checks
    for (let i = 0; i < LOADING_CHECKS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingStep(i + 1);
    }

    // Determine which demo wallet to use for each address
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
        // Default to critical for demo
        demoData = { ...DEMO_WALLETS.critical };
      }

      // Use the input address
      demoData.address = addr;
      demoData.chain = chain;
      return demoData;
    });

    // Aggregate results if multiple wallets
    const finalResults = aggregateResults(walletResults);

    await new Promise(resolve => setTimeout(resolve, 500));
    setResults(finalResults);
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

  const colors = results ? getRiskColor(results.riskScore) : null;

  return (
    <div className={`min-h-screen ${results ? `${colors.bg} text-white` : 'bg-gray-50 text-gray-900'}`}>
      <div className={`${results ? 'max-w-4xl' : 'max-w-2xl'} mx-auto px-4 sm:px-6 lg:px-8 ${results ? 'py-12' : 'py-24'}`}>
        
        {!results && !loading && (
          /* MAIN PAGE - INPUT TERMINAL (Cursor App Style) */
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
            {/* Logo/Title - Centered */}
            <div className="text-center space-y-6">
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-gray-900">
                GamStart
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-xl mx-auto">
                A diagnostic tool that scans your cryptocurrency wallet to detect patterns of compulsive gambling behavior.
              </p>
            </div>

            {/* Input Terminal - Centered and Prominent */}
            <div className="w-full space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Chain Selector */}
                  <div className="relative">
                    <select
                      value={chain}
                      onChange={(e) => setChain(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 font-medium cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>

                  {/* Address Input - Supports multiple addresses */}
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleScan();
                      }
                    }}
                    placeholder={chain === 'ETH' ? '0x... (or multiple addresses separated by comma or newline)' : 'Enter SOL address(es)'}
                    rows={address.split('\n').length > 1 ? Math.min(address.split('\n').length, 4) : 1}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none min-h-[48px]"
                  />

                  {/* Scan Button - Purple accent */}
                  <button
                    onClick={handleScan}
                    disabled={!address.trim()}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Search size={20} />
                    Scan
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter one or multiple wallet addresses (separate by comma or newline)
                </p>
              </div>

              {/* Demo Hint */}
              <p className="text-sm text-gray-500 text-center">
                Try: "critical", "warning", "optimal", or any address for demo
              </p>
            </div>
          </div>
        )}

        {loading && (
          /* LOADING STATE - THEATRICAL CHECKLIST */
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Forensic Scan in Progress</h2>
              <p className="text-gray-600">Analyzing wallet behavior patterns...</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-4 shadow-sm">
              {LOADING_CHECKS.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index < loadingStep
                      ? 'text-green-600'
                      : index === loadingStep
                      ? 'text-purple-600 animate-pulse'
                      : 'text-gray-400'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    index < loadingStep
                      ? 'border-green-600 bg-green-50'
                      : index === loadingStep
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300'
                  }`}>
                    {index < loadingStep && (
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    )}
                    {index === loadingStep && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="font-medium">{check}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {results && !loading && (
          /* RESULTS PAGE - DIAGNOSTIC REPORT (Personality Test Style Layout) */
          <div className="space-y-12">
            {/* Header Section - Similar to personality test header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1">GamStart</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Wallet size={14} />
                  {results.isMultiple ? (
                    <span>{results.addresses.length} wallet{results.addresses.length > 1 ? 's' : ''} scanned</span>
                  ) : (
                    <span className="font-mono">{formatAddress(results.address)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
          </div>

            {/* Main Score Section - Centered like personality test */}
            <div className="text-center space-y-4 py-8">
              <div className="text-sm text-gray-400 uppercase tracking-wide">Your Risk Score</div>
              <div className={`text-8xl font-bold ${colors.text}`}>
                {results.riskScore}
                <span className="text-4xl text-gray-500">/100</span>
              </div>
              <div className={`text-3xl font-semibold ${getStatusColor(results.status)}`}>
                {results.status}
              </div>
              </div>
              
            {/* Diagnosis Section - Similar to personality type info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Info className={`${colors.accent} mt-1 flex-shrink-0`} size={24} />
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-3 uppercase tracking-wide">The Diagnosis</div>
                  <p className="text-lg leading-relaxed text-gray-200">{results.diagnosis}</p>
                </div>
              </div>
            </div>

            {/* Behavioral Metrics - Grid layout like personality traits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Behavioral Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Deposit Velocity Card */}
                <div className={`${colors.border} border-2 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm`}>
                  <button
                    onClick={() => setExpandedMetric(expandedMetric === 'velocity' ? null : 'velocity')}
                    className="w-full p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors"
                  >
                    <div className={`p-4 rounded-lg ${colors.bg} ${colors.border} border mb-4`}>
                      <Activity className={colors.accent} size={32} />
                          </div>
                    <div className="text-4xl font-bold mb-2">
                      <div className={`${colors.text}`}>
                        {results.depositVelocity.rate}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{results.depositVelocity.unit}</div>
                </div>
                    <div className="font-semibold text-lg mb-1">Deposit Velocity</div>
                    <div className="text-sm text-gray-400">The "Panic" Detector</div>
                  </button>
                  {expandedMetric === 'velocity' && (
                    <div className="p-6 pt-0 border-t border-white/10 space-y-4">
                      <p className="text-gray-400 text-sm text-center">
                        Number of transactions sent to casinos per hour during active sessions. 
                        High velocity indicates "tilting" or panic-depositing to win back losses.
                      </p>
              </div>
            )}
                </div>

                {/* Midnight Factor Card */}
                <div className={`${colors.border} border-2 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm`}>
                  <button
                    onClick={() => setExpandedMetric(expandedMetric === 'midnight' ? null : 'midnight')}
                    className="w-full p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors"
                  >
                    <div className={`p-4 rounded-lg ${colors.bg} ${colors.border} border mb-4`}>
                      <Clock className={colors.accent} size={32} />
                          </div>
                    <div className="text-4xl font-bold mb-2">
                      <div className={`${colors.text}`}>
                        {results.midnightFactor.percentage}%
                      </div>
                </div>
                    <div className="font-semibold text-lg mb-1">The Midnight Factor</div>
                    <div className="text-sm text-gray-400">The "Bender" Detector</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {results.midnightFactor.transactions} of {results.midnightFactor.totalTransactions} txns
                    </div>
                  </button>
                  {expandedMetric === 'midnight' && (
                    <div className="p-6 pt-0 border-t border-white/10 space-y-4">
                      <p className="text-gray-400 text-sm text-center">
                        Percentage of gambling transactions that occur between 12:00 AM and 5:00 AM local time. 
                        Late-night gambling correlates highly with addiction and poor decision-making.
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial Impact Card */}
                <div className={`${colors.border} border-2 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm`}>
                  <button
                    onClick={() => setExpandedMetric(expandedMetric === 'financial' ? null : 'financial')}
                    className="w-full p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors"
                  >
                    <div className={`p-4 rounded-lg ${colors.bg} ${colors.border} border mb-4`}>
                      <DollarSign className={colors.accent} size={32} />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                      <div className={`${colors.text}`}>
                        ${(results.financialImpact.totalUSD / 1000).toFixed(0)}k
                          </div>
                        </div>
                    <div className="font-semibold text-lg mb-1">Financial Impact</div>
                    <div className="text-sm text-gray-400">The "Reality Check"</div>
                    <div className="text-xs text-gray-500 mt-2 font-mono">
                      {results.financialImpact.totalETH} ETH
                    </div>
                  </button>
                  {expandedMetric === 'financial' && (
                    <div className="p-6 pt-0 border-t border-white/10 space-y-4">
                      <p className="text-gray-400 text-sm text-center">
                        Total volume (in Crypto and USD) sent to casino addresses. 
                        This visualizes the scale of the loss.
                      </p>
                    </div>
                  )}
                  </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center pt-8">
              <button
                onClick={() => {
                  setResults(null);
                  setAddress('');
                  setExpandedMetric(null);
                }}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors font-medium"
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
