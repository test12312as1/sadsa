'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Trophy, ExternalLink } from 'lucide-react';

// Twitter Icon
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

// Twitch Icon
const TwitchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
);

// YouTube Icon
const YouTubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// Kick Icon
const KickIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.333 0v24h5.334v-8l2.666 2.667L14.667 24H22l-8-9.333L22 6h-7.333l-5.334 6V0z" />
  </svg>
);

// Diamond Eye Logo - Eye with diamond pupil
const DiamondEyeLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Eye outline */}
    <path 
      d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-purple-400"
    />
    {/* Diamond pupil */}
    <path 
      d="M12 8L15 12.5L12 17L9 12.5L12 8Z" 
      fill="currentColor"
      className="text-purple-500"
    />
  </svg>
);

// Casino list
const CASINOS = [
  'Stake', 'Roobet', 'Rollbit', 'Shuffle', 'Gamdom', 'Rainbet', 
  'BC.Game', 'Duelbits', '500 Casino', 'Yeet', 'StakeUS', 'Chips.gg'
];

// Accent color presets
const COLOR_PRESETS = [
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gold', value: '#eab308' },
  { name: 'Cyan', value: '#06b6d4' }
];

// Prize split presets
const PRIZE_SPLITS = [
  { 
    name: 'Top 3', 
    description: '50% / 30% / 20%',
    splits: [{ place: 1, percent: 50 }, { place: 2, percent: 30 }, { place: 3, percent: 20 }]
  },
  { 
    name: 'Top 5', 
    description: '40% / 25% / 15% / 12% / 8%',
    splits: [{ place: 1, percent: 40 }, { place: 2, percent: 25 }, { place: 3, percent: 15 }, { place: 4, percent: 12 }, { place: 5, percent: 8 }]
  },
  { 
    name: 'Top 10', 
    description: '30% / 20% / 15% / 10% / 8% / 6% / 4% / 3% / 2% / 2%',
    splits: [
      { place: 1, percent: 30 }, { place: 2, percent: 20 }, { place: 3, percent: 15 }, 
      { place: 4, percent: 10 }, { place: 5, percent: 8 }, { place: 6, percent: 6 },
      { place: 7, percent: 4 }, { place: 8, percent: 3 }, { place: 9, percent: 2 }, { place: 10, percent: 2 }
    ]
  }
];

// Timeline options
const TIMELINES = [
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'monthly' }
];

