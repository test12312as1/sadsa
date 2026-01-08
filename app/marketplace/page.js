'use client';

import { useState } from 'react';
import { Gift, Users, DollarSign, TrendingUp, ChevronRight, Lock, Trophy, Clock, Star } from 'lucide-react';
import Link from 'next/link';

// Demo verified VIPs (anonymized)
const DEMO_VIPS = [
  {
    id: 'VIP-8A2F',
    casino: 'Stake',
    tier: 'Diamond',
    volumeCasino: 285000,
    volumeSports: 42000,
    pnlCasino: -38000,
    pnlSports: -4200,
    lastActive: '2h ago',
  },
  {
    id: 'VIP-3K9D',
    casino: 'Rollbit',
    tier: 'Platinum',
    volumeCasino: 142000,
    volumeSports: 0,
    pnlCasino: -18500,
    pnlSports: 0,
    lastActive: '5h ago',
  },
  {
    id: 'VIP-7M1X',
    casino: 'Shuffle',
    tier: 'Platinum',
    volumeCasino: 195000,
    volumeSports: 67000,
    pnlCasino: -31000,
    pnlSports: 3200,
    lastActive: '1d ago',
  },
  {
    id: 'VIP-2P5N',
    casino: 'Stake',
    tier: 'Gold',
    volumeCasino: 78000,
    volumeSports: 28000,
    pnlCasino: 12000,
    pnlSports: -1800,
    lastActive: '3h ago',
  },
  {
    id: 'VIP-9Q4R',
    casino: 'Roobet',
    tier: 'Diamond',
    volumeCasino: 420000,
    volumeSports: 0,
    pnlCasino: -89000,
    pnlSports: 0,
    lastActive: '30m ago',
  },
  {
    id: 'VIP-5T8W',
    casino: 'Gamdom',
    tier: 'Gold',
    volumeCasino: 52000,
    volumeSports: 35000,
    pnlCasino: -8200,
    pnlSports: -5000,
    lastActive: '1w ago',
  }
];

// Demo recent offers made/accepted
const DEMO_OFFERS = [
  {
    id: 'offer-001',
    casino: 'Stake',
    amount: '$500',
    type: 'No Deposit Bonus',
    vipTier: 'Diamond',
    status: 'accepted',
    timeAgo: '2 hours ago'
  },
  {
    id: 'offer-002',
    casino: 'Rollbit',
    amount: '$250',
    type: 'Free Play Credit',
    vipTier: 'Platinum',
    status: 'accepted',
    timeAgo: '5 hours ago'
  },
  {
    id: 'offer-003',
    casino: 'Shuffle',
    amount: '$1,000',
    type: 'VIP Welcome Package',
    vipTier: 'Diamond',
    status: 'pending',
    timeAgo: '1 day ago'
  }
];

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

export default function VIPDashboard() {
  const [selectedCasino, setSelectedCasino] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');

  const casinos = ['all', 'Stake', 'Rollbit', 'Shuffle', 'Roobet', 'Gamdom'];
  const tiers = ['all', 'Diamond', 'Platinum', 'Gold'];

  const filteredVIPs = DEMO_VIPS.filter(vip => {
    if (selectedCasino !== 'all' && vip.casino !== selectedCasino) return false;
    if (selectedTier !== 'all' && vip.tier !== selectedTier) return false;
    return true;
  });

  const formatPnL = (value) => {
    if (value === 0) return '-';
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}$${Math.abs(value).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link 
                href="/"
                className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity"
              >
                <span className="text-purple-500">◈</span>
                GamStart
              </Link>
              
              {/* Primary Tabs */}
              <div className="flex items-center bg-[#1a1a2e] rounded-lg p-0.5">
                <Link
                  href="/"
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-gray-300 transition-all"
                >
                  Players
                </Link>
                <Link
                  href="/?tab=platforms"
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-gray-300 transition-all"
                >
                  Casinos
                </Link>
              </div>

              {/* Secondary Links */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/marketplace"
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Account Marketplace
                </Link>
                <span className="px-3 py-1.5 text-sm text-white font-medium">
                  Verified VIPs
                </span>
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification CTA */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="text-purple-400" size={20} />
              <div>
                <div className="text-purple-300 font-medium">Get exclusive bonuses from casinos</div>
                <div className="text-sm text-gray-400">Verify your VIP status to receive personalized offers</div>
              </div>
            </div>
            <Link
              href="/verify"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              Verify Now
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Verified VIPs</h1>
          <p className="text-sm text-gray-500">Anonymized verified players receiving offers from casinos</p>
        </div>

        {/* Recent Offers Section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Recent Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{offer.casino}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    offer.status === 'accepted' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{offer.amount}</div>
                <div className="text-xs text-gray-500 mb-3">{offer.type}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>To {offer.vipTier} VIP</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {offer.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Casino:</span>
            <div className="flex gap-1">
              {casinos.map((casino) => (
                <button
                  key={casino}
                  onClick={() => setSelectedCasino(casino)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedCasino === casino
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-[#12121c] text-gray-400 hover:text-white border border-transparent'
                  }`}
                >
                  {casino === 'all' ? 'All' : casino}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Tier:</span>
            <div className="flex gap-1">
              {tiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedTier === tier
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-[#12121c] text-gray-400 hover:text-white border border-transparent'
                  }`}
                >
                  {tier === 'all' ? 'All' : tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* VIPs Table */}
        <div className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase bg-[#0f0f1a]">
                <th className="text-left px-4 py-3 font-medium">VIP ID</th>
                <th className="text-left px-4 py-3 font-medium">Casino</th>
                <th className="text-left px-4 py-3 font-medium">Tier</th>
                <th className="text-right px-4 py-3 font-medium">Volume (Casino)</th>
                <th className="text-right px-4 py-3 font-medium">Volume (Sports)</th>
                <th className="text-right px-4 py-3 font-medium">P&L (Casino)</th>
                <th className="text-right px-4 py-3 font-medium">P&L (Sports)</th>
                <th className="text-right px-4 py-3 font-medium">Active</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredVIPs.map((vip) => (
                <tr key={vip.id} className="border-t border-gray-800/30 hover:bg-[#1a1a2e]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Lock className="text-gray-600" size={12} />
                      <span className="font-mono text-xs text-gray-400">{vip.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{vip.casino}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${
                      vip.tier === 'Diamond' ? 'text-cyan-400' :
                      vip.tier === 'Platinum' ? 'text-purple-400' :
                      vip.tier === 'Gold' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {vip.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white">${vip.volumeCasino.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-400">
                    {vip.volumeSports > 0 ? `$${vip.volumeSports.toLocaleString()}` : '-'}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${vip.pnlCasino >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPnL(vip.pnlCasino)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${vip.pnlSports >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPnL(vip.pnlSports)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 text-xs">{vip.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVIPs.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No VIPs match your filters
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-gray-600">
          All player data is anonymized. Personal information is only shared after mutual consent.
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="text-gray-500 text-sm">© 2026 GamStart</div>
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

