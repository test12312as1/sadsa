'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Trophy, Share2, ChevronLeft, ChevronRight, RotateCcw, TrendingUp, TrendingDown, Crown, Volume2, Skull, Sparkles, Target, Users, Flame, ArrowLeft, Info } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Deadlock Heroes Data
const HEROES = [
  { id: 1, name: 'Abrams', role: 'Tank', color: '#8B4513' },
  { id: 2, name: 'Bebop', role: 'Support', color: '#4169E1' },
  { id: 3, name: 'Dynamo', role: 'Support', color: '#9932CC' },
  { id: 4, name: 'Grey Talon', role: 'Carry', color: '#2F4F4F' },
  { id: 5, name: 'Haze', role: 'Carry', color: '#FF1493' },
  { id: 6, name: 'Infernus', role: 'Carry', color: '#FF4500' },
  { id: 7, name: 'Ivy', role: 'Support', color: '#228B22' },
  { id: 8, name: 'Kelvin', role: 'Tank', color: '#00CED1' },
  { id: 9, name: 'Lady Geist', role: 'Carry', color: '#800080' },
  { id: 10, name: 'Lash', role: 'Carry', color: '#FFD700' },
  { id: 11, name: 'McGinnis', role: 'Support', color: '#CD853F' },
  { id: 12, name: 'Mo & Krill', role: 'Tank', color: '#556B2F' },
  { id: 13, name: 'Paradox', role: 'Carry', color: '#4B0082' },
  { id: 14, name: 'Pocket', role: 'Support', color: '#8A2BE2' },
  { id: 15, name: 'Seven', role: 'Carry', color: '#00BFFF' },
  { id: 16, name: 'Shiv', role: 'Carry', color: '#DC143C' },
  { id: 17, name: 'Vindicta', role: 'Carry', color: '#B22222' },
  { id: 18, name: 'Viscous', role: 'Tank', color: '#32CD32' },
  { id: 19, name: 'Warden', role: 'Tank', color: '#708090' },
  { id: 20, name: 'Wraith', role: 'Carry', color: '#483D8B' },
  { id: 21, name: 'Yamato', role: 'Carry', color: '#FF6347' },
  { id: 22, name: 'Mirage', role: 'Carry', color: '#DDA0DD' },
  { id: 23, name: 'Holliday', role: 'Support', color: '#F4A460' },
  { id: 24, name: 'Calico', role: 'Support', color: '#FFA07A' },
];

// Voting Categories
const CATEGORIES = [
  { id: 'nerf', name: 'Most Likely to Get Nerfed', icon: Target, description: 'Who needs the nerf hammer?' },
  { id: 'design', name: 'Best Hero Design', icon: Sparkles, description: 'Coolest looking hero' },
  { id: 'annoying', name: 'Most Annoying to Play Against', icon: Skull, description: 'Makes you want to uninstall' },
  { id: 'voicelines', name: 'Best Voice Lines', icon: Volume2, description: 'Most memorable quotes' },
  { id: 'fun', name: 'Most Fun to Play', icon: Flame, description: 'Pure enjoyment factor' },
  { id: 'carry', name: 'Best Solo Carry Potential', icon: Crown, description: '1v9 machine' },
];

// K-factor for ELO calculation
const K_FACTOR = 32;

// Calculate expected score
const expectedScore = (ratingA, ratingB) => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

// Calculate new ELO ratings
const calculateNewRatings = (winnerRating, loserRating) => {
  const expectedWinner = expectedScore(winnerRating, loserRating);
  const expectedLoser = expectedScore(loserRating, winnerRating);
  
  return {
    newWinnerRating: Math.round(winnerRating + K_FACTOR * (1 - expectedWinner)),
    newLoserRating: Math.round(loserRating + K_FACTOR * (0 - expectedLoser))
  };
};

// Initialize ratings for a category
const initializeRatings = () => {
  const ratings = {};
  HEROES.forEach(hero => {
    ratings[hero.id] = 1200;
  });
  return ratings;
};

// Get random matchup
const getRandomMatchup = (heroes, previousMatchups = []) => {
  const availablePairs = [];
  
  for (let i = 0; i < heroes.length; i++) {
    for (let j = i + 1; j < heroes.length; j++) {
      const pairKey = `${Math.min(heroes[i].id, heroes[j].id)}-${Math.max(heroes[i].id, heroes[j].id)}`;
      if (!previousMatchups.includes(pairKey)) {
        availablePairs.push([heroes[i], heroes[j]]);
      }
    }
  }
  
  if (availablePairs.length === 0) {
    const randomIndex = Math.floor(Math.random() * heroes.length);
    let secondIndex = Math.floor(Math.random() * heroes.length);
    while (secondIndex === randomIndex) {
      secondIndex = Math.floor(Math.random() * heroes.length);
    }
    return [heroes[randomIndex], heroes[secondIndex]];
  }
  
  const randomPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
  return Math.random() > 0.5 ? randomPair : [randomPair[1], randomPair[0]];
};

