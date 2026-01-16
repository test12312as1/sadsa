'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';

export default function EmailCapture({ 
  title = "Get Early Access",
  description = "Be the first to know when new features launch.",
  buttonText = "Notify Me",
  variant = "default" // "default" | "inline" | "hero"
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    
    // Simulate API call - replace with actual endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, always succeed
    setStatus('success');
    setEmail('');
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
            placeholder="your@email.com"
                className="email-input w-full px-4 py-2.5 rounded text-sm text-white placeholder-[var(--arena-text-muted)]"
            disabled={status === 'loading' || status === 'success'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`px-5 py-2.5 rounded font-medium text-sm transition-all flex items-center gap-2 ${
            status === 'success'
              ? 'bg-[var(--arena-success)] text-white'
              : 'btn-primary'
          }`}
        >
          {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {status === 'success' && <Check size={16} />}
          {status === 'idle' && buttonText}
          {status === 'loading' && 'Joining...'}
          {status === 'success' && 'Done!'}
          {status === 'error' && 'Try Again'}
        </button>
      </form>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--arena-text-muted)]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="Enter your email"
                className="email-input w-full pl-12 pr-4 py-3.5 rounded text-white placeholder-[var(--arena-text-muted)]"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`px-6 py-3.5 rounded font-semibold transition-all flex items-center gap-2 ${
                status === 'success'
                  ? 'bg-[var(--arena-success)] text-white'
                  : 'btn-primary'
              }`}
            >
              {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
              {status === 'success' && <Check size={18} />}
              {status === 'idle' && buttonText}
              {status === 'loading' && 'Joining...'}
              {status === 'success' && 'Done!'}
              {status === 'error' && 'Retry'}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-[var(--arena-danger)] text-sm mt-2">{errorMessage}</p>
          )}
          {status === 'success' && (
            <p className="text-[var(--arena-success)] text-sm mt-2">You&apos;re on the list! We&apos;ll notify you when we launch.</p>
          )}
        </form>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="arena-card p-6 text-center">
      <div className="w-12 h-12 rounded bg-[var(--arena-primary)]/20 flex items-center justify-center mx-auto mb-4">
        <Mail className="text-[var(--arena-primary)]" size={24} />
      </div>
      <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-[var(--arena-text-muted)] mb-4">{description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          placeholder="your@email.com"
          className="email-input w-full px-4 py-3 rounded text-white placeholder-[var(--arena-text-muted)] text-center"
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full py-3 rounded font-medium transition-all flex items-center justify-center gap-2 ${
            status === 'success'
              ? 'bg-[var(--arena-success)] text-white'
              : 'btn-primary'
          }`}
        >
          {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
          {status === 'success' && <Check size={18} />}
          {status === 'idle' && buttonText}
          {status === 'loading' && 'Joining...'}
          {status === 'success' && 'You\'re In!'}
          {status === 'error' && 'Try Again'}
        </button>
        {status === 'error' && (
          <p className="text-[var(--arena-danger)] text-sm">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