export default function CreateLeaderboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  
  const [formData, setFormData] = useState({
    streamerName: '',
    subdomain: '',
    accentColor: '#8b5cf6',
    prizePool: '',
    prizeSplit: PRIZE_SPLITS[0],
    casino: '',
    timeline: 'weekly',
    affiliateCode: '',
    apiKey: '',
    socials: {
      twitter: '',
      discord: '',
      twitch: '',
      youtube: '',
      kick: ''
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate subdomain from streamer name
    if (field === 'streamerName') {
      const subdomain = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({ ...prev, subdomain }));
    }
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate URL
    const url = `https://${formData.subdomain}.gamblescan.org/leaderboard`;
    setGeneratedUrl(url);
    setIsComplete(true);
    setIsSubmitting(false);
  };

  const isFormValid = 
    formData.streamerName && 
    formData.subdomain && 
    formData.prizePool && 
    formData.casino && 
    formData.affiliateCode;

  // Success screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-400" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Leaderboard Created!</h1>
          <p className="text-gray-400 mb-6">Your leaderboard is live and ready to share with your community.</p>
          
          <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Your Leaderboard URL</div>
            <a 
              href={`/leaderboards/sample/${formData.subdomain}`}
              target="_blank"
              className="text-purple-400 hover:text-purple-300 font-mono text-sm break-all flex items-center justify-center gap-2"
            >
              {generatedUrl}
              <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="space-y-3">
            <a
              href={`/leaderboards/sample/${formData.subdomain}`}
              className="block w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
            >
              View Your Leaderboard
            </a>
            <a
              href="/leaderboards"
              className="block w-full py-3 bg-[#1a1a2e] hover:bg-[#252540] text-white font-medium rounded-lg transition-colors"
            >
              Back to Leaderboards
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-purple-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-medium text-white mb-2">Creating Your Leaderboard</h2>
          <p className="text-gray-400">Setting up your custom page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <a 
                href="/"
                className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity"
              >
                <DiamondEyeLogo size={22} />
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

      {/* Main Content */}
      <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <a
          href="/leaderboards"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Leaderboards
        </a>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Leaderboard</h1>
          <p className="text-gray-400">Fill in the details below to set up your custom affiliate leaderboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Streamer Name *</label>
                <input
                  type="text"
                  value={formData.streamerName}
                  onChange={(e) => handleChange('streamerName', e.target.value)}
                  placeholder="e.g., TerriblePKER"
                  className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subdomain *</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    placeholder="yourname"
                    className="flex-1 bg-[#0a0a14] border border-gray-800 rounded-l-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <div className="bg-[#1a1a2e] border border-l-0 border-gray-800 rounded-r-lg px-4 py-3 text-gray-500">
                    .gamblescan.org
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-lg font-medium text-white mb-4">Appearance</h2>
            
            <div>
              <label className="block text-sm text-gray-400 mb-3">Accent Color</label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('accentColor', color.value)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.accentColor === color.value 
                        ? 'border-white scale-110' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Settings */}
          <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-lg font-medium text-white mb-4">Leaderboard Settings</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prize Pool ($) *</label>
                  <input
                    type="number"
                    value={formData.prizePool}
                    onChange={(e) => handleChange('prizePool', e.target.value)}
                    placeholder="5000"
                    className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Casino *</label>
                  <select
                    value={formData.casino}
                    onChange={(e) => handleChange('casino', e.target.value)}
                    className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select a casino</option>
                    {CASINOS.map((casino) => (
                      <option key={casino} value={casino}>{casino}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Prize Split</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PRIZE_SPLITS.map((split) => (
                    <button
                      key={split.name}
                      type="button"
                      onClick={() => handleChange('prizeSplit', split)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        formData.prizeSplit.name === split.name
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="font-medium text-white text-sm">{split.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{split.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Timeline</label>
                <div className="flex gap-3">
                  {TIMELINES.map((timeline) => (
                    <button
                      key={timeline.value}
                      type="button"
                      onClick={() => handleChange('timeline', timeline.value)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        formData.timeline === timeline.value
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      {timeline.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Affiliate Settings */}
          <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-lg font-medium text-white mb-4">Affiliate Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Affiliate Code *</label>
                <input
                  type="text"
                  value={formData.affiliateCode}
                  onChange={(e) => handleChange('affiliateCode', e.target.value)}
                  placeholder="e.g., terriblepker"
                  className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">API Access Key (Optional)</label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  placeholder="For real-time wager tracking"
                  className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to use demo data for now</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-lg font-medium text-white mb-4">Social Links</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <TwitterIcon size={14} />
                    Twitter/X
                  </label>
                  <input
                    type="text"
                    value={formData.socials.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    placeholder="@username"
                    className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <DiscordIcon size={14} />
                    Discord
                  </label>
                  <input
                    type="text"
                    value={formData.socials.discord}
                    onChange={(e) => handleSocialChange('discord', e.target.value)}
                    placeholder="discord.gg/invite"
                    className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <TwitchIcon size={14} />
                    Twitch
                  </label>
                  <input
                    type="text"
                    value={formData.socials.twitch}
                    onChange={(e) => handleSocialChange('twitch', e.target.value)}
                    placeholder="twitch.tv/username"
                    className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <YouTubeIcon size={14} />
                    YouTube
                  </label>
                  <input
                    type="text"
                    value={formData.socials.youtube}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    placeholder="youtube.com/@channel"
                    className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <KickIcon size={14} />
                    Kick
                  </label>
                  <input
                    type="text"
                    value={formData.socials.kick}
                    onChange={(e) => handleSocialChange('kick', e.target.value)}
                    placeholder="kick.com/username"
                    className="w-full bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid}
              className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Create Leaderboard
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="text-gray-500 text-sm">
              © 2026 GambleScan
            </div>
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





