'use client';

import { useState } from 'react';
import { Crown, Clock, ChevronRight, BarChart3, Building2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Telegram Icon
const TelegramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
  </svg>
);

// Demo verified VIPs (anonymized) - with game preferences instead of casino
const DEMO_VIPS = [
  {
    gameOfChoice: 'Hacksaw Slots Player',
    volumeCasino: 285000,
    volumeSports: 42000,
    lastActive: '2h ago',
    telegram: '@player_abc123',
    discord: 'player#4567',
    lookingFor: ['VIP Transfer', 'Cashback On Originals']
  },
  {
    gameOfChoice: 'Basketball Bettor',
    volumeCasino: 142000,
    volumeSports: 0,
    lastActive: '5h ago',
    telegram: '@betting_pro',
    lookingFor: ['Higher Soccer Limits', 'Daily Lossback Deal']
  },
  {
    gameOfChoice: 'Plinko Player',
    volumeCasino: 195000,
    volumeSports: 67000,
    lastActive: '1d ago',
    discord: 'plinko#1234',
    lookingFor: ['VIP Transfer', 'Cashback On Originals']
  },
  {
    gameOfChoice: 'Roulette Specialist',
    volumeCasino: 78000,
    volumeSports: 28000,
    lastActive: '3h ago',
    telegram: '@roulette_vip',
    discord: 'roulette#5678',
    lookingFor: ['Daily Lossback Deal', 'Higher Soccer Limits']
  },
  {
    gameOfChoice: 'Blackjack Pro',
    volumeCasino: 420000,
    volumeSports: 0,
    lastActive: '30m ago',
    telegram: '@blackjack_elite',
    discord: 'blackjack#9012',
    lookingFor: ['VIP Transfer', 'Cashback On Originals', 'Daily Lossback Deal']
  },
  {
    gameOfChoice: 'Football Bettor',
    volumeCasino: 52000,
    volumeSports: 35000,
    lastActive: '1w ago',
    telegram: '@football_bet',
    lookingFor: ['Higher Soccer Limits']
  },
  {
    gameOfChoice: 'Crash Game Enthusiast',
    volumeCasino: 380000,
    volumeSports: 120000,
    lastActive: '4h ago',
    discord: 'crash#7890',
    lookingFor: ['VIP Transfer', 'Daily Lossback Deal']
  },
  {
    gameOfChoice: 'Live Dealer Regular',
    volumeCasino: 165000,
    volumeSports: 45000,
    lastActive: '12h ago',
    telegram: '@live_dealer',
    discord: 'live#2345',
    lookingFor: ['Cashback On Originals', 'Higher Soccer Limits']
  }
];

