'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Activity, Users, TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';

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

function getCasinoColor(name) {
  const colors = {
    'Stake': '#22c55e',
    'Rollbit': '#ef4444',
    'Duel': '#f97316',
    'Roobet': '#8b5cf6',
    'Gamdom': '#eab308',
    'Duelbits': '#ec4899',
    '500 Casino': '#3b82f6',
    'Shuffle': '#f472b6',
    'Rainbet': '#06b6d4',
    'BC.Game': '#fbbf24',
    'StakeUS': '#f472b6',
    'Yeet': '#fbbf24'
  };
  return colors[name] || '#6b7280';
}

function formatNumber(num) {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(0)}`;
}

export default function CasinoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const casinoName = decodeURIComponent(params.name);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('volume');

  useEffect(() => {
    fetchCasinoData();
  }, [casinoName, timeRange]);

  const fetchCasinoData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/casino/${encodeURIComponent(casinoName)}?range=${timeRange}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch casino data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navbar component for reuse
  const Navbar = () => (
    <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <a 
              href="/"
              className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity"
            >
              <span className="text-purple-500">◈</span>
              GambleScan
            </a>
            
            {/* Primary Tabs */}
            <div className="flex items-center bg-[#1a1a2e] rounded-lg p-0.5">
              <a
                href="/"
                className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-300 transition-all"
              >
                Players
              </a>
              <a
                href="/?tab=platforms"
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-[#252540] text-white transition-all"
              >
                Casinos
              </a>
            </div>

            {/* Secondary Links */}
            <div className="hidden md:flex items-center gap-1">
              <a
                href="/vip-dashboard"
                className="px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                VIP Offers
              </a>
              <a
                href="/leaderboards"
                className="px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Leaderboard Builder
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-[#1a1a2e] hover:bg-[#252540] rounded-lg border border-gray-700/50 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Footer component for reuse
  const Footer = () => (
    <footer className="border-t border-gray-800/50 bg-[#0a0a14]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="text-gray-500 text-sm">
            © 2026 GambleScan
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
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-gray-800 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => router.push('/?tab=platforms')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft size={18} />
              Back to Analytics
            </button>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Casino Not Found</h1>
              <p className="text-gray-500">No data available for {casinoName}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const casinoColor = getCasinoColor(casinoName);
  const current = data.current || {};
  const trends = data.trends || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => router.push('/?tab=platforms')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Analytics
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: casinoColor }}
            >
              {casinoName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{casinoName}</h1>
              <p className="text-sm text-gray-500">Casino Analytics Dashboard</p>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Time Range:</span>
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: '1y', label: '1 Year' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeRange === range.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-[#1a1a2e] text-gray-400 hover:text-white hover:bg-[#252540]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <DollarSign className="text-purple-400" size={18} />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Volume</div>
            </div>
            <div className="text-2xl font-bold text-white">{formatNumber(current.totalVolume || 0)}</div>
            <div className="text-xs text-gray-500 mt-1">Today</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Activity className="text-purple-400" size={18} />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Deposits</div>
            </div>
            <div className="text-2xl font-bold text-white">{(current.totalDeposits || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Today</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="text-purple-400" size={18} />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Unique Depositors</div>
            </div>
            <div className="text-2xl font-bold text-white">{(current.uniqueDepositors || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Today</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="text-purple-400" size={18} />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">New Depositors</div>
            </div>
            <div className="text-2xl font-bold text-white">{(current.newDepositors || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">First-time today</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Deposit Size</div>
            <div className="text-xl font-bold text-white">{formatNumber(current.avgDepositSize || 0)}</div>
          </div>
          <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Market Share</div>
            <div className="text-xl font-bold text-white">{(current.marketShare || 0).toFixed(1)}%</div>
          </div>
          <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Historical Data Points</div>
            <div className="text-xl font-bold text-white">{trends.length}</div>
          </div>
        </div>

        {/* Trend Chart */}
        {trends.length > 0 && (
          <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-white">Volume Trends</div>
                <div className="text-xs text-gray-500">Over {timeRange}</div>
              </div>
              <div className="flex gap-2">
                {['volume', 'deposits', 'depositors'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedMetric === metric
                        ? 'bg-purple-500 text-white'
                        : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
                    }`}
                  >
                    {metric === 'volume' ? 'Volume' : metric === 'deposits' ? 'Deposits' : 'Depositors'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] text-gray-600">
                {selectedMetric === 'volume' && (
                  <>
                    <span>{formatNumber(Math.max(...trends.map(t => t.volume || 0)))}</span>
                    <span>{formatNumber(Math.max(...trends.map(t => t.volume || 0)) * 0.75)}</span>
                    <span>{formatNumber(Math.max(...trends.map(t => t.volume || 0)) * 0.5)}</span>
                    <span>{formatNumber(Math.max(...trends.map(t => t.volume || 0)) * 0.25)}</span>
                    <span>$0</span>
                  </>
                )}
                {selectedMetric === 'deposits' && (
                  <>
                    <span>{Math.max(...trends.map(t => t.deposits || 0)).toLocaleString()}</span>
                    <span>{(Math.max(...trends.map(t => t.deposits || 0)) * 0.75).toLocaleString()}</span>
                    <span>{(Math.max(...trends.map(t => t.deposits || 0)) * 0.5).toLocaleString()}</span>
                    <span>{(Math.max(...trends.map(t => t.deposits || 0)) * 0.25).toLocaleString()}</span>
                    <span>0</span>
                  </>
                )}
                {selectedMetric === 'depositors' && (
                  <>
                    <span>{Math.max(...trends.map(t => t.depositors || 0)).toLocaleString()}</span>
                    <span>{(Math.max(...trends.map(t => t.depositors || 0)) * 0.75).toLocaleString()}</span>
                    <span>{(Math.max(...trends.map(t => t.depositors || 0)) * 0.5).toLocaleString()}</span>
                    <span>{(Math.max(...trends.map(t => t.depositors || 0)) * 0.25).toLocaleString()}</span>
                    <span>0</span>
                  </>
                )}
              </div>

              {/* Chart area */}
              <div className="absolute left-14 right-0 top-0 bottom-0 flex items-end justify-between gap-1">
                {trends.map((trend, i) => {
                  const maxValue = selectedMetric === 'volume' 
                    ? Math.max(...trends.map(t => t.volume || 0))
                    : selectedMetric === 'deposits'
                    ? Math.max(...trends.map(t => t.deposits || 0))
                    : Math.max(...trends.map(t => t.depositors || 0));
                  
                  const value = selectedMetric === 'volume' 
                    ? trend.volume || 0
                    : selectedMetric === 'deposits'
                    ? trend.deposits || 0
                    : trend.depositors || 0;
                  
                  const height = maxValue > 0 ? (value / maxValue) * 200 : 0;
                  const date = new Date(trend.date);
                  const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="w-full relative">
                        <div 
                          className="w-full bg-gradient-to-t from-purple-500/60 to-purple-400/20 rounded-t transition-all group-hover:from-purple-500/80 group-hover:to-purple-400/40"
                          style={{ height: `${height}px` }}
                          title={`${dateLabel}: ${selectedMetric === 'volume' ? formatNumber(value) : value.toLocaleString()}`}
                        />
                      </div>
                      <div className="text-[8px] text-gray-600 truncate w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {dateLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {trends.length === 0 && (
          <div className="bg-[#12121c] rounded-xl p-12 border border-gray-800/50 text-center">
            <BarChart3 className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">No historical data available yet</p>
            <p className="text-xs text-gray-600 mt-2">Snapshots will appear after the cron job runs</p>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