// Hero Avatar Component
const HeroAvatar = ({ hero, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-32 h-32 text-2xl'
  };
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold text-white`}
      style={{ 
        background: `linear-gradient(135deg, ${hero.color}, ${hero.color}88)`,
        border: `2px solid ${hero.color}`
      }}
    >
      {hero.name.charAt(0)}
    </div>
  );
};

// Hero Card Component for Voting
const HeroCard = ({ hero, onVote, side, isAnimating, voteDirection }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchDelta, setTouchDelta] = useState(0);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    const delta = e.touches[0].clientX - touchStart;
    setTouchDelta(delta);
  };
  
  const handleTouchEnd = () => {
    if (Math.abs(touchDelta) > 100) {
      onVote(touchDelta > 0 ? 'right' : 'left');
    }
    setTouchStart(null);
    setTouchDelta(0);
  };
  
  const animationClass = isAnimating 
    ? voteDirection === side ? 'swipe-right' : 'swipe-left'
    : '';
  
  return (
    <div
      className={`hero-card relative cursor-pointer touch-feedback ${animationClass}`}
      style={{
        transform: touchDelta ? `translateX(${touchDelta * 0.3}px) rotate(${touchDelta * 0.02}deg)` : undefined,
        transition: touchDelta ? 'none' : 'transform 0.2s ease'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onVote(side)}
    >
      {/* Vote overlay indicators */}
      {touchDelta > 50 && (
        <div className="absolute inset-0 vote-overlay-right z-10 flex items-center justify-end pr-4 rounded-xl">
          <div className="bg-[var(--arena-success)] rounded-full p-3">
            <ChevronRight className="text-white" size={32} />
          </div>
        </div>
      )}
      {touchDelta < -50 && (
        <div className="absolute inset-0 vote-overlay-left z-10 flex items-center justify-start pl-4 rounded-xl">
          <div className="bg-[var(--arena-danger)] rounded-full p-3">
            <ChevronLeft className="text-white" size={32} />
          </div>
        </div>
      )}
      
      {/* Hero Image/Avatar */}
      <div 
        className="aspect-[3/4] flex items-center justify-center relative overflow-hidden rounded-t-xl"
        style={{ 
          background: `linear-gradient(180deg, ${hero.color}33 0%, ${hero.color}11 100%)`
        }}
      >
        <div 
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold text-white"
          style={{ 
            background: `linear-gradient(135deg, ${hero.color}, ${hero.color}aa)`,
            border: `3px solid ${hero.color}`,
            boxShadow: `0 0 40px ${hero.color}44`
          }}
        >
          {hero.name.charAt(0)}
        </div>
        
        {/* Role badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider"
          style={{ 
            background: `${hero.color}33`,
            border: `1px solid ${hero.color}66`,
            color: hero.color
          }}
        >
          {hero.role}
        </div>
      </div>
      
      {/* Hero Info */}
      <div className="p-4 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {hero.name}
        </h3>
      </div>
    </div>
  );
};

// Ranking Item Component
const RankingItem = ({ hero, rank, rating, previousRank, isNew }) => {
  const rankChange = previousRank ? previousRank - rank : 0;
  
  return (
    <div className={`ranking-item flex items-center gap-3 p-2 ${isNew ? 'rank-change' : ''}`}>
      <div className={`w-6 text-center font-bold text-sm ${
        rank === 1 ? 'rank-1' :
        rank === 2 ? 'rank-2' :
        rank === 3 ? 'rank-3' :
        'text-[var(--arena-text-muted)]'
      }`}>
        {rank === 1 && <Crown size={16} className="inline" />}
        {rank > 1 && rank}
      </div>
      
      <HeroAvatar hero={hero} size="sm" />
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{hero.name}</div>
        <div className="text-xs text-[var(--arena-text-muted)]">{rating} ELO</div>
      </div>
      
      {rankChange !== 0 && (
        <div className={`flex items-center text-xs ${rankChange > 0 ? 'text-[var(--arena-success)]' : 'text-[var(--arena-danger)]'}`}>
          {rankChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span className="ml-0.5">{Math.abs(rankChange)}</span>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function HeroRanker() {
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [ratings, setRatings] = useState({});
  const [matchup, setMatchup] = useState(null);
  const [previousMatchups, setPreviousMatchups] = useState([]);
  const [voteCount, setVoteCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [voteDirection, setVoteDirection] = useState(null);
  const [previousRanks, setPreviousRanks] = useState({});
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [recentlyChanged, setRecentlyChanged] = useState([]);
  const [showMobileRankings, setShowMobileRankings] = useState(false);
  
  // Initialize on mount
  useEffect(() => {
    const savedRatings = localStorage.getItem(`lockarena-ratings-${currentCategory.id}`);
    const savedVoteCount = localStorage.getItem(`lockarena-votes-${currentCategory.id}`);
    
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    } else {
      setRatings(initializeRatings());
    }
    
    if (savedVoteCount) {
      setVoteCount(parseInt(savedVoteCount));
    }
    
    setMatchup(getRandomMatchup(HEROES));
    setPreviousMatchups([]);
  }, [currentCategory]);
  
  // Save to localStorage
  useEffect(() => {
    if (Object.keys(ratings).length > 0) {
      localStorage.setItem(`lockarena-ratings-${currentCategory.id}`, JSON.stringify(ratings));
      localStorage.setItem(`lockarena-votes-${currentCategory.id}`, voteCount.toString());
    }
  }, [ratings, voteCount, currentCategory]);
  
  // Get sorted rankings
  const getSortedRankings = useCallback(() => {
    return HEROES
      .map(hero => ({
        ...hero,
        rating: ratings[hero.id] || 1200
      }))
      .sort((a, b) => b.rating - a.rating);
  }, [ratings]);
  
  // Handle vote
  const handleVote = useCallback((winningSide) => {
    if (isAnimating || !matchup) return;
    
    const winner = winningSide === 'left' ? matchup[0] : matchup[1];
    const loser = winningSide === 'left' ? matchup[1] : matchup[0];
    
    setIsAnimating(true);
    setVoteDirection(winningSide);
    
    const currentRankings = getSortedRankings();
    const prevRanks = {};
    currentRankings.forEach((hero, index) => {
      prevRanks[hero.id] = index + 1;
    });
    setPreviousRanks(prevRanks);
    
    const { newWinnerRating, newLoserRating } = calculateNewRatings(
      ratings[winner.id] || 1200,
      ratings[loser.id] || 1200
    );
    
    setTimeout(() => {
      setRatings(prev => ({
        ...prev,
        [winner.id]: newWinnerRating,
        [loser.id]: newLoserRating
      }));
      
      setRecentlyChanged([winner.id, loser.id]);
      setTimeout(() => setRecentlyChanged([]), 500);
      
      const pairKey = `${Math.min(matchup[0].id, matchup[1].id)}-${Math.max(matchup[0].id, matchup[1].id)}`;
      setPreviousMatchups(prev => [...prev, pairKey]);
      
      setMatchup(getRandomMatchup(HEROES, [...previousMatchups, pairKey]));
      setVoteCount(prev => prev + 1);
      setIsAnimating(false);
      setVoteDirection(null);
    }, 400);
  }, [isAnimating, matchup, ratings, previousMatchups, getSortedRankings]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleVote('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleVote('right');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleVote]);
  
  // Reset rankings
  const handleReset = () => {
    if (confirm('Reset all rankings for this category?')) {
      setRatings(initializeRatings());
      setVoteCount(0);
      setPreviousMatchups([]);
      setMatchup(getRandomMatchup(HEROES));
    }
  };
  
  // Share results
  const handleShare = () => {
    const rankings = getSortedRankings();
    const top5 = rankings.slice(0, 5);
    
    const shareText = `🎮 My Deadlock "${currentCategory.name}" Rankings:\n\n${top5.map((h, i) => `${i + 1}. ${h.name} (${h.rating})`).join('\n')}\n\nVote now: lockarena.com/rank`;
    
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {
        navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  };
  
  const sortedRankings = getSortedRankings();
  
  return (
    <div className="min-h-screen bg-[var(--arena-bg)]">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Hero Rankings
              </h1>
              <p className="text-sm text-[var(--arena-text-muted)]">Vote to create community rankings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--arena-surface)] border border-[var(--arena-border)]">
              <span className="text-sm text-[var(--arena-text-secondary)]">{voteCount} votes</span>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-white transition-colors"
              title="Reset Rankings"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-[var(--arena-primary)]/20 text-[var(--arena-primary)] hover:bg-[var(--arena-primary)]/30 transition-colors"
              title="Share Rankings"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Voting Section */}
          <div className="flex-1">
            {/* Category Selector */}
            <div className="mb-6">
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="category-pill w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--arena-surface-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <currentCategory.icon className="text-[var(--arena-primary)]" size={20} />
                  <div className="text-left">
                    <div className="text-lg font-semibold text-white">
                      {currentCategory.name}
                    </div>
                    <div className="text-xs text-[var(--arena-text-muted)]">{currentCategory.description}</div>
                  </div>
                </div>
                <ChevronRight className={`text-[var(--arena-text-muted)] transition-transform ${showCategoryPicker ? 'rotate-90' : ''}`} size={20} />
              </button>
              
              {showCategoryPicker && (
                <div className="mt-2 bg-[var(--arena-surface)] rounded-xl border border-[var(--arena-border)] overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCurrentCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--arena-surface-hover)] transition-colors ${
                        cat.id === currentCategory.id ? 'bg-[var(--arena-primary)]/10' : ''
                      }`}
                    >
                      <cat.icon className={cat.id === currentCategory.id ? 'text-[var(--arena-primary)]' : 'text-[var(--arena-text-muted)]'} size={18} />
                      <div className="text-left">
                        <div className={`font-medium ${cat.id === currentCategory.id ? 'text-[var(--arena-primary)]' : 'text-white'}`}>
                          {cat.name}
                        </div>
                        <div className="text-xs text-[var(--arena-text-muted)]">{cat.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Matchup Cards */}
            {matchup && (
              <div className="relative">
                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="vs-badge w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-[var(--arena-primary)]">VS</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <HeroCard
                    hero={matchup[0]}
                    onVote={() => handleVote('left')}
                    side="left"
                    isAnimating={isAnimating}
                    voteDirection={voteDirection}
                  />
                  <HeroCard
                    hero={matchup[1]}
                    onVote={() => handleVote('right')}
                    side="right"
                    isAnimating={isAnimating}
                    voteDirection={voteDirection}
                  />
                </div>
              </div>
            )}
            
            {/* Keyboard Hints (Desktop) */}
            <div className="hidden md:flex justify-center gap-8 mt-6 text-sm text-[var(--arena-text-muted)]">
              <div className="flex items-center gap-2">
                <span className="key-hint px-2 py-1 rounded">←</span>
                <span>or</span>
                <span className="key-hint px-2 py-1 rounded">A</span>
                <span>for left</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="key-hint px-2 py-1 rounded">→</span>
                <span>or</span>
                <span className="key-hint px-2 py-1 rounded">D</span>
                <span>for right</span>
              </div>
            </div>
            
            {/* Mobile Swipe Hint */}
            <div className="md:hidden text-center mt-4 text-sm text-[var(--arena-text-muted)]">
              Tap a hero to vote or swipe to choose
            </div>
            
            {/* Mobile Rankings Toggle */}
            <button
              onClick={() => setShowMobileRankings(!showMobileRankings)}
              className="lg:hidden w-full mt-6 py-3 rounded-xl bg-[var(--arena-surface)] border border-[var(--arena-border)] text-white font-medium flex items-center justify-center gap-2"
            >
              <Trophy size={18} className="text-[var(--arena-primary)]" />
              {showMobileRankings ? 'Hide Rankings' : 'View Rankings'}
            </button>
          </div>
          
          {/* Rankings Sidebar */}
          <div className={`lg:w-80 ${showMobileRankings ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[var(--arena-surface)] rounded-xl border border-[var(--arena-border)] overflow-hidden sticky top-24">
              <div className="p-4 border-b border-[var(--arena-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="text-[var(--arena-primary)]" size={18} />
                  <span className="font-semibold text-white">Rankings</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--arena-text-muted)]">
                  <Users size={12} />
                  <span>{voteCount} votes</span>
                </div>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {sortedRankings.map((hero, index) => (
                  <RankingItem
                    key={hero.id}
                    hero={hero}
                    rank={index + 1}
                    rating={hero.rating}
                    previousRank={previousRanks[hero.id]}
                    isNew={recentlyChanged.includes(hero.id)}
                  />
                ))}
              </div>
              
              <div className="p-3 border-t border-[var(--arena-border)]">
                <button
                  onClick={handleShare}
                  className="w-full py-2.5 rounded-lg btn-primary font-medium flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share Rankings
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Section */}
        <div className="mt-12 arena-card p-6">
          <div className="flex items-start gap-3">
            <Info className="text-[var(--arena-secondary)] shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-2">How It Works</h3>
              <p className="text-sm text-[var(--arena-text-secondary)]">
                Each vote updates the ELO ratings of both heroes. The more you vote, the more accurate the rankings become. 
                Your votes are saved locally and contribute to the community rankings. Share your results to spark debates!
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
