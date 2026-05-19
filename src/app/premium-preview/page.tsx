'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Lock } from 'lucide-react';
import { accessModeActive } from '@/context/AccessModeContext';
import { audienceHref, audienceModeActive } from '@/context/AudienceModeContext';

/**
 * §Admin — Premium Deck Preview.
 *
 * Admin-only preview of the alternative cinematic visual treatment of
 * the same ADAC outpatient proposal content (Claude Design standalone
 * export, served from /premium-deck/index.html).
 *
 * Access gate mirrors the /control page (Phase 2.4W.1 flash-free
 * pattern): a single useEffect resolves the access mode after
 * hydration, before that the page renders only the bare background so
 * no presenter or audience chrome leaks for a frame.
 *
 * - Admin: shows the iframe + open-full-screen button.
 * - Guest / unauthenticated: shows "Presenter-only preview." message.
 * - Mobile audience (?m=1 or /m flag): same block (this is not part of
 *   the audience experience).
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const DECK_URL = `${BASE_PATH}/premium-deck/index.html`;

export default function PremiumPreviewPage() {
  // `null` = pre-hydration sentinel, `true` = block, `false` = show preview.
  const [blocked, setBlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const isAdmin = accessModeActive() === 'admin';
    setBlocked(audienceModeActive() || !isAdmin);
  }, []);

  if (blocked === null) {
    return <div className="min-h-screen bg-navy-deep" aria-hidden />;
  }

  if (blocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-deep px-6 py-12">
        <div className="relative w-full max-w-md rounded-sm border border-white/15 bg-navy/60 px-6 py-8 text-center backdrop-blur-md">
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

          <span
            className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-sm border"
            style={{
              borderColor:
                'color-mix(in srgb, var(--theme-accent) 50%, transparent)',
              background:
                'color-mix(in srgb, var(--theme-accent) 12%, transparent)',
              color: 'var(--theme-accent)',
            }}
          >
            <Lock size={18} />
          </span>

          <p
            className="mt-5 font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            Presenter-only preview
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-white">
            This page is admin-only
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ice/85">
            The Premium Deck Preview is an internal alternative visual
            mockup of the ADAC presentation. The current ADAC meeting
            deck remains the official working version.
          </p>

          <Link
            href={audienceHref('/')}
            className="mt-6 inline-flex items-center gap-2 rounded-sm border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-colors"
            style={{
              borderColor:
                'color-mix(in srgb, var(--theme-accent) 60%, transparent)',
              background:
                'color-mix(in srgb, var(--theme-accent) 15%, transparent)',
            }}
          >
            <ArrowLeft size={13} />
            Back to presentation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header bar */}
      <div className="border-b border-white/10 bg-navy-deep/85 px-4 py-3 backdrop-blur-sm md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ice/70 transition-colors hover:text-gold"
            >
              <ArrowLeft size={14} />
              Back to presentation
            </Link>
          </div>
          <a
            href={DECK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] transition-all hover:opacity-90"
            style={{
              background: 'var(--theme-cta-bg)',
              color: 'var(--theme-cta-text)',
              boxShadow: '0 0 20px var(--theme-cta-glow)',
            }}
          >
            Open premium deck full screen
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Title block */}
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-6 md:px-6 md:pb-6 md:pt-10">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          Admin-only · Alternative visual direction
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
          Premium Deck Preview
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ice/80 md:text-base">
          The same ADAC outpatient proposal content in a more cinematic
          executive visual direction.
        </p>
        <p className="mt-3 max-w-3xl text-xs italic text-ink-soft/75 md:text-sm">
          This is an alternative visual preview of the ADAC presentation.
          The current ADAC meeting deck remains the official working
          version.
        </p>
      </div>

      {/* Iframe — standalone HTML loads its own bundle and runs inside */}
      <div className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="relative overflow-hidden rounded-sm border border-white/10 bg-[#07070B]">
          <iframe
            src={DECK_URL}
            title="Premium Deck Preview"
            className="block h-[78vh] w-full"
            style={{ border: 0 }}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
