'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, TrendingUp, TrendingDown, DollarSign, 
  Wallet, PiggyBank, BarChart3, Search, ChevronDown, 
  X, Shield, ArrowUpRight, Clock, CheckCircle2, Lock
} from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Available casinos for selection
const CASINOS = [
  { id: 'stake', name: 'Stake', logo: '🎰' },
  { id: 'rollbit', name: 'Rollbit', logo: '🎲' },
  { id: 'roobet', name: 'Roobet', logo: '🦘' },
  { id: 'duelbits', name: 'Duelbits', logo: '⚔️' },
  { id: 'bc-game', name: 'BC.Game', logo: '🎮' },
  { id: 'gamdom', name: 'Gamdom', logo: '💎' },
  { id: 'csgoroll', name: 'CSGORoll', logo: '🔫' },
  { id: 'shuffle', name: 'Shuffle', logo: '🃏' },
  { id: 'metawin', name: 'Metawin', logo: '🏆' },
  { id: 'packdraw', name: 'Packdraw', logo: '📦' },
];

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with commas
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, isPreview = false }) => {
  const isPositive = changeType === 'positive';
  
  return (
    <div className="arena-card p-4 md:p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-[var(--arena-text-muted)]">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[var(--arena-accent-purple)]/20 flex items-center justify-center">
            <Icon size={16} className="text-[var(--arena-accent-purple)]" />
          </div>
        )}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-white mb-1">
        {isPreview ? (
          <span className="text-[var(--arena-text-muted)]">$0</span>
        ) : (
          value
        )}
      </div>
      <div className="flex items-center gap-1 text-sm">
        {isPositive ? (
          <TrendingUp size={14} className="text-[var(--arena-success)]" />
        ) : (
          <TrendingDown size={14} className="text-[var(--arena-danger)]" />
        )}
        <span className={isPositive ? 'text-[var(--arena-success)]' : 'text-[var(--arena-danger)]'}>
          {change}%
        </span>
        <span className="text-[var(--arena-text-muted)]">vs last week</span>
      </div>
    </div>
  );
};

// Add Casino Modal
const AddCasinoModal = ({ isOpen, onClose, onAdd }) => {
  const [selectedCasino, setSelectedCasino] = useState('');
  const [wagerAmount, setWagerAmount] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCasino && wagerAmount) {
      const casino = CASINOS.find(c => c.id === selectedCasino);
      onAdd({
        id: Date.now(),
        casinoId: selectedCasino,
        casinoName: casino.name,
        casinoLogo: casino.logo,
        wager: parseFloat(wagerAmount),
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSelectedCasino('');
      setWagerAmount('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedCasinoData = CASINOS.find(c => c.id === selectedCasino);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--arena-bg-elevated)] rounded-xl border border-[var(--arena-border)] shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white">Add Casino</h3>
            <button onClick={onClose} className="p-1 text-[var(--arena-text-muted)] hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-[var(--arena-text-muted)] mb-6">Track your wager at a casino</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Casino Selector */}
            <div>
              <label className="block text-sm text-[var(--arena-text-secondary)] mb-2">Casino</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--arena-bg)] border border-[var(--arena-border)] text-left flex items-center justify-between hover:border-[var(--arena-accent-purple)] transition-colors"
                >
                  {selectedCasinoData ? (
                    <span className="flex items-center gap-2 text-white">
                      <span>{selectedCasinoData.logo}</span>
                      <span>{selectedCasinoData.name}</span>
                    </span>
                  ) : (
                    <span className="text-[var(--arena-text-muted)]">Select casino</span>
                  )}
                  <ChevronDown size={18} className={`text-[var(--arena-text-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--arena-bg)] border border-[var(--arena-border)] rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                    {CASINOS.map((casino) => (
                      <button
                        key={casino.id}
                        type="button"
                        onClick={() => {
                          setSelectedCasino(casino.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-2 hover:bg-[var(--arena-surface)] transition-colors ${
                          selectedCasino === casino.id ? 'bg-[var(--arena-accent-purple)]/10 text-[var(--arena-accent-purple)]' : 'text-white'
                        }`}
                      >
                        <span>{casino.logo}</span>
                        <span>{casino.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Wager Amount */}
            <div>
              <label className="block text-sm text-[var(--arena-text-secondary)] mb-2">Total Wager (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--arena-text-muted)]">$</span>
                <input
                  type="number"
                  value={wagerAmount}
                  onChange={(e) => setWagerAmount(e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-[var(--arena-bg)] border border-[var(--arena-border)] text-white placeholder-[var(--arena-text-muted)] focus:outline-none focus:border-[var(--arena-accent-purple)] transition-colors"
                />
              </div>
              <p className="text-xs text-[var(--arena-text-muted)] mt-1">Your total wagered amount at this casino</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedCasino || !wagerAmount}
              className="w-full py-3 rounded-lg bg-[var(--arena-accent-purple)] text-white font-semibold hover:bg-[var(--arena-accent-purple)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Casino
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Login Required Overlay
const LoginRequiredOverlay = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--arena-bg)]/80 backdrop-blur-sm rounded-lg z-10">
    <Lock size={32} className="text-[var(--arena-text-muted)] mb-3" />
    <h4 className="text-lg font-semibold text-white mb-1">Login Required</h4>
    <p className="text-sm text-[var(--arena-text-muted)] mb-4 text-center px-4">
      Please sign in to your account to access this feature.
    </p>
    <Link
      href="#"
      className="px-6 py-2 rounded-lg bg-[var(--arena-accent-purple)] text-white font-semibold hover:bg-[var(--arena-accent-purple)]/90 transition-colors"
    >
      Go to Login
    </Link>
  </div>
);

