'use client';

import { ADACMonthlyGroupedChart } from './ADACMonthlyGroupedChart';

/**
 * §3.1 — composed page (Phase 2.4I rewrite).
 *
 * The single chart on this route is now the grouped monthly ADAC chart
 * (2023 / 2024 / 2025 / 2026 YTD). The earlier composition (single-series
 * Year-by-Year bars + the 4-row supplementary heatmap from 2.4H) has
 * been retired:
 *
 *   - The Year-by-Year bars made 2026 look weak because it was YTD,
 *     and the animated GrowthArrow overlay had a viewBox text-clipping bug.
 *   - The 4-row heatmap was visually repetitive once the grouped chart
 *     could show the same monthly seasonality more clearly.
 *
 * Per-year totals (57 / 103 / 97 / 11) are now surfaced inside the
 * grouped chart's footer strip so the headline 268-case narrative is
 * still visible on this route. The Executive Data Room continues to
 * carry the dedicated FourYearContextCard with the same totals.
 *
 * The locked clinical/financial headline charts (§3.3 / §3.4 / §3.5 /
 * §3.6 / §3.7 / §3.8) remain unchanged — they stay calibrated to the
 * 2024–2025 analysis window where the source data is complete.
 */
export function YearlyVolumePage() {
  return <ADACMonthlyGroupedChart />;
}
