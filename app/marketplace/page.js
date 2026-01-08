'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Shield, Lock, DollarSign, Users, CheckCircle, AlertTriangle, Eye, EyeOff, MessageSquare, ChevronRight, Star, TrendingUp, Clock, Filter, Search } from 'lucide-react';
import Link from 'next/link';

// Demo listings data
const DEMO_LISTINGS = [
  {
    id: 'listing-001',
    tier: 'Diamond',
    totalVolume: 285000,
    estimatedValue: 42750,
    casinos: ['Stake', 'Rollbit', 'Shuffle'],
    vipLevel: 'Diamond',
    verified: true,
    created: '2 days ago',
    views: 47,
    inquiries: 3
  },
  {
    id: 'listing-002',
    tier: 'Platinum',
    totalVolume: 142000,
    estimatedValue: 21300,
    casinos: ['Stake', 'Roobet'],
    vipLevel: 'Platinum',
    verified: true,
    created: '5 days ago',
    views: 89,
    inquiries: 7
  },
  {
    id: 'listing-003',
    tier: 'Gold',
    totalVolume: 78000,
    estimatedValue: 11700,
    casinos: ['Gamdom', 'Duel'],
    vipLevel: 'Gold',
    verified: true,
    created: '1 week ago',
    views: 124,
    inquiries: 5
  },
  {
    id: 'listing-004',
    tier: 'Platinum',
    totalVolume: 195000,
    estimatedValue: 29250,
    casinos: ['Stake', 'Shuffle', 'Roobet', 'BC.Game'],
    vipLevel: 'Platinum',
    verified: false,
    created: '3 days ago',
    views: 56,
    inquiries: 2
  },
  {
    id: 'listing-005',
    tier: 'Silver',
    totalVolume: 32000,
    estimatedValue: 4800,
    casinos: ['Duel'],
    vipLevel: 'Silver',
    verified: true,
    created: '2 weeks ago',
    views: 203,
    inquiries: 12
  }
];

