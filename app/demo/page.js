'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, Gamepad2, Gift, ChevronDown, ShoppingCart, Plus, 
  MessageSquare, Send, Swords, Trophy, Package, Dices, 
  Star, Users, Clock, TrendingUp
} from 'lucide-react';

// Color palette from Deadlock ranks
const COLORS = {
  primary: '#D4A84B',      // Beige/Gold - main brand color
  primaryHover: '#E8C36B',
  bg: '#1A1D21',           // Dark charcoal
  bgElevated: '#252A31',
  surface: '#2D333B',
  border: '#373E47',
  text: '#ECEFF4',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  // Accent colors from the chart
  orange: '#D97B2A',
  pink: '#D94B8A',
  blue: '#5B7FD4',
  lime: '#8FD94B',
  purple: '#9B5BD4',
  red: '#D94B4B',
  silver: '#B8C4D4',
  cyan: '#4BD9C5',
  yellow: '#D9D94B',
};

// Mock chat messages
const CHAT_MESSAGES = [
  { id: 1, user: 'LotuSs', badge: 'VIP', color: COLORS.primary, message: 'Dlore' },
  { id: 2, user: 'jamesraisbeck200', badge: 'VIP', color: COLORS.primary, message: 'feeeeeeedddddddddddd' },
  { id: 3, user: 'Voonex', badge: 'VIP', color: COLORS.primary, message: 'lu its alr win lol' },
  { id: 4, user: 'LotuSs', badge: 'VIP', color: COLORS.primary, message: 'I mean lotus' },
  { id: 5, user: 'ZILDENovski', badge: 'XII', color: COLORS.purple, message: 'wow nice pull' },
  { id: 6, user: 'Brightlight1', badge: 'VIP', color: COLORS.primary, message: 'Easy wins' },
  { id: 7, user: 'ProGambler', badge: 'XII', color: COLORS.purple, message: 'RED all day baby' },
  { id: 8, user: 'CasualBetter', badge: null, color: COLORS.blue, message: 'Good luck everyone!' },
  { id: 9, user: 'InfernusMain', badge: 'VIP', color: COLORS.primary, message: 'Who else mains Infernus?' },
  { id: 10, user: 'LootLord', badge: 'XII', color: COLORS.purple, message: 'Opening legendary cases rn' },
];

// Live wins data
const LIVE_WINS = [
  { id: 1, game: 'Cases', player: 'EpicHunter', badge: 'VIP', amount: 25.00, multi: '3.00x', payout: 75.00 },
  { id: 2, game: 'Roulette', player: 'WinStreak', badge: 'VIP', amount: 75.00, multi: '2.00x', payout: 150.00 },
  { id: 3, game: 'Roulette', player: 'GreenDream', badge: 'VIP', amount: 10.00, multi: '14.00x', payout: 140.00 },
  { id: 4, game: 'Cases', player: 'LuckyShot', badge: 'XII', amount: 50.00, multi: '5.00x', payout: 250.00 },
  { id: 5, game: 'Battles', player: 'BattleKing', badge: 'VIP', amount: 100.00, multi: '2.50x', payout: 250.00 },
];

// Game cards data with Deadlock rank colors
const GAMES = [
  {
    id: 'battles',
    title: 'CASE BATTLES',
    subtitle: 'Compete head-to-head against other players',
    bgColor: COLORS.orange,
    icon: Swords,
    size: 'large',
    href: '/cases'
  },
  {
    id: 'sports',
    title: 'SPORTS',
    subtitle: 'Bet on esports matches',
    bgColor: COLORS.lime,
    icon: Trophy,
    size: 'large',
    badge: 'SOON',
    href: '/esports'
  },
  {
    id: 'cases',
    title: 'CASES',
    subtitle: 'Open cases, win rare items',
    bgColor: COLORS.purple,
    icon: Package,
    size: 'small',
    href: '/cases'
  },
  {
    id: 'roll',
    title: 'ROLL',
    subtitle: 'Bet on colors, win multipliers',
    bgColor: COLORS.yellow,
    icon: Dices,
    size: 'small',
    href: '/predictions'
  },
  {
    id: 'rewards',
    title: 'REWARDS',
    subtitle: 'Daily free coins',
    bgColor: COLORS.pink,
    icon: Gift,
    size: 'small',
    href: '/rank'
  },
  {
    id: 'affiliates',
    title: 'AFFILIATES',
    subtitle: 'Earn commission',
    bgColor: COLORS.red,
    icon: Users,
    size: 'small',
    href: '/rank'
  },
];

