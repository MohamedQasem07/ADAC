'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CountUp from 'react-countup';
import { fallbackADACData } from '@/data/fallback';
import {
  CHART_AXIS_LINE,
  CHART_TEXT_SECONDARY,
  CHART_TOOLTIP_STYLE,
} from '@/lib/chart-style';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { useThemeChartColors } from '@/lib/theme-colors';

/**
 * Compact dashboard-only chart variants for the Executive Data Room.
 *
 * These do NOT replace the full §3 charts — they sit alongside, sized
 * for dashboard cards (~180-220 px tall), with no insight panels and
 * a short caption. Each chart has its own "Open full view →" link in
 * the parent DataRoomPage.
 *
 * Locked data: all numbers read from src/data/fallback.ts.
 */

const INK = CHART_TEXT_SECONDARY;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HEATMAP_YEARS = ['2024', '2025'];

// ─── §3.1 compact ───────────────────────────────────────────────
export function MiniYearlyBars() {
  const palette = useThemeChartColors();
  const GOLD = palette.primary;
  const GOLD_SOFT = palette.primarySoft;
  const data = fallbackADACData.yearlyADAC.map((row) => ({
    year: String(row.year),
    total: row.total,
    isYTD: row.note?.includes('YTD') ?? false,
  }));
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 28, right: 12, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fill: INK, fontSize: 12, letterSpacing: '0.1em' }}
            tickLine={false}
            axisLine={{ stroke: CHART_AXIS_LINE }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(201,169,97,0.06)' }}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Bar
            dataKey="total"
            radius={[2, 2, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((d) => (
              <Cell
                key={d.year}
                fill={d.isYTD ? GOLD_SOFT : GOLD}
                fillOpacity={d.isYTD ? 0.5 : 0.92}
                stroke={d.isYTD ? GOLD : 'transparent'}
                strokeDasharray={d.isYTD ? '4 3' : undefined}
              />
            ))}
            <LabelList
              dataKey="total"
              position="top"
              fill="#fff"
              fontSize={13}
              fontFamily="var(--font-playfair), Georgia, serif"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── §3.2 compact heatmap ───────────────────────────────────────
export function MiniHeatmap() {
  const data = fallbackADACData.germanMonthly;
  const max = useMemo(() => {
    let m = 0;
    for (const month of MONTHS) {
      for (const year of HEATMAP_YEARS) {
        const v = (data as Record<string, Record<string, number | null>>)[month][year];
        if (v != null && v > m) m = v;
      }
    }
    return m;
  }, [data]);
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref}>
      <table className="w-full" aria-label="German patient monthly volume">
        <thead>
          <tr>
            <th className="w-9" />
            {MONTHS.map((m) => (
              <th
                key={m}
                className="px-0.5 pb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-ice/80"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HEATMAP_YEARS.map((year, yi) => (
            <tr key={year}>
              <th className="pr-2 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-ice/80">
                {year}
              </th>
              {MONTHS.map((month, mi) => {
                const value = (data as Record<string, Record<string, number | null>>)[month][year];
                const intensity = value != null ? value / max : 0;
                const delay = inView ? (yi * 12 + mi) * 0.025 : 0;
                return (
                  <motion.td
                    key={`${year}-${month}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ delay, duration: 0.4, ease: ease.premium }}
                    className="relative p-0.5"
                  >
                    <div
                      className="relative flex aspect-square min-w-[26px] items-center justify-center rounded-sm border border-white/10 text-[10px] font-semibold text-white"
                      style={{ background: `rgba(var(--theme-chart-primary-rgb), ${0.08 + intensity * 0.75})` }}
                      title={`${month} ${year}: ${value ?? '—'}`}
                    >
                      <span style={{ opacity: value != null ? 1 : 0.55 }}>
                        {value ?? ''}
                      </span>
                    </div>
                  </motion.td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── §3.8 compact market-share radial ───────────────────────────
export function MiniMarketShare() {
  const palette = useThemeChartColors();
  const GOLD = palette.primary;
  const ms = fallbackADACData.marketShare;
  const pct = Number(ms.adacShare.replace('%', ''));
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });

  // SVG ring math
  const size = 160;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);

  return (
    <div ref={ref} className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
            fill="none"
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={GOLD}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
            transition={{ duration: 1.4, ease: ease.premium }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-2xl font-semibold text-white md:text-3xl">
            {inView ? (
              <CountUp end={pct} duration={1.4} decimals={2} suffix="%" preserveValue useEasing />
            ) : (
              '0%'
            )}
          </p>
          <p className="mt-1 max-w-[110px] text-center text-[10px] uppercase leading-tight tracking-[0.18em] text-ice/85">
            ADAC share of insured German cases
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── §3.4 compact donut ─────────────────────────────────────────
export function MiniFinancialDonut() {
  const palette = useThemeChartColors();
  const GOLD = palette.primary;
  const TEAL = palette.tertiary;
  const fm = fallbackADACData.financialMix.combined;
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });
  return (
    <div ref={ref} className="relative" style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: 'Insurance', value: fm.insurance, fill: GOLD },
              { name: 'Cash', value: fm.cash, fill: TEAL },
            ]}
            dataKey="value"
            innerRadius={56}
            outerRadius={84}
            paddingAngle={2}
            startAngle={90}
            endAngle={450}
            stroke="none"
            animationDuration={1100}
            animationEasing="ease-out"
          >
            <Cell />
            <Cell />
          </Pie>
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ delay: 0.6, duration: 0.5, ease: ease.premium }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      >
        <p className="font-display text-2xl text-white">
          {inView ? <CountUp end={fm.total} duration={1.3} preserveValue useEasing /> : 0}
        </p>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-ice/85">cases</p>
      </motion.div>
      <div className="mt-2 flex items-center justify-center gap-4 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-ice/85">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: GOLD }} />
          Insurance {fm.insurancePct}%
        </span>
        <span className="inline-flex items-center gap-1.5 text-ice/85">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: TEAL }} />
          Cash {fm.cashPct}%
        </span>
      </div>
    </div>
  );
}

// ─── §3.3 compact diagnosis (top 5) ─────────────────────────────
export function MiniDiagnosis() {
  const palette = useThemeChartColors();
  const GOLD = palette.primary;
  const data = fallbackADACData.diagnosisProfile.slice(0, 5).map((d) => ({
    name: d.category,
    pct: d.pct,
    count: d.count,
  }));
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, left: 110, bottom: 0 }}>
          <XAxis type="number" hide domain={[0, 'dataMax']} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: INK, fontSize: 11 }}
            width={108}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) => (v.length > 22 ? v.slice(0, 21) + '…' : v)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(201,169,97,0.06)' }}
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={(_v: number, _n, p) => [`${p.payload.count} (${p.payload.pct.toFixed(1)}%)`, 'Cases']}
          />
          <Bar
            dataKey="pct"
            radius={[0, 2, 2, 0]}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={GOLD} fillOpacity={Math.max(0.55, 1 - i * 0.08)} />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v: number) => `${v.toFixed(1)}%`}
              fill="#fff"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── §3.5 compact admission stacked bar ─────────────────────────
export function MiniAdmission() {
  const palette = useThemeChartColors();
  const GOLD = palette.primary;
  const TEAL = palette.tertiary;
  const BLUE = palette.secondary;
  const ap = fallbackADACData.admissionProfile;
  const surgeryPct = Number(
    (
      ap.majorSurgery.pct +
      ap.skilledSurgery.pct +
      ap.advancedSurgery.pct +
      ap.minorSurgery.pct +
      ap.mediumSurgery.pct
    ).toFixed(2)
  );
  const segments = [
    { label: 'Normal Room', pct: ap.normalRoom.pct, color: GOLD },
    { label: 'ICU', pct: ap.icu.pct, color: BLUE },
    { label: 'Surgery', pct: surgeryPct, color: TEAL },
  ];
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });

  return (
    <div ref={ref} className="flex h-[200px] flex-col justify-center">
      <div className="flex h-12 w-full overflow-hidden rounded-sm border border-white/10">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ width: 0 }}
            animate={inView ? { width: `${seg.pct}%` } : { width: 0 }}
            transition={{ delay: 0.2 + i * 0.18, duration: 0.8, ease: ease.premium }}
            style={{ background: seg.color }}
            className="flex items-center justify-center font-display text-xs font-semibold text-navy-deep"
          >
            {seg.pct.toFixed(0)}%
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-2 text-[11px] uppercase tracking-[0.2em] text-ice/85">
        {segments.map((seg) => (
          <span key={seg.label} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ background: seg.color }} />
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── §3.6 compact age distribution ──────────────────────────────
export function MiniAge() {
  const palette = useThemeChartColors();
  const GOLD = palette.primary;
  const GOLD_SOFT = palette.primarySoft;
  const data = fallbackADACData.ageProfile.map((d) => ({
    name: d.group.replace(/^[\d–\-+ ]+/, '').trim() || d.group,
    full: d.group,
    count: d.count,
    pct: d.pct,
    isDominant: d.group.startsWith('61+'),
  }));
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: 0, bottom: 30 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: INK, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_AXIS_LINE }}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={40}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(201,169,97,0.06)' }}
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={(_v, _n, p) => [`${p.payload.count} (${p.payload.pct}%)`, p.payload.full]}
          />
          <Bar
            dataKey="count"
            radius={[2, 2, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((d) => (
              <Cell
                key={d.full}
                fill={d.isDominant ? GOLD_SOFT : GOLD}
                fillOpacity={d.isDominant ? 1 : 0.55}
                style={d.isDominant ? { filter: 'drop-shadow(0 0 8px rgba(var(--theme-chart-primary-rgb),0.45))' } : undefined}
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
    </div>
  );
}

// ─── §3.7 compact length-of-stay histogram ──────────────────────
export function MiniLengthOfStay() {
  const palette = useThemeChartColors();
  const GOLD = palette.primary;
  const data = fallbackADACData.lengthOfStay.map((d) => ({
    days: d.days,
    count: d.count,
    pct: d.pct,
    isShort: d.days <= 2,
  }));
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });

  return (
    <div ref={ref} style={{ width: '100%', height: 200 }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 36, right: 8, left: 0, bottom: 20 }}>
          <XAxis
            dataKey="days"
            tick={{ fill: INK, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: CHART_AXIS_LINE }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(201,169,97,0.06)' }}
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={(_v, _n, p) => [`${p.payload.count} cases (${p.payload.pct.toFixed(2)}%)`, 'Admissions']}
          />
          <Bar
            dataKey="count"
            radius={[2, 2, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((d) => (
              <Cell key={d.days} fill={GOLD} fillOpacity={d.isShort ? 1 : 0.55} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.5, ease: ease.premium }}
        className="pointer-events-none absolute left-[8%] top-1 text-center"
        style={{ width: '14%' }}
      >
        <p
          className="font-display text-base"
          style={{ color: 'var(--theme-accent)' }}
        >
          83%
        </p>
        <p
          className="text-[9px] uppercase tracking-[0.25em]"
          style={{ color: 'var(--theme-accent-soft)' }}
        >
          within 48 h
        </p>
      </motion.div>
    </div>
  );
}

// ─── Reusable little summary stat (used by Section 4 markup) ────
export { CountUp };
