'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { fallbackADACData } from '@/data/fallback';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

/**
 * 4-Year Partnership Context card — Phase 2.4H.
 *
 * Sits in the Executive Data Room alongside the primary 2024–2025
 * dashboard cards. Communicates that 2024–2025 remains the strongest
 * complete analysis window, while showing the wider 4-year shape:
 *
 *   - 268 total ADAC cases (2023 + 2024 + 2025 + 2026 YTD)
 *   - per-year bar strip with 2026 YTD marked distinctly
 *   - one-line clarifications about which window is which
 *
 * Reads from `historicalContext2023_2026` in adac-data.json (extracted
 * 2026-05-17). No invented numbers.
 */
export function FourYearContextCard() {
  const ctx = fallbackADACData.historicalContext2023_2026;
  const yearly = ctx?.yearlyVolume?.data ?? [];
  const summary = ctx?.fourYearSummary;
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });

  const maxCount = Math.max(1, ...yearly.map((y) => y.count));

  return (
    <div ref={ref} className="rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            4-Year Partnership Context
          </p>
          <h3 className="mt-2 font-display text-2xl text-white md:text-3xl">
            Four years of continuous ADAC casework
          </h3>
        </div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-ice/85">
          Jan 2023 – May 2026
        </p>
      </div>

      {/* Hero "268" + supporting line */}
      <div className="mt-6 flex flex-wrap items-baseline gap-6">
        <p
          className="font-display text-6xl font-semibold leading-none md:text-7xl"
          style={{ color: 'var(--theme-accent)' }}
        >
          {inView ? <CountUp end={summary?.totalADAC ?? 268} duration={1.4} preserveValue useEasing /> : '0'}
        </p>
        <p className="max-w-md text-sm text-ice/85 md:text-base">
          Total ADAC cases over four years. <span className="text-white">
            The primary clinical analysis window remains 2024–2025 (n=200, of which 156 admissions
            have detailed breakdowns).
          </span> 2023 and 2026 YTD add real volume + seasonality context without replacing the
          primary dataset.
        </p>
      </div>

      {/* Per-year bar strip */}
      <motion.div
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {yearly.map((y) => {
          const pct = (y.count / maxCount) * 100;
          return (
            <motion.div
              key={y.year}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.premium } },
              }}
              className="rounded-sm border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-baseline justify-between">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  {y.year}
                </p>
                {y.ytd && (
                  <span
                    className="inline-block rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em]"
                    style={{
                      borderColor: 'var(--theme-badge-border)',
                      color: 'var(--theme-badge-text)',
                    }}
                  >
                    YTD
                  </span>
                )}
              </div>
              <p className="mt-2 font-display text-3xl text-white">
                {inView ? <CountUp end={y.count} duration={1.2} preserveValue useEasing /> : 0}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-sm bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${pct}%` } : { width: 0 }}
                  transition={{ delay: 0.4, duration: 0.9, ease: ease.premium }}
                  className="h-full"
                  style={{
                    background: y.ytd
                      ? 'repeating-linear-gradient(45deg, var(--theme-accent-soft), var(--theme-accent-soft) 4px, transparent 4px, transparent 7px)'
                      : 'var(--theme-accent)',
                  }}
                />
              </div>
              {y.ytd && (
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ice/70">
                  {y.monthsCovered ?? 'Jan–May'} · 5 months
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Honest data-window note */}
      <div
        className="mt-6 rounded-sm border p-4 text-xs leading-relaxed md:text-sm"
        style={{
          background: 'var(--theme-badge-bg)',
          borderColor: 'var(--theme-badge-border)',
          color: 'var(--theme-badge-text)',
        }}
      >
        <p>
          <span className="font-semibold uppercase tracking-[0.18em] text-white">Data windows:</span>{' '}
          Yearly volumes 2023–2026 are real. <span className="text-white">Clinical breakdowns
          (diagnosis, admission, age, length of stay) stay 2024–2025 (n=156)</span> — the 2023 source records
          do not include diagnosis, DOB or discharge-date columns, and 2026 YTD has only 11 cases. 2024–2025
          remains the strongest complete analysis window.
        </p>
      </div>
    </div>
  );
}
