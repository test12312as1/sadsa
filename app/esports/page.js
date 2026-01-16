'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Trophy, Users, Clock, MapPin, ExternalLink, ChevronRight, Play, ArrowLeft, Bell, Filter, Search } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import EmailCapture from '../components/emailcapture';

// Note: Updated to use new brand colors via CSS variables

// Mock tournament data
const TOURNAMENTS = [
  {
    id: 1,
    name: 'Deadlock Championship Series',
    organizer: 'ESL',
    prizePool: '$100,000',
    startDate: '2026-02-15',
    endDate: '2026-02-20',
    status: 'upcoming',
    teams: 16,
    region: 'Global',
    image: null,
    tier: 'S-Tier'
  },
  {
    id: 2,
    name: 'NA Deadlock Open',
    organizer: 'BLAST',
    prizePool: '$25,000',
    startDate: '2026-01-25',
    endDate: '2026-01-28',
    status: 'upcoming',
    teams: 8,
    region: 'North America',
    image: null,
    tier: 'A-Tier'
  },
  {
    id: 3,
    name: 'EU Deadlock Masters',
    organizer: 'FACEIT',
    prizePool: '$50,000',
    startDate: '2026-01-20',
    endDate: '2026-01-22',
    status: 'live',
    teams: 12,
    region: 'Europe',
    image: null,
    tier: 'A-Tier'
  },
  {
    id: 4,
    name: 'Weekly Community Cup #12',
    organizer: 'Community',
    prizePool: '$1,000',
    startDate: '2026-01-18',
    endDate: '2026-01-18',
    status: 'completed',
    teams: 32,
    region: 'Global',
    image: null,
    tier: 'B-Tier'
  },
];

// Mock match data
const UPCOMING_MATCHES = [
  {
    id: 1,
    tournament: 'EU Deadlock Masters',
    team1: { name: 'Team Liquid', tag: 'TL', score: null },
    team2: { name: 'Fnatic', tag: 'FNC', score: null },
    time: '2026-01-20T18:00:00Z',
    status: 'live',
    stream: 'https://twitch.tv/esl_deadlock'
  },
  {
    id: 2,
    tournament: 'EU Deadlock Masters',
    team1: { name: 'G2 Esports', tag: 'G2', score: null },
    team2: { name: 'Vitality', tag: 'VIT', score: null },
    time: '2026-01-20T20:00:00Z',
    status: 'upcoming',
    stream: 'https://twitch.tv/esl_deadlock'
  },
  {
    id: 3,
    tournament: 'NA Deadlock Open',
    team1: { name: 'Cloud9', tag: 'C9', score: null },
    team2: { name: 'Sentinels', tag: 'SEN', score: null },
    time: '2026-01-25T19:00:00Z',
    status: 'upcoming',
    stream: null
  },
];

// Mock team rankings
const TOP_TEAMS = [
  { rank: 1, name: 'Team Liquid', tag: 'TL', region: 'EU', points: 2450, change: 0 },
  { rank: 2, name: 'Fnatic', tag: 'FNC', region: 'EU', points: 2380, change: 1 },
  { rank: 3, name: 'Cloud9', tag: 'C9', region: 'NA', points: 2320, change: -1 },
  { rank: 4, name: 'G2 Esports', tag: 'G2', region: 'EU', points: 2280, change: 2 },
  { rank: 5, name: 'Sentinels', tag: 'SEN', region: 'NA', points: 2210, change: 0 },
];

// Format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format time
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Tournament Card
const TournamentCard = ({ tournament }) => {
  const statusColors = {
    live: 'bg-[var(--arena-danger)] text-white',
    upcoming: 'bg-[var(--arena-primary)]/20 text-[var(--arena-primary)]',
    completed: 'bg-[var(--arena-surface)] text-[var(--arena-text-muted)]'
  };
  
  const tierColors = {
    'S-Tier': 'text-yellow-500',
    'A-Tier': 'text-[var(--arena-primary)]',
    'B-Tier': 'text-[var(--arena-text-secondary)]'
  };
  
  return (
    <div className="arena-card p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${statusColors[tournament.status]}`}>
            {tournament.status === 'live' && '● '}
            {tournament.status}
          </span>
          <span className={`text-xs font-semibold ${tierColors[tournament.tier]}`}>
            {tournament.tier}
          </span>
        </div>
        <span className="text-xs text-[var(--arena-text-muted)]">{tournament.organizer}</span>
      </div>
      
      <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-[var(--arena-primary)] transition-colors">
        {tournament.name}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-[var(--arena-text-secondary)]">
          <Calendar size={14} />
          <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--arena-text-secondary)]">
          <MapPin size={14} />
          <span>{tournament.region}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--arena-text-secondary)]">
          <Users size={14} />
          <span>{tournament.teams} Teams</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-[var(--arena-border)]">
        <div>
          <div className="text-xs text-[var(--arena-text-muted)]">Prize Pool</div>
          <div className="text-lg font-display font-bold text-[var(--arena-secondary)]">{tournament.prizePool}</div>
        </div>
        <button className="p-2 rounded-lg bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] hover:bg-[var(--arena-surface-hover)] transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// Match Card
