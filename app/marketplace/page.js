'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Heart, Clock } from 'lucide-react';
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
    price: 8500,
    created: '2 days ago',
    watchlist: 46
  },
  {
    id: 'GS-2026-002',
    casino: 'Rollbit',
    tier: 'Platinum',
    volumeCasino: 142000,
    volumeSports: 0,
    pnlCasino: -18500,
    pnlSports: 0,
    price: 4200,
    created: '5 days ago',
    watchlist: 38
  },
  {
    id: 'GS-2026-003',
    casino: 'Shuffle',
    tier: 'Platinum',
    volumeCasino: 95000,
    volumeSports: 67000,
    pnlCasino: -12000,
    pnlSports: 3200,
    price: 5800,
    created: '1 week ago',
    watchlist: 32
  },
  {
    id: 'GS-2026-004',
    casino: 'Stake',
    tier: 'Gold',
    volumeCasino: 52000,
    volumeSports: 28000,
    pnlCasino: -8200,
    pnlSports: -1800,
    price: 2400,
    created: '3 days ago',
    watchlist: 21
  },
  {
    id: 'GS-2026-005',
    casino: 'Roobet',
    tier: 'Gold',
    volumeCasino: 78000,
    volumeSports: 0,
    pnlCasino: 12000,
    pnlSports: 0,
    price: 3100,
    created: '4 days ago',
    watchlist: 28
  },
  {
    id: 'GS-2026-006',
    casino: 'Gamdom',
    tier: 'Platinum',
    volumeCasino: 120000,
    volumeSports: 35000,
    pnlCasino: -22000,
    pnlSports: -5000,
    price: 4600,
    created: '1 day ago',
    watchlist: 19
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
  const [sortBy, setSortBy] = useState('recent');

  const casinos = ['all', 'Stake', 'Rollbit', 'Shuffle', 'Roobet', 'Gamdom'];
  const tiers = ['all', 'Diamond', 'Platinum', 'Gold'];

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
                <span className="text-sm text-white font-medium">Account Marketplace</span>
                <Link href="/vip-dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                  VIP Offers
                </Link>
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
        {/* Search Bar - Full Width */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a2e] border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 text-lg"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Filters Row */}
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

          <button
            onClick={() => setShowSellModal(true)}
            className="px-5 py-2 bg-[#2a2a3e] hover:bg-[#3a3a4e] text-white rounded-lg text-sm font-medium transition-colors border border-gray-600"
          >
            List Your Account
          </button>
        </div>

        {/* Results Count + Sort */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-400">{filteredListings.length} accounts available</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Sort by:</span>
            {['Recent', 'Price Low', 'Price High', 'Volume'].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort.toLowerCase())}
                className={`transition-colors ${sortBy === sort.toLowerCase() ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Table - Domain Style */}
        <div className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800/50 text-xs text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Account</div>
            <div className="col-span-1 text-center">Tier</div>
            <div className="col-span-2 text-right">Volume</div>
            <div className="col-span-2 text-right">P&L</div>
            <div className="col-span-1 text-center">Watchlist</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-1"></div>
          </div>

          {/* Listings */}
          {filteredListings.map((listing) => (
            <div key={listing.id} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-800/30 hover:bg-[#1a1a2e]/50 transition-colors items-center">
              {/* Account Info */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                    {listing.casino[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{listing.casino}</div>
                    <div className="text-xs text-gray-500 font-mono">{listing.id}</div>
                  </div>
                </div>
              </div>

              {/* Tier */}
              <div className="col-span-1 text-center">
                <span className={`text-sm font-medium ${
                  listing.tier === 'Diamond' ? 'text-cyan-400' :
                  listing.tier === 'Platinum' ? 'text-purple-400' :
                  'text-yellow-400'
                }`}>
                  {listing.tier}
                </span>
              </div>

              {/* Volume */}
              <div className="col-span-2 text-right">
                <div className="text-white">${listing.volumeCasino.toLocaleString()}</div>
                {listing.volumeSports > 0 && (
                  <div className="text-xs text-gray-500">+${listing.volumeSports.toLocaleString()} sports</div>
                )}
              </div>

              {/* P&L */}
              <div className="col-span-2 text-right">
                <div className={listing.pnlCasino >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatPnL(listing.pnlCasino)}
                </div>
                {listing.pnlSports !== 0 && (
                  <div className={`text-xs ${listing.pnlSports >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                    {formatPnL(listing.pnlSports)} sports
                  </div>
                )}
              </div>

              {/* Watchlist */}
              <div className="col-span-1 text-center text-gray-400">
                {listing.watchlist}
              </div>

              {/* Price */}
              <div className="col-span-2 text-right">
                <div className="text-white text-lg font-semibold">${listing.price.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{listing.created}</div>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-2">
                <button className="px-4 py-2 bg-[#2a2a3e] hover:bg-[#3a3a4e] text-white rounded-lg text-sm font-medium transition-colors">
                  Contact
                </button>
                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                  <Heart size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {filteredListings.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              No accounts match your filters
            </div>
          )}
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-sm text-gray-600">
          All transactions are facilitated through our secure brokerage service.
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

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">List Your Account</h3>
            <p className="text-sm text-gray-400 mb-6">
              To list your casino account for sale, first scan your wallet on our Players page. 
              Once verified, you can list each casino account separately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSellModal(false)}
                className="flex-1 py-2.5 bg-[#2a2a3e] hover:bg-[#3a3a4e] text-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <Link
                href="/"
                className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium transition-colors text-center"
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
        <div className="w-8 h-8 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4" />
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
