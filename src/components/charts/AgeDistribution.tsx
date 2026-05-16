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
  CHART_GRID,
  CHART_TEXT_SECONDARY,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from '@/lib/chart-style';
import { useThemeChartColors } from '@/lib/theme-colors';
import { ChartFrame } from './ChartFrame';

const INK_SOFT = CHART_TEXT_SECONDARY;

/**
 * §3.6 — ADAC Age Distribution.
 *
 * 6 age buckets. 61+ Seniors dominate at 62.20%; that bar gets a soft
 * accent glow. Theme-aware (Phase 2.4E.2) — primary + primary-soft
 * follow the active theme.
 */
export function AgeDistribution() {
  const palette = useThemeChartColors();
  const PRIMARY = palette.primary;
  const PRIMARY_SOFT = palette.primarySoft;
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
      dataWindow="Clinical breakdown · 2024–2025"
      transparencyNote="2023 source records have no DOB column; 2026 YTD ages were extracted (0-4:1, 18-40:3, 41-60:1, 61+:6 from n=11) but are not folded into the headline distribution to keep the denominator stable at n=156."
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
              cursor={{ fill: 'rgba(var(--theme-chart-primary-rgb),0.06)' }}
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={CHART_TOOLTIP_LABEL_STYLE}
              itemStyle={CHART_TOOLTIP_ITEM_STYLE}
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
                  fill={d.isDominant ? PRIMARY_SOFT : PRIMARY}
                  fillOpacity={d.isDominant ? 1 : 0.65}
                  style={
                    d.isDominant
                      ? { filter: 'drop-shadow(0 0 12px rgba(var(--theme-chart-primary-rgb),0.45))' }
                      : undefined
                  }
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
