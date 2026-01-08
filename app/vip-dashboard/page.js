'use client';

import { useState } from 'react';
import { Crown, Lock, Clock, ChevronRight, Info } from 'lucide-react';
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
  },
  {
    id: 'VIP-4L2M',
    casino: 'Shuffle',
    tier: 'Diamond',
    volumeCasino: 380000,
    volumeSports: 120000,
    pnlCasino: -65000,
    pnlSports: -18000,
    lastActive: '4h ago',
  },
  {
    id: 'VIP-6N8P',
    casino: 'Stake',
    tier: 'Platinum',
    volumeCasino: 165000,
    volumeSports: 45000,
    pnlCasino: -28000,
    pnlSports: 5200,
    lastActive: '12h ago',
  }
];

// Demo past/example offers (personalized offers that were made)
const DEMO_PAST_OFFERS = [
  {
    id: 'offer-001',
    casino: 'Stake',
    offer: '$2,500 Welcome Package',
    vipId: 'VIP-8A2F',
    tier: 'Diamond',
    timeAgo: '3 days ago'
  },
  {
    id: 'offer-002',
    casino: 'Rollbit',
    offer: '$1,000 Reload Bonus',
    vipId: 'VIP-3K9D',
    tier: 'Platinum',
    timeAgo: '1 week ago'
  },
  {
    id: 'offer-003',
    casino: 'Shuffle',
    offer: 'Personal VIP Host + $500',
    vipId: 'VIP-7M1X',
    tier: 'Platinum',
    timeAgo: '2 weeks ago'
  },
  {
    id: 'offer-004',
    casino: 'Gamdom',
    offer: '$750 No-Strings Bonus',
    vipId: 'VIP-9Q4R',
    tier: 'Diamond',
    timeAgo: '5 days ago'
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
      {/* Navbar - DexCheck Style */}
      <nav className="bg-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-yellow-400 text-2xl">◈</span>
                <span className="text-white font-bold text-xl">GamStart</span>
              </Link>
              
              <div className="flex items-center bg-[#2a2a2a] rounded-lg p-1">
                <Link href="/" className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white transition-all">
                  Players
                </Link>
                <Link href="/?tab=platforms" className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white transition-all">
                  Casinos
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-6">
                <Link href="/marketplace" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Account Marketplace
                </Link>
                <span className="text-sm text-white font-medium">VIP Offers</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <TwitterIcon size={18} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <DiscordIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] mx-auto px-6 py-8 w-full">
        {/* Combined Header + CTA */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="text-yellow-400" size={28} />
                <h1 className="text-3xl font-bold text-white">VIP Offers</h1>
              </div>
              <p className="text-gray-400 max-w-xl">
                Verify your wagering history and have casinos compete for your action with personalized VIP offers.
              </p>
            </div>
            <Link
              href="/verify"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Get Verified
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        {/* Recent Offers Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Offers Accepted</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_PAST_OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-800/50 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium text-lg">{offer.casino}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    offer.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-400' :
                    offer.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {offer.tier}
                  </span>
                </div>
                <div className="text-xl font-semibold text-white mb-3">{offer.offer}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-mono">{offer.vipId}</span>
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
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg border border-gray-700">
            <span className="text-sm text-gray-400">Casino</span>
            <select 
              value={selectedCasino}
              onChange={(e) => setSelectedCasino(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
            >
              {casinos.map(c => <option key={c} value={c} className="bg-[#1a1a2e]">{c === 'all' ? 'All' : c}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg border border-gray-700">
            <span className="text-sm text-gray-400">Tier</span>
            <select 
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
            >
              {tiers.map(t => <option key={t} value={t} className="bg-[#1a1a2e]">{t === 'all' ? 'All' : t}</option>)}
            </select>
          </div>

          <div className="flex-1" />
          <div className="text-sm text-gray-400">{filteredVIPs.length} verified VIPs</div>
        </div>

        {/* VIP Cards Grid - Luxurious Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredVIPs.map((vip) => (
            <div
              key={vip.id}
              className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all group"
            >
              {/* Card Header with Tier Color */}
              <div className={`px-4 py-3 ${
                vip.tier === 'Diamond' ? 'bg-gradient-to-r from-cyan-500/10 to-transparent' :
                vip.tier === 'Platinum' ? 'bg-gradient-to-r from-purple-500/10 to-transparent' :
                'bg-gradient-to-r from-yellow-500/10 to-transparent'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="text-gray-500" size={12} />
                    <span className="font-mono text-sm text-gray-400">{vip.id}</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    vip.tier === 'Diamond' ? 'text-cyan-400' :
                    vip.tier === 'Platinum' ? 'text-purple-400' : 'text-yellow-400'
                  }`}>
                    {vip.tier}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* Casino */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                    vip.tier === 'Diamond' ? 'bg-cyan-500/20' :
                    vip.tier === 'Platinum' ? 'bg-purple-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {vip.casino[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{vip.casino}</div>
                    <div className="text-xs text-gray-500">{vip.lastActive}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1a1a2e] rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Casino Vol</div>
                    <div className="text-white font-medium">${(vip.volumeCasino / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="bg-[#1a1a2e] rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Sports Vol</div>
                    <div className="text-white font-medium">
                      {vip.volumeSports > 0 ? `$${(vip.volumeSports / 1000).toFixed(0)}K` : '-'}
                    </div>
                  </div>
                </div>

                {/* P&L */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">P&L Casino</span>
                  <span className={vip.pnlCasino >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                    {formatPnL(vip.pnlCasino)}
                  </span>
                </div>
                {vip.pnlSports !== 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">P&L Sports</span>
                    <span className={vip.pnlSports >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                      {formatPnL(vip.pnlSports)}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-4 pb-4">
                <button className="w-full py-2.5 bg-[#2a2a3e] hover:bg-[#3a3a4e] text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:text-white">
                  <Info size={14} />
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVIPs.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No VIPs match your filters
          </div>
        )}

        {/* Info */}
        <div className="mt-10 text-center text-sm text-gray-600">
          All player data is anonymized. Personal information is only shared after mutual consent.
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
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