const getTierColor = (tier) => {
  switch (tier) {
    case 'Diamond': return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'Platinum': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'Gold': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    case 'Silver': return { bg: 'bg-gray-400/20', text: 'text-gray-300', border: 'border-gray-400/30' };
    default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
  }
};

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const walletParam = searchParams.get('wallet');
  const valueParam = searchParams.get('value');
  
  const [activeTab, setActiveTab] = useState(walletParam ? 'sell' : 'browse');
  const [listingStep, setListingStep] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Form state for selling
  const [sellForm, setSellForm] = useState({
    wallet: walletParam || '',
    askingPrice: valueParam ? Math.round(parseFloat(valueParam) * 0.15) : '',
    description: '',
    acceptTerms: false
  });

  const estimatedValue = valueParam ? Math.round(parseFloat(valueParam) * 0.15) : 0;

  const filteredListings = DEMO_LISTINGS.filter(listing => {
    if (selectedFilter !== 'all' && listing.tier.toLowerCase() !== selectedFilter) return false;
    if (searchQuery && !listing.casinos.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={18} />
                <span className="text-sm">Back</span>
              </Link>
              <div className="w-px h-6 bg-gray-700" />
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-blue-400" size={20} />
                <span className="text-white font-semibold">Account Marketplace</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Important Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-blue-300 font-medium mb-1">Secure Middleman Service</h3>
              <p className="text-sm text-gray-400">
                All transactions are handled through GamStart's secure escrow service. We verify both parties and protect your privacy throughout the process. No personal information is shared until both parties agree to proceed.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'browse'
                ? 'bg-blue-500 text-white'
                : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
            }`}
          >
            Browse Listings
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'sell'
                ? 'bg-blue-500 text-white'
                : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
            }`}
          >
            Sell Your Account
          </button>
        </div>

        {/* BROWSE TAB */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="text-2xl font-bold text-white">{DEMO_LISTINGS.length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Active Listings</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="text-2xl font-bold text-blue-400">$109,800</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Total Value</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="text-2xl font-bold text-green-400">23</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Sold This Week</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50">
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Success Rate</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search by casino name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                {['all', 'diamond', 'platinum', 'gold', 'silver'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      selectedFilter === filter
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => {
                const tierStyle = getTierColor(listing.tier);
                return (
                  <div
                    key={listing.id}
                    className="bg-[#12121c] rounded-xl border border-gray-800/50 hover:border-gray-700 transition-all overflow-hidden group"
                  >
                    {/* Header */}
                    <div className={`px-4 py-3 ${tierStyle.bg} border-b ${tierStyle.border}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className={tierStyle.text} size={16} />
                          <span className={`font-semibold ${tierStyle.text}`}>{listing.tier} VIP</span>
                        </div>
                        {listing.verified && (
                          <div className="flex items-center gap-1 text-green-400 text-xs">
                            <CheckCircle size={12} />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Volume</div>
                          <div className="text-lg font-bold text-white">${listing.totalVolume.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Asking</div>
                          <div className="text-lg font-bold text-blue-400">${listing.estimatedValue.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Casinos */}
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Casinos</div>
                        <div className="flex flex-wrap gap-1.5">
                          {listing.casinos.map((casino) => (
                            <span key={casino} className="px-2 py-1 bg-[#1a1a2e] rounded text-xs text-gray-300">
                              {casino}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800/50">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {listing.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            {listing.inquiries}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {listing.created}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="px-4 pb-4">
                      <button className="w-full py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-500 group-hover:text-white">
                        <Lock size={14} />
                        Request Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* How It Works */}
            <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50 mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">How Premium Brokering Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 font-bold">1</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Browse Listings</div>
                  <div className="text-xs text-gray-500">View anonymized account details - volume, tier, casinos</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 font-bold">2</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Request Details</div>
                  <div className="text-xs text-gray-500">Express interest - both parties remain anonymous</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 font-bold">3</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Secure Escrow</div>
                  <div className="text-xs text-gray-500">Buyer deposits funds into GamStart escrow</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 font-bold">4</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Transfer & Payout</div>
                  <div className="text-xs text-gray-500">Account transferred, seller paid, buyer verified</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SELL TAB */}
        {activeTab === 'sell' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    listingStep >= step
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#1a1a2e] text-gray-500'
                  }`}>
                    {listingStep > step ? <CheckCircle size={18} /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-24 md:w-32 h-1 mx-2 rounded ${
                      listingStep > step ? 'bg-blue-500' : 'bg-[#1a1a2e]'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Account Info */}
            {listingStep === 1 && (
              <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Account Information</h2>
                  <p className="text-sm text-gray-400">Your wallet has been scanned. Review your estimated account value.</p>
                </div>

                {/* Estimated Value Card */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-5 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-300 mb-1">Estimated Account Value</div>
                      <div className="text-3xl font-bold text-white">${estimatedValue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Based on ${valueParam ? parseFloat(valueParam).toLocaleString() : '0'} deposit volume (15% valuation)
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <DollarSign className="text-blue-400" size={32} />
                    </div>
                  </div>
                </div>

                {/* Wallet */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Connected Wallet</label>
                  <div className="bg-[#1a1a2e] rounded-lg p-3 font-mono text-sm text-gray-300 break-all">
                    {sellForm.wallet || 'No wallet connected'}
                  </div>
                </div>

                {/* Custom Price */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Asking Price (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder={estimatedValue.toString()}
                      value={sellForm.askingPrice}
                      onChange={(e) => setSellForm({ ...sellForm, askingPrice: e.target.value })}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave blank to use estimated value</p>
                </div>

                <button
                  onClick={() => setListingStep(2)}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Privacy Settings */}
            {listingStep === 2 && (
              <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Privacy & Listing Settings</h2>
                  <p className="text-sm text-gray-400">Choose what information is visible to potential buyers.</p>
                </div>

                {/* What's Visible */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-400 mb-2">Public Information (Visible to Buyers)</div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <Eye className="text-green-400" size={18} />
                    <div>
                      <div className="text-sm text-white">Deposit Volume & VIP Tier</div>
                      <div className="text-xs text-gray-500">Total gambling volume and achieved status</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <Eye className="text-green-400" size={18} />
                    <div>
                      <div className="text-sm text-white">Casino List</div>
                      <div className="text-xs text-gray-500">Which platforms the account has history with</div>
                    </div>
                  </div>
                </div>

                {/* What's Hidden */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-400 mb-2">Private Information (Hidden Until Deal)</div>
                  <div className="flex items-center gap-3 p-3 bg-[#1a1a2e] rounded-lg border border-gray-700">
                    <EyeOff className="text-gray-500" size={18} />
                    <div>
                      <div className="text-sm text-gray-300">Wallet Address</div>
                      <div className="text-xs text-gray-500">Only revealed after escrow is funded</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#1a1a2e] rounded-lg border border-gray-700">
                    <EyeOff className="text-gray-500" size={18} />
                    <div>
                      <div className="text-sm text-gray-300">Personal Details</div>
                      <div className="text-xs text-gray-500">Email, usernames - never shared automatically</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Additional Notes (Optional)</label>
                  <textarea
                    placeholder="Any special features, bonuses, or notes about the account..."
                    value={sellForm.description}
                    onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setListingStep(1)}
                    className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setListingStep(3)}
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {listingStep === 3 && (
              <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Review Your Listing</h2>
                  <p className="text-sm text-gray-400">Confirm the details before submitting.</p>
                </div>

                {/* Summary */}
                <div className="bg-[#1a1a2e] rounded-xl p-5 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asking Price</span>
                    <span className="text-white font-semibold">
                      ${sellForm.askingPrice || estimatedValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee (5%)</span>
                    <span className="text-gray-300">
                      -${Math.round((sellForm.askingPrice || estimatedValue) * 0.05).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-700 pt-4 flex justify-between">
                    <span className="text-gray-300 font-medium">You Receive</span>
                    <span className="text-green-400 font-bold text-lg">
                      ${Math.round((sellForm.askingPrice || estimatedValue) * 0.95).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={sellForm.acceptTerms}
                    onChange={(e) => setSellForm({ ...sellForm, acceptTerms: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    I understand that GamStart acts as a middleman and will hold funds in escrow until the account transfer is verified. I agree to the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>.
                  </label>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-sm text-gray-300">
                      <strong className="text-yellow-300">Important:</strong> Selling casino accounts may violate platform terms of service. GamStart facilitates transactions but does not guarantee account longevity post-transfer.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setListingStep(2)}
                    className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={!sellForm.acceptTerms}
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Create Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#12121c] rounded-2xl p-8 max-w-md w-full border border-gray-800 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Listing Created!</h3>
              <p className="text-gray-400 mb-6">
                Your account has been listed on the marketplace. You'll be notified when a buyer expresses interest.
              </p>
              <div className="bg-[#1a1a2e] rounded-lg p-4 mb-6">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Listing ID</div>
                <div className="font-mono text-lg text-white">GS-2026-00{Math.floor(Math.random() * 900 + 100)}</div>
              </div>
              <Link
                href="/"
                className="block w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Loading fallback component
function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading marketplace...</p>
      </div>
    </div>
  );
}

// Wrap in Suspense boundary for useSearchParams
export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplaceContent />
    </Suspense>
  );
}

