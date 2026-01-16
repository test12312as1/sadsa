'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, Trophy, Gift, Shield, Users, Zap, Target, Calendar, Star, ChevronRight, Clock } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import EmailCapture from '../components/emailcapture';

// Note: Updated to use new brand colors via CSS variables

// Sample prediction categories
const PREDICTION_CATEGORIES = [
  {
    title: 'Patch Predictions',
    description: 'Predict which heroes will be buffed or nerfed in upcoming patches',
    icon: Target,
    examples: ['Will Seven get nerfed?', 'Next hero to receive a rework?', 'Biggest buff in next patch?']
  },
  {
    title: 'Tournament Outcomes',
    description: 'Predict match winners, tournament champions, and MVPs',
    icon: Trophy,
    examples: ['DCS 2026 Champion?', 'Most kills in Grand Finals?', 'First team to win 3 maps?']
  },
  {
    title: 'Community Milestones',
    description: 'Predict player counts, viewership records, and community achievements',
    icon: Users,
    examples: ['Peak concurrent players?', 'Twitch viewership record?', 'First team to 100 wins?']
  },
  {
    title: 'Meta Predictions',
    description: 'Predict meta shifts, popular picks, and strategy trends',
    icon: Zap,
    examples: ['Most picked hero next month?', 'New meta strategy?', 'Highest win rate hero?']
  },
];

// Sample leaderboard
const SAMPLE_LEADERBOARD = [
  { rank: 1, name: 'PredictionKing', points: 12450, accuracy: '78%', streak: 8 },
  { rank: 2, name: 'DeadlockOracle', points: 11200, accuracy: '75%', streak: 5 },
  { rank: 3, name: 'MetaGuru', points: 10800, accuracy: '72%', streak: 3 },
  { rank: 4, name: 'PatchNotes', points: 9950, accuracy: '71%', streak: 6 },
  { rank: 5, name: 'TourneyWatcher', points: 9400, accuracy: '69%', streak: 2 },
];

// Prizes
const PRIZES = [
  { place: '1st', prize: '$50 Gift Card', icon: '🥇' },
  { place: '2nd', prize: '$25 Gift Card', icon: '🥈' },
  { place: '3rd', prize: '$10 Gift Card', icon: '🥉' },
  { place: 'Top 10', prize: 'Exclusive Badge', icon: '⭐' },
];

