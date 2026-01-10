'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Trophy, ExternalLink } from 'lucide-react';

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

// Sample leaderboard configurations
const SAMPLE_CONFIGS = {
  terriblepker: {
    streamerName: 'TerriblePKER',
    casino: 'Roobet',
    casinoUrl: 'https://roobet.com',
    prizePool: 5000,
    accentColor: '#f97316',
    timeline: 'bi-weekly',
    affiliateCode: 'terriblepker',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    socials: {
      twitter: 'https://twitter.com/terriblepker',
      discord: 'https://discord.gg/terriblepker',
      twitch: 'https://twitch.tv/terriblepker',
      youtube: '',
      kick: 'https://kick.com/terriblepker'
    },
    prizeSplit: [
      { place: 1, percent: 50 },
      { place: 2, percent: 30 },
      { place: 3, percent: 20 }
    ]
  },
  codeivanb: {
    streamerName: 'CodeIvanB',
    casino: 'Rainbet',
    casinoUrl: 'https://rainbet.com',
    prizePool: 10000,
    accentColor: '#8b5cf6',
    timeline: 'monthly',
    affiliateCode: 'codeivanb',
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    socials: {
      twitter: 'https://twitter.com/codeivanb',
      discord: 'https://discord.gg/codeivanb',
      twitch: 'https://twitch.tv/codeivanb',
      youtube: 'https://youtube.com/@codeivanb',
      kick: ''
    },
    prizeSplit: [
      { place: 1, percent: 40 },
      { place: 2, percent: 25 },
      { place: 3, percent: 15 },
      { place: 4, percent: 12 },
      { place: 5, percent: 8 }
    ]
  },
  karmacf: {
    streamerName: 'KarmaCF',
    casino: 'Stake',
    casinoUrl: 'https://stake.com',
    prizePool: 25000,
    accentColor: '#22c55e',
    timeline: 'weekly',
    affiliateCode: 'karmacf',
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    socials: {
      twitter: 'https://twitter.com/karmacf',
      discord: 'https://discord.gg/karmacf',
      twitch: 'https://twitch.tv/karmacf',
      youtube: 'https://youtube.com/@karmacf',
      kick: 'https://kick.com/karmacf'
    },
    prizeSplit: [
      { place: 1, percent: 30 },
      { place: 2, percent: 20 },
      { place: 3, percent: 15 },
      { place: 4, percent: 10 },
      { place: 5, percent: 8 },
      { place: 6, percent: 6 },
      { place: 7, percent: 4 },
      { place: 8, percent: 3 },
      { place: 9, percent: 2 },
      { place: 10, percent: 2 }
    ]
  }
};

// Generate demo leaderboard data
function generateDemoData(numPlaces) {
  const names = [
    'CryptoKing', 'LuckyDegen', 'WhaleWatcher', 'DiamondHands', 'MoonShot',
    'StackingSats', 'GambleGod', 'RiskTaker', 'HighRoller', 'BetMaster',
    'CasinoAce', 'SlotLord', 'PokerFace', 'BlackjackPro', 'RouletteRuler',
    'DiceDevil', 'JackpotJoe', 'SpinWinner', 'CardShark', 'BetBoss'
  ];
  
  const data = [];
  let baseWager = 150000 + Math.random() * 100000;
  
  for (let i = 0; i < Math.min(numPlaces + 5, names.length); i++) {
    baseWager = baseWager * (0.6 + Math.random() * 0.3);
    data.push({
      rank: i + 1,
      username: names[i],
      wagered: Math.round(baseWager)
    });
  }
  
  return data;
}

