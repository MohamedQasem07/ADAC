# ADAC 2023 & 2026 Integration Notes — Phase 2.4H

> Internal reference for what is real, what is extrapolated, what is intentionally not shown, and why.
> Date of extraction: **2026-05-17**
> Source files: `Master_Sheet_New.xlsm` (sheet "Master Sheet") + `master_sheet_tayb.xlsx` (sheet "ورقة1")
> Extraction script saved alongside this note at `docs/data_extraction_2026.txt`.

---

## 1. What is real (extracted from Excel)

### ADAC yearly volume (2023–2026)
| Year | Cases | Note |
|---|---|---|
| 2023 | 57 | Real, from `master_sheet_tayb.xlsx` (Y=23.0 filter) |
| 2024 | 103 | Real |
| 2025 | 97 | Real |
| 2026 YTD | 11 | Real, Jan–May 2026 |
| **Total** | **268** | |

### ADAC monthly distribution
Real, but heterogeneous: 2024 and 2025 monthly rows are **insurance-paid ADAC case flow** (72 and 83 cases respectively, the ones recorded in `Master_Sheet_New.xlsm`). 2024's yearly total of 103 and 2025's 97 include cash cases counted elsewhere. The 4-year monthly heatmap labels this explicitly.

| Year | Months (Jan→Dec) | Row total |
|---|---|---|
| 2023 | 7, 0, 2, 8, 1, 8, 6, 7, 4, 3, 9, 2 | 57 |
| 2024 | 1, 6, 2, 2, 5, 7, 8, 8, 12, 7, 7, 7 | 72 |
| 2025 | 4, 5, 6, 2, 8, 8, 3, 10, 9, 7, 12, 9 | 83 |
| 2026 YTD | 4, 1, 4, 2, 0, —, —, —, —, —, —, — | 11 |

### 2026 YTD clinical (real, n=11)
- **Ages:** 0–4 = 1 · 5–12 = 0 · 13–17 = 0 · 18–40 = 3 · 41–60 = 1 · 61+ = 6.
- **Cash vs insurance:** GOPED = 9 · NO GOP = 1 · Not sent = 1 → 9 insurance / 2 cash.
- **Hotels:** Pharaoh Azur × 2, Tropitel × 2, Kaisol Romance × 3, Mina Mark, Dana Beach, Steigenberger Aqua Magic, Pick Albatros Resort × 1 each.
- **Gender:** 6F / 5M.
- **Diagnoses:** free-text multi-system descriptions — see "What is intentionally not shown" below.

### German monthly volume — supplementary years (real)
- **2023:** total 303. Monthly Jan–Dec = 24, 9, 28, 26, 16, 35, 30, 27, 27, 27, 39, 15.
- **2026 YTD:** total 86. Monthly Jan–May = 23, 11, 22, 22, 8.

### 2023 hotels (real)
HMC generic × 53, Tropital × 3, Romance × 1. Hotel-level granularity only became consistent from 2024 onwards.

---

## 2. What is extrapolated (intentionally NOT used in primary charts)

The brief in `DATA_UPDATE_2023_2026.md` proposed extrapolating 2023 diagnosis / age / length-of-stay percentages from the 2024–2025 patterns. **We chose not to render that as a primary chart.**

Reasoning:
1. The 2023 Excel sheet (`master_sheet_tayb.xlsx`, sheet "ورقة1") **does not include** Diagnosis, DOB, or Discharge Date columns for ADAC rows.
2. Extrapolating 2024–2025 percentages onto 2023 would inflate the apparent denominator without adding real information.
3. ADAC executives explicitly value transparency; a chart that says "n=209 admissions across 4 years" when 53 of those 209 are synthesized counts is more risky than the cleaner "n=156 · 2024–2025".

Where 2023 / 2026 are relevant, they appear as **supplementary context** (4-year context card + 4-year ADAC monthly heatmap), labelled distinctly, never silently merged into the headline clinical charts.

---

## 3. What is intentionally not shown (and why)

