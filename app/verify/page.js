'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gift, Upload, CheckCircle, Camera, MessageCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

const CASINOS = ['Stake', 'Rollbit', 'Shuffle', 'Roobet', 'Gamdom', 'Rainbet', 'Duel', 'StakeUS', '500 Casino', 'BC.GAME'];

function VerifyContent() {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    casino: '',
    wagerAmount: '',
    telegram: ''
  });
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot({ name: file.name, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
        {/* Navbar */}
        <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity">
                  <span className="text-purple-500">◈</span>
                  GambleScan
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
                  <Link href="/vip-dashboard" className="px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    VIP Offers
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

        <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#12121c] rounded-xl p-8 border border-purple-500/20 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Verification Submitted</h1>
            <p className="text-gray-400 mb-6">
              Thank you for submitting your verification request. Our team will review your information and you will be contacted by <span className="text-purple-400 font-medium">@gamstartconcierge</span> on Telegram within a few hours.
            </p>
            <Link
              href="/vip-dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              Go to VIP Dashboard
              <ChevronRight size={16} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity">
                <span className="text-purple-500">◈</span>
                GambleScan
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
                <Link href="/vip-dashboard" className="px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  VIP Offers
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

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="text-purple-400" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">VIP Verification</h1>
          <p className="text-sm text-gray-500">Get personalized offers from top casinos</p>
        </div>

        {/* Verification Form */}
        <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Casino Selection */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Choose Casino</label>
              <select
                value={formData.casino}
                onChange={(e) => setFormData({ ...formData, casino: e.target.value })}
                className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">Select a casino</option>
                {CASINOS.map(casino => (
                  <option key={casino} value={casino} className="bg-[#0a0a14]">{casino}</option>
                ))}
              </select>
            </div>

            {/* Wager Amount */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Total Wager Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.wagerAmount}
                onChange={(e) => setFormData({ ...formData, wagerAmount: e.target.value })}
                placeholder="Enter your total wagering amount"
                className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Casino Stats Screenshot</label>
              <div className="border border-dashed border-gray-700 rounded-lg p-6 text-center relative hover:border-purple-500/50 transition-colors">
                {screenshot ? (
                  <div className="space-y-2">
                    <CheckCircle className="text-purple-400 mx-auto" size={24} />
                    <div className="text-sm text-white">{screenshot.name}</div>
                    <button
                      type="button"
                      onClick={() => setScreenshot(null)}
                      className="text-xs text-gray-500 hover:text-purple-400"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className="text-gray-500 mx-auto mb-2" size={24} />
                    <div className="text-sm text-gray-400 mb-1">Click to upload screenshot</div>
                    <div className="text-xs text-gray-600">PNG, JPG up to 10MB</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                  </>
                )}
              </div>
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Telegram Username</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  placeholder="@username"
                  className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">You'll be contacted on this Telegram account</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Submitting...' : 'Submit Verification'}
              <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="text-gray-500 text-sm">© 2026 GambleScan</div>
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

function VerifyLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  );
}


