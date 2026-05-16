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
import {
  CHART_AXIS_LINE,
  CHART_GRID,
  CHART_TEXT_SECONDARY,
  CHART_TOOLTIP_STYLE,
} from '@/lib/chart-style';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { useThemeChartColors } from '@/lib/theme-colors';
import { ChartFrame } from './ChartFrame';

const INK_SOFT = CHART_TEXT_SECONDARY;

/**
 * §3.7 — ADAC Length of Stay (histogram).
 *
 * Theme-aware (Phase 2.4E.2): primary bars + "83%" callout follow the
 * active theme (gold under Premium Navy, ADAC yellow under
 * Partnership).
 */
export function LengthOfStay() {
  const palette = useThemeChartColors();
  const PRIMARY = palette.primary;
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
      dataWindow="Clinical breakdown · 2024–2025"
      annotation="83% of admissions discharged within 48 hours"
      insight={{
        keyInsight:
          'Most admissions were resolved within a short timeframe — 83% discharged within 48 hours.',
        meaning:
          'Fast documentation, clear package coding, and same-day case summaries align directly with ADAC’s case-closure needs.',
      }}
    >
      <div ref={ref} style={{ width: '100%', height: 360 }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 60, right: 20, left: 10, bottom: 28 }}>
            <CartesianGrid stroke={CHART_GRID} vertical={false} />
            <XAxis
              dataKey="days"
              tick={{ fill: INK_SOFT, fontSize: 13 }}
              tickLine={false}
              axisLine={{ stroke: CHART_AXIS_LINE }}
              label={{
                value: 'Days admitted',
                position: 'insideBottom',
                offset: -12,
                fill: INK_SOFT,
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            />
            <YAxis
              tick={{ fill: INK_SOFT, fontSize: 13 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ fill: 'rgba(var(--theme-chart-primary-rgb),0.06)' }}
              contentStyle={CHART_TOOLTIP_STYLE}
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
                  fill={PRIMARY}
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
          <p
            className="font-display text-2xl"
            style={{ color: 'var(--theme-accent)' }}
          >
            83%
          </p>
          <p
            className="text-[11px] uppercase tracking-[0.3em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            within 48 h
          </p>
        </motion.div>
      </div>
    </ChartFrame>
  );
}
