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
import { fallbackADACData } from '@/data/fallback';
import { ChartFrame } from './ChartFrame';

const GOLD = '#C9A961';
const GOLD_SOFT = '#E0C988';
const INK_SOFT = '#7A8B9D';

/**
 * §3.1 — Year-by-Year ADAC Volume.
 *
 * Bars: 2023 = 57 · 2024 = 103 · 2025 = 97 · 2026 = 11 (lighter + "YTD" label).
 * Spec animation: bars grow 0 → final, 200 ms stagger, value CountUp,
 *                 +70% growth arrow draws last (Phase 5.5).
 */
export function YearlyVolumeChart() {
  const data = fallbackADACData.yearlyADAC.map((row) => ({
    year: String(row.year),
    total: row.total,
    isYTD: row.note?.includes('YTD'),
  }));

  return (
    <ChartFrame
      subId="3.1"
      eyebrow="§3.1"
      title="Year-by-Year ADAC Volume"
      populationLabel="n=268 cases · 2023–2026"
      annotation="+70% growth 2023 → 2025 · 2026 reported YTD (5 months)"
    >
      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 30, right: 20, left: 0, bottom: 0 }}>
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
            >
              {data.map((d, i) => (
                <Cell
                  key={d.year}
                  fill={d.isYTD ? GOLD_SOFT : GOLD}
                  fillOpacity={d.isYTD ? 0.5 : 0.92}
                  stroke={d.isYTD ? GOLD : 'transparent'}
                  strokeDasharray={d.isYTD ? '4 3' : undefined}
                  style={{ transitionDelay: `${i * 100}ms` }}
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
      </div>
    </ChartFrame>
  );
}
