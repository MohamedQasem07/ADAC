'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from '@/lib/chart-style';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { useThemeChartColors } from '@/lib/theme-colors';
import { ChartFrame } from './ChartFrame';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ChartRow {
  month: string;
  y2023: number | null;
  y2024: number | null;
  y2025: number | null;
  y2026: number | null;
}

type SeriesKey = 'y2023' | 'y2024' | 'y2025' | 'y2026';

interface SeriesDef {
  key: SeriesKey;
  label: string;
  rowKey: string;
  ytd: boolean;
}

/**
 * §3.1 (Phase 2.4I) — ADAC Monthly Case Pattern 2023–2026 (grouped bars).
 *
 * Replaces the old single-series Year-by-Year bar chart and the
 * 4-row supplementary heatmap on this route. Renders one bar per
 * year for each month, with 2026 styled distinctly (dashed border,
 * lighter fill) because it's year-to-date only.
 *
 * Data source: `historicalContext2023_2026.adacMonthly.rows` in
 * adac-data.json (real extraction from the two Excel master files,
 * documented in docs/ADAC_2023_2026_INTEGRATION_NOTES.md).
 *
 * 2026 future months (Jun–Dec) pass `null` so Recharts renders no bar
 * — never zero. May 2026 = 0 is a real value and renders as a flat
 * baseline tick.
 */
export function ADACMonthlyGroupedChart() {
  const ctx = fallbackADACData.historicalContext2023_2026;
  const rows: ChartRow[] = MONTHS.map((m, i) => {
    const row = ctx?.adacMonthly?.rows ?? [];
    const lookup = (label: string) => row.find((r) => r.year === label);
    return {
      month: m,
      y2023: lookup('2023')?.months?.[i] ?? null,
      y2024: lookup('2024')?.months?.[i] ?? null,
      y2025: lookup('2025')?.months?.[i] ?? null,
      y2026: lookup('2026 YTD')?.months?.[i] ?? null,
    };
  });

  const palette = useThemeChartColors();
  const colors: Record<SeriesKey, string> = {
    y2023: palette.secondary, // HMC blue (premium) / partnership blue
    y2024: palette.primarySoft, // soft gold / soft yellow
    y2025: palette.primary, // gold / ADAC yellow (the strongest year)
    y2026: palette.tertiary, // teal / cyan (visually distinct + dashed)
  };

  const series: SeriesDef[] = [
    { key: 'y2023', label: '2023', rowKey: '2023', ytd: false },
    { key: 'y2024', label: '2024', rowKey: '2024', ytd: false },
    { key: 'y2025', label: '2025', rowKey: '2025', ytd: false },
    { key: 'y2026', label: '2026 YTD', rowKey: '2026', ytd: true },
  ];

  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.1"
      eyebrow="§3.1"
      title="ADAC Monthly Case Pattern 2023–2026"
      populationLabel="Monthly ADAC activity pattern · 2026 YTD only"
      dataWindow="Historical 2023–2026 · 2026 YTD (Jan–May)"
      annotation="2024–2025 remains the primary complete analysis window. 2026 is shown as year-to-date context only."
      transparencyNote="2024 and 2025 monthly rows reflect insurance-paid ADAC case flow. The headline 2024–2025 partnership total remains 200 total ADAC cases including cash cases counted in older bookkeeping."
      insight={{
        keyInsight:
          'Across four years, ADAC monthly volume holds a consistent late-summer-to-autumn peak (Aug–Nov) with steady spring activity — the seasonal shape is repeatable.',
        meaning:
          'A package framework lets HMC plan staffing and reporting against this repeating seasonal curve rather than reacting month by month.',
      }}
    >
      {/* Legend chips */}
      <div ref={ref} className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {series.map((s) => (
          <span
            key={s.key}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ice/85"
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-5 rounded-[1px]"
              style={
                s.ytd
                  ? {
                      background: `repeating-linear-gradient(45deg, ${colors[s.key]}, ${colors[s.key]} 3px, transparent 3px, transparent 5px)`,
                      border: `1px dashed ${colors[s.key]}`,
                    }
                  : { background: colors[s.key] }
              }
            />
            {s.label}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 720, height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 30, right: 12, left: 0, bottom: 12 }} barCategoryGap="18%" barGap={2}>
              <CartesianGrid stroke={CHART_GRID} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: CHART_TEXT_SECONDARY, fontSize: 12, letterSpacing: '0.12em' }}
                tickLine={false}
                axisLine={{ stroke: CHART_AXIS_LINE }}
              />
              <YAxis
                tick={{ fill: CHART_TEXT_SECONDARY, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={28}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(value, name) => {
                  const v = value as number | null;
                  const n = String(name);
                  if (v == null) return [null, null] as unknown as [string, string];
                  const label =
                    n === 'y2023'
                      ? '2023'
                      : n === 'y2024'
                        ? '2024'
                        : n === 'y2025'
                          ? '2025'
                          : '2026 YTD';
                  return [`${v} case${v === 1 ? '' : 's'}`, label];
                }}
              />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  isAnimationActive={inView}
                  animationDuration={900}
                  animationEasing="ease-out"
                  radius={[2, 2, 0, 0]}
                >
                  {rows.map((r, i) => {
                    const v = r[s.key];
                    return (
                      <Cell
                        key={`${s.key}-${i}`}
                        fill={colors[s.key]}
                        fillOpacity={s.ytd ? 0.55 : 0.92}
                        stroke={s.ytd ? colors[s.key] : 'transparent'}
                        strokeDasharray={s.ytd ? '3 2' : undefined}
                        strokeWidth={s.ytd ? 1 : 0}
                        // Suppress drawing entirely when value is null (Recharts already
                        // skips, but we make sure the Cell carries no visible artefact).
                        style={v == null ? { opacity: 0 } : undefined}
                      />
                    );
                  })}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-year totals strip — keeps the audience anchored on the 268 / 57 / 103 / 97 / 11 numbers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 1.0, duration: 0.6, ease: ease.premium }}
        className="mt-6 grid grid-cols-2 gap-2 text-center sm:grid-cols-4"
      >
        {series.map((s) => {
          const total = ctx?.adacMonthly?.rows?.find((r) => r.year === s.rowKey || r.year === (s.ytd ? '2026 YTD' : s.label))?.total ?? 0;
          return (
            <div
              key={s.key}
              className="rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2"
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: s.ytd ? colors[s.key] : 'var(--theme-accent)' }}
              >
                {s.label}
              </p>
              <p className="mt-1 font-display text-xl text-white">{total}</p>
            </div>
          );
        })}
      </motion.div>
    </ChartFrame>
  );
}

