'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { fallbackADACData } from '@/data/fallback';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChartFrame } from './ChartFrame';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Row {
  year: string;
  /** Length 12. `null` = no data / future month. */
  months: Array<number | null>;
  total: number;
}

/**
 * §3.2 — German Traveler Monthly Flow 2023–2026.
 *
 * Phase 2.4I expansion: was 2 rows (2024 + 2025) — now 4 rows
 * (2023 + 2024 + 2025 + 2026 YTD). All values are real extractions:
 *   - 2024 / 2025 come from the existing `germanMonthly` map (preserved)
 *   - 2023 comes from `historicalContext2023_2026.germanMonthly2023`
 *   - 2026 YTD comes from `historicalContext2023_2026.germanMonthly2026YTD`
 *
 * This is full German traveler flow across the operation — NOT
 * ADAC-only. The ADAC clinical/financial analysis window (2024–2025)
 * is unaffected; the 1,127 denominator used in §3.4 / §3.5 / §3.6 /
 * §3.7 / §3.8 remains the locked source of truth.
 */
export function GermanMonthlyHeatmap() {
  // 2024 + 2025 — preserve the existing values exactly.
  const legacy = fallbackADACData.germanMonthly as Record<
    string,
    Record<string, number | null>
  >;
  const months2024 = MONTHS.map((m) => legacy[m]?.['2024'] ?? null);
  const months2025 = MONTHS.map((m) => legacy[m]?.['2025'] ?? null);

  // 2023 + 2026 YTD — from the 2.4H historical context block.
  const ctx = fallbackADACData.historicalContext2023_2026;
  const months2023 = (ctx?.germanMonthly2023?.months ?? Array(12).fill(null)) as Array<
    number | null
  >;
  const months2026 = (ctx?.germanMonthly2026YTD?.months ?? Array(12).fill(null)) as Array<
    number | null
  >;

  const rows: Row[] = useMemo(
    () => [
      { year: '2023', months: months2023, total: ctx?.germanMonthly2023?.total ?? 0 },
      {
        year: '2024',
        months: months2024,
        total: months2024.reduce<number>((a, v) => a + (v ?? 0), 0),
      },
      {
        year: '2025',
        months: months2025,
        total: months2025.reduce<number>((a, v) => a + (v ?? 0), 0),
      },
      { year: '2026 YTD', months: months2026, total: ctx?.germanMonthly2026YTD?.total ?? 0 },
    ],
    // months2024 / months2025 / months2023 / months2026 are computed once at module-load shape
    // and `ctx` is a constant import — disabling exhaustive-deps is safe here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const max = useMemo(() => {
    let m = 0;
    for (const r of rows) {
      for (const v of r.months) {
        if (v != null && v > m) m = v;
      }
    }
    return m || 1;
  }, [rows]);

  const grandTotal = rows.reduce((a, r) => a + r.total, 0);
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.2"
      eyebrow="§3.2"
      title="German Traveler Monthly Flow 2023–2026"
      populationLabel={`Full German traveler flow across the operation · 2026 YTD only · n=${grandTotal.toLocaleString()} across 4 years`}
      dataWindow="Historical 2023–2026 · 2026 YTD (Jan–May)"
      annotation="2026 is year-to-date only. Future months are not included."
      transparencyNote="Full German traveler flow (not ADAC-only). The locked 2024–2025 ADAC analysis denominator (1,127 German patients in §3.4 / §3.5 / §3.6 / §3.7) is unchanged by this 4-year operational view."
      insight={{
        keyInsight:
          'Across four years, German traveler volume holds a clear Aug–Nov peak with consistent spring activity — the seasonal shape is stable and predictable.',
        meaning:
          'A package framework helps ADAC and HMC plan against this repeating seasonality with fewer approval delays and steadier case throughput.',
      }}
    >
      <div ref={ref} className="overflow-x-auto">
        <table className="mx-auto w-full" aria-label="German traveler monthly flow 2023 to 2026 YTD">
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
            {rows.map((row, yi) => (
              <tr key={row.year}>
                <th className="pr-3 text-right text-[12px] font-medium uppercase tracking-[0.2em] text-ice/85">
                  {row.year}
                </th>
                {row.months.map((value, mi) => {
                  const intensity = value != null ? value / max : 0;
                  const delay = inView ? (yi * 12 + mi) * 0.025 : 0;
                  return (
                    <motion.td
                      key={`${row.year}-${mi}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
                  {row.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}
