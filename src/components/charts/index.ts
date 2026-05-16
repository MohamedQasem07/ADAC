/** Renderer registry — maps SubtopicRenderer ids to the React component. */

import type { ComponentType } from 'react';
import { YearlyVolumePage } from './YearlyVolumePage';
import { ADACMonthlyGroupedChart } from './ADACMonthlyGroupedChart';
import { ADACMonthlyHeatmap4Year } from './ADACMonthlyHeatmap4Year';
import { GermanMonthlyHeatmap } from './GermanMonthlyHeatmap';
import { DiagnosisProfile } from './DiagnosisProfile';
import { FinancialDonuts } from './FinancialDonuts';
import { AdmissionProfile } from './AdmissionProfile';
import { AgeDistribution } from './AgeDistribution';
import { LengthOfStay } from './LengthOfStay';
import { MarketShareHero } from './MarketShareHero';
import { GermanVolumeSummary } from './GermanVolumeSummary';

export const CHART_REGISTRY: Record<string, ComponentType> = {
  // §3.1 — Phase 2.4I renders the ADAC Monthly Case Pattern grouped chart
  // (2023 / 2024 / 2025 / 2026 YTD). The old single-series Year-by-Year
  // bars + GrowthArrow + 4-row heatmap composition was retired.
  'chart-yearly':       YearlyVolumePage,
  'chart-heatmap':      GermanMonthlyHeatmap,
  'chart-diagnoses':    DiagnosisProfile,
  'chart-financial':    FinancialDonuts,
  'chart-admission':    AdmissionProfile,
  'chart-age':          AgeDistribution,
  'chart-los':          LengthOfStay,
  'chart-market-share': MarketShareHero,
  'chart-german-volume': GermanVolumeSummary,
};

export {
  YearlyVolumePage,
  ADACMonthlyGroupedChart,
  ADACMonthlyHeatmap4Year,
  GermanMonthlyHeatmap,
  DiagnosisProfile,
  FinancialDonuts,
  AdmissionProfile,
  AgeDistribution,
  LengthOfStay,
  MarketShareHero,
  GermanVolumeSummary,
};
