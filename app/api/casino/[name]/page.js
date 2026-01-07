'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Activity, Users, TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
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
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
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
      </div>
    );
  }

  const casinoColor = getCasinoColor(casinoName);
  const current = data.current || {};
  const trends = data.trends || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
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
    </div>
  );
}
