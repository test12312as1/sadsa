'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Trophy, Calendar, TrendingUp, Package } from 'lucide-react';

// Discord icon
const DiscordIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const NAV_ITEMS = [
  { href: '/rank', label: 'Rankings', icon: Trophy },
  { href: '/esports', label: 'Esports', icon: Calendar },
  { href: '/predictions', label: 'Predict', icon: TrendingUp, comingSoon: true },
  { href: '/cases', label: 'Cases', icon: Package, comingSoon: true },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--arena-bg)]/80 backdrop-blur-md border-b border-[var(--arena-border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-[var(--arena-primary)] flex items-center justify-center font-bold text-[#1A1A1A] text-sm">
              L
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Lock<span className="text-[var(--arena-primary)]">Arena</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[var(--arena-primary)] font-bold'
                      : 'text-[var(--arena-text-secondary)] hover:text-white hover:bg-[var(--arena-surface)]'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.comingSoon && (
                    <span className="coming-soon-badge">Soon</span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--arena-primary)] shadow-[0_0_8px_var(--arena-primary-glow)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="p-2 rounded-lg text-[var(--arena-text-secondary)] hover:text-white hover:bg-[var(--arena-surface)] transition-colors"
              title="Join Discord"
            >
              <DiscordIcon size={20} />
            </a>
            <Link
              href="/rank"
              className="btn-primary px-4 py-2 rounded text-sm"
            >
              Start Voting
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[var(--arena-surface)] text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--arena-bg)] border-t border-[var(--arena-border)]">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                    isActive
                      ? 'text-[var(--arena-primary)] bg-[var(--arena-primary)]/10 font-bold'
                      : 'text-[var(--arena-text-secondary)] hover:text-white hover:bg-[var(--arena-surface)]'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.comingSoon && (
                    <span className="coming-soon-badge">Soon</span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[var(--arena-border)]">
              <Link
                href="/rank"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full py-3 rounded text-center block font-semibold"
              >
                Start Voting
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