export default function DemoPage() {
  const [chatMessage, setChatMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: COLORS.bg }}>
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}>
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left - Logo & Nav */}
          <div className="flex items-center gap-6">
            {/* Race Banner */}
            <div className="flex items-center gap-2 px-3 py-1 rounded text-sm font-bold" style={{ backgroundColor: COLORS.red }}>
              <span>🏁</span>
              <span>1M RACE</span>
            </div>
            
            <Link href="#" className="text-sm font-medium uppercase tracking-wide transition-colors" style={{ color: COLORS.textSecondary }}>
              Redeem Affiliates
            </Link>
            <Link href="#" className="text-sm font-medium uppercase tracking-wide transition-colors" style={{ color: COLORS.textSecondary }}>
              Promo Codes
            </Link>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium uppercase tracking-wide transition-colors" style={{ color: COLORS.textSecondary }}>
              Fairness
            </Link>
            <Link href="#" className="text-sm font-medium uppercase tracking-wide transition-colors" style={{ color: COLORS.textSecondary }}>
              Affiliates
            </Link>
            <Link href="#" className="text-sm font-medium uppercase tracking-wide transition-colors" style={{ color: COLORS.textSecondary }}>
              TOS
            </Link>
            <button className="p-2 transition-colors" style={{ color: COLORS.textSecondary }}>
              <Gamepad2 size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Secondary Nav */}
      <div className="fixed top-14 left-0 right-0 z-40 border-b" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="flex items-center justify-between h-12 px-4">
          {/* Left - Logo & Menu */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded flex items-center justify-center font-bold" style={{ backgroundColor: COLORS.primary, color: COLORS.bg }}>
                L
              </div>
            </Link>
            
            {/* Home */}
            <button className="p-2 rounded text-white" style={{ backgroundColor: COLORS.surface }}>
              <Home size={20} />
            </button>
            
            {/* Games Dropdown */}
            <button className="flex items-center gap-2 px-3 py-2 rounded text-white text-sm font-medium" style={{ backgroundColor: COLORS.surface }}>
              <Gamepad2 size={18} />
              <span>GAMES</span>
              <ChevronDown size={16} />
            </button>
            
            {/* Rewards */}
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors" style={{ color: COLORS.textSecondary }}>
              <Gift size={18} />
              <span>REWARDS</span>
            </button>
          </div>

          {/* Right - Balance & Login */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button className="p-2 relative transition-colors" style={{ color: COLORS.textSecondary }}>
              <ShoppingCart size={20} />
            </button>
            
            {/* Balance */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded border" style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}>
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
              <span className="font-bold">1,000</span>
              <button className="ml-1 p-1 rounded" style={{ backgroundColor: COLORS.primary, color: COLORS.bg }}>
                <Plus size={14} />
              </button>
            </div>
            
            {/* Login */}
            <button className="px-4 py-2 rounded font-bold text-sm uppercase" style={{ backgroundColor: COLORS.primary, color: COLORS.bg }}>
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex pt-[104px]">
        {/* Chat Sidebar */}
        {sidebarOpen && (
          <aside className="fixed left-0 top-[104px] bottom-0 w-64 border-r flex flex-col" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇺🇸</span>
                <span className="font-semibold">247</span>
              </div>
              <button className="text-sm transition-colors" style={{ color: COLORS.textSecondary }}>Rules</button>
              <button 
                onClick={() => setSidebarOpen(false)}
                style={{ color: COLORS.textSecondary }}
              >
                ‹
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {CHAT_MESSAGES.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: msg.color + '22', color: msg.color }}
                  >
                    {msg.badge || msg.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm" style={{ color: msg.color }}>
                        {msg.user}
                      </span>
                      <span style={{ color: COLORS.textMuted }}>:</span>
                    </div>
                    <p className="text-sm break-words" style={{ color: COLORS.textSecondary }}>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-3 border-t" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded text-white text-sm focus:outline-none"
                  style={{ 
                    backgroundColor: COLORS.bg, 
                    borderWidth: 1, 
                    borderStyle: 'solid', 
                    borderColor: COLORS.border,
                    color: COLORS.text
                  }}
                />
                <button className="p-2 rounded" style={{ backgroundColor: COLORS.primary, color: COLORS.bg }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : ''} p-6`}>
          {/* Toggle Sidebar Button (when closed) */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed left-4 top-32 p-2 rounded text-white z-30"
              style={{ backgroundColor: COLORS.surface }}
            >
              <MessageSquare size={20} />
            </button>
          )}

          {/* Banner Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Deposit Banner */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-lg p-6" style={{ background: `linear-gradient(135deg, ${COLORS.lime}22 0%, ${COLORS.bg} 100%)`, border: `1px solid ${COLORS.border}` }}>
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: COLORS.textSecondary }}>Multiple Payment Options</p>
                <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Deposit & Play</h2>
                <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
                  Crypto, cards, and more. Fast deposits, instant withdrawals.
                </p>
                <button className="px-4 py-2 rounded font-bold text-sm" style={{ backgroundColor: COLORS.primary, color: COLORS.bg }}>
                  Deposit Now
                </button>
              </div>
              {/* Decorative elements */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <div className="w-10 h-10 rounded" style={{ backgroundColor: COLORS.silver + '33' }} />
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                <div className="w-10 h-10 rounded" style={{ backgroundColor: COLORS.cyan + '66' }} />
              </div>
            </div>

            {/* Contest Banner */}
            <div className="relative overflow-hidden rounded-lg p-6" style={{ background: `linear-gradient(135deg, ${COLORS.blue}44 0%, ${COLORS.bg} 100%)`, border: `1px solid ${COLORS.border}` }}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>$1,000</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase" style={{ backgroundColor: COLORS.cyan, color: COLORS.bg }}>
                    Weekly
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.text }}>Deadlock Prediction Contest</h3>
                <p className="text-sm mb-3" style={{ color: COLORS.textSecondary }}>
                  Predict match outcomes and win big!
                </p>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded font-bold text-sm" style={{ backgroundColor: COLORS.primary, color: COLORS.bg }}>
                    Join Contest
                  </button>
                  <span className="text-xs" style={{ color: COLORS.textSecondary }}>Ends in 6d 12h</span>
                </div>
              </div>
              {/* Trophy icon */}
              <Trophy className="absolute right-4 top-4" style={{ color: COLORS.primary + '33' }} size={60} />
            </div>
          </div>

          {/* Games Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 size={20} style={{ color: COLORS.textSecondary }} />
              <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Games</h2>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Large Cards - Case Battles & Sports */}
              {GAMES.filter(g => g.size === 'large').map((game) => (
                <Link
                  key={game.id}
                  href={game.href}
                  className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-lg p-6 min-h-[180px] group transition-transform hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${game.bgColor} 0%, ${game.bgColor}88 100%)` }}
                >
                  {game.badge && (
                    <span className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: COLORS.bg + 'aa' }}>
                      {game.badge}
                    </span>
                  )}
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold mb-1 text-white">{game.title}</h3>
                    <p className="text-sm text-white/80">{game.subtitle}</p>
                  </div>
                  <game.icon className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/30 transition-colors" size={80} />
                </Link>
              ))}

              {/* Small Cards */}
              {GAMES.filter(g => g.size === 'small').map((game) => (
                <Link
                  key={game.id}
                  href={game.href}
                  className="relative overflow-hidden rounded-lg p-4 min-h-[140px] group transition-transform hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${game.bgColor} 0%, ${game.bgColor}88 100%)` }}
                >
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-bold mb-0.5 text-white">{game.title}</h3>
                    <p className="text-xs text-white/80">{game.subtitle}</p>
                  </div>
                  <game.icon className="absolute right-4 top-4 text-white/20 group-hover:text-white/30 transition-colors" size={40} />
                </Link>
              ))}
            </div>
          </div>

          {/* Live Wins Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.red }} />
              <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>Live Wins</h2>
            </div>

            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, border: `1px solid ${COLORS.border}` }}>
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 px-4 py-3 text-sm" style={{ borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>
                <div>Game</div>
                <div>Player</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Multi</div>
                <div className="text-right">Payout</div>
              </div>

              {/* Table Rows */}
              {LIVE_WINS.map((win) => (
                <div 
                  key={win.id} 
                  className="grid grid-cols-5 gap-4 px-4 py-3 transition-colors"
                  style={{ borderBottom: `1px solid ${COLORS.border}` }}
                >
                  <div className="flex items-center gap-2">
                    <Package size={16} style={{ color: COLORS.textSecondary }} />
                    <span className="text-sm" style={{ color: COLORS.text }}>{win.game}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: COLORS.primary + '22', color: COLORS.primary }}
                    >
                      {win.badge === 'VIP' ? 'V' : 'X'}
                    </div>
                    <span className="text-sm font-medium" style={{ color: COLORS.text }}>{win.player}</span>
                  </div>
                  <div className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                      <span className="text-sm" style={{ color: COLORS.text }}>{win.amount.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="text-right text-sm" style={{ color: COLORS.text }}>{win.multi}</div>
                  <div className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.lime }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.lime }}>{win.payout.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
