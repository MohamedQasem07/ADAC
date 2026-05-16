'use client';

import { motion } from 'framer-motion';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

interface SectionDividerProps {
  eyebrow: string;
  /** Optional one-line clarifier under the eyebrow. */
  caption?: string;
}

/**
 * Thin themed rule + uppercase eyebrow used in the Executive Data Room
 * to make the structural break between
 *   - "4-Year Operational Context · 2023 → 2026 YTD" and
 *   - "Primary Clinical & Financial Analysis · 2024–2025"
 * visually obvious to ADAC executives (Phase 2.4I Part F).
 *
 * No background, no card — just a rule + label that sits between
 * existing dashboard blocks without disrupting their layout.
 */
export function SectionDivider({ eyebrow, caption }: SectionDividerProps) {
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.6, ease: ease.premium }}
      className="mx-auto mb-2 mt-12 flex w-full max-w-7xl items-baseline gap-4 px-4 sm:px-6"
    >
      <p
        className="shrink-0 font-mono text-[10px] uppercase tracking-[0.4em]"
        style={{ color: 'var(--theme-accent)' }}
      >
        {eyebrow}
      </p>
      <span
        aria-hidden
        className="h-px flex-1"
        style={{
          background:
            'linear-gradient(to right, var(--theme-accent), color-mix(in srgb, var(--theme-accent) 8%, transparent))',
        }}
      />
      {caption && (
        <p className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-ice/65">{caption}</p>
      )}
    </motion.div>
  );
}
