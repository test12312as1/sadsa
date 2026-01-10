'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Diamond Eye Logo
const DiamondEyeLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-purple-400"
    />
    <path 
      d="M12 8L15 12.5L12 17L9 12.5L12 8Z" 
      fill="currentColor"
      className="text-purple-500"
    />
  </svg>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const token = localStorage.getItem('gamblescan_token');
    const storedUser = localStorage.getItem('gamblescan_user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Optionally verify with backend
      fetchProfile(token);
    }
    setLoading(false);
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('gamblescan_user', JSON.stringify(data.user));
      } else {
        // Token invalid, clear storage
        handleLogout();
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gamblescan_token');
    localStorage.removeItem('gamblescan_user');
    window.location.href = '/';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Signed In</h1>
          <p className="text-gray-400 mb-6">Please sign in to view your profile.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </Link>
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
              <Link 
                href="/"
                className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity"
              >
                <DiamondEyeLogo size={22} />
                GambleScan
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-[#1a1a2e] hover:bg-[#252540] rounded-lg border border-gray-700/50 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="bg-[#12121c] rounded-2xl border border-gray-800/50 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-transparent p-8 border-b border-gray-800/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center">
                <User className="text-purple-400" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Profile</h1>
                <p className="text-gray-400 text-sm">Manage your GambleScan account</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#0f0f1a] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Mail className="text-purple-400" size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                  <div className="text-white font-medium">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#0f0f1a] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Calendar className="text-purple-400" size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Member Since</div>
                  <div className="text-white font-medium">{formatDate(user.created_at)}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#0f0f1a] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <User className="text-purple-400" size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Account ID</div>
                  <div className="text-gray-400 font-mono text-sm">{user.id?.slice(0, 8)}...{user.id?.slice(-4)}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-800/50">
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-12">
            <div className="text-gray-500 text-sm">
              © 2026 GambleScan
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
