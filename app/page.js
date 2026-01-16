'use client';

import Link from 'next/link';
import { Trophy, Calendar, TrendingUp, Package, ArrowRight, Users, ChevronRight, Target, Flame, Crown } from 'lucide-react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import EmailCapture from './components/emailcapture';

// Feature cards data
const FEATURES = [
  {
    title: 'Hero Rankings',
    description: 'Swipe. Vote. See how the community ranks every hero across categories.',
    icon: Trophy,
    href: '/rank',
    color: 'primary',
    status: 'live',
    cta: 'Start Voting'
  },
  {
    title: 'Esports Hub',
    description: 'Never miss a tournament. Track every team, match, and result.',
    icon: Calendar,
    href: '/esports',
    color: 'secondary',
    status: 'live',
    cta: 'Explore'
  },
  {
    title: 'Predictions',
    description: 'Predict the meta. Win prizes. Free-to-play markets on patches and tournaments.',
    icon: TrendingUp,
    href: '/predictions',
    color: 'primary',
    status: 'coming',
    cta: 'Get Notified'
  },
  {
    title: 'Cases',
    description: 'Open cases, climb ranks, dominate the leaderboard.',
    icon: Package,
    href: '/cases',
    color: 'secondary',
    status: 'coming',
    cta: 'Get Notified'
  },
];

// Hero ranking categories preview
const CATEGORIES_PREVIEW = [
  { name: 'Most Likely to Get Nerfed', icon: Target, votes: '4.2K' },
  { name: 'Best Hero Design', icon: Flame, votes: '3.8K' },
  { name: 'Most Annoying to Play Against', icon: Crown, votes: '2.9K' },
];

