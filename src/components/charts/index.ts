/** Renderer registry — maps SubtopicRenderer ids to the React component. */

import type { ComponentType } from 'react';
import { YearlyVolumeChart } from './YearlyVolumeChart';
import { YearlyVolumePage } from './YearlyVolumePage';
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
  // §3.1 now renders the composed YearlyVolumePage = bar chart + 4-year
  // ADAC monthly heatmap (Phase 2.4H). The standalone YearlyVolumeChart
  // is still exported for use inside DataRoomPage's MiniYearlyBars.
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

export { YearlyVolumeChart, YearlyVolumePage, ADACMonthlyHeatmap4Year, GermanMonthlyHeatmap, DiagnosisProfile, FinancialDonuts, AdmissionProfile, AgeDistribution, LengthOfStay, MarketShareHero, GermanVolumeSummary };
