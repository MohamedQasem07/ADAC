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
const INK_SOFT = '#7A8B9D';

/**
 * §3.7 — ADAC Length of Stay (histogram).
 *
 * Days 1–15 with counts. 77 (1d) + 53 (2d) = 130 cases = 83% short stay.
 * Spec animation: bars grow up sequentially; curly brace SVG annotation
 * draws above the 1-day + 2-day bars (Phase 5.5).
 */
export function LengthOfStay() {
  const data = fallbackADACData.lengthOfStay.map((d) => ({
    days: d.days,
    count: d.count,
    pct: d.pct,
    isShort: d.days <= 2,
  }));

  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.7"
      eyebrow="§3.7"
      title="ADAC Length of Stay"
      populationLabel="n=156 ADAC admissions · 2024–2025"
      annotation="83% of admissions discharged within 48 hours"
    >
      <div ref={ref} style={{ width: '100%', height: 360 }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 60, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="days"
              tick={{ fill: INK_SOFT, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              label={{
                value: 'Days admitted',
                position: 'insideBottom',
                offset: -8,
                fill: INK_SOFT,
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            />
            <YAxis
              tick={{ fill: INK_SOFT, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={32}
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
              formatter={(_v, _n, p) => [`${p.payload.count} cases (${p.payload.pct.toFixed(2)}%)`, 'Admissions']}
            />
            <Bar
              dataKey="count"
              radius={[2, 2, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((d) => (
                <Cell
                  key={d.days}
                  fill={GOLD}
                  fillOpacity={d.isShort ? 1 : 0.55}
                />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                fill="#fff"
                fontSize={11}
                fontFamily="var(--font-playfair), Georgia, serif"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* "83%" callout above the 1d + 2d bars */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={{ delay: 1.2, duration: 0.7, ease: ease.premium }}
          className="pointer-events-none absolute left-[6%] top-0 text-center"
          style={{ width: '12%' }}
        >
          <p className="font-display text-2xl text-gold">83%</p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold/80">within 48 h</p>
        </motion.div>
      </div>
    </ChartFrame>
  );
}
