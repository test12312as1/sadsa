'use client';

import { useState } from 'react';
import { ArrowLeft, Crown, Gift, Users, DollarSign, TrendingUp, Filter, Search, Star, CheckCircle, Clock, ChevronRight, Shield, Eye, EyeOff, Lock, Building2, Wallet, BarChart3, ArrowUpRight, Settings, Bell } from 'lucide-react';
import Link from 'next/link';

// Demo verified VIPs (limited info shown to unverified casinos)
const DEMO_VIPS = [
  {
    id: 'vip-001',
    tier: 'Diamond',
    totalVolume: 285000,
    pnl: -42000,
    activeCasinos: 4,
    lastActive: '2 hours ago',
    verified: true,
    matchScore: 98
  },
  {
    id: 'vip-002',
    tier: 'Platinum',
    totalVolume: 142000,
    pnl: -18500,
    activeCasinos: 3,
    lastActive: '5 hours ago',
    verified: true,
    matchScore: 87
  },
  {
    id: 'vip-003',
    tier: 'Platinum',
    totalVolume: 195000,
    pnl: -31000,
    activeCasinos: 5,
    lastActive: '1 day ago',
    verified: true,
    matchScore: 82
  },
  {
    id: 'vip-004',
    tier: 'Gold',
    totalVolume: 78000,
    pnl: 12000,
    activeCasinos: 2,
    lastActive: '3 hours ago',
    verified: true,
    matchScore: 74
  },
  {
    id: 'vip-005',
    tier: 'Diamond',
    totalVolume: 420000,
    pnl: -89000,
    activeCasinos: 6,
    lastActive: '30 min ago',
    verified: true,
    matchScore: 95
  },
  {
    id: 'vip-006',
    tier: 'Gold',
    totalVolume: 52000,
    pnl: -8200,
    activeCasinos: 2,
    lastActive: '1 week ago',
    verified: true,
    matchScore: 61
  }
];

// Demo active bonus campaigns from casinos
const DEMO_CAMPAIGNS = [
  {
    id: 'camp-001',
    casino: 'Stake',
    title: 'Diamond VIP Acquisition',
    budget: 50000,
    spent: 12500,
    bonusAmount: 500,
    criteria: { minVolume: 100000, tier: 'Diamond' },
    claims: 25,
    active: true,
    color: '#22c55e'
  },
  {
    id: 'camp-002',
    casino: 'Rollbit',
    title: 'High Roller Welcome',
    budget: 25000,
    spent: 8400,
    bonusAmount: 200,
    criteria: { minVolume: 50000, tier: 'Platinum+' },
    claims: 42,
    active: true,
    color: '#ef4444'
  },
  {
    id: 'camp-003',
    casino: 'Shuffle',
    title: 'Competitor Switch Bonus',
    budget: 15000,
    spent: 3250,
    bonusAmount: 250,
    criteria: { minVolume: 25000, excludeCasinos: ['Shuffle'] },
    claims: 13,
    active: true,
    color: '#ec4899'
  }
];

const getTierColor = (tier) => {
  switch (tier) {
    case 'Diamond': return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'Platinum': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'Gold': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
  }
};

