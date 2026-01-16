'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ArrowLeft, Shield, Sparkles, Zap, Lock, CreditCard, Coins, Gift, ChevronRight, Star, Check } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import EmailCapture from '../components/emailcapture';

// Note: Updated to use new brand colors via CSS variables

// Sample case types
const CASE_TYPES = [
  {
    name: 'Standard Case',
    price: '$2.50',
    rarity: 'Common - Rare',
    color: '#3b82f6',
    items: ['Common Skins', 'Uncommon Skins', 'Rare Skins'],
    bestDrop: 'Rare Hero Skin'
  },
  {
    name: 'Premium Case',
    price: '$5.00',
    rarity: 'Uncommon - Epic',
    color: '#8b5cf6',
    items: ['Uncommon Skins', 'Rare Skins', 'Epic Skins'],
    bestDrop: 'Epic Weapon Skin'
  },
  {
    name: 'Legendary Case',
    price: '$10.00',
    rarity: 'Rare - Legendary',
    color: '#f59e0b',
    items: ['Rare Skins', 'Epic Skins', 'Legendary Skins'],
    bestDrop: 'Legendary Hero Skin'
  },
];

// Features
const FEATURES = [
  {
    icon: Shield,
    title: 'Provably Fair',
    description: 'Every case opening is verifiable on-chain. Complete transparency.'
  },
  {
    icon: Zap,
    title: 'Instant Withdrawals',
    description: 'Withdraw your winnings instantly to CS:GO skins or crypto.'
  },
  {
    icon: Sparkles,
    title: 'Exclusive Skins',
    description: 'Community-created Deadlock skins you won\'t find anywhere else.'
  },
  {
    icon: Lock,
    title: 'Secure & Licensed',
    description: 'Fully compliant platform with industry-standard security.'
  },
];

// Deposit methods
const DEPOSIT_METHODS = [
  { name: 'CS:GO Skins', icon: '🎮', description: 'Trade your CS:GO inventory' },
  { name: 'Cryptocurrency', icon: '₿', description: 'BTC, ETH, USDT, and more' },
  { name: 'Gift Cards', icon: '🎁', description: 'Steam, Amazon, and others' },
];

