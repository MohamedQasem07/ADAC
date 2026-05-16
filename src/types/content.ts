/**
 * Shared content types for the presentation.
 *
 * The deck's content lives in `src/content/*.md` and `*.json` files.
 * Components consume them through `src/lib/content-loader.ts` (build time)
 * or `src/lib/data-loader.ts` (runtime override for packages + adac-data).
 */

export type SectionLayout =
  | 'hero'
  | 'hero-stat'
  | 'editorial'
  | 'flow'
  | 'grid-3'
  | 'grid-4'
  | 'grid-6'
  | 'timeline'
  | 'dashboard'
  | 'structured';

export type SubtopicRenderer =
  | 'markdown'
  | 'cards'
  | 'flow'
  | 'timeline'
  | 'map'
  | 'sample-report'
  | 'chart-yearly'
  | 'chart-heatmap'
  | 'chart-diagnoses'
  | 'chart-financial'
  | 'chart-admission'
  | 'chart-age'
  | 'chart-los'
  | 'chart-market-share'
  | 'chart-german-volume'
  | 'package-category'
  | 'pricing-matrix'
  | 'worked-example';

export interface SubtopicMeta {
  id: string;
  title: string;
  /** Path under src/content/, e.g. "section-02b-locations.json" */
  content?: string;
  /** Optional explicit renderer override; defaults inferred from content extension. */
  renderer?: SubtopicRenderer;
  /** Optional JSON-pointer-style path into a data file, e.g. "adac-data.json#yearlyADAC". */
  data?: string;
}

export interface SectionMeta {
  id: string;
  title: string;
  /** Determines the SectionFrame variant + background treatment. */
  type: 'hero' | 'mixed' | 'dashboard' | 'editorial' | 'flow' | 'data-room';
  /** Optional top-level content file (markdown, usually). */
  content?: string;
  subtopics?: SubtopicMeta[];
  /** Sidebar grouping hint, e.g. "Story", "Data", "Operations". */
  group?: string;
}

export interface PresentationManifest {
  meeting: {
    date: string;
    location: string;
    title: string;
    eyebrow: string;
  };
  sections: SectionMeta[];
}

/**
 * Frontmatter shape expected on every markdown content file.
 */
export interface MarkdownFrontmatter {
  title?: string;
  eyebrow?: string;
  layout?: SectionLayout;
  /** Optional KPI list for hero-stat layout. */
  stats?: Array<{ value: string | number; label: string }>;
  /** Optional caption rendered below the title. */
  subtitle?: string;
  /** Optional pull quote (used for §2.5 reputation reviews). */
  quote?: string;
  /** Free-form metadata for the rendering layer. */
  [key: string]: unknown;
}

export interface MarkdownContent {
  frontmatter: MarkdownFrontmatter;
  /** Raw markdown body (no frontmatter). */
  body: string;
}

/**
 * Pricing scenario for the hidden Cmd/Ctrl+1/2/3 toggle.
 * A = "To be agreed" · B = standard catalogue · C = standard × 1.8 (rounded to nearest 10).
 */
export type PricingScenario = 'A' | 'B' | 'C';

export interface PackagePrices {
  A: string; // always "To be agreed"
  B: number;
  C: number;
}

export interface Package {
  category: number;
  /** Optional sub-section identifier (e.g. "A", "B", "C", "D" for wound-care subsections). */
  section?: string;
  code: string;
  name: string;
  included: string;
  prices: PackagePrices;
}

export interface PackageCategory {
  id: number;
  code: string; // GI, RX, WD, OR, EN, DN, DR, EY, CR
  name: string;
  description: string;
  escalationNote?: string;
  /** Sub-section ordering for categories that have A/B/C/D groupings. */
  subsections?: Array<{ id: string; title: string }>;
}

/** ─── ADAC dataset ──────────────────────────────────────────────── */

export interface YearlyADAC {
  year: number;
  total: number;
  cash?: number | null;
  insurance?: number | null;
  note?: string;
}

export interface MonthlyHeatmapRow {
  /** Three-letter month abbreviation. */
  [yearKey: string]: number | null | undefined;
}

export interface ADACDataset {
  /** All ADAC cases by year (2023=57, 2024=103, 2025=97, 2026=11 YTD). */
  yearlyADAC: YearlyADAC[];
  /** Grand total cases across all available years. */
  grandTotal: number;
  /** Combined 2024-2025 view (insurance-heavy window used for charts 3.3-3.7). */
  combined2024_2025: {
    total: number; // 200
    cash: number; // 44
    insurance: number; // 156
  };
  /** Section 3.4 — cash vs insurance split. */
  financialMix: {
    [year: string]: {
      cash: number;
      insurance: number;
      total: number;
      cashPct: number;
      insurancePct: number;
    };
  };
  /** Section 3.2 heatmap — GERMAN patients (not ADAC), by month × year. */
  germanMonthly: Record<string, Record<string, number | null>>;
  /** German patient volume totals. */
  germanVolume: {
    by_year: Record<string, number>;
    total: number;
    marketShareOfHMC: Record<string, string>;
  };
  /** Section 3.5 — ADAC admission profile (n=156). */
  admissionProfile: {
    totalAdmissions: number;
    normalRoom: { count: number; pct: number };
    icu: { count: number; pct: number };
    majorSurgery: { count: number; pct: number };
    skilledSurgery: { count: number; pct: number };
    advancedSurgery: { count: number; pct: number };
    minorSurgery: { count: number; pct: number };
    mediumSurgery: { count: number; pct: number };
  };
  /** Section 3.3 — diagnosis profile (n=156). */
  diagnosisProfile: Array<{ category: string; count: number; pct: number }>;
  /** Section 3.6 — age distribution (n=156). */
  ageProfile: Array<{ group: string; count: number; pct: number }>;
  /** Section 3.7 — length of stay (n=156). */
  lengthOfStay: Array<{ days: number; count: number; pct: number }>;
  /** Section 3.8 — ADAC share of insured German cases. */
  marketShare: {
    totalInsuredGermanCases: number; // 766
    adacCases: number; // 156
    adacShare: string; // "20.37%"
    rank: string; // "#1"
    phrasing: string;
  };
}