const MatchCard = ({ match }) => {
  const isLive = match.status === 'live';
  
  return (
    <div className={`arena-card p-4 ${isLive ? 'glow-border' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[var(--arena-text-muted)]">{match.tournament}</span>
        {isLive ? (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-[var(--arena-danger)] text-white live-indicator">
            ● LIVE
          </span>
        ) : (
          <span className="text-xs text-[var(--arena-text-secondary)]">
            {formatDate(match.time)} • {formatTime(match.time)}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        {/* Team 1 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--arena-surface)] flex items-center justify-center font-display font-bold text-white">
            {match.team1.tag.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white">{match.team1.name}</div>
            <div className="text-xs text-[var(--arena-text-muted)]">{match.team1.tag}</div>
          </div>
        </div>
        
        {/* VS */}
        <div className="px-4">
          <span className="text-sm font-display font-bold text-[var(--arena-text-muted)]">VS</span>
        </div>
        
        {/* Team 2 */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-[var(--arena-surface)] flex items-center justify-center font-display font-bold text-white">
            {match.team2.tag.charAt(0)}
          </div>
          <div className="text-right">
            <div className="font-semibold text-white">{match.team2.name}</div>
            <div className="text-xs text-[var(--arena-text-muted)]">{match.team2.tag}</div>
          </div>
        </div>
      </div>
      
      {match.stream && (
        <a 
          href={match.stream}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full py-2 rounded-lg bg-[var(--arena-tertiary)]/20 text-[var(--arena-tertiary)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--arena-tertiary)]/30 transition-colors"
        >
          <Play size={14} />
          Watch Stream
        </a>
      )}
    </div>
  );
};

export default function EsportsHub() {
  const [activeTab, setActiveTab] = useState('tournaments');
  
  return (
    <div className="min-h-screen bg-[var(--arena-bg)]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                ESPORTS <span className="gradient-text">HUB</span>
              </h1>
              <p className="text-sm text-[var(--arena-text-muted)]">Tournaments, matches, and team rankings</p>
            </div>
          </div>
          
          <button className="p-2 rounded-lg bg-[var(--arena-primary)]/20 text-[var(--arena-primary)] hover:bg-[var(--arena-primary)]/30 transition-colors">
            <Bell size={18} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {['tournaments', 'matches', 'teams'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[var(--arena-primary)] text-[var(--arena-bg)]'
                  : 'bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--arena-text-muted)]" size={18} />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--arena-surface)] border border-[var(--arena-border)] text-white placeholder-[var(--arena-text-muted)] focus:border-[var(--arena-primary)] focus:outline-none transition-colors"
                />
              </div>
              <button className="px-4 py-2.5 rounded-lg bg-[var(--arena-surface)] border border-[var(--arena-border)] text-[var(--arena-text-secondary)] hover:text-white flex items-center gap-2 transition-colors">
                <Filter size={16} />
                Filters
              </button>
            </div>
            
            {/* Tournament Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOURNAMENTS.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
            
            {/* Load More */}
            <div className="text-center mt-8">
              <button className="btn-secondary px-6 py-2.5 rounded-lg font-semibold">
                Load More Tournaments
              </button>
            </div>
          </div>
        )}
        
        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live & Upcoming */}
              <div>
                <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[var(--arena-primary)]" />
                  LIVE & UPCOMING
                </h2>
                <div className="space-y-4">
                  {UPCOMING_MATCHES.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
              
              {/* Calendar */}
              <div>
                <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[var(--arena-secondary)]" />
                  MATCH CALENDAR
                </h2>
                <div className="arena-card p-6 text-center">
                  <Calendar className="mx-auto text-[var(--arena-text-muted)] mb-4" size={48} />
                  <p className="text-[var(--arena-text-secondary)] mb-4">
                    Full calendar view coming soon. Get notified when it launches.
                  </p>
                  <EmailCapture variant="inline" buttonText="Notify Me" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div>
            <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              TEAM RANKINGS
            </h2>
            
            <div className="arena-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--arena-border)]">
                      <th className="text-left p-4 text-xs font-semibold text-[var(--arena-text-muted)] uppercase">#</th>
                      <th className="text-left p-4 text-xs font-semibold text-[var(--arena-text-muted)] uppercase">Team</th>
                      <th className="text-left p-4 text-xs font-semibold text-[var(--arena-text-muted)] uppercase">Region</th>
                      <th className="text-right p-4 text-xs font-semibold text-[var(--arena-text-muted)] uppercase">Points</th>
                      <th className="text-right p-4 text-xs font-semibold text-[var(--arena-text-muted)] uppercase">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_TEAMS.map((team) => (
                      <tr key={team.rank} className="border-b border-[var(--arena-border)] hover:bg-[var(--arena-surface-hover)] transition-colors">
                        <td className="p-4">
                          <span className={`font-display font-bold ${
                            team.rank === 1 ? 'text-yellow-500' :
                            team.rank === 2 ? 'text-gray-400' :
                            team.rank === 3 ? 'text-orange-600' :
                            'text-[var(--arena-text-muted)]'
                          }`}>
                            {team.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--arena-surface)] flex items-center justify-center font-display font-bold text-white">
                              {team.tag.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{team.name}</div>
                              <div className="text-xs text-[var(--arena-text-muted)]">{team.tag}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[var(--arena-text-secondary)]">{team.region}</td>
                        <td className="p-4 text-right font-mono font-semibold text-white">{team.points}</td>
                        <td className="p-4 text-right">
                          {team.change > 0 && <span className="text-[var(--arena-success)]">▲ {team.change}</span>}
                          {team.change < 0 && <span className="text-[var(--arena-danger)]">▼ {Math.abs(team.change)}</span>}
                          {team.change === 0 && <span className="text-[var(--arena-text-muted)]">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-[var(--arena-border)] text-center">
                <button className="text-[var(--arena-primary)] text-sm hover:underline">
                  View Full Rankings →
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* CTA Section */}
        <div className="mt-12 arena-card p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">
            Never Miss a Match
          </h3>
          <p className="text-[var(--arena-text-secondary)] mb-6 max-w-md mx-auto">
            Get notifications for your favorite teams and tournaments. We&apos;ll keep you updated.
          </p>
          <EmailCapture variant="inline" buttonText="Subscribe" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
