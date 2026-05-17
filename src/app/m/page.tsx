'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

/**
 * Phase 2.4W — Mobile Audience Mode landing route.
 *
 * URL: `/m` · QR-code entry for ADAC attendees during the meeting.
 *
 * On mount:
 *   1. Set sessionStorage flag so audience mode survives refreshes
 *      within this tab even if `?m=1` is dropped from a Link.
 *   2. Show a brief premium welcome card (~750 ms) so the user knows
 *      they landed in the right place.
 *   3. Redirect to `/?m=1` (the deck home) so the standard route tree
 *      can take over without route duplication.
 *
 * Static-export safe: this is a normal `page.tsx` under `src/app/m/`,
 * Next.js auto-exports it as `/ADAC/m/index.html` under GitHub Pages.
 */
export default function MobileLandingPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      window.sessionStorage.setItem('hmc-audience-mode', '1');
    } catch {
      // ignore — fall through to URL-based detection
    }
    const t = setTimeout(() => {
      router.replace('/?m=1');
    }, 750);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            borderColor: 'color-mix(in srgb, var(--theme-accent) 50%, transparent)',
            background: 'color-mix(in srgb, var(--theme-accent) 12%, transparent)',
            color: 'var(--theme-accent)',
          }}
        >
          <Smartphone size={20} />
        </span>

        <p
          className="mt-5 font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          HMC × ADAC
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-white">
          Follow along on your phone
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ice/85">
          Loading the mobile-friendly meeting view…
        </p>

        <div
          aria-hidden
          className="mx-auto mt-6 h-px w-16"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--theme-accent), transparent)',
          }}
        />
      </motion.div>
    </main>
  );
}
