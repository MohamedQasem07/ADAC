'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { fallbackADACData } from '@/data/fallback';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChartFrame } from './ChartFrame';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * ADAC Monthly Distribution — 4-year supplementary heatmap.
 *
 * Phase 2.4H — added alongside the existing primary 2024–2025 charts.
 *
 * 4 rows × 12 months:
 *   2023      — real monthly ADAC volume (n=57)
 *   2024      — real insurance-paid ADAC monthly flow (n=72 of 103 cases)
 *   2025      — real insurance-paid ADAC monthly flow (n=83 of 97 cases)
 *   2026 YTD  — real Jan–May ADAC monthly volume (n=11)
 *
 * Numbers come from `historicalContext2023_2026.adacMonthly` in
 * adac-data.json (extracted from Master_Sheet_New.xlsm and
 * master_sheet_tayb.xlsx on 2026-05-17). 2026 May+ cells render as
 * "not yet reported" with no fill and a dash.
 */
export function ADACMonthlyHeatmap4Year() {
  const ctx = fallbackADACData.historicalContext2023_2026;
  const rows = useMemo(() => ctx?.adacMonthly?.rows ?? [], [ctx]);
  const footnote = ctx?.adacMonthly?.footnote;

  const max = useMemo(() => {
    let m = 0;
    for (const r of rows) {
      for (const v of r.months) {
        if (v != null && v > m) m = v;
      }
    }
    return m || 1;
  }, [rows]);

  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.2-4y"
      eyebrow="§3.2 · Supplementary"
      title="ADAC Monthly Distribution · 4 Years"
      populationLabel={`n=223 insurance-paid + Jan 2023–May 2026 · ${rows.length} rows`}
      dataWindow="Historical 2023–2026 · 2026 YTD"
      annotation={footnote}
      insight={{
        keyInsight:
          'Across four years, ADAC monthly volume shows consistent seasonality — every year peaks in the Aug–Nov window, with steady spring activity and a clear winter trough.',
        meaning:
          'A package framework lets HMC plan staffing and reporting against this repeating seasonal shape rather than reacting case by case.',
      }}
    >
      <div ref={ref} className="overflow-x-auto">
        <table className="mx-auto w-full" aria-label="ADAC monthly distribution 2023–2026">
          <thead>
            <tr>
              <th className="w-16" />
              {MONTHS.map((m) => (
                <th
                  key={m}
                  className="px-1 pb-2 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-ice/85"
                >
                  {m}
                </th>
              ))}
              <th className="w-16 pb-2 text-right text-[11px] font-medium uppercase tracking-[0.18em] text-ice/85">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.year}>
                <th className="pr-3 text-right text-[12px] font-medium uppercase tracking-[0.2em] text-ice/85">
                  {row.year}
                </th>
                {row.months.map((value, mi) => {
                  const intensity = value != null ? value / max : 0;
                  const delay = inView ? (ri * 12 + mi) * 0.025 : 0;
                  return (
                    <motion.td
                      key={`${row.year}-${mi}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                      transition={{ delay, duration: 0.4, ease: ease.premium }}
                      className="relative p-0.5"
                    >
                      <div
                        className="group relative flex aspect-square min-w-[40px] items-center justify-center rounded-sm border border-white/10 text-[12px] font-semibold text-white transition-shadow duration-300 hover:shadow-gold-glow"
                        style={{
                          background:
                            value == null
                              ? 'rgba(255,255,255,0.02)'
                              : `rgba(var(--theme-chart-primary-rgb), ${0.08 + intensity * 0.75})`,
                          borderStyle: value == null ? 'dashed' : 'solid',
                        }}
                        title={value == null ? `${MONTHS[mi]} ${row.year}: not yet reported` : `${MONTHS[mi]} ${row.year}: ${value}`}
                      >
                        <span style={{ opacity: value != null ? 1 : 0.35 }}>
                          {value == null ? '—' : value}
                        </span>
                      </div>
                    </motion.td>
                  );
                })}
                <td className="pl-3 text-right font-mono text-[12px] tracking-[0.1em] text-ice/85">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}
