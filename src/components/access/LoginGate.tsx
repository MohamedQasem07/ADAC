'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { useAccessMode } from '@/context/AccessModeContext';

/**
 * Phase 2.4Z — Login / access gate.
 *
 * Two paths:
 *   1. Admin login (username + password). Credentials live in the
 *      static bundle — this is a UX gate, not real auth.
 *   2. "Continue as Guest" — sets accessMode='guest', which flows
 *      into AudienceModeProvider so the deck behaves identically to
 *      mobile audience mode (no prices, no presenter chrome).
 *
 * Returns null when accessMode is non-null so the deck behind it is
 * always live and never blanked.
 *
 * Rescue: append `?admin=1` to any URL to force the gate to re-show
 * even when a prior session value is stored.
 */

const ADMIN_USER = 'Admin';
const ADMIN_PASS = '0120299027Cm@';

function stripAdminQuery() {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('admin')) {
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.toString());
    }
  } catch {
    /* ignore */
  }
}

export function LoginGate() {
  const { accessMode, isHydrated, setAccessMode } = useAccessMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const userInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus username once the gate becomes visible.
  useEffect(() => {
    if (isHydrated && accessMode === null) {
      userInputRef.current?.focus();
    }
  }, [isHydrated, accessMode]);

  if (!isHydrated) return null;
  if (accessMode !== null) return null;

  const enterAdmin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAccessMode('admin');
      stripAdminQuery();
    } else {
      setError('Invalid username or password');
    }
  };

  const enterGuest = () => {
    setAccessMode('guest');
    stripAdminQuery();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    enterAdmin();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="HMC × ADAC — Sign in or continue as guest"
      className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center px-6 py-12"
      style={{
        background: 'var(--theme-page-bg-gradient)',
        backgroundAttachment: 'fixed',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-sm border border-white/15 bg-navy/70 px-8 py-10 shadow-card-hover backdrop-blur-md"
      >
        {/* corner chrome */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t opacity-70"
          style={{ borderColor: 'var(--theme-accent)' }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r opacity-70"
          style={{ borderColor: 'var(--theme-accent)' }}
        />

        <p
          className="text-center font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          HMC × ADAC
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-semibold leading-tight text-white">
          Partnership Proposal
        </h1>
        <p className="mt-2 text-center text-xs tracking-wide text-ice/70">
          Please sign in to continue
        </p>
        <div
          aria-hidden
          className="mx-auto mt-4 h-px w-16"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--theme-accent), transparent)',
          }}
        />

        <form onSubmit={onSubmit} className="mt-8 space-y-4" autoComplete="off">
          <div>
            <label
              htmlFor="access-username"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-ice/70"
            >
              Username
            </label>
            <input
              id="access-username"
              ref={userInputRef}
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              spellCheck={false}
              className="w-full rounded-sm border border-white/15 bg-navy-deep/60 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[var(--theme-accent)]"
            />
          </div>
          <div>
            <label
              htmlFor="access-password"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-ice/70"
            >
              Password
            </label>
            <input
              id="access-password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full rounded-sm border border-white/15 bg-navy-deep/60 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[var(--theme-accent)]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="font-mono text-[11px] tracking-wide"
              style={{ color: '#E74747' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] transition-all hover:opacity-90"
            style={{
              background: 'var(--theme-cta-bg)',
              color: 'var(--theme-cta-text)',
              boxShadow: '0 0 24px var(--theme-cta-glow)',
            }}
          >
            <Lock size={13} />
            Sign in
          </button>
        </form>

        <div aria-hidden className="my-6 flex items-center gap-3">
          <span className="block h-px flex-1 bg-white/10" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-ice/40">
            or
          </span>
          <span className="block h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={enterGuest}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/15 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-ice/85 transition-colors hover:border-white/35 hover:text-white"
        >
          Continue as Guest
          <ArrowRight size={13} />
        </button>

        <p className="mt-6 text-center text-[10px] tracking-wide text-ice/40">
          Guest view shows the full presentation without pricing
        </p>
      </motion.div>
    </div>
  );
}
