'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import { fallbackADACData } from '@/data/fallback';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChartFrame } from './ChartFrame';

const GOLD = '#C9A961';
const GOLD_SOFT = '#E0C988';
const INK_SOFT = '#7A8B9D';

/**
 * §3.1 — Year-by-Year ADAC Volume.
 *
 * Bars: 2023 = 57 · 2024 = 103 · 2025 = 97 · 2026 = 11 (lighter + "YTD" label).
 * Phase 5.5 polish: per-bar stagger via animationBegin, +70% growth arrow
 * draws on top of the chart from 2023 → 2025 bar with delay.
 */
export function YearlyVolumeChart() {
  const data = fallbackADACData.yearlyADAC.map((row) => ({
    year: String(row.year),
    total: row.total,
    isYTD: row.note?.includes('YTD'),
  }));

  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.1"
      eyebrow="§3.1"
      title="Year-by-Year ADAC Volume"
      populationLabel="n=268 cases · 2023–2026"
    >
      <div ref={ref} className="relative" style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 60, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: INK_SOFT, fontSize: 13, letterSpacing: '0.1em' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            />
            <YAxis
              tick={{ fill: INK_SOFT, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ fill: 'rgba(201,169,97,0.06)' }}
              contentStyle={{
                background: 'rgba(13,27,42,0.92)',
                border: '1px solid rgba(201,169,97,0.25)',
                borderRadius: 2,
                color: '#fff',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="total"
              radius={[2, 2, 0, 0]}
              animationDuration={900}
              animationEasing="ease-out"
              isAnimationActive={inView}
            >
              {data.map((d, i) => (
                <Cell
                  key={d.year}
                  fill={d.isYTD ? GOLD_SOFT : GOLD}
                  fillOpacity={d.isYTD ? 0.5 : 0.92}
                  stroke={d.isYTD ? GOLD : 'transparent'}
                  strokeDasharray={d.isYTD ? '4 3' : undefined}
                  style={{ transitionDelay: `${i * 200}ms` }}
                />
              ))}
              <LabelList
                dataKey="total"
                position="top"
                fill="#fff"
                fontSize={14}
                fontFamily="var(--font-playfair), Georgia, serif"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* +70% growth arrow — draws from above 2023 bar to above 2025 bar
            after the data animation lands (delay ~1.4s). The arrow is an
            SVG path with stroke-dasharray reveal. */}
        <GrowthArrow inView={inView} />
      </div>

      <p className="mt-6 text-center text-sm italic text-gold-soft md:text-base">
        +70% growth 2023 → 2025 · 2026 shown YTD (5 months)
      </p>
    </ChartFrame>
  );
}

/** Animated "+70% growth" callout overlay drawn above the chart bars. */
function GrowthArrow({ inView }: { inView: boolean }) {
  // 4 bars in equal segments: midpoints at 12.5%, 37.5%, 62.5%, 87.5%.
  // 2023 = first bar (12.5%), 2025 = third bar (62.5%).
  return (
    <motion.svg
      viewBox="0 0 100 14"
      preserveAspectRatio="none"
      className="pointer-events-none absolute left-0 right-0 top-0"
      style={{ width: '100%', height: 48 }}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 1.4, duration: 0.6, ease: ease.premium }}
    >
      <defs>
        <marker
          id="growth-arrow-head"
          viewBox="0 0 6 6"
          refX="5"
          refY="3"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={GOLD} />
        </marker>
      </defs>
      <motion.path
        d="M 12.5 10 Q 37.5 2 62.5 10"
        fill="none"
        stroke={GOLD}
        strokeWidth="0.4"
        strokeLinecap="round"
        markerEnd="url(#growth-arrow-head)"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ delay: 1.4, duration: 1.2, ease: ease.premium }}
      />
      <motion.text
        x="37.5"
        y="0.5"
        textAnchor="middle"
        fill={GOLD_SOFT}
        fontSize="3.2"
        fontStyle="italic"
        initial={{ opacity: 0, y: -4 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ delay: 2.0, duration: 0.6, ease: ease.premium }}
      >
        +70%
      </motion.text>
    </motion.svg>
  );
}
