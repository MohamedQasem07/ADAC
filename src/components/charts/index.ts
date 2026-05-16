/** Renderer registry — maps SubtopicRenderer ids to the React component. */

import type { ComponentType } from 'react';
import { YearlyVolumeChart } from './YearlyVolumeChart';
import { GermanMonthlyHeatmap } from './GermanMonthlyHeatmap';
import { DiagnosisProfile } from './DiagnosisProfile';
import { FinancialDonuts } from './FinancialDonuts';
import { AdmissionProfile } from './AdmissionProfile';
import { AgeDistribution } from './AgeDistribution';
import { LengthOfStay } from './LengthOfStay';
import { MarketShareHero } from './MarketShareHero';
import { GermanVolumeSummary } from './GermanVolumeSummary';

export const CHART_REGISTRY: Record<string, ComponentType> = {
  'chart-yearly':       YearlyVolumeChart,
  'chart-heatmap':      GermanMonthlyHeatmap,
  'chart-diagnoses':    DiagnosisProfile,
  'chart-financial':    FinancialDonuts,
  'chart-admission':    AdmissionProfile,
  'chart-age':          AgeDistribution,
  'chart-los':          LengthOfStay,
  'chart-market-share': MarketShareHero,
  'chart-german-volume': GermanVolumeSummary,
};

export { YearlyVolumeChart, GermanMonthlyHeatmap, DiagnosisProfile, FinancialDonuts, AdmissionProfile, AgeDistribution, LengthOfStay, MarketShareHero, GermanVolumeSummary };
