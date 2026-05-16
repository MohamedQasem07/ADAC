'use client';

import { YearlyVolumeChart } from './YearlyVolumeChart';
import { ADACMonthlyHeatmap4Year } from './ADACMonthlyHeatmap4Year';

/**
 * §3.1 composed page — Phase 2.4H.
 *
 * Renders the existing Yearly Volume bar chart (2023, 2024, 2025, 2026 YTD)
 * followed by the new 4-year ADAC Monthly Heatmap (supplementary). Keeping
 * them on the same route means ADAC executives see both the annual shape
 * and the within-year seasonality without leaving §3.1.
 *
 * The primary 2024–2025 clinical breakdowns (§3.3 / §3.5 / §3.6 / §3.7)
 * are NOT extended into this 4-year view — they remain n=156, 2024–2025,
 * because the 2023 source records lack diagnosis / DOB / discharge-date
 * columns. See docs/ADAC_2023_2026_INTEGRATION_NOTES.md.
 */
export function YearlyVolumePage() {
  return (
    <>
      <YearlyVolumeChart />
      <ADACMonthlyHeatmap4Year />
    </>
  );
}