export default function VIPDashboard() {
  const [activeTab, setActiveTab] = useState('players'); // 'players' or 'casinos'
  const [viewMode, setViewMode] = useState('player'); // 'player' or 'casino'
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(null);

  const filteredVIPs = DEMO_VIPS.filter(vip => {
    if (selectedFilter !== 'all' && vip.tier.toLowerCase() !== selectedFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={18} />
                <span className="text-sm">Back</span>
              </Link>
              <div className="w-px h-6 bg-gray-700" />
              <div className="flex items-center gap-2">
                <Crown className="text-yellow-400" size={20} />
                <span className="text-white font-semibold">VIP Dashboard</span>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#1a1a2e] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('player')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'player'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Users size={14} />
                Player View
              </button>
              <button
                onClick={() => setViewMode('casino')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'casino'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Building2 size={14} />
                Casino View
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PLAYER VIEW */}
        {viewMode === 'player' && (
          <div className="space-y-6">
            {/* Player Welcome */}
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Welcome, VIP Player</h1>
                  <p className="text-gray-400 max-w-xl">
                    Browse exclusive offers from casinos actively seeking verified players like you. 
                    Your gambling history qualifies you for special bonuses - no deposit, no wager required.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="text-green-400" size={18} />
                  <span className="text-green-300 font-medium">Verified</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Gift className="text-purple-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">{DEMO_CAMPAIGNS.length}</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Active Offers</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="text-green-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">$950</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Available Value</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Star className="text-yellow-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">95</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Match Score</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Crown className="text-cyan-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">Diamond</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">VIP Tier</div>
              </div>
            </div>

            {/* Your Matching Offers */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Offers Matching Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_CAMPAIGNS.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden hover:border-purple-500/50 transition-all group"
                  >
                    <div 
                      className="px-4 py-3 border-b border-gray-800/50"
                      style={{ backgroundColor: `${campaign.color}15` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: campaign.color }}
                          />
                          <span className="font-semibold text-white">{campaign.casino}</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{campaign.title}</div>
                        <div className="text-3xl font-bold text-white">${campaign.bonusAmount}</div>
                        <div className="text-xs text-green-400 mt-1">No deposit · No wager</div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-gray-400">
                          <span>Min Volume:</span>
                          <span className="text-white">${campaign.criteria.minVolume.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Required Tier:</span>
                          <span className="text-white">{campaign.criteria.tier || 'Any'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800/50">
                        <span>{campaign.claims} claimed</span>
                        <span className="text-green-400">You qualify!</span>
                      </div>

                      <button className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                        <Gift size={16} />
                        Claim Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
              <h3 className="text-lg font-semibold text-white mb-4">How Automated Matching Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-purple-400 font-bold">1</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Verify Your VIP Status</div>
                  <div className="text-xs text-gray-500">Complete verification to prove your gambling history</div>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Casinos Set Criteria</div>
                  <div className="text-xs text-gray-500">Platforms define target volume, tier, and bonus amounts</div>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-purple-400 font-bold">3</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Auto-Match System</div>
                  <div className="text-xs text-gray-500">Our system matches your profile to eligible offers</div>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-purple-400 font-bold">4</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Claim Instantly</div>
                  <div className="text-xs text-gray-500">One click to claim - bonus credited automatically</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASINO VIEW */}
        {viewMode === 'casino' && (
          <div className="space-y-6">
            {/* Casino Welcome */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/10 rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Casino VIP Acquisition</h1>
                  <p className="text-gray-400 max-w-xl">
                    Access verified VIP players with proven gambling history. Set your targeting criteria 
                    and budget - bonuses are automatically offered to matching players.
                  </p>
                </div>
                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Settings size={16} />
                  Casino Settings
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-blue-300 font-medium mb-1">Privacy-First Design</h3>
                  <p className="text-sm text-gray-400">
                    Casino accounts see limited player data: volume range, tier, and P&L direction only. 
                    Full details are revealed only after a player accepts your offer and you both agree to connect.
                  </p>
                </div>
              </div>
            </div>

            {/* Casino Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Users className="text-yellow-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">{DEMO_VIPS.length}</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Verified VIPs</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="text-green-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">$1.2M</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Total Volume</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Gift className="text-purple-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">80</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Bonuses Claimed</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="text-cyan-400" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white">34%</div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Conversion Rate</div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Your Active Campaigns</h2>
                <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Gift size={16} />
                  Create Campaign
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_CAMPAIGNS.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-[#12121c] rounded-xl border border-gray-800/50 p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">{campaign.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                        Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Budget Used</span>
                          <span className="text-white">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#1a1a2e] rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Bonus/Player</div>
                          <div className="text-white font-medium">${campaign.bonusAmount}</div>
                        </div>
                        <div className="bg-[#1a1a2e] rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Claims</div>
                          <div className="text-white font-medium">{campaign.claims}</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Targeting: {campaign.criteria.tier || 'All tiers'}, ${campaign.criteria.minVolume?.toLocaleString() || '0'}+ volume
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VIP Pool */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Verified VIP Pool</h2>
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  {['all', 'diamond', 'platinum', 'gold'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        selectedFilter === filter
                          ? 'bg-yellow-500 text-black'
                          : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-gray-500 uppercase bg-[#0f0f1a]">
                      <th className="text-left px-4 py-3 font-medium">VIP ID</th>
                      <th className="text-left px-4 py-3 font-medium">Tier</th>
                      <th className="text-right px-4 py-3 font-medium">Volume Range</th>
                      <th className="text-right px-4 py-3 font-medium">P&L</th>
                      <th className="text-right px-4 py-3 font-medium">Active Casinos</th>
                      <th className="text-right px-4 py-3 font-medium">Match Score</th>
                      <th className="text-right px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredVIPs.map((vip) => {
                      const tierStyle = getTierColor(vip.tier);
                      return (
                        <tr key={vip.id} className="border-t border-gray-800/30 hover:bg-[#1a1a2e]/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Lock className="text-gray-600" size={12} />
                              <span className="font-mono text-gray-400">{vip.id}</span>
                              {vip.verified && <CheckCircle className="text-green-400" size={12} />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
                              {vip.tier}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-white font-medium">
                            ${(Math.floor(vip.totalVolume / 50000) * 50).toLocaleString()}K - ${(Math.ceil(vip.totalVolume / 50000) * 50).toLocaleString()}K
                          </td>
                          <td className={`px-4 py-3 text-right font-medium ${vip.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {vip.pnl >= 0 ? 'Winning' : 'Losing'}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-400">{vip.activeCasinos}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-medium ${
                              vip.matchScore >= 90 ? 'text-green-400' :
                              vip.matchScore >= 70 ? 'text-yellow-400' :
                              'text-gray-400'
                            }`}>
                              {vip.matchScore}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setShowOfferModal(vip)}
                              className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-xs font-medium transition-colors"
                            >
                              Send Offer
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#12121c] rounded-2xl p-6 max-w-md w-full border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Send Offer to {showOfferModal.id}</h3>
                <button
                  onClick={() => setShowOfferModal(null)}
                  className="text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1a1a2e] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">VIP Tier:</span>
                    <span className="text-white">{showOfferModal.tier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Match Score:</span>
                    <span className="text-green-400">{showOfferModal.matchScore}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bonus Amount ($)</label>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message (Optional)</label>
                  <textarea
                    placeholder="We'd love to welcome you to our casino..."
                    rows={3}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <EyeOff className="text-blue-400 flex-shrink-0 mt-0.5" size={14} />
                    <div className="text-xs text-gray-400">
                      The player will see your casino name and offer. Your contact info remains hidden until they accept.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowOfferModal(null)}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Gift size={18} />
                  Send Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

