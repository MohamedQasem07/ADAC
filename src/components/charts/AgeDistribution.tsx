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
import {
  CHART_AXIS_LINE,
  CHART_GOLD,
  CHART_GOLD_SOFT,
  CHART_GRID,
  CHART_TEXT_SECONDARY,
  CHART_TOOLTIP_STYLE,
} from '@/lib/chart-style';
import { ChartFrame } from './ChartFrame';

const GOLD = CHART_GOLD;
const GOLD_GLOW = CHART_GOLD_SOFT;
const INK_SOFT = CHART_TEXT_SECONDARY;

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
      insight={{
        keyInsight:
          'A large share of cases involve older travelers (62% over 60), which raises clinical responsibility and documentation needs.',
        meaning:
          'Structured triage, clear escalation criteria, and same-day documented care pathways are essential for ADAC AG Holders.',
      }}
    >
      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 30, right: 20, left: 10, bottom: 70 }}>
            <CartesianGrid stroke={CHART_GRID} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: INK_SOFT, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: CHART_AXIS_LINE }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: INK_SOFT, fontSize: 13 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ fill: 'rgba(201,169,97,0.06)' }}
              contentStyle={CHART_TOOLTIP_STYLE}
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