export default function PredictionsPage() {
  const [email, setEmail] = useState('');
  
  return (
    <div className="min-h-screen bg-[var(--arena-bg)]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-lg bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                PREDICTION <span className="gradient-text-purple">MARKETS</span>
              </h1>
              <span className="coming-soon-badge">COMING SOON</span>
            </div>
            <p className="text-sm text-[var(--arena-text-muted)]">Free-to-play predictions with real prizes</p>
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--arena-tertiary)]/20 to-pink-500/10" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          
          <div className="relative p-8 md:p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[var(--arena-tertiary)]/20 flex items-center justify-center mx-auto mb-6 animate-float">
              <TrendingUp className="text-[var(--arena-tertiary)]" size={40} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Predict. Compete. <span className="gradient-text-purple">Win.</span>
            </h2>
            
            <p className="text-lg text-[var(--arena-text-secondary)] max-w-2xl mx-auto mb-8">
              Make predictions on Deadlock patches, tournaments, and community milestones. 
              Climb the leaderboard and win real prizes every week. No money required.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--arena-surface)] border border-[var(--arena-border)]">
                <Shield className="text-[var(--arena-success)]" size={18} />
                <span className="text-sm text-white">100% Free to Play</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--arena-surface)] border border-[var(--arena-border)]">
                <Gift className="text-[var(--arena-secondary)]" size={18} />
                <span className="text-sm text-white">Weekly Prizes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--arena-surface)] border border-[var(--arena-border)]">
                <Trophy className="text-yellow-500" size={18} />
                <span className="text-sm text-white">Competitive Leaderboards</span>
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <EmailCapture 
                variant="hero"
                title=""
                description=""
                buttonText="GET EARLY ACCESS"
              />
            </div>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white text-center mb-8">
            HOW IT <span className="gradient-text">WORKS</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="arena-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--arena-primary)]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-display font-bold text-[var(--arena-primary)]">1</span>
              </div>
              <h4 className="font-display font-bold text-white mb-2">Make Predictions</h4>
              <p className="text-sm text-[var(--arena-text-secondary)]">
                Browse active prediction markets and place your bets using free credits. No real money needed.
              </p>
            </div>
            
            <div className="arena-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--arena-secondary)]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-display font-bold text-[var(--arena-secondary)]">2</span>
              </div>
              <h4 className="font-display font-bold text-white mb-2">Earn Points</h4>
              <p className="text-sm text-[var(--arena-text-secondary)]">
                Correct predictions earn you points. Build streaks for bonus multipliers and climb the ranks.
              </p>
            </div>
            
            <div className="arena-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--arena-tertiary)]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-display font-bold text-[var(--arena-tertiary)]">3</span>
              </div>
              <h4 className="font-display font-bold text-white mb-2">Win Prizes</h4>
              <p className="text-sm text-[var(--arena-text-secondary)]">
                Top performers each week win gift cards, exclusive badges, and bragging rights.
              </p>
            </div>
          </div>
        </div>
        
        {/* Prediction Categories */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white text-center mb-8">
            PREDICTION <span className="gradient-text-purple">CATEGORIES</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PREDICTION_CATEGORIES.map((category) => (
              <div key={category.title} className="arena-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--arena-tertiary)]/20 flex items-center justify-center shrink-0">
                    <category.icon className="text-[var(--arena-tertiary)]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white mb-1">{category.title}</h4>
                    <p className="text-sm text-[var(--arena-text-secondary)] mb-3">{category.description}</p>
                    <div className="space-y-1">
                      {category.examples.map((example, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[var(--arena-text-muted)]">
                          <ChevronRight size={12} className="text-[var(--arena-tertiary)]" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Leaderboard Preview & Prizes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Leaderboard */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              SAMPLE LEADERBOARD
            </h3>
            
            <div className="arena-card overflow-hidden">
              <div className="p-4 border-b border-[var(--arena-border)] bg-[var(--arena-surface)]">
                <div className="flex items-center justify-between text-xs text-[var(--arena-text-muted)]">
                  <span>Weekly Rankings</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Resets in 3d 14h
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-[var(--arena-border)]">
                {SAMPLE_LEADERBOARD.map((user) => (
                  <div key={user.rank} className="p-4 flex items-center gap-4 hover:bg-[var(--arena-surface-hover)] transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold ${
                      user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                      user.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                      user.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                      'bg-[var(--arena-surface)] text-[var(--arena-text-muted)]'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-[var(--arena-text-muted)]">
                        {user.accuracy} accuracy • {user.streak} streak 🔥
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-[var(--arena-primary)]">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-[var(--arena-text-muted)]">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Prizes */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="text-[var(--arena-secondary)]" size={20} />
              WEEKLY PRIZES
            </h3>
            
            <div className="arena-card p-6">
              <div className="space-y-4 mb-6">
                {PRIZES.map((prize) => (
                  <div key={prize.place} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--arena-surface)]">
                    <span className="text-2xl">{prize.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{prize.place} Place</div>
                    </div>
                    <div className="font-display font-bold text-[var(--arena-secondary)]">{prize.prize}</div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 rounded-lg bg-[var(--arena-tertiary)]/10 border border-[var(--arena-tertiary)]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-[var(--arena-tertiary)]" size={16} />
                  <span className="font-semibold text-white">Early Access Bonus</span>
                </div>
                <p className="text-sm text-[var(--arena-text-secondary)]">
                  Sign up now and get 500 bonus prediction credits when we launch!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="arena-card p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--arena-tertiary)]/10 to-transparent" />
          
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Ready to Test Your <span className="gradient-text-purple">Predictions?</span>
            </h3>
            <p className="text-[var(--arena-text-secondary)] mb-8 max-w-lg mx-auto">
              Join the waitlist and be among the first to compete when prediction markets launch.
            </p>
            
            <div className="max-w-md mx-auto">
              <EmailCapture 
                variant="hero"
                buttonText="JOIN WAITLIST"
              />
            </div>
            
            <p className="text-xs text-[var(--arena-text-muted)] mt-4">
              Expected launch: Q2 2026
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
