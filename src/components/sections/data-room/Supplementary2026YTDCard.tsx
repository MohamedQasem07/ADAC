'use client';

import { motion } from 'framer-motion';
import { fallbackADACData } from '@/data/fallback';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

interface CardItem {
  label: string;
  value: number;
}

interface Supplementary2026YTDCardProps {
  title: string;
  /** Two-line context blurb under the title (kept short). */
  subtitle?: string;
  items: CardItem[];
  /**
   * Default footnote is always rendered to make the data-window rule
   * obvious to ADAC executives. Override only if you need to extend it.
   */
  footnote?: string;
}

const DEFAULT_FOOTNOTE =
  '2026 YTD context only — not merged into the 2024–2025 headline analysis.';

/**
 * Phase 2.4I — small sibling card that sits beside a primary 2024–2025
 * chart (Cash vs Insurance donut · Age Distribution bars) on the
 * Executive Data Room and reports the parallel 2026 YTD breakdown.
 *
 * Visual style: themed border + soft glass surface + theme-accent label
 * column. Never tries to look like the primary chart; the card explicitly
 * announces itself as supplementary YTD context.
 */
export function Supplementary2026YTDCard({
  title,
  subtitle,
  items,
  footnote = DEFAULT_FOOTNOTE,
}: Supplementary2026YTDCardProps) {
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });
  const total = items.reduce((a, i) => a + i.value, 0);

  return (
    <motion.aside
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: ease.premium }}
      className="flex h-full flex-col rounded-sm border p-5 backdrop-blur-sm"
      style={{
        background: 'var(--theme-badge-bg)',
        borderColor: 'var(--theme-badge-border)',
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: 'var(--theme-badge-text)' }}
        >
          2026 YTD context
        </p>
        <span
          className="inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em]"
          style={{
            borderColor: 'var(--theme-badge-border)',
            color: 'var(--theme-badge-text)',
          }}
        >
          n={total}
        </span>
      </div>
      <h4 className="mt-2 font-display text-lg leading-tight text-white">{title}</h4>
      {subtitle && <p className="mt-1 text-xs text-ice/85">{subtitle}</p>}

      <ul className="mt-4 space-y-1.5 text-sm">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex items-baseline justify-between border-b border-white/5 pb-1.5 last:border-b-0"
          >
            <span className="text-ice/85">{it.label}</span>
            <span className="font-display text-lg text-white">{it.value}</span>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-4 text-[10px] leading-relaxed text-ice/65">{footnote}</p>
    </motion.aside>
  );
}

/** Pre-wired Cash vs Insurance · 2026 YTD card. */
export function Cash2026YTDCard() {
  const ytd = fallbackADACData.historicalContext2023_2026?.adac2026YTDClinical;
  const insurance = ytd?.financialMix?.insurance ?? 9;
  const cash = ytd?.financialMix?.cash ?? 2;

  return (
    <Supplementary2026YTDCard
      title="Cash vs Insurance · 2026 YTD"
      subtitle="GOPED 9 · No GOP / Not sent 2"
      items={[
        { label: 'Insurance (GOPED)', value: insurance },
        { label: 'Cash (No GOP / Not sent)', value: cash },
      ]}
    />
  );
}

/** Pre-wired Age Distribution · 2026 YTD card. */
export function Age2026YTDCard() {
  const ages =
    fallbackADACData.historicalContext2023_2026?.adac2026YTDClinical?.ages ?? {
      '0-4': 0,
      '5-12': 0,
      '13-17': 0,
      '18-40': 0,
      '41-60': 0,
      '61+': 0,
    };

  return (
    <Supplementary2026YTDCard
      title="Age Distribution · 2026 YTD"
      subtitle="From the 11-case YTD set"
      items={[
        { label: '0–4', value: ages['0-4'] ?? 0 },
        { label: '5–12', value: ages['5-12'] ?? 0 },
        { label: '13–17', value: ages['13-17'] ?? 0 },
        { label: '18–40', value: ages['18-40'] ?? 0 },
        { label: '41–60', value: ages['41-60'] ?? 0 },
        { label: '61+', value: ages['61+'] ?? 0 },
      ]}
    />
  );
}
