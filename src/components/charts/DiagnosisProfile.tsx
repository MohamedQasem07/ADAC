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
import { ChartFrame } from './ChartFrame';

const GOLD = '#C9A961';
const INK_SOFT = '#7A8B9D';

/**
 * §3.3 — ADAC Diagnosis Profile.
 *
 * 13 categories sorted desc, GI top at 39.10%. Horizontal bars grow
 * L→R from 0; top diagnosis first with 80 ms stagger (Phase 5.5).
 */
export function DiagnosisProfile() {
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
      annotation="Top 3 categories = 75.6% of admissions"
    >
      <div style={{ width: '100%', height: 540 }}>
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
              tick={{ fill: INK_SOFT, fontSize: 12 }}
              width={200}
              tickLine={false}
              axisLine={false}
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
                  fill={GOLD}
                  fillOpacity={Math.max(0.4, 1 - i * 0.045)}
                />
              ))}
              <LabelList
                dataKey="pct"
                position="right"
                formatter={(v: number) => `${v.toFixed(1)}%`}
                fill="#fff"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