/**
 * Compact variant used inside the Executive Data Room's Historical
 * Performance block. No ChartFrame, no insight panel — just the grouped
 * bars + legend, sized to a dashboard card (~240 px tall).
 */
export function MiniADACMonthlyGrouped() {
  const ctx = fallbackADACData.historicalContext2023_2026;
  const rows: ChartRow[] = MONTHS.map((m, i) => {
    const row = ctx?.adacMonthly?.rows ?? [];
    const lookup = (label: string) => row.find((r) => r.year === label);
    return {
      month: m,
      y2023: lookup('2023')?.months?.[i] ?? null,
      y2024: lookup('2024')?.months?.[i] ?? null,
      y2025: lookup('2025')?.months?.[i] ?? null,
      y2026: lookup('2026 YTD')?.months?.[i] ?? null,
    };
  });

  const palette = useThemeChartColors();
  const colors: Record<SeriesKey, string> = {
    y2023: palette.secondary,
    y2024: palette.primarySoft,
    y2025: palette.primary,
    y2026: palette.tertiary,
  };

  const series: SeriesDef[] = [
    { key: 'y2023', label: '2023', rowKey: '2023', ytd: false },
    { key: 'y2024', label: '2024', rowKey: '2024', ytd: false },
    { key: 'y2025', label: '2025', rowKey: '2025', ytd: false },
    { key: 'y2026', label: '2026 YTD', rowKey: '2026', ytd: true },
  ];

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {series.map((s) => (
          <span
            key={s.key}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ice/85"
          >
            <span
              aria-hidden
              className="inline-block h-2 w-3.5 rounded-[1px]"
              style={
                s.ytd
                  ? {
                      background: `repeating-linear-gradient(45deg, ${colors[s.key]}, ${colors[s.key]} 2px, transparent 2px, transparent 4px)`,
                      border: `1px dashed ${colors[s.key]}`,
                    }
                  : { background: colors[s.key] }
              }
            />
            {s.label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <div style={{ minWidth: 560, height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 6, right: 4, left: 0, bottom: 0 }} barCategoryGap="16%" barGap={1}>
              <CartesianGrid stroke={CHART_GRID} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: CHART_TEXT_SECONDARY, fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: CHART_AXIS_LINE }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(value, name) => {
                  const v = value as number | null;
                  const n = String(name);
                  if (v == null) return [null, null] as unknown as [string, string];
                  const label =
                    n === 'y2023'
                      ? '2023'
                      : n === 'y2024'
                        ? '2024'
                        : n === 'y2025'
                          ? '2025'
                          : '2026 YTD';
                  return [`${v} case${v === 1 ? '' : 's'}`, label];
                }}
              />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  isAnimationActive
                  animationDuration={800}
                  animationEasing="ease-out"
                  radius={[2, 2, 0, 0]}
                >
                  {rows.map((r, i) => {
                    const v = r[s.key];
                    return (
                      <Cell
                        key={`${s.key}-${i}`}
                        fill={colors[s.key]}
                        fillOpacity={s.ytd ? 0.55 : 0.92}
                        stroke={s.ytd ? colors[s.key] : 'transparent'}
                        strokeDasharray={s.ytd ? '3 2' : undefined}
                        strokeWidth={s.ytd ? 1 : 0}
                        style={v == null ? { opacity: 0 } : undefined}
                      />
                    );
                  })}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
