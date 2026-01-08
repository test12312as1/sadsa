'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart, Lock, ChevronRight, Clock, MessageSquare, Filter, Search, Trophy, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Demo listings data - per casino account
const DEMO_LISTINGS = [
  {
    id: 'GS-2026-001',
    casino: 'Stake',
    tier: 'Diamond',
    volumeCasino: 285000,
    volumeSports: 42000,
    pnlCasino: -38000,
    pnlSports: -4200,
    created: '2 days ago',
  },
  {
    id: 'GS-2026-002',
    casino: 'Rollbit',
    tier: 'Platinum',
    volumeCasino: 142000,
    volumeSports: 0,
    pnlCasino: -18500,
    pnlSports: 0,
    created: '5 days ago',
  },
  {
    id: 'GS-2026-003',
    casino: 'Shuffle',
    tier: 'Platinum',
    volumeCasino: 95000,
    volumeSports: 67000,
    pnlCasino: -12000,
    pnlSports: 3200,
    created: '1 week ago',
  },
  {
    id: 'GS-2026-004',
    casino: 'Stake',
    tier: 'Gold',
    volumeCasino: 52000,
    volumeSports: 28000,
    pnlCasino: -8200,
    pnlSports: -1800,
    created: '3 days ago',
  },
  {
    id: 'GS-2026-005',
    casino: 'Roobet',
    tier: 'Gold',
    volumeCasino: 78000,
    volumeSports: 0,
    pnlCasino: 12000,
    pnlSports: 0,
    created: '4 days ago',
  },
  {
    id: 'GS-2026-006',
    casino: 'Gamdom',
    tier: 'Platinum',
    volumeCasino: 120000,
    volumeSports: 35000,
    pnlCasino: -22000,
    pnlSports: -5000,
    created: '1 day ago',
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

function MarketplaceContent() {
  const searchParams = useSearchParams();
  
  const [selectedCasino, setSelectedCasino] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSellModal, setShowSellModal] = useState(false);

  const casinos = ['all', 'Stake', 'Rollbit', 'Shuffle', 'Roobet', 'Gamdom'];
  const tiers = ['all', 'Diamond', 'Platinum', 'Gold', 'Silver'];

  const filteredListings = DEMO_LISTINGS.filter(listing => {
    if (selectedCasino !== 'all' && listing.casino !== selectedCasino) return false;
    if (selectedTier !== 'all' && listing.tier !== selectedTier) return false;
    if (searchQuery && !listing.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatPnL = (value) => {
    if (value === 0) return '-';
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}$${Math.abs(value).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Navbar - Same as main page */}
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
                <span className="px-3 py-1.5 text-sm text-white font-medium">
                  Account Marketplace
                </span>
                <Link
                  href="/vip-dashboard"
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Verified VIPs
                </Link>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Account Marketplace</h1>
            <p className="text-sm text-gray-500">Browse verified casino accounts available for transfer</p>
          </div>
          <button
            onClick={() => setShowSellModal(true)}
            className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 hover:text-white rounded-lg border border-gray-700 transition-all text-sm font-medium"
          >
            List Your Account
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12121c] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>
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
              {tiers.slice(0, 4).map((tier) => (
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

        {/* Listings Table */}
        <div className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase bg-[#0f0f1a]">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Casino</th>
                <th className="text-left px-4 py-3 font-medium">Tier</th>
                <th className="text-right px-4 py-3 font-medium">Volume (Casino)</th>
                <th className="text-right px-4 py-3 font-medium">Volume (Sports)</th>
                <th className="text-right px-4 py-3 font-medium">P&L (Casino)</th>
                <th className="text-right px-4 py-3 font-medium">P&L (Sports)</th>
                <th className="text-right px-4 py-3 font-medium">Listed</th>
                <th className="text-right px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="border-t border-gray-800/30 hover:bg-[#1a1a2e]/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-400">{listing.id}</span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{listing.casino}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${
                      listing.tier === 'Diamond' ? 'text-cyan-400' :
                      listing.tier === 'Platinum' ? 'text-purple-400' :
                      listing.tier === 'Gold' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {listing.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white">${listing.volumeCasino.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-400">
                    {listing.volumeSports > 0 ? `$${listing.volumeSports.toLocaleString()}` : '-'}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${listing.pnlCasino >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPnL(listing.pnlCasino)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${listing.pnlSports >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPnL(listing.pnlSports)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 text-xs">{listing.created}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded text-xs font-medium transition-colors">
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredListings.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No listings match your filters
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-gray-600">
          All transactions are facilitated through our secure brokerage service. 
          <button className="text-purple-400 hover:text-purple-300 ml-1">Learn more</button>
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

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121c] rounded-xl p-6 max-w-md w-full border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">List Your Account</h3>
            <p className="text-sm text-gray-400 mb-6">
              To list your casino account, first scan your wallet on our Players page. 
              Once verified, you can list each casino account separately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSellModal(false)}
                className="flex-1 py-2.5 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <Link
                href="/"
                className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-center"
              >
                Scan Wallet
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplaceContent />
    </Suspense>
  );
}
