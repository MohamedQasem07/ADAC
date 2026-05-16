'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { fallbackADACData } from '@/data/fallback';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { useThemeChartColors } from '@/lib/theme-colors';
import { ChartFrame } from './ChartFrame';

/**
 * §3.9 — German Volume Summary.
 *
 * Three stat cards. Theme-aware (Phase 2.4E.2) — the cumulative card
 * border + the dashed connecting line use --theme-accent.
 */
export function GermanVolumeSummary() {
  const palette = useThemeChartColors();
  const PRIMARY = palette.primary;
  const gv = fallbackADACData.germanVolume;
  const { ref, inView } = useScrollReveal();

  const cards = [
    { value: gv.by_year['2024'], label: 'German patients · 2024', share: gv.marketShareOfHMC['2024'] },
    { value: gv.by_year['2025'], label: 'German patients · 2025', share: gv.marketShareOfHMC['2025'] },
    { value: gv.total,            label: 'Combined 2024 + 2025',  share: 'Total' },
  ];

  return (
    <ChartFrame
      subId="3.9"
      eyebrow="§3.9"
      title="German Patient Volume"
      populationLabel="n=1,127 German patients · 2024–2025"
      annotation="23% → 27% of HMC volume in 2 years"
      insight={{
        keyInsight:
          'German travelers remain a major patient group across the Red Sea operation — 1,127 cases over 2024 and 2025, growing as a share of HMC volume.',
        meaning:
          'HMC’s German-case experience supports multilingual service, documentation standards, and predictable cooperation with German insurance partners.',
      }}
    >
      <div ref={ref} className="relative">
        {/* Connecting line that draws across the three cards. */}
        <motion.svg
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 md:block"
          style={{ width: '100%', height: 16 }}
          aria-hidden
        >
          <motion.line
            x1="16"
            x2="84"
            y1="2"
            y2="2"
            stroke={PRIMARY}
            strokeWidth="0.2"
            strokeDasharray="0.6 1.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
            transition={{ delay: 1.2, duration: 1.2, ease: ease.premium }}
          />
        </motion.svg>

        <motion.div
          variants={staggerTight}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {cards.map((c, i) => {
            const isCumulative = i === 2;
            return (
              <motion.div
                key={c.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: ease.premium },
                  },
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3, ease: ease.premium }}
                className="relative rounded-sm border bg-navy/60 p-8 text-center backdrop-blur-sm"
                style={{
                  borderColor: isCumulative
                    ? 'color-mix(in srgb, var(--theme-accent) 40%, transparent)'
                    : 'rgba(255,255,255,0.1)',
                }}
              >
                <p className="font-display text-5xl text-white md:text-6xl">
                  {inView ? (
                    <CountUp end={c.value} duration={1.8} separator="," preserveValue useEasing />
                  ) : (
                    c.value
                  )}
                </p>
                <p className="mt-3 text-[12px] uppercase tracking-[0.3em] text-ice/85">
                  {c.label}
                </p>
                <p
                  className="mt-4 text-xs"
                  style={{
                    color: isCumulative ? 'var(--theme-accent-soft)' : 'rgba(244,248,252,0.85)',
                  }}
                >
                  {isCumulative ? 'Cumulative' : `${c.share} of HMC volume`}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </ChartFrame>
  );
}
