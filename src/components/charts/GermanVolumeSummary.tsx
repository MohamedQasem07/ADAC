'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { fallbackADACData } from '@/data/fallback';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChartFrame } from './ChartFrame';

/**
 * §3.9 — German Volume Summary.
 *
 * Three stat cards: 552 (2024) · 575 (2025) · 1,127 combined. Numbers
 * CountUp; subtle SVG line connects 2024 → 2025 → Total after all three
 * settle (Phase 5.5).
 */
export function GermanVolumeSummary() {
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
    >
      <div ref={ref} className="relative">
        {/* Connecting line that draws across the three cards after they settle. */}
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
            stroke="#C9A961"
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
          {cards.map((c, i) => (
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
              className={`relative rounded-sm border bg-navy/60 p-8 text-center backdrop-blur-sm ${
                i === 2 ? 'border-gold/40' : 'border-white/10'
              }`}
            >
              <p className="font-display text-5xl text-white md:text-6xl">
                {inView ? (
                  <CountUp end={c.value} duration={1.8} separator="," preserveValue useEasing />
                ) : (
                  c.value
                )}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-ink-soft/80">
                {c.label}
              </p>
              <p
                className={`mt-4 text-xs ${
                  i === 2 ? 'text-gold-soft' : 'text-ink-soft/70'
                }`}
              >
                {i === 2 ? 'Cumulative' : `${c.share} of HMC volume`}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ChartFrame>
  );
}