export default function SampleLeaderboard() {
  const params = useParams();
  const id = params.id;
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  
  // Get config or use default
  const config = SAMPLE_CONFIGS[id] || SAMPLE_CONFIGS.terriblepker;
  
  // Generate demo data based on prize split
  const leaderboardData = generateDemoData(config.prizeSplit.length);
  
  // Calculate prizes
  const calculatePrize = (rank) => {
    const split = config.prizeSplit.find(s => s.place === rank);
    if (split) {
      return (config.prizePool * split.percent / 100);
    }
    return 0;
  };
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = config.endDate.getTime();
      const diff = end - now;
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [config.endDate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Streamer Name & Casino */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: config.accentColor }}
            >
              {config.streamerName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{config.streamerName}</h1>
              <a 
                href={config.casinoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                {config.casino}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
          
          {/* Prize Pool */}
          <div 
            className="inline-block px-6 py-3 rounded-xl mb-6"
            style={{ backgroundColor: `${config.accentColor}15`, border: `1px solid ${config.accentColor}30` }}
          >
            <div className="text-sm text-gray-400 mb-1">Prize Pool</div>
            <div 
              className="text-4xl font-bold"
              style={{ color: config.accentColor }}
            >
              ${config.prizePool.toLocaleString()}
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.mins },
              { label: 'SECS', value: timeLeft.secs }
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="text-center">
                  <div 
                    className="text-3xl font-bold w-16 h-16 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${config.accentColor}15` }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{item.label}</div>
                </div>
                {i < 3 && <span className="text-2xl text-gray-600 -mt-4">:</span>}
              </div>
            ))}
          </div>
          
          {/* Affiliate Code */}
          <div className="mb-6">
            <span className="text-gray-400">Use code: </span>
            <span 
              className="font-bold text-lg"
              style={{ color: config.accentColor }}
            >
              {config.affiliateCode}
            </span>
            <a
              href={config.casinoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: config.accentColor }}
            >
              Visit {config.casino}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Top 3 Podium Display */}
        <div className="flex items-end justify-center gap-4 md:gap-8 mb-10 mt-8 pt-8">
          {/* 2nd Place - Left */}
          {leaderboardData[1] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div 
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold z-10"
                  style={{ 
                    background: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)',
                    color: '#1a1a2e',
                    boxShadow: '0 2px 8px rgba(156, 163, 175, 0.4)'
                  }}
                >
                  2
                </div>
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold border-2"
                  style={{ 
                    backgroundColor: '#1a1a2e',
                    borderColor: '#9ca3af'
                  }}
                >
                  <span style={{ color: '#9ca3af' }}>{leaderboardData[1].username.charAt(0)}</span>
                </div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 text-center border border-gray-700/50 w-40">
                <div className="text-gray-400 text-sm mb-1 truncate">
                  {leaderboardData[1].username.slice(0, 3)}*****{leaderboardData[1].username.slice(-2)}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Wagered</div>
                <div className="text-white font-bold">${leaderboardData[1].wagered.toLocaleString()}</div>
                <div 
                  className="text-xl font-bold mt-2"
                  style={{ color: config.accentColor }}
                >
                  ${calculatePrize(2).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* 1st Place - Center (Elevated) */}
          {leaderboardData[0] && (
            <div className="flex flex-col items-center -mt-8">
              <div className="relative mb-3">
                <div 
                  className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10"
                  style={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #eab308 100%)',
                    color: '#1a1a2e',
                    boxShadow: '0 4px 12px rgba(234, 179, 8, 0.5)'
                  }}
                >
                  1
                </div>
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold border-2"
                  style={{ 
                    backgroundColor: '#1a1a2e',
                    borderColor: '#eab308',
                    boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)'
                  }}
                >
                  <span style={{ color: '#eab308' }}>{leaderboardData[0].username.charAt(0)}</span>
                </div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-5 text-center border border-yellow-500/30 w-48">
                <div className="text-yellow-400 font-medium mb-1 truncate">
                  {leaderboardData[0].username.slice(0, 3)}*****{leaderboardData[0].username.slice(-2)}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Wagered</div>
                <div className="text-white font-bold text-lg">${leaderboardData[0].wagered.toLocaleString()}</div>
                <div 
                  className="text-2xl font-bold mt-2"
                  style={{ color: config.accentColor }}
                >
                  ${calculatePrize(1).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place - Right */}
          {leaderboardData[2] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div 
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold z-10"
                  style={{ 
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    color: '#1a1a2e',
                    boxShadow: '0 2px 8px rgba(180, 83, 9, 0.4)'
                  }}
                >
                  3
                </div>
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold border-2"
                  style={{ 
                    backgroundColor: '#1a1a2e',
                    borderColor: '#b45309'
                  }}
                >
                  <span style={{ color: '#b45309' }}>{leaderboardData[2].username.charAt(0)}</span>
                </div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 text-center border border-gray-700/50 w-40">
                <div className="text-gray-400 text-sm mb-1 truncate">
                  {leaderboardData[2].username.slice(0, 3)}*****{leaderboardData[2].username.slice(-2)}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Wagered</div>
                <div className="text-white font-bold">${leaderboardData[2].wagered.toLocaleString()}</div>
                <div 
                  className="text-xl font-bold mt-2"
                  style={{ color: config.accentColor }}
                >
                  ${calculatePrize(3).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Remaining Leaderboard Table (4th place onwards) */}
        {leaderboardData.length > 3 && (
          <div className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase bg-[#0f0f1a]">
                    <th className="text-center px-4 py-3 font-medium w-20">Rank</th>
                    <th className="text-left px-4 py-3 font-medium">User</th>
                    <th className="text-right px-4 py-3 font-medium">Wagered</th>
                    <th className="text-right px-4 py-3 font-medium">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.slice(3).map((entry) => {
                    const prize = calculatePrize(entry.rank);
                    
                    return (
                      <tr 
                        key={entry.rank} 
                        className="border-t border-gray-800/30 hover:bg-[#1a1a2e]/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-center">
                          <span className="text-gray-500">{entry.rank}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                              style={{ backgroundColor: `${config.accentColor}30` }}
                            >
                              {entry.username.charAt(0)}
                            </div>
                            <span className="text-gray-300">
                              {entry.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-gray-400">
                            ${entry.wagered.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {prize > 0 ? (
                            <span style={{ color: config.accentColor }}>
                              ${prize.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pt-6 border-t border-gray-800/50">
          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {config.socials.twitter && (
              <a 
                href={config.socials.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <TwitterIcon size={20} />
              </a>
            )}
            {config.socials.discord && (
              <a 
                href={config.socials.discord} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <DiscordIcon size={20} />
              </a>
            )}
            {config.socials.twitch && (
              <a 
                href={config.socials.twitch} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <TwitchIcon size={20} />
              </a>
            )}
            {config.socials.youtube && (
              <a 
                href={config.socials.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <YouTubeIcon size={20} />
              </a>
            )}
            {config.socials.kick && (
              <a 
                href={config.socials.kick} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <KickIcon size={20} />
              </a>
            )}
          </div>
          
          {/* Built by GambleScan */}
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-400 transition-colors"
          >
            <span className="text-purple-500">◈</span>
            Built by GambleScan
          </a>
        </footer>
      </div>
    </div>
  );
}