| Item | Reason |
|---|---|
| 2023 diagnosis breakdown | No Diagnosis column in 2023 source. |
| 2023 age distribution | No DOB column in 2023 source. |
| 2023 length of stay | No Discharge Date column in 2023 source. |
| 2023 cash / insurance split | No Case Status column in 2023 source. |
| 2026 length of stay | `Master_Sheet_New.xlsm` does not include a Discharge Date column for ADAC rows. |
| 2026 diagnosis coded to the 13 categories | 2026 source diagnoses are free-text multi-system descriptions; coding them to the 2024–2025 13-category schema would be a judgment call, not a measurement. |
| 4-year insurance-share denominator (e.g. "16.6% of 1,612") | Brief proposed it. We chose to wait until 2023 + 2026 *insured German* subsets are explicitly extracted, rather than mix totals with insured subsets. |

---

## 4. Charts updated in Phase 2.4H

| Chart | Update |
|---|---|
| §3.1 YearlyVolumeChart | Population label clarified to `n=268 cases · 2023 + 2024 + 2025 + 2026 YTD`. Data window chip `Historical 2023–2026 · 2026 YTD (Jan–May)`. 2026 bar continues to render with the lighter / dashed YTD treatment. |
| §3.1 page (composed) | Now renders `YearlyVolumeChart` + a new `ADACMonthlyHeatmap4Year` on the same route. |
| **NEW** `ADACMonthlyHeatmap4Year` | 4 rows × 12 months. Real data. Footnote about insurance-paid vs total. |
| §3.2 GermanMonthlyHeatmap | Transparency note added: 2023 / 2026 monthly data exists but is reported in the 4-Year Context card rather than folded into the primary 2024–2025 heatmap. |
| §3.3 DiagnosisProfile | Transparency note: 2023 has no diagnosis column; 2026 free-text is not coded. Stays n=156. |
| §3.4 FinancialDonuts | Transparency note: 2023 has no Case Status column; 2026 shows 9/2 — headline split stays 2024–2025. |
| §3.5 AdmissionProfile | Transparency note: stays n=156. |
| §3.6 AgeDistribution | Transparency note: 2026 ages extracted (1/0/0/3/1/6) but not merged into the n=156 headline. |
| §3.7 LengthOfStay | Transparency note: no Discharge Date column in 2023 or 2026 sources. |
| §3.8 MarketShareHero | Transparency note: 20.37% stays calibrated to the 2024–2025 insured-German window. |

## 5. New components

| File | Purpose |
|---|---|
| `src/components/charts/ADACMonthlyHeatmap4Year.tsx` | Supplementary 4-row × 12-month heatmap. |
| `src/components/charts/YearlyVolumePage.tsx` | Composed §3.1 page = bar chart + 4-year monthly heatmap. |
| `src/components/sections/data-room/FourYearContextCard.tsx` | "4-Year Partnership Context" card on `/section/data-room`. |

## 6. New / updated data file fields

`src/content/adac-data.json` and `public/data/adac-data.json` now expose a **`historicalContext2023_2026`** block with:
- `yearlyVolume` (4-year bar source-of-truth)
- `adacMonthly` (4-row heatmap source-of-truth)
- `germanMonthly2023`, `germanMonthly2026YTD`
- `adac2026YTDClinical` (real n=11 breakdown)
- `adac2023Clinical` (volume + hotels only — flags everything else as unavailable)
- `fourYearSummary` (narrative metadata)

All previously existing fields (`yearlyADAC`, `combined2024_2025`, `financialMix`, `germanMonthly`, `germanVolume`, `admissionProfile`, `diagnosisProfile`, `ageProfile`, `lengthOfStay`, `marketShare`, `section3HeroStats`) are **unchanged** — primary 2024–2025 analysis is preserved exactly.

## 7. Charts that intentionally stayed 2024–2025

§3.3 DiagnosisProfile, §3.5 AdmissionProfile, §3.6 AgeDistribution, §3.7 LengthOfStay, §3.4 FinancialDonuts, §3.8 MarketShareHero, §3.2 GermanMonthlyHeatmap.

Each carries a `transparencyNote` explaining the choice. ADAC sees the reasoning on the chart, not buried in a footnote.

## 8. Next steps if more 2023 / 2026 source data is provided

If a future export adds Diagnosis / DOB / Discharge Date columns to the 2023 records, we can:
- extend §3.3 / §3.6 / §3.7 to a 4-year view (with the existing n=156 also visible)
- compute a real 4-year insured-German denominator and update §3.8 with a confirmed secondary metric
- compute 2023 + 2026 length-of-stay distributions

Until then, the safe pattern is: real volume + seasonality + hotels in supplementary 4-year views; primary clinical charts stay calibrated to the 2024–2025 admission set where the source data is complete.
