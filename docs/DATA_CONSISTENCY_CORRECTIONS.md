# ⚠️ DATA CONSISTENCY CORRECTIONS — READ BEFORE BUILDING SECTION 3

## CRITICAL

The numbers in the previous prompt (`CLAUDE_CODE_EXPANSION_PROMPT.md`) contained errors that would CONFLICT with the official ADAC Partnership Overview PDF already presented to ADAC in 2025.

**ADAC has already seen the official numbers.** Any presentation that contradicts those numbers will damage credibility. Use ONLY the corrected numbers below.

---

## CORRECTED DATA (USE THESE — NOT THE OLD BRIEF NUMBERS)

### ADAC Total Case Volume (PDF-verified, OFFICIAL)

| Year | Cases | Notes |
|------|-------|-------|
| 2023 | 57    | From internal data |
| 2024 | **103** | Includes 31 cash + 72 insurance |
| 2025 | **97**  | Includes 13 cash + 84 insurance |
| 2026 | 11    | YTD as of May 2026 (first 5 months only) |
| **Total** | **268** | Across 4 years |

**Use these EXACT numbers in:**
- Section 3 hero number → "268 ADAC cases over 4 years" (or "200 over 2 years" if focusing on 2024-2025)
- Section 3.1 Year-by-Year chart bars
- Any "total" or "annual" reference anywhere in the app

### ADAC Year-by-Year Breakdown (Cash + Insurance)

```json
{
  "yearlyADAC": [
    { "year": 2023, "total": 57, "cash": null, "insurance": null, "note": "Split not available" },
    { "year": 2024, "total": 103, "cash": 31, "insurance": 72 },
    { "year": 2025, "total": 97, "cash": 13, "insurance": 84 },
    { "year": 2026, "total": 11, "cash": null, "insurance": null, "note": "YTD" }
  ],
  "grandTotal": 268,
  "combined2024_2025": { "total": 200, "cash": 44, "insurance": 156 }
}
```

### ADAC Cash vs Insurance Split (PDF verified)

```json
{
  "adacFinancialMix": {
    "2024": { "cash": 31, "insurance": 72, "total": 103, "cashPct": 30, "insurancePct": 70 },
    "2025": { "cash": 13, "insurance": 84, "total": 97,  "cashPct": 13, "insurancePct": 87 },
    "combined": { "cash": 44, "insurance": 156, "total": 200, "cashPct": 22, "insurancePct": 78 }
  },
  "insight": "Insurance share grew from 70% to 87% in 2025 — ADAC is increasingly insurer-driven"
}
```

---

## MONTHLY DISTRIBUTION — IMPORTANT CLARIFICATION

The monthly heatmap data I previously included was based on **insurance-only ADAC cases** (which was incomplete). The official PDF only shows monthly distribution for **all German patients** (not just ADAC), which was:

### German Cases (NOT ADAC-only) — Monthly Distribution 2024-2025

```json
{
  "germanMonthlyHeatmap": {
    "Jan":  { "2024": 8,   "2025": 40 },
    "Feb":  { "2024": 20,  "2025": 27 },
    "Mar":  { "2024": 28,  "2025": 34 },
    "Apr":  { "2024": 34,  "2025": 35 },
    "May":  { "2024": 34,  "2025": 43 },
    "Jun":  { "2024": 47,  "2025": 47 },
    "Jul":  { "2024": 49,  "2025": 43 },
    "Aug":  { "2024": 55,  "2025": 71 },
    "Sep":  { "2024": 63,  "2025": 58 },
    "Oct":  { "2024": 101, "2025": 57 },
    "Nov":  { "2024": 60,  "2025": 62 },
    "Dec":  { "2024": 53,  "2025": 58 }
  },
  "totals": { "2024": 552, "2025": 575 }
}
```

**Use this for the heatmap in Section 3.2.** The chart title should be "**German Patient Monthly Volume**" (NOT "ADAC monthly volume"). This matches the PDF.

For ADAC-specific monthly data, only year-over-year totals (103, 97, etc.) should be shown — not month-by-month for ADAC alone.

---

## GERMAN PATIENT VOLUME — VERIFIED (KEEP AS IS)

```json
{
  "germanVolume": {
    "2024": 552,
    "2025": 575,
    "total": 1127,
    "marketShareOfHMC": {
      "2024": "23%",
      "2025": "27%"
    }
  }
}
```
✅ **No conflict** — matches PDF exactly.

---

## ADAC ADMISSION PROFILE — VERIFIED (KEEP AS IS)

156 admissions across 2024-2025:

```json
{
  "admissionProfile": {
    "totalAdmissions": 156,
    "normalRoom": { "count": 116, "pct": 74.36 },
    "icu": { "count": 24, "pct": 15.38 },
    "majorSurgery": { "count": 5, "pct": 3.21 },
    "skilledSurgery": { "count": 4, "pct": 2.56 },
    "advancedSurgery": { "count": 3, "pct": 1.92 },
    "minorSurgery": { "count": 3, "pct": 1.92 },
    "mediumSurgery": { "count": 1, "pct": 0.64 }
  }
}
```
✅ **No conflict** — matches PDF exactly.

**Note:** 156 admissions out of 200 total = 78% admission rate. The other 22% (44 cases) were outpatient. This is important for Section 4.

---

## ADAC DIAGNOSIS PROFILE — VERIFIED (KEEP AS IS)

Based on 156 admitted cases:

