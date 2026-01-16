'use client';

import Link from 'next/link';
import { Twitter, Youtube, Mail } from 'lucide-react';

// Discord icon
const DiscordIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[var(--arena-bg)] border-t border-[var(--arena-border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-[var(--arena-primary)] flex items-center justify-center font-bold text-[#1A1A1A] text-sm">
                L
              </div>
              <span className="text-lg font-semibold text-white">
                Lock<span className="text-[var(--arena-primary)]">Arena</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--arena-text-muted)] mb-4">
              Your competitive edge in Deadlock. Vote, predict, dominate.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="p-2 rounded bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                <DiscordIcon size={18} />
              </a>
              <a href="#" className="p-2 rounded bg-[var(--arena-surface)] text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/rank" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                  Hero Rankings
                </Link>
              </li>
              <li>
                <Link href="/esports" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                  Esports Hub
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors flex items-center gap-2">
                  Predictions
                  <span className="coming-soon-badge">Soon</span>
                </Link>
              </li>
              <li>
                <Link href="/cases" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors flex items-center gap-2">
                  Cases
                  <span className="coming-soon-badge">Soon</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--arena-text-secondary)] hover:text-[var(--arena-primary)] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-sm text-[var(--arena-text-muted)] mb-3">
              Get notified when new features launch.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="email-input flex-1 px-3 py-2 rounded text-sm text-white placeholder-[var(--arena-text-muted)]"
              />
              <button type="submit" className="btn-primary px-3 py-2 rounded">
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--arena-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--arena-text-muted)]">
            © 2026 LockArena. A community project.
          </p>
          <p className="text-xs text-[var(--arena-text-muted)]">
            Not affiliated with Valve Corporation. Deadlock™ is a trademark of Valve.
          </p>
        </div>
      </div>
    </footer>
  );
}
