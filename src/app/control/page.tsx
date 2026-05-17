'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { ControlPanel } from '@/components/control/ControlPanel';
import { audienceHref, audienceModeActive } from '@/context/AudienceModeContext';

/**
 * Standalone Presenter Control Mode route.
 *
 * URL: /control · Not linked from any audience-facing UI.
 * Same content as the Ctrl/Cmd+Shift+E overlay, but renders full-page
 * for cases where the overlay UX is too cramped (long editing sessions).
 *
 * Phase 2.4W — audience-mode safety. If the visitor is in mobile
 * audience mode (`?m=1` or sessionStorage flag), this page shows a
 * "Presenter-only area" message instead of the actual ControlPanel.
 * Desktop presenter access (no `?m=1`) is unchanged.
 *
 * Phase 2.4W.1 — flash-free hydration. The previous implementation
 * read `useAudienceMode()` from context, but context resolves audience
 * mode in a useEffect, so /control?m=1 briefly rendered the full
 * ControlPanel chrome before flipping to the "Presenter-only area"
 * message. Fixed by tracking a local `audience: boolean | null`
 * state: SSR and first client render show only the navy background
 * (no chrome leak), then a single useEffect calls `audienceModeActive()`
 * synchronously and renders the correct branch on the next paint.
 * Hydration-safe (server + first client paint produce the same empty
 * background div, so no React mismatch warning).
 */
export default function ControlPage() {
  const [audience, setAudience] = useState<boolean | null>(null);

  useEffect(() => {
    setAudience(audienceModeActive());
  }, []);

  // First render on both server and client — render only the bare
  // background. Prevents any flash of presenter chrome before the
  // audience check resolves on /control?m=1.
  if (audience === null) {
    return <div className="min-h-screen bg-navy-deep" aria-hidden />;
  }

  if (audience) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-deep px-6 py-12">
        <div
          className="relative w-full max-w-md rounded-sm border border-white/15 bg-navy/60 px-6 py-8 text-center backdrop-blur-md"
        >
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
            Presenter-only area
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-white">
            This page is not part of the mobile view
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ice/85">
            You&rsquo;re using the mobile-friendly meeting view. The
            presenter control panel isn&rsquo;t available here.
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
      <div className="border-b border-white/10 bg-navy-deep/80 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ice/70 transition-colors hover:text-gold"
        >
          <ArrowLeft size={14} />
          Back to presentation
        </Link>
      </div>
      <div className="mx-auto max-w-6xl">
        <ControlPanel />
      </div>
    </div>
  );
}