// Top ranked heroes preview
const TOP_HEROES = [
  { name: 'Seven', elo: 1847, change: '+12' },
  { name: 'Haze', elo: 1792, change: '+8' },
  { name: 'Vindicta', elo: 1756, change: '-3' },
  { name: 'Warden', elo: 1723, change: '+15' },
  { name: 'Bebop', elo: 1698, change: '+5' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--arena-bg)]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-hex opacity-50" />
        
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--arena-surface)] border border-[var(--arena-border)] mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[var(--arena-success)] animate-pulse" />
              <span className="text-sm font-semibold text-[var(--arena-text-secondary)] uppercase tracking-wide">Join 10,000+ Players</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up stagger-1">
              <span className="text-white">Who&apos;s the best hero?</span>
              <br />
              <span className="text-[var(--arena-primary)]">You decide.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg text-[var(--arena-text-secondary)] max-w-xl mx-auto mb-8 animate-fade-up stagger-2">
              Vote on hero matchups, track esports, and compete in prediction markets. 
              Your competitive edge in Deadlock.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up stagger-3">
              <Link
                href="/rank"
                className="btn-primary px-8 py-4 rounded font-semibold text-lg flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Start Voting
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/esports"
                className="btn-secondary px-8 py-4 rounded font-semibold text-lg flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Explore Esports
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12 animate-fade-up stagger-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">10K+</div>
                <div className="text-xs text-[var(--arena-text-muted)] uppercase tracking-wide font-semibold">Votes Cast</div>
              </div>
              <div className="w-px h-10 bg-[var(--arena-border)]" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">24</div>
                <div className="text-xs text-[var(--arena-text-muted)] uppercase tracking-wide font-semibold">Heroes Ranked</div>
              </div>
              <div className="w-px h-10 bg-[var(--arena-border)]" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">6</div>
                <div className="text-xs text-[var(--arena-text-muted)] uppercase tracking-wide font-semibold">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything Deadlock
            </h2>
            <p className="text-[var(--arena-text-secondary)] max-w-xl mx-auto">
              From hero rankings to esports coverage. More features launching soon.
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`arena-card p-6 group relative overflow-hidden animate-fade-up stagger-${index + 1}`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {feature.status === 'live' ? (
                    <span className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wide bg-[var(--arena-success)] text-[#1A1A1A]">
                      LIVE
                    </span>
                  ) : (
                    <span className="coming-soon-badge">COMING SOON</span>
                  )}
                </div>
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded flex items-center justify-center mb-4 ${
                  feature.color === 'primary' 
                    ? 'bg-[var(--arena-primary)]/20 text-[var(--arena-primary)]' 
                    : 'bg-[var(--arena-secondary)]/20 text-[var(--arena-secondary)]'
                }`}>
                  <feature.icon size={24} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[var(--arena-primary)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[var(--arena-text-secondary)] text-sm mb-4">
                  {feature.description}
                </p>
                
                {/* CTA */}
                <div className="flex items-center text-sm font-medium text-[var(--arena-primary)] group-hover:gap-2 transition-all">
                  <span>{feature.cta}</span>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Ranker Preview Section */}
      <section className="py-20 bg-[var(--arena-bg-elevated)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--arena-primary)]/10 border border-[var(--arena-primary)]/30 mb-4">
                <Trophy className="text-[var(--arena-primary)]" size={14} />
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--arena-primary)]">MOST POPULAR</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hero Rankings
              </h2>
              
              <p className="text-[var(--arena-text-secondary)] mb-6">
                Swipe through hero matchups and vote for your favorites. Our ELO-based ranking system 
                creates community-driven leaderboards that spark debates.
              </p>
              
              {/* Categories */}
              <div className="space-y-3 mb-8">
                {CATEGORIES_PREVIEW.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 rounded bg-[var(--arena-bg)] border border-[var(--arena-border)]">
                    <div className="flex items-center gap-3">
                      <cat.icon className="text-[var(--arena-primary)]" size={18} />
                      <span className="text-white font-semibold text-sm">{cat.name}</span>
                    </div>
                    <span className="text-xs text-[var(--arena-text-muted)] uppercase tracking-wide font-semibold">{cat.votes} votes</span>
                  </div>
                ))}
              </div>
              
              <Link
                href="/rank"
                className="btn-primary px-6 py-3 rounded font-semibold inline-flex items-center gap-2"
              >
                Start Voting
                <ArrowRight size={18} />
              </Link>
            </div>
            
            {/* Right - Rankings Preview */}
            <div className="arena-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="text-[var(--arena-primary)]" size={20} />
                  <span className="font-semibold text-white">Top Ranked</span>
                </div>
                <span className="text-xs text-[var(--arena-text-muted)]">Most Likely to Get Nerfed</span>
              </div>
              
              <div className="space-y-2">
                {TOP_HEROES.map((hero, index) => (
                  <div 
                    key={hero.name}
                    className="flex items-center gap-4 p-3 rounded bg-[var(--arena-bg)] hover:bg-[var(--arena-surface-hover)] transition-colors"
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-[var(--arena-accent-orange)]/20 text-[var(--arena-accent-orange)]' :
                      index === 1 ? 'bg-[#B0B0B0]/20 text-[#B0B0B0]' :
                      index === 2 ? 'bg-[var(--arena-accent-purple)]/20 text-[var(--arena-accent-purple)]' :
                      'bg-[var(--arena-surface)] text-[var(--arena-text-muted)]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{hero.name}</div>
                      <div className="text-xs text-[var(--arena-text-muted)]">{hero.elo} ELO</div>
                    </div>
                    <div className={`text-sm font-medium ${
                      hero.change.startsWith('+') ? 'text-[var(--arena-success)]' : 'text-[var(--arena-danger)]'
                    }`}>
                      {hero.change}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-[var(--arena-border)] text-center">
                <Link href="/rank" className="text-[var(--arena-secondary)] text-sm hover:underline">
                  View full rankings →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Coming Soon
            </h2>
            <p className="text-[var(--arena-text-secondary)] max-w-xl mx-auto">
              We&apos;re building the ultimate Deadlock platform. Get early access.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Predictions Card */}
            <div className="arena-card p-8 text-center">
              <div className="w-14 h-14 rounded bg-[var(--arena-secondary)]/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-[var(--arena-secondary)]" size={28} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Prediction Markets</h3>
              <p className="text-[var(--arena-text-secondary)] text-sm mb-6">
                Free-to-play betting on patches, tournaments, and community milestones. 
                Compete for weekly prizes.
              </p>
              
              <Link
                href="/predictions"
                className="btn-secondary w-full py-3 rounded font-medium"
              >
                Get Notified
              </Link>
            </div>
            
            {/* Cases Card */}
            <div className="arena-card p-8 text-center">
              <div className="w-14 h-14 rounded bg-[var(--arena-primary)]/20 flex items-center justify-center mx-auto mb-4">
                <Package className="text-[var(--arena-primary)]" size={28} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Case Opening</h3>
              <p className="text-[var(--arena-text-secondary)] text-sm mb-6">
                The first Deadlock case opening platform. Open cases for exclusive 
                community skins.
              </p>
              
              <Link
                href="/cases"
                className="btn-primary w-full py-3 rounded font-medium"
              >
                Get Notified
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--arena-bg-elevated)]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Arena
          </h2>
          <p className="text-[var(--arena-text-secondary)] mb-8">
            Be the first to know when new features launch. Get exclusive early access.
          </p>
          
          <EmailCapture 
            variant="hero"
            buttonText="Join Waitlist"
          />
          
          <p className="text-xs text-[var(--arena-text-muted)] mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
