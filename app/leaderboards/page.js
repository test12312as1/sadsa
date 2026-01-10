'use client';

import { useState } from 'react';
import { Trophy, Zap, Crown, Star, Check, X, ArrowRight, Users, BarChart3, Gift } from 'lucide-react';

// Sample leaderboard data for preview cards
const SAMPLE_LEADERBOARDS = [
  {
    id: 'orange',
    streamerName: 'Orange',
    casino: 'Roobet',
    prizePool: 5000,
    accentColor: '#f97316', // Orange
    timeline: 'Bi-Weekly',
    participants: 247
  },
  {
    id: 'purple',
    streamerName: 'Purple',
    casino: 'Rainbet',
    prizePool: 10000,
    accentColor: '#8b5cf6', // Purple
    timeline: 'Monthly',
    participants: 512
  },
  {
    id: 'green',
    streamerName: 'Green',
    casino: 'Stake',
    prizePool: 25000,
    accentColor: '#22c55e', // Green
    timeline: 'Weekly',
    participants: 1834
  }
];

const FEATURES = [
  {
    icon: Trophy,
    title: 'Custom Leaderboards',
    description: 'Create branded leaderboards that match your stream aesthetic'
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Leaderboard updates automatically as your viewers wager'
  },
  {
    icon: Users,
    title: 'Engage Your Community',
    description: 'Drive engagement with competitive prize pools'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance and viewer participation'
  }
];

const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      { text: '1 Active Leaderboard', included: true },
      { text: 'Subdomain (you.gamblescan.org)', included: true },
      { text: 'All Casino Integrations', included: true },
      { text: 'Custom Accent Colors', included: true },
      { text: 'Social Links', included: true },
      { text: 'Custom Domain', included: false },
      { text: 'Multiple Leaderboards', included: false },
      { text: 'VIP Highroller Insights', included: false }
    ]
  },
  pro: {
    name: 'Pro',
    price: 199,
    features: [
      { text: 'Unlimited Leaderboards', included: true },
      { text: 'Subdomain (you.gamblescan.org)', included: true },
      { text: 'All Casino Integrations', included: true },
      { text: 'Custom Accent Colors', included: true },
      { text: 'Social Links', included: true },
      { text: 'Custom Domain', included: true },
      { text: 'Multiple Leaderboards', included: true },
      { text: 'VIP Highroller Insights', included: true }
    ]
  }
};

export default function LeaderboardsLanding() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Navbar */}
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
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-300 transition-all"
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
                  className="px-3 py-1.5 text-sm text-white font-medium transition-colors"
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

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Crown className="text-purple-400" size={16} />
            <span className="text-sm text-purple-300">For Gambling Streamers</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Build Your Own <span className="text-purple-400">Leaderboard</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Create custom affiliate leaderboards for your community. Track wagers, 
            distribute prizes, and grow your audience with competitive engagement.
          </p>
          
          <a
            href="/leaderboards/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
          >
            Create Your Leaderboard
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Sample Leaderboards */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Sample Leaderboards</h2>
          <p className="text-gray-500 text-center mb-8">Click to preview live examples</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_LEADERBOARDS.map((lb) => (
              <a
                key={lb.id}
                href={`/leaderboards/sample/${lb.id}`}
                className="group bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all hover:scale-[1.02]"
              >
                {/* Header with accent color */}
                <div 
                  className="h-2"
                  style={{ backgroundColor: lb.accentColor }}
                />
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: lb.accentColor }}
                      >
                        {lb.streamerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{lb.streamerName}</div>
                        <div className="text-xs text-gray-500">{lb.casino}</div>
                      </div>
                    </div>
                    <div 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${lb.accentColor}20`, color: lb.accentColor }}
                    >
                      {lb.timeline}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Prize Pool</div>
                      <div className="text-white font-bold">${lb.prizePool.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-xs">Participants</div>
                      <div className="text-white font-medium">{lb.participants}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-center gap-2 text-sm text-gray-400 group-hover:text-purple-400 transition-colors">
                    <span>View Leaderboard</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-2">What's Possible</h2>
          <p className="text-gray-500 text-center mb-8">Everything you need to run successful competitions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="text-purple-400" size={20} />
                </div>
                <h3 className="font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Simple Pricing</h2>
          <p className="text-gray-500 text-center mb-8">Start free, upgrade when you need more</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{PRICING.free.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {PRICING.free.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check className="text-green-400 shrink-0" size={16} />
                    ) : (
                      <X className="text-gray-600 shrink-0" size={16} />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <a
                href="/leaderboards/create"
                className="block w-full py-3 text-center bg-[#1a1a2e] hover:bg-[#252540] text-white font-medium rounded-lg transition-colors"
              >
                Get Started Free
              </a>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-6 border border-purple-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{PRICING.pro.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">${PRICING.pro.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {PRICING.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check className="text-purple-400 shrink-0" size={16} />
                    ) : (
                      <X className="text-gray-600 shrink-0" size={16} />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <a
                href="/leaderboards/create?plan=pro"
                className="block w-full py-3 text-center bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="text-gray-500 text-sm">
              © 2026 GambleScan
            </div>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}