```json
{
  "diagnosisProfile": [
    { "category": "Gastrointestinal / Abdomen", "count": 61, "pct": 39.10 },
    { "category": "Respiratory / Chest Infection", "count": 34, "pct": 21.79 },
    { "category": "Trauma & Orthopedics", "count": 23, "pct": 14.74 },
    { "category": "General Medicine", "count": 8, "pct": 5.13 },
    { "category": "General Surgery", "count": 7, "pct": 4.49 },
    { "category": "Cardiovascular / Blood Pressure", "count": 6, "pct": 3.85 },
    { "category": "Vascular (DVT/Phlebitis)", "count": 5, "pct": 3.21 },
    { "category": "Dehydration / Electrolytes / AKI", "count": 3, "pct": 1.92 },
    { "category": "Neurology", "count": 3, "pct": 1.92 },
    { "category": "Urology / Renal", "count": 2, "pct": 1.28 },
    { "category": "Skin & Soft Tissue Infection", "count": 2, "pct": 1.28 },
    { "category": "ENT", "count": 1, "pct": 0.64 },
    { "category": "Fever / Sepsis", "count": 1, "pct": 0.64 }
  ]
}
```
✅ **No conflict** — matches PDF exactly.

---

## ADAC AGE DISTRIBUTION — VERIFIED (KEEP AS IS)

```json
{
  "ageProfile": [
    { "group": "0–4 Infants",       "count": 3,  "pct": 1.90 },
    { "group": "5–12 Children",     "count": 4,  "pct": 2.60 },
    { "group": "13–17 Adolescents", "count": 2,  "pct": 1.30 },
    { "group": "18–40 Young Adults", "count": 18, "pct": 11.50 },
    { "group": "41–60 Middle Age",  "count": 32, "pct": 20.50 },
    { "group": "61+ Seniors",       "count": 97, "pct": 62.20 }
  ]
}
```
✅ **No conflict** — matches PDF exactly.

---

## ADAC LENGTH OF STAY — VERIFIED (KEEP AS IS)

```json
{
  "lengthOfStay": [
    { "days": 1,  "count": 77, "pct": 49.36 },
    { "days": 2,  "count": 53, "pct": 33.97 },
    { "days": 3,  "count": 8,  "pct": 5.13 },
    { "days": 4,  "count": 2,  "pct": 1.28 },
    { "days": 5,  "count": 5,  "pct": 3.21 },
    { "days": 6,  "count": 1,  "pct": 0.64 },
    { "days": 7,  "count": 3,  "pct": 1.92 },
    { "days": 9,  "count": 3,  "pct": 1.92 },
    { "days": 11, "count": 1,  "pct": 0.64 },
    { "days": 12, "count": 1,  "pct": 0.64 },
    { "days": 13, "count": 1,  "pct": 0.64 },
    { "days": 15, "count": 1,  "pct": 0.64 }
  ],
  "insight": "83% of admissions discharged within 48 hours"
}
```
✅ **No conflict** — matches PDF exactly.

---

## INSURANCE MARKET SHARE — CRITICAL CONSTRAINT

The original ADAC PDF listed ALL competitor insurance companies (Allianz, Euro Center, Deutsche Assistance, HUK Coburg, Roland, etc.) and showed ADAC as #1 with 20.37%.

**However, the owner has explicitly instructed: DO NOT show competitor names in the new presentation.**

### What to show instead

```json
{
  "adacMarketShare": {
    "totalInsuredGermanCases_2024_2025": 766,
    "adacCases": 156,
    "adacShare": "20.37%",
    "rank": "#1",
    "phrasing": "ADAC accounts for approximately 1 in every 5 insured German patients treated at HMC, making it the largest single German insurance partner in our portfolio."
  }
}
```

✅ Show: "ADAC = #1 German insurance partner / 20.37% share"
❌ Do NOT show: ranked list with Allianz, Euro Center, etc.

Use a single large hero stat: **"20.37%"** with supporting text **"of insured German cases at HMC come through ADAC"**.

---

## UPDATED SECTION 3 SUMMARY STATS (for hero cards)

```json
{
  "section3HeroStats": [
    { "value": "268",   "label": "ADAC cases 2023–2026" },
    { "value": "200",   "label": "Cases in 2024–2025 alone" },
    { "value": "1,127", "label": "Total German patients 2024–2025" },
    { "value": "20.37%","label": "ADAC share of insured German cases" }
  ]
}
```

---

## VERIFICATION CHECKLIST FOR CLAUDE CODE

Before finalizing Section 3 and all its sub-topics, verify:

- [ ] ADAC total = **268 cases** (not 223 from old brief)
- [ ] ADAC 2024 = **103** (not 72)
- [ ] ADAC 2025 = **97** (not 83)
- [ ] Combined 2024-2025 = **200** (not 155)
- [ ] Cash/Insurance split matches PDF exactly
- [ ] Monthly heatmap labeled as "German Patients" (not "ADAC")
- [ ] No competitor insurance names appear anywhere
- [ ] ADAC market share shown as 20.37% / #1
- [ ] All numbers reconcile with the official ADAC Partnership Overview PDF

---

## INSTRUCTIONS FOR CLAUDE CODE

1. **Replace** the data in `CLAUDE_CODE_EXPANSION_PROMPT.md` Section "ADAC Partnership Data" with the corrected values above.

2. **Update** all JSON content files in `src/content/` to reflect these correct numbers.

3. **When building Section 3 charts**, use the corrected breakdown:
   - Yearly chart: 57 (2023) → 103 (2024) → 97 (2025) → 11 (2026 YTD)
   - Cash/Insurance donut: 22% / 78%
   - Admission donut: 78% admitted, 22% outpatient

4. **Section 3 hero number** should be either:
   - "268" with "ADAC cases over 4 years" subtitle, OR
   - "200" with "ADAC cases across 2024-2025" subtitle (matches PDF framing best)

5. **Cross-reference with the PDF** if uncertain. The PDF is the source of truth for 2024-2025 numbers.
