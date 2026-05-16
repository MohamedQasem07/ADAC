'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { fallbackADACData } from '@/data/fallback';
import { CHART_TOOLTIP_STYLE } from '@/lib/chart-style';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChartFrame } from './ChartFrame';

const GOLD = '#C9A961';
const TEAL = '#0096B4';

/**
 * §3.4 — Cash vs Insurance Split.
 *
 * Combined: 22% cash / 78% insurance (44 / 156 of 200). Side-by-side
 * mini donuts for 2024 (30/70) and 2025 (13/87) progression.
 * Spec animation: arc draws 0 → final, center text CountUp, side donuts
 *                 animate in sequence (Phase 5.5).
 */
export function FinancialDonuts() {
  const fm = fallbackADACData.financialMix;
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.4"
      eyebrow="§3.4"
      title="Cash vs Insurance Split"
      populationLabel="n=200 ADAC cases · 2024–2025"
      annotation="Insurance share grew from 70% → 87% in 2025"
      insight={{
        keyInsight:
          'The insurance share of ADAC cases at HMC rose sharply in 2025 — from 70% to 87% of cases.',
        meaning:
          'A clearer ADAC–HMC framework reduces uncertainty for travelers and removes the cash-payment friction at the moment of care.',
      }}
    >
      <div ref={ref} className="flex flex-col items-center gap-12 md:flex-row md:justify-around">
        {/* Big combined donut */}
        <div className="relative" style={{ width: 280, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Insurance', value: fm.combined.insurance, fill: GOLD },
                  { name: 'Cash', value: fm.combined.cash, fill: TEAL },
                ]}
                dataKey="value"
                innerRadius={88}
                outerRadius={130}
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
                stroke="none"
                animationDuration={1100}
                animationEasing="ease-out"
              >
                <Cell />
                <Cell />
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.5, duration: 0.6, ease: ease.premium }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="font-display text-5xl text-white">
              {inView ? <CountUp end={fm.combined.total} duration={1.5} preserveValue useEasing /> : 0}
            </p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.3em] text-ice/80">cases</p>
          </motion.div>
        </div>

        {/* Side year breakdown */}
        <div className="flex flex-1 flex-col gap-4">
          {(['2024', '2025'] as const).map((year, idx) => {
            const year_data = fm[year];
            return (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
                transition={{ delay: 0.7 + idx * 0.15, duration: 0.6, ease: ease.premium }}
                className="rounded-sm border border-white/10 bg-navy/30 p-5"
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-gold">{year}</p>
                <p className="mt-1 font-display text-2xl text-white">
                  {year_data.total} <span className="text-sm text-ice/80">cases</span>
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-sm bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${year_data.insurancePct}%` } : { width: 0 }}
                    transition={{ delay: 0.9 + idx * 0.15, duration: 0.9, ease: ease.premium }}
                    className="h-full"
                    style={{ background: GOLD }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[12px] uppercase tracking-[0.2em] text-ice/85">
                  <span>Insurance {year_data.insurancePct}%</span>
                  <span>Cash {year_data.cashPct}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ChartFrame>
  );
}
