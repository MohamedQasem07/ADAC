'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { InsightPanel, type ChartInsight } from './InsightPanel';

interface ChartFrameProps {
  /** Section id (e.g. "3.1"). */
  subId: string;
  /** Chart title in large display type. */
  title: string;
  /** Mandatory population subtitle: "n=156 admissions · 2024–2025". */
  populationLabel: string;
  /** Optional annotation pulled below the chart. */
  annotation?: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** Optional two-card insight panel under the chart. */
  insight?: ChartInsight;
  children: ReactNode;
  /** Tighter top padding for non-hero charts. */
  compact?: boolean;
}

/**
 * Shared chart container. Provides the universal entry animation:
 *   - Container fades up on scroll-into-view (0.6 s)
 *   - Title fades in first
 *   - Subtitle (n=X · window) fades in 150 ms later
 *   - Annotation fades in
 *   - InsightPanel (when supplied) fades in last
 */
export function ChartFrame({
  subId,
  title,
  populationLabel,
  annotation,
  eyebrow,
  insight,
  children,
  compact = false,
}: ChartFrameProps) {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`mx-auto w-full max-w-6xl px-8 ${compact ? 'py-16' : 'py-24'}`}
    >
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: ease.premium }}
        className="mb-6"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          {eyebrow ?? `§${subId}`}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
          {title}
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: ease.premium }}
          className="mt-2 text-xs uppercase tracking-[0.25em] text-ice/85"
        >
          {populationLabel}
        </motion.p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ delay: 0.25, duration: 0.8, ease: ease.premium }}
        className="relative rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm md:p-10"
      >
        {children}
      </motion.div>

      {annotation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: ease.premium }}
          className="mt-6 text-center text-sm italic text-gold-soft md:text-base"
        >
          {annotation}
        </motion.p>
      )}

      {insight && <InsightPanel insight={insight} inView={inView} />}
    </section>
  );
}