// Main Component
export default function VIPDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle this for testing
  const [casinos, setCasinos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCasinos = localStorage.getItem('gamblescan-casinos');
    if (savedCasinos) {
      setCasinos(JSON.parse(savedCasinos));
    }
  }, []);

  // Save to localStorage when casinos change
  useEffect(() => {
    if (casinos.length > 0) {
      localStorage.setItem('gamblescan-casinos', JSON.stringify(casinos));
    }
  }, [casinos]);

  const handleAddCasino = (newCasino) => {
    setCasinos(prev => [...prev, newCasino]);
  };

  const handleDeleteCasino = (id) => {
    setCasinos(prev => prev.filter(c => c.id !== id));
  };

  // Calculate totals
  const totalWager = casinos.reduce((sum, c) => sum + c.wager, 0);
  const totalDeposited = totalWager * 0.15; // Estimate
  const totalWithdrawn = totalWager * 0.12; // Estimate
  const netProfit = totalWithdrawn - totalDeposited;

  // Filter casinos
  const filteredCasinos = casinos.filter(c => 
    c.casinoName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--arena-bg)]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                My Profile
              </h1>
              <p className="text-sm text-[var(--arena-text-muted)]">Track and verify your gambling activity across casinos</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="arena-card p-4 mb-6">
          <p className="text-sm text-[var(--arena-text-secondary)]">
            <span className="text-white font-semibold">GambleScan</span> helps high-rollers aggregate gambling data across casinos. 
            Track your wagers, get verified by us, and receive exclusive VIP transfer offers from partner casinos.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Wagered" 
            value={formatCurrency(totalWager)} 
            change={0} 
            changeType="positive"
            icon={BarChart3}
            isPreview={casinos.length === 0}
          />
          <StatCard 
            title="Total Deposited" 
            value={formatCurrency(totalDeposited)} 
            change={0} 
            changeType="positive"
            icon={Wallet}
            isPreview={casinos.length === 0}
          />
          <StatCard 
            title="Total Withdrawn" 
            value={formatCurrency(totalWithdrawn)} 
            change={0} 
            changeType="positive"
            icon={PiggyBank}
            isPreview={casinos.length === 0}
          />
          <StatCard 
            title="Net Profit" 
            value={formatCurrency(netProfit)} 
            change={0} 
            changeType={netProfit >= 0 ? 'positive' : 'negative'}
            icon={DollarSign}
            isPreview={casinos.length === 0}
          />
        </div>

        {/* Casino Breakdown Section */}
        <div className="arena-card overflow-hidden mb-8">
          {/* Header */}
          <div className="p-4 border-b border-[var(--arena-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Casino Breakdown</h2>
              <p className="text-sm text-[var(--arena-text-muted)]">Your wager distribution across platforms</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--arena-text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search casinos..."
                  className="pl-9 pr-4 py-2 text-sm rounded-lg bg-[var(--arena-bg)] border border-[var(--arena-border)] text-white placeholder-[var(--arena-text-muted)] focus:outline-none focus:border-[var(--arena-accent-purple)] transition-colors w-48"
                />
              </div>
              {/* Add Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--arena-accent-purple)] text-white font-semibold hover:bg-[var(--arena-accent-purple)]/90 transition-colors text-sm"
              >
                <Plus size={16} />
                Add Casino
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto">
            {!isLoggedIn && casinos.length === 0 && <LoginRequiredOverlay />}
            
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--arena-border)] text-left text-sm text-[var(--arena-text-muted)]">
                  <th className="px-4 py-3 font-medium">Casino</th>
                  <th className="px-4 py-3 font-medium">Total Wager</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Added</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCasinos.length > 0 ? (
                  filteredCasinos.map((casino) => (
                    <tr key={casino.id} className="border-b border-[var(--arena-border)] hover:bg-[var(--arena-surface-hover)] transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{casino.casinoLogo}</span>
                          <span className="font-medium text-white">{casino.casinoName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-white">{formatCurrency(casino.wager)}</span>
                      </td>
                      <td className="px-4 py-4">
                        {casino.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-[var(--arena-success)]/20 text-[var(--arena-success)]">
                            <CheckCircle2 size={12} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-[var(--arena-warning)]/20 text-[var(--arena-warning)]">
                            <Clock size={12} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--arena-text-muted)]">
                        {new Date(casino.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="px-3 py-1.5 rounded text-xs font-medium bg-[var(--arena-accent-purple)]/20 text-[var(--arena-accent-purple)] hover:bg-[var(--arena-accent-purple)]/30 transition-colors"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleDeleteCasino(casino.id)}
                            className="px-3 py-1.5 rounded text-xs font-medium bg-[var(--arena-danger)]/20 text-[var(--arena-danger)] hover:bg-[var(--arena-danger)]/30 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--arena-surface)] flex items-center justify-center mb-4">
                          <Search size={24} className="text-[var(--arena-text-muted)]" />
                        </div>
                        <p className="text-[var(--arena-text-muted)] mb-1">No casinos added yet</p>
                        <p className="text-sm text-[var(--arena-text-muted)]">Add your first casino to start tracking</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[var(--arena-border)] flex items-center justify-between text-sm text-[var(--arena-text-muted)]">
            <span>Showing {filteredCasinos.length} of {casinos.length} casinos</span>
          </div>
        </div>

        {/* VIP Calculator Section */}
        <div className="arena-card p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">VIP Transfer Calculator</h2>
              <p className="text-sm text-[var(--arena-text-muted)]">Estimate your VIP bonus offer when transferring to a new casino</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[var(--arena-accent-purple)]/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-[var(--arena-accent-purple)]" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--arena-text-secondary)] mb-2">Total Lifetime Wager (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--arena-text-muted)]">$</span>
                  <input
                    type="number"
                    placeholder="e.g., 50000"
                    defaultValue={totalWager || ''}
                    className="w-full pl-8 pr-4 py-2.5 text-sm rounded-lg bg-[var(--arena-bg)] border border-[var(--arena-border)] text-white placeholder-[var(--arena-text-muted)] focus:outline-none focus:border-[var(--arena-accent-purple)] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[var(--arena-text-secondary)] mb-2">Average Monthly Wager (USD)</label>
                <div className="relative">
                  <TrendingUp size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--arena-text-muted)]" />
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-[var(--arena-bg)] border border-[var(--arena-border)] text-white placeholder-[var(--arena-text-muted)] focus:outline-none focus:border-[var(--arena-accent-purple)] transition-colors"
                  />
                </div>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-[var(--arena-accent-purple)] text-white font-semibold hover:bg-[var(--arena-accent-purple)]/90 transition-colors text-sm">
                Calculate Bonus
              </button>
            </div>

            {/* Result Section */}
            <div className="bg-[var(--arena-bg)] rounded-lg p-4 border border-[var(--arena-border)]">
              <h4 className="text-sm font-medium text-[var(--arena-text-muted)] mb-3">Estimated VIP Transfer Bonus</h4>
              <div className="text-3xl font-bold text-[var(--arena-accent-purple)] mb-4">
                {totalWager > 0 ? formatCurrency(totalWager * 0.02) : '$0'}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--arena-text-muted)]">Lossback</span>
                  <span className="text-white">Up to 15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--arena-text-muted)]">Free Spins</span>
                  <span className="text-white">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--arena-text-muted)]">Betting Limits</span>
                  <span className="text-white">Increased</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--arena-border)]">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[var(--arena-surface)] text-[var(--arena-accent-purple)] font-medium hover:bg-[var(--arena-surface-hover)] transition-colors text-sm"
                >
                  View VIP Offers
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="arena-card p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--arena-accent-purple)]/10 to-transparent" />
          <div className="relative">
            <Shield size={32} className="mx-auto mb-3 text-[var(--arena-accent-purple)]" />
            <h3 className="text-xl font-bold text-white mb-2">Get Verified & Unlock VIP Offers</h3>
            <p className="text-sm text-[var(--arena-text-muted)] mb-4 max-w-lg mx-auto">
              Verify your gambling history with us and get access to exclusive VIP transfer bonuses from our partner casinos.
            </p>
            <button className="px-6 py-2.5 rounded-lg bg-[var(--arena-accent-purple)] text-white font-semibold hover:bg-[var(--arena-accent-purple)]/90 transition-colors">
              Start Verification
            </button>
          </div>
        </div>
      </main>

      {/* Add Casino Modal */}
      <AddCasinoModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCasino}
      />
      
      <Footer />
    </div>
  );
}
