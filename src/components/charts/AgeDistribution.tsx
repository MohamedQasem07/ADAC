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
const GOLD_GLOW = '#E0C988';
const INK_SOFT = '#7A8B9D';

/**
 * §3.6 — ADAC Age Distribution.
 *
 * 6 age buckets. 61+ Seniors dominate at 62.20%; that bar gets a gold
 * glow accent on settle (Phase 5.5).
 */
export function AgeDistribution() {
  const data = fallbackADACData.ageProfile.map((d) => ({
    name: d.group,
    count: d.count,
    pct: d.pct,
    isDominant: d.group.startsWith('61+'),
  }));

  return (
    <ChartFrame
      subId="3.6"
      eyebrow="§3.6"
      title="ADAC Age Distribution"
      populationLabel="n=156 ADAC admissions · 2024–2025"
      annotation="62% seniors · 82% over 40 · higher clinical complexity"
    >
      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 30, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: INK_SOFT, fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={70}
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
              formatter={(_v, _n, p) => [`${p.payload.count} (${p.payload.pct}%)`, 'Count']}
            />
            <Bar
              dataKey="count"
              radius={[2, 2, 0, 0]}
              animationDuration={900}
              animationEasing="ease-out"
            >
              {data.map((d) => (
                <Cell
                  key={d.name}
                  fill={d.isDominant ? GOLD_GLOW : GOLD}
                  fillOpacity={d.isDominant ? 1 : 0.65}
                  style={d.isDominant ? { filter: 'drop-shadow(0 0 12px rgba(201,169,97,0.45))' } : undefined}
                />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                fill="#fff"
                fontSize={12}
                fontFamily="var(--font-playfair), Georgia, serif"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