// Demo recent offers - more general, showcasing possibilities
const DEMO_PAST_OFFERS = [
  {
    id: 'offer-001',
    offer: 'VIP Transfer',
    description: 'High-volume player with $285K casino wagering',
    wager: '$285K',
    timeAgo: '3 days ago'
  },
  {
    id: 'offer-002',
    offer: 'Custom Sports Betting Limits',
    description: 'Verified bettor with $67K sports volume',
    wager: '$67K',
    timeAgo: '1 week ago'
  },
  {
    id: 'offer-003',
    offer: 'Personal VIP Host',
    description: 'Dedicated host assigned to $195K casino player',
    wager: '$195K',
    timeAgo: '2 weeks ago'
  },
  {
    id: 'offer-004',
    offer: 'Exclusive Reload Bonus',
    description: 'Custom reload package for $420K volume player',
    wager: '$420K',
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
  const [showCasinoVerifyModal, setShowCasinoVerifyModal] = useState(false);
  const [casinoFormData, setCasinoFormData] = useState({
    type: 'operator',
    brandName: '',
    telegram: ''
  });

  const handleCasinoVerify = async (e) => {
    e.preventDefault();
    // Handle casino/affiliate verification submission
    console.log('Casino verification:', casinoFormData);
    setShowCasinoVerifyModal(false);
    // Show success message
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity">
                <span className="text-purple-500">◈</span>
                GamStart
              </Link>
              
              <div className="flex items-center bg-[#1a1a2e] rounded-lg p-0.5">
                <Link href="/" className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-gray-300 transition-all">
                  Players
                </Link>
                <Link href="/?tab=platforms" className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-gray-300 transition-all">
                  Casinos
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-1">
                <Link href="/marketplace" className="px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Account Marketplace
                </Link>
                <span className="px-3 py-1.5 text-sm text-purple-400 font-medium">
                  VIP Offers
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header - Matching Casinos page style */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Crown className="text-purple-400" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">VIP Offers</h1>
              <p className="text-sm text-gray-500">Personalized offers from top crypto casinos</p>
            </div>
          </div>
        </div>

        {/* Hero Section - Luxurious Copy + Process Flow */}
        <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-6 border border-purple-500/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Value Proposition */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Casinos compete for your action</h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Stop chasing generic bonuses. Verify your wagering history and let casinos come to you with 
                personalized VIP offers tailored to your playing style. High-volume players receive exclusive 
                reload bonuses, dedicated VIP hosts, and custom promotions not available anywhere else.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
              >
                Get Verified
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Right - Process Flow (Text Only) */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm shrink-0">1</div>
                  <div>
                    <div className="text-white font-medium">Verify Wager</div>
                    <div className="text-sm text-gray-500">Scan your wallet to verify your casino activity</div>
                  </div>
                </div>
                <div className="ml-4 border-l border-purple-500/20 h-4" />
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm shrink-0">2</div>
                  <div>
                    <div className="text-white font-medium">Get Matched</div>
                    <div className="text-sm text-gray-500">Casinos see your anonymized profile and stats</div>
                  </div>
                </div>
                <div className="ml-4 border-l border-purple-500/20 h-4" />
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm shrink-0">3</div>
                  <div>
                    <div className="text-white font-medium">Receive Offers</div>
                    <div className="text-sm text-gray-500">Accept personalized offers from competing casinos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Offers Section */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Recent Offers Accepted</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_PAST_OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 hover:border-purple-500/30 transition-colors"
              >
                <div className="text-lg font-semibold text-white mb-2">{offer.offer}</div>
                <div className="text-sm text-gray-400 mb-3">{offer.description}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Wager: {offer.wager}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {offer.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified VIPs Section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Verified VIPs</h2>
          
          {/* Casino/Affiliate Representative Section */}
          <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="text-purple-400" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">For Casino & Affiliate Representatives</h3>
                  <p className="text-sm text-gray-400">
                    Are you a representative of a casino or an affiliate? Get verified and send offers to verified high rollers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCasinoVerifyModal(true)}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2 shrink-0"
              >
                Get Verified
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* VIP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_VIPS.map((vip, index) => (
            <div
              key={index}
              className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden hover:border-purple-500/30 transition-all group"
            >
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-gray-800/50 bg-purple-500/5">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium text-sm">{vip.gameOfChoice}</div>
                  <CheckCircle2 className="text-green-400" size={16} />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0a0a14] rounded-lg p-2.5">
                    <div className="text-[10px] text-gray-500 uppercase mb-0.5">Casino Vol</div>
                    <div className="text-white text-sm font-medium">${(vip.volumeCasino / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="bg-[#0a0a14] rounded-lg p-2.5">
                    <div className="text-[10px] text-gray-500 uppercase mb-0.5">Sports Vol</div>
                    <div className="text-white text-sm font-medium">
                      {vip.volumeSports > 0 ? `$${(vip.volumeSports / 1000).toFixed(0)}K` : '-'}
                    </div>
                  </div>
                </div>

                {/* Looking For */}
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-2">Looking for:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {vip.lookingFor.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-xs rounded border border-purple-500/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blurred Contact Info */}
                <div className="space-y-1.5 pt-2 border-t border-gray-800/50">
                  {vip.telegram && (
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600">
                        <TelegramIcon size={14} />
                      </div>
                      <div className="text-xs text-gray-500 font-mono blur-sm select-none">
                        {vip.telegram}
                      </div>
                    </div>
                  )}
                  {vip.discord && (
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600">
                        <DiscordIcon size={14} />
                      </div>
                      <div className="text-xs text-gray-500 font-mono blur-sm select-none">
                        {vip.discord}
                      </div>
                    </div>
                  )}
                  <div className="text-[10px] text-gray-600 italic mt-1">
                    Verify to access contact info
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Last active: {vip.lastActive}
                </div>
              </div>
            </div>
          ))}
        </div>

        {DEMO_VIPS.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No VIPs available
          </div>
        )}

        {/* Info */}
        <div className="mt-8 text-center text-xs text-gray-600">
          All player data is anonymized. Personal information is only shared after mutual consent.
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Casino/Affiliate Verify Modal */}
      {showCasinoVerifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121c] rounded-xl p-6 max-w-md w-full border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Casino / Affiliate Verification</h3>
            <form onSubmit={handleCasinoVerify} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCasinoFormData({...casinoFormData, type: 'operator'})}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                      casinoFormData.type === 'operator'
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#1a1a2e] text-gray-300 hover:bg-[#252540]'
                    }`}
                  >
                    Operator
                  </button>
                  <button
                    type="button"
                    onClick={() => setCasinoFormData({...casinoFormData, type: 'affiliate'})}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                      casinoFormData.type === 'affiliate'
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#1a1a2e] text-gray-300 hover:bg-[#252540]'
                    }`}
                  >
                    Affiliate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Brand Name</label>
                <input
                  type="text"
                  value={casinoFormData.brandName}
                  onChange={(e) => setCasinoFormData({...casinoFormData, brandName: e.target.value})}
                  className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter brand name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Telegram</label>
                <input
                  type="text"
                  value={casinoFormData.telegram}
                  onChange={(e) => setCasinoFormData({...casinoFormData, telegram: e.target.value})}
                  className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="@username"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCasinoVerifyModal(false)}
                  className="flex-1 py-2.5 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