export default function CasesPage() {
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
                CASE <span className="gradient-text">OPENING</span>
              </h1>
              <span className="coming-soon-badge">COMING LATE 2026</span>
            </div>
            <p className="text-sm text-[var(--arena-text-muted)]">The first Deadlock case opening platform</p>
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--arena-secondary)]/20 to-yellow-500/10" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          
          <div className="relative p-8 md:p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[var(--arena-secondary)]/20 flex items-center justify-center mx-auto mb-6 animate-float">
              <Package className="text-[var(--arena-secondary)]" size={40} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Open Cases. Win <span className="gradient-text">Skins.</span>
            </h2>
            
            <p className="text-lg text-[var(--arena-text-secondary)] max-w-2xl mx-auto mb-8">
              The first dedicated case opening platform for Deadlock. Open cases for exclusive 
              community skins, withdraw to CS:GO items, and experience provably fair drops.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {FEATURES.slice(0, 3).map((feature) => (
                <div key={feature.title} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--arena-surface)] border border-[var(--arena-border)]">
                  <feature.icon className="text-[var(--arena-secondary)]" size={18} />
                  <span className="text-sm text-white">{feature.title}</span>
                </div>
              ))}
            </div>
            
            <div className="max-w-md mx-auto">
              <EmailCapture 
                variant="hero"
                buttonText="GET EARLY ACCESS"
              />
            </div>
          </div>
        </div>
        
        {/* Case Preview */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white text-center mb-8">
            CASE <span className="gradient-text">PREVIEW</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_TYPES.map((caseType) => (
              <div 
                key={caseType.name} 
                className="arena-card p-6 relative overflow-hidden group"
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    background: `radial-gradient(circle at center, ${caseType.color}22 0%, transparent 70%)`
                  }}
                />
                
                <div className="relative">
                  {/* Case Icon */}
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${caseType.color}33, ${caseType.color}11)`,
                      border: `2px solid ${caseType.color}66`
                    }}
                  >
                    <Package size={40} style={{ color: caseType.color }} />
                  </div>
                  
                  <h4 className="text-xl font-display font-bold text-white text-center mb-2">
                    {caseType.name}
                  </h4>
                  
                  <div className="text-center mb-4">
                    <span className="text-2xl font-display font-bold" style={{ color: caseType.color }}>
                      {caseType.price}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-[var(--arena-text-muted)] text-center">
                      Contains: {caseType.rarity}
                    </div>
                    {caseType.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[var(--arena-text-secondary)]">
                        <Check size={14} style={{ color: caseType.color }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 rounded-lg bg-[var(--arena-surface)] text-center">
                    <div className="text-xs text-[var(--arena-text-muted)]">Best Drop</div>
                    <div className="font-semibold text-white">{caseType.bestDrop}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-[var(--arena-text-muted)] mt-4">
            * Preview only. Final cases and pricing may vary at launch.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white text-center mb-8">
            WHY <span className="gradient-text">LOCKARENA?</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="arena-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--arena-secondary)]/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-[var(--arena-secondary)]" size={24} />
                </div>
                <h4 className="font-display font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-[var(--arena-text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Deposit Methods */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white text-center mb-8">
            DEPOSIT <span className="gradient-text">METHODS</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {DEPOSIT_METHODS.map((method) => (
              <div key={method.name} className="arena-card p-6 text-center">
                <div className="text-4xl mb-3">{method.icon}</div>
                <h4 className="font-display font-bold text-white mb-1">{method.name}</h4>
                <p className="text-sm text-[var(--arena-text-muted)]">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white text-center mb-8">
            LAUNCH <span className="gradient-text">TIMELINE</span>
          </h3>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--arena-border)]" />
              
              {/* Timeline items */}
              <div className="space-y-8">
                <div className="relative flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--arena-success)] flex items-center justify-center shrink-0 z-10">
                    <Check className="text-white" size={20} />
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-[var(--arena-success)] font-semibold">NOW</div>
                    <div className="font-display font-bold text-white">Community Building</div>
                    <p className="text-sm text-[var(--arena-text-secondary)]">
                      Hero Ranker, Esports Hub, and community tools live
                    </p>
                  </div>
                </div>
                
                <div className="relative flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--arena-tertiary)] flex items-center justify-center shrink-0 z-10">
                    <span className="text-white font-bold">Q2</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-[var(--arena-tertiary)] font-semibold">Q2 2026</div>
                    <div className="font-display font-bold text-white">Prediction Markets Launch</div>
                    <p className="text-sm text-[var(--arena-text-secondary)]">
                      Free-to-play predictions with weekly prizes
                    </p>
                  </div>
                </div>
                
                <div className="relative flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--arena-secondary)] flex items-center justify-center shrink-0 z-10">
                    <span className="text-white font-bold">Q4</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-[var(--arena-secondary)] font-semibold">LATE 2026</div>
                    <div className="font-display font-bold text-white">Case Opening Launch</div>
                    <p className="text-sm text-[var(--arena-text-secondary)]">
                      Full case opening platform with community skins
                    </p>
                  </div>
                </div>
                
                <div className="relative flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--arena-surface)] border-2 border-[var(--arena-border)] flex items-center justify-center shrink-0 z-10">
                    <Star className="text-[var(--arena-text-muted)]" size={20} />
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-[var(--arena-text-muted)] font-semibold">TBD</div>
                    <div className="font-display font-bold text-white">Deadlock Items Integration</div>
                    <p className="text-sm text-[var(--arena-text-secondary)]">
                      When Valve enables item trading
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="arena-card p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--arena-secondary)]/10 to-transparent" />
          
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Be First in <span className="gradient-text">Line</span>
            </h3>
            <p className="text-[var(--arena-text-secondary)] mb-8 max-w-lg mx-auto">
              Join the waitlist for exclusive early access, bonus credits, and special launch promotions.
            </p>
            
            <div className="max-w-md mx-auto">
              <EmailCapture 
                variant="hero"
                buttonText="JOIN WAITLIST"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-[var(--arena-text-muted)]">
                <Gift className="text-[var(--arena-secondary)]" size={16} />
                <span>Early access bonus credits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--arena-text-muted)]">
                <Star className="text-[var(--arena-secondary)]" size={16} />
                <span>Exclusive launch skins</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
