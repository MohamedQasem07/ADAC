'use client';

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fallbackADACData } from '@/data/fallback';
import {
  CHART_TEXT_SECONDARY,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from '@/lib/chart-style';
import { useThemeChartColors } from '@/lib/theme-colors';
import { ChartFrame } from './ChartFrame';

const INK_SOFT = CHART_TEXT_SECONDARY;

/**
 * §3.3 — ADAC Diagnosis Profile.
 *
 * 13 categories sorted desc, GI top at 39.10%. Horizontal bars grow
 * L→R from 0; top diagnosis first with 80 ms stagger.
 *
 * Theme-aware (Phase 2.4E.2): primary bars take `palette.primary` —
 * gold under Premium Navy, ADAC yellow under Partnership.
 */
export function DiagnosisProfile() {
  const palette = useThemeChartColors();
  const PRIMARY = palette.primary;
  const data = fallbackADACData.diagnosisProfile.map((d) => ({
    name: d.category,
    pct: d.pct,
    count: d.count,
  }));

  return (
    <ChartFrame
      subId="3.3"
      eyebrow="§3.3"
      title="ADAC Diagnosis Profile"
      populationLabel="n=156 ADAC admissions · 2024–2025"
      dataWindow="Clinical breakdown · 2024–2025"
      transparencyNote="2023 ADAC source records do not include a Diagnosis column, and 2026 YTD (n=11) free-text records are not coded into these 13 categories. The 4-year diagnosis chart is intentionally not extrapolated."
      annotation="Top 3 categories = 75.6% of admissions"
      insight={{
        keyInsight:
          'The top diagnosis categories are concentrated in a small number of common tourist medical scenarios — gastrointestinal, respiratory, and trauma cover ~75% of admissions.',
        meaning:
          'These patterns are well-suited to structured outpatient flat-rate packages rather than repeated case-by-case pricing.',
      }}
    >
      <div className="h-[420px] w-full sm:h-[540px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 60, left: 200, bottom: 10 }}
          >
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: INK_SOFT, fontSize: 13 }}
              width={210}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(var(--theme-chart-primary-rgb),0.06)' }}
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={CHART_TOOLTIP_LABEL_STYLE}
              itemStyle={CHART_TOOLTIP_ITEM_STYLE}
              formatter={(_v: number, _n, p) =>
                [`${p.payload.count} cases · ${p.payload.pct.toFixed(2)}%`, 'Count']
              }
            />
            <Bar
              dataKey="pct"
              radius={[0, 2, 2, 0]}
              animationDuration={900}
              animationEasing="ease-out"
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={PRIMARY}
                  fillOpacity={Math.max(0.4, 1 - i * 0.045)}
                />
              ))}
              <LabelList
                dataKey="pct"
                position="right"
                formatter={(v: number) => `${v.toFixed(1)}%`}
                fill="#fff"
                fontSize={13}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
