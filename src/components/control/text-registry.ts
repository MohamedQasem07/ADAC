/**
 * Registry of editable text fields exposed in Control Mode.
 *
 * Each entry pairs an override key with a presenter-readable label and
 * the original default. Components that render these fields look up the
 * override at render time via `useOverrides().textOf(key, fallback)`.
 *
 * To add a new editable field:
 *   1. Pick a stable key (e.g. "overview.card.3.summary")
 *   2. Add an entry below
 *   3. In the rendering component, wrap the displayed text with textOf(key, default)
 */

import overviewData from '@/content/section-overview.json';
import decisionsData from '@/content/section-decisions.json';

export interface TextField {
  key: string;
  label: string;
  group: string;
  defaultValue: string;
  /** Optional multiline hint. */
  multiline?: boolean;
}

/**
 * Section 3 chart insight defaults. Mirrors the hardcoded copy that
 * lives inside each chart component (e.g. YearlyVolumeChart.tsx).
 * Keys: `chart.{subId}.keyInsight` and `chart.{subId}.meaning`.
 */
const CHART_INSIGHTS: Array<{
  subId: string;
  title: string;
  keyInsight: string;
  meaning: string;
}> = [
  {
    subId: '3.1',
    title: 'Yearly Volume',
    keyInsight:
      'ADAC case volume shows a stable multi-year relationship, with 2024 and 2025 forming the main analysis window.',
    meaning:
      'HMC is not proposing an untested cooperation — the package model is built on real, multi-year case-handling history.',
  },
  {
    subId: '3.2',
    title: 'German Monthly Heatmap',
    keyInsight:
      'German traveler volume is seasonal, with clear concentration in high-demand months across August through December.',
    meaning:
      'A package framework helps ADAC and HMC manage predictable seasonal peaks with fewer approval delays and steadier case throughput.',
  },
  {
    subId: '3.3',
    title: 'Diagnosis Profile',
    keyInsight:
      'The top diagnosis categories are concentrated in a small number of common tourist medical scenarios — gastrointestinal, respiratory, and trauma cover ~75% of admissions.',
    meaning:
      'These patterns are well-suited to structured outpatient flat-rate packages rather than repeated case-by-case pricing.',
  },
  {
    subId: '3.4',
    title: 'Cash vs Insurance',
    keyInsight:
      'The insurance share of ADAC cases at HMC rose sharply in 2025 — from 70% to 87% of cases.',
    meaning:
      'A clearer ADAC–HMC framework reduces uncertainty for travelers and removes the cash-payment friction at the moment of care.',
  },
  {
    subId: '3.5',
    title: 'Admission Profile',
    keyInsight:
      'A meaningful portion of ADAC cases required admission, but the outpatient segment still needs a clear, efficient model.',
    meaning:
      'The flat-rate outpatient framework manages earlier-stage cases before unnecessary escalation and keeps admission decisions clinically driven.',
  },
  {
    subId: '3.6',
    title: 'Age Distribution',
    keyInsight:
      'A large share of cases involve older travelers (62% over 60), which raises clinical responsibility and documentation needs.',
    meaning:
      'Structured triage, clear escalation criteria, and same-day documented care pathways are essential for ADAC AG Holders.',
  },
  {
    subId: '3.7',
    title: 'Length of Stay',
    keyInsight:
      'Most admissions were resolved within a short timeframe — 83% discharged within 48 hours.',
    meaning:
      'Fast documentation, clear package coding, and same-day case summaries align directly with ADAC’s case-closure needs.',
  },
  {
    subId: '3.8',
    title: 'Market Share',
    keyInsight:
      'ADAC represents the leading share of insured German cases at HMC — approximately 1 in every 5 insured German patients.',
    meaning:
      'A dedicated outpatient framework is justified by the scale and strategic value of this relationship, not by speculation.',
  },
  {
    subId: '3.9',
    title: 'German Volume Summary',
    keyInsight:
      'German travelers remain a major patient group across the Red Sea operation — 1,127 cases over 2024 and 2025, growing as a share of HMC volume.',
    meaning:
      'HMC’s German-case experience supports multilingual service, documentation standards, and predictable cooperation with German insurance partners.',
  },
];

export function chartInsightDefaults(subId: string): { keyInsight: string; meaning: string } | undefined {
  return CHART_INSIGHTS.find((c) => c.subId === subId);
}

export const CHART_INSIGHT_LIST = CHART_INSIGHTS;

const CLOSING_PROPOSED_OUTCOME =
  "Agree on the outpatient package pilot framework and nominate ADAC and HMC operational contacts to finalize scope, reporting format, and launch preparation.";

export function closingProposedOutcomeDefault(): string {
  return CLOSING_PROPOSED_OUTCOME;
}

/** Build the full list of editable text fields, with stable keys. */
export function buildTextRegistry(): TextField[] {
  const fields: TextField[] = [];

  // ─── Presentation Overview cards ───────────────────────────────
  overviewData.items.forEach((item, i) => {
    const num = i + 1;
    fields.push({
      key: `overview.card.${num}.title`,
      label: `Overview card ${num} — title`,
      group: 'Presentation Overview',
      defaultValue: item.title,
    });
    fields.push({
      key: `overview.card.${num}.summary`,
      label: `Overview card ${num} — summary`,
      group: 'Presentation Overview',
      defaultValue: item.summary,
      multiline: true,
    });
  });

  // ─── Decision Points cards ─────────────────────────────────────
  decisionsData.items.forEach((item, i) => {
    const num = i + 1;
    fields.push({
      key: `decisions.card.${num}.title`,
      label: `Decisions card ${num} — title`,
      group: 'Decision Points',
      defaultValue: item.title,
    });
    fields.push({
      key: `decisions.card.${num}.summary`,
      label: `Decisions card ${num} — summary`,
      group: 'Decision Points',
      defaultValue: item.summary,
      multiline: true,
    });
  });

  // ─── Closing — proposed outcome ────────────────────────────────
  fields.push({
    key: 'closing.proposedOutcome',
    label: "Closing — Today's proposed outcome",
    group: 'Closing slide',
    defaultValue: CLOSING_PROPOSED_OUTCOME,
    multiline: true,
  });

  // ─── Section 3 chart insights ──────────────────────────────────
  for (const c of CHART_INSIGHTS) {
    fields.push({
      key: `chart.${c.subId}.keyInsight`,
      label: `§${c.subId} ${c.title} — Key insight`,
      group: 'Section 3 chart insights',
      defaultValue: c.keyInsight,
      multiline: true,
    });
    fields.push({
      key: `chart.${c.subId}.meaning`,
      label: `§${c.subId} ${c.title} — What this means for ADAC`,
      group: 'Section 3 chart insights',
      defaultValue: c.meaning,
      multiline: true,
    });
  }

  return fields;
}
