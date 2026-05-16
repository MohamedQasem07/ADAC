'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { fallbackADACData } from '@/data/fallback';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChartFrame } from './ChartFrame';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = ['2024', '2025'];

/**
 * §3.2 — German Patient Monthly Volume (heatmap).
 *
 * Per the corrections doc, this chart is GERMAN patients, not ADAC.
 * 12 × 2 grid with gold-intensity ramp. Phase 5.5 will polish the
 * wave-reveal motion (cells animate L→R / T→B with scale 0.5 → 1).
 */
export function GermanMonthlyHeatmap() {
  const data = fallbackADACData.germanMonthly;

  // Find max value for color scaling.
  const max = useMemo(() => {
    let m = 0;
    for (const month of MONTHS) {
      for (const year of YEARS) {
        const v = (data as Record<string, Record<string, number | null>>)[month][year];
        if (v != null && v > m) m = v;
      }
    }
    return m;
  }, [data]);

  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.2"
      eyebrow="§3.2"
      title="German Patient Monthly Volume"
      populationLabel="n=1,127 German patients · 2024–2025 monthly"
      annotation="Peak season concentration · August through December"
      insight={{
        keyInsight:
          'German traveler volume is seasonal, with clear concentration in high-demand months across August through December.',
        meaning:
          'A package framework helps ADAC and HMC manage predictable seasonal peaks with fewer approval delays and steadier case throughput.',
      }}
    >
      <div ref={ref} className="overflow-x-auto">
        <table className="mx-auto w-full">
          <thead>
            <tr>
              <th className="w-12" />
              {MONTHS.map((m) => (
                <th
                  key={m}
                  className="px-1 pb-2 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-ice/85"
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {YEARS.map((year, yi) => (
              <tr key={year}>
                <th className="pr-3 text-right text-[12px] font-medium uppercase tracking-[0.2em] text-ice/85">
                  {year}
                </th>
                {MONTHS.map((month, mi) => {
                  const value = (data as Record<string, Record<string, number | null>>)[month][year];
                  const intensity = value != null ? value / max : 0;
                  const delay = inView ? (yi * 12 + mi) * 0.035 : 0;
                  return (
                    <motion.td
                      key={`${year}-${month}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                      transition={{
                        delay,
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative p-0.5"
                    >
                      <div
                        className="group relative flex aspect-square min-w-[44px] items-center justify-center rounded-sm border border-white/10 text-[13px] font-semibold text-white transition-shadow duration-300 hover:shadow-gold-glow"
                        style={{
                          background: `rgba(201, 169, 97, ${0.08 + intensity * 0.75})`,
                        }}
                      >
                        <span style={{ opacity: value != null ? 1 : 0.2 }}>
                          {value ?? '—'}
                        </span>
                      </div>
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}
