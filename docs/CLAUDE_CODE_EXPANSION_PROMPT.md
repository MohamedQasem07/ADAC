# HMC × ADAC — Full Presentation Vision (Expansion Brief)

## STATUS

You've already started building the Next.js application for the **Package Catalogue** section based on `CLAUDE_CODE_WEB_APP_PROMPT.md`. That work is excellent and stays — it becomes **just one section** of a much bigger presentation.

This document expands the scope from "package catalogue" to "complete 18-section interactive presentation" that runs the entire 90-minute ADAC meeting.

---

## NEW VISION

The presentation has **18 main sections** (top-level). Each section can have **multiple sub-topics** the user drills into during the meeting. Think of it as:

```
Section 1: Welcome              ← top-level slide, single screen
   └─ no sub-topics

Section 2: About HMC            ← top-level slide
   ├─ Sub-topic 2.1: Our History
   ├─ Sub-topic 2.2: Our Locations
   ├─ Sub-topic 2.3: Our Team
   └─ Sub-topic 2.4: Our Equipment

Section 3: Our Partnership Data  ← top-level slide with KPI summary
   ├─ Sub-topic 3.1: Year-by-Year Volume (interactive chart)
   ├─ Sub-topic 3.2: Monthly Heatmap
   ├─ Sub-topic 3.3: Diagnosis Profile
   ├─ Sub-topic 3.4: Age Distribution
   ├─ Sub-topic 3.5: Admission Profile
   └─ Sub-topic 3.6: Length of Stay
...
Section 12: Package Catalogue   ← what you already built
   ├─ Sub-topic 12.1: Category 1 (GI + IV)
   ├─ Sub-topic 12.2: Category 2 (Respiratory)
   ├─ ... (9 categories total)
```

Total expected scope: **18 sections × 3-6 sub-topics each = 70-90 distinct content screens**.

---

## CRITICAL ARCHITECTURAL REQUIREMENT: WORD-LIKE EDITABILITY

This is the **most important new requirement**. The owner needs to be able to edit text content as easily as editing a Word document.

### Implementation Strategy

**All content lives in editable JSON/Markdown files. NO content is hardcoded in React components.**

```
src/content/
├── sections.json                  ← Master section list + ordering
├── section-01-welcome.md          ← Welcome message (Markdown — easy to edit)
├── section-02-about-hmc.md
├── section-02a-history.md
├── section-02b-locations.json     ← Structured data (locations array)
├── section-02c-team.md
├── section-02d-equipment.json     ← Structured equipment list
├── section-03-partnership-data.json   ← All ADAC numbers
├── section-03a-yearly-volume.json
├── section-03b-monthly-heatmap.json
├── section-03c-diagnoses.json
├── section-04-...
...
├── packages.json                  ← Existing package catalogue
```

### Why JSON + Markdown?
- **Markdown for text-heavy sections** — owner can edit with any text editor or even GitHub web UI
- **JSON for structured data** — tables, charts, lists, KPIs
- **Both are version-controlled** — Mohamed can see every edit, roll back if needed
- **No code knowledge required** — the structure is clear

### Components Become Renderers
Each React component just **reads from these files** and renders. Changing text means editing the markdown file — no rebuild needed if using Next.js incremental static regeneration, or `npm run build` for static export.

Example:
```typescript
// src/components/Section.tsx
import { getSectionContent } from '@/lib/content-loader';

export function Section({ id }: { id: string }) {
  const content = getSectionContent(id);
  return <MarkdownRenderer content={content.body} />;
}
```

### Hot-Reload Edit Workflow
- Owner opens `src/content/section-02-about-hmc.md` in VS Code
- Edits the headline, paragraph, anything
- Saves the file
- Page auto-refreshes in development mode (`npm run dev`)
- For production: edit on GitHub → push → GitHub Actions rebuilds and deploys

---

## THE 18 SECTIONS — COMPLETE LIST

### Section 1 — Welcome / Cover
- **Single screen, no sub-topics**
- Hero: "Partnership Proposal" eyebrow + main title
- HMC logo, date, prepared for
- Subtle particle background
- "Press → to begin" indicator

### Section 2 — About HMC
- **Top-level screen:** Big "10 Locations · 24/7 · 5+ Years · 4 Languages" hero numbers
- **Sub-topics:**
  - 2.1 Our Story (history, founding)
  - 2.2 Our Network (10 locations with interactive map)
  - 2.3 Our Team (doctors, nurses, languages)
  - 2.4 Our Equipment (portable medical kit detailed)
  - 2.5 Our Reputation (Google Reviews #1 in Hurghada + 5-10 review screenshots)

### Section 3 — Our Partnership Track Record with ADAC
- **Top-level screen:** Single hero number — "230" or "200 ADAC cases over 2024–2026"
- **Sub-topics (all data-rich, like Power BI):**
  - 3.1 Year-by-Year Volume (animated bar chart 2023, 2024, 2025, 2026 — exclude 2022)
  - 3.2 Monthly Distribution (heatmap of all months × years)
  - 3.3 Seasonality Patterns
  - 3.4 Cash vs Insurance Split (pie chart)
  - 3.5 Admission vs Outpatient Mix
  - 3.6 Diagnosis Profile (top categories with bars)
  - 3.7 Age Distribution (senior-dominant)
  - 3.8 Length of Stay Analysis
  - 3.9 ADAC Share of German Market (19% of HMC's German volume)

### Section 4 — Why Outpatient Packages Matter for ADAC
- **Top-level:** 4-card layout (Predictable / Fast / Documented / Reduced Admission)
- **Sub-topics:**
  - 4.1 The Travel Medicine Challenge
  - 4.2 The Cost Predictability Problem
  - 4.3 How Flat Rates Solve This
  - 4.4 Patient Experience Benefit

### Section 5 — Geographic Coverage & Reach
- **Top-level:** Interactive map (the SVG one)
- **Sub-topics:**
  - 5.1 Hurghada Cluster (6 clinics, hotel coverage)
  - 5.2 Sahl Hasheesh Cluster (3 clinics)
  - 5.3 Safaga + Marsa Alam Extension
  - 5.4 Hotel Access Capability ("we enter any hotel")
  - 5.5 Response Time by Zone

### Section 6 — Service Delivery Modes
- **Top-level:** 3 modes side-by-side
- **Sub-topics:**
  - 6.1 Mode A: Clinic Visit (in detail)
  - 6.2 Mode B: Hotel Room Visit (with equipment list)
  - 6.3 Mode C: Mobile Clinic Unit (deployed to hotel gates)

### Section 7 — Patient Journey
- **Top-level:** 7-step horizontal flow
- **Sub-topics:**
  - 7.1 Case Notification
  - 7.2 Triage Protocol
  - 7.3 Service Assignment Decision Tree
  - 7.4 Treatment Delivery
  - 7.5 Documentation
  - 7.6 Invoice & Reporting
  - 7.7 Follow-up

### Section 8 — Medical Triage Workflow
- **Top-level:** Flowchart diagram
- **Sub-topics:**
  - 8.1 Initial Assessment
  - 8.2 Severity Classification
  - 8.3 Routing Logic (which mode/clinic)
  - 8.4 Escalation Criteria (red flags)

### Section 9 — Service Quality & SLA Commitments
- **Top-level:** 4 KPI cards (15min, 30min, 45min, <3hrs)
- **Sub-topics:**
  - 9.1 Response Time Commitments
  - 9.2 Communication Channels
  - 9.3 Reporting Cadence
  - 9.4 Quality Metrics

### Section 10 — Documentation Standards
- **Top-level:** Sample report preview
- **Sub-topics:**
  - 10.1 Medical Report Template (full sample)
  - 10.2 Invoice Format
  - 10.3 Same-Day Case Summary
  - 10.4 Monthly Performance Report

### Section 11 — Escalation Protocol
- **Top-level:** Red flags 2×5 grid
- **Sub-topics:**
  - 11.1 Clinical Red Flags
  - 11.2 Ambulance Activation
  - 11.3 ER Coordination
  - 11.4 Communication During Escalation

### Section 12 — Package Catalogue (YOUR EXISTING WORK)
- **Top-level:** 9 category cards (3×3 grid)
- **Sub-topics:**
  - 12.1 GI & IV Therapy (14 packages)
  - 12.2 Respiratory (7 packages)
  - 12.3 Wound Care (10 packages, 4 sub-sections)
  - 12.4 Trauma & Orthopedic (8 packages)
  - 12.5 ENT (6 packages)
  - 12.6 Dental (5 packages)
  - 12.7 Allergic & Skin (5 packages)
  - 12.8 Eye (3 packages)
  - 12.9 Cardiac (4 packages)
- **Pricing scenarios A/B/C remain (Cmd+1/2/3)**

### Section 13 — Pricing Philosophy
- **Top-level:** Mission statement
- **Sub-topics:**
  - 13.1 Calibrated for Reasonable Pricing
  - 13.2 What's Always Included
  - 13.3 What's Quoted Separately
  - 13.4 Currency & Payment Terms

### Section 14 — Implementation Roadmap
- **Top-level:** 4-phase timeline (May → Oct 2026)
- **Sub-topics:**
  - 14.1 May 2026 — Agreement Phase
  - 14.2 June 2026 — Preparation Phase
  - 14.3 Jul-Sep 2026 — Pilot Phase
  - 14.4 October 2026 — Joint Review

### Section 15 — Benefits for ADAC
- **Top-level:** 6-benefit grid
- **Sub-topics:**
  - 15.1 Cost Predictability
  - 15.2 Faster Claims Processing
  - 15.3 Reduced Disputes
  - 15.4 Patient Experience Quality
  - 15.5 Geographic Coverage
  - 15.6 Single Point of Contact

### Section 16 — Benefits for ADAC AG Holders (Patients)
- **Top-level:** Patient journey emphasis
- **Sub-topics:**
  - 16.1 Easy Access
  - 16.2 Hotel-Room Service
  - 16.3 Language Support
  - 16.4 Trust & Reviews

### Section 17 — Discussion Points
- **Top-level:** 9 numbered discussion points
- **Sub-topics:**
  - 17.1 Package Scope
  - 17.2 Pricing Finalization
  - 17.3 Reporting Format
  - 17.4 Approval Workflows
  - 17.5 Escalation Rules
  - 17.6 Transportation Policy
  - 17.7 Invoice Format
  - 17.8 Communication Protocol
  - 17.9 Pilot Scope

### Section 18 — Closing & Next Steps
- **Single screen, no sub-topics**
- Hero statement
- 3 numbered next steps
- Thank you + contact info

---

## ADAC PARTNERSHIP DATA (FOR SECTION 3 — ALREADY VERIFIED)

The data below comes from the previous analysis and the official "ADAC Partnership Overview" PDF. Use these EXACT numbers in Section 3 and its sub-topics.

### ADAC Cases by Year (use 2023, 2024, 2025, 2026 — EXCLUDE 2022)
```json
{
  "yearlyADAC": [
    { "year": 2023, "cases": 57 },
    { "year": 2024, "cases": 72 },
    { "year": 2025, "cases": 83 },
    { "year": 2026, "cases": 11, "note": "YTD (first 5 months)" }
  ],
  "totalCases": 223
}
```

### Monthly Distribution Matrix (heatmap data)
```json
{
  "monthlyHeatmap": {
    "Jan":  { "2023": 7, "2024": 1, "2025": 4, "2026": 4 },
    "Feb":  { "2023": 0, "2024": 6, "2025": 5, "2026": 1 },
    "Mar":  { "2023": 2, "2024": 2, "2025": 6, "2026": 4 },
    "Apr":  { "2023": 8, "2024": 2, "2025": 2, "2026": 2 },
    "May":  { "2023": 1, "2024": 5, "2025": 8, "2026": 0 },
    "Jun":  { "2023": 8, "2024": 7, "2025": 8, "2026": null },
    "Jul":  { "2023": 6, "2024": 8, "2025": 3, "2026": null },
    "Aug":  { "2023": 7, "2024": 8, "2025": 10, "2026": null },
    "Sep":  { "2023": 4, "2024": 12, "2025": 9, "2026": null },
    "Oct":  { "2023": 3, "2024": 7, "2025": 7, "2026": null },
    "Nov":  { "2023": 9, "2024": 7, "2025": 12, "2026": null },
    "Dec":  { "2023": 2, "2024": 7, "2025": 9, "2026": null }
  }
}
```

### German Patient Volume (verified from PDF)
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

### ADAC Cash vs Insurance Split
```json
{
  "adacFinancialMix": {
    "2024": { "cash": 31, "insurance": 72, "total": 103 },
    "2025": { "cash": 13, "insurance": 84, "total": 97 },
    "combined": { "cash": 44, "insurance": 156, "total": 200, "cashPct": 22, "insurancePct": 78 }
  }
}
```

### ADAC Admission Profile (156 admissions 2024-2025)
```json
{
  "admissionProfile": {
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

### ADAC Diagnosis Profile (156 cases)
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

### ADAC Age Distribution
```json
{
  "ageProfile": [
    { "group": "0–4 Infants", "count": 3, "pct": 1.90 },
    { "group": "5–12 Children", "count": 4, "pct": 2.60 },
    { "group": "13–17 Adolescents", "count": 2, "pct": 1.30 },
    { "group": "18–40 Young Adults", "count": 18, "pct": 11.50 },
    { "group": "41–60 Middle Age", "count": 32, "pct": 20.50 },
    { "group": "61+ Seniors", "count": 97, "pct": 62.20 }
  ]
}
```

### ADAC Length of Stay
```json
{
  "lengthOfStay": [
    { "days": 1, "count": 77, "pct": 49.36 },
    { "days": 2, "count": 53, "pct": 33.97 },
    { "days": 3, "count": 8, "pct": 5.13 },
    { "days": 4, "count": 2, "pct": 1.28 },
    { "days": 5, "count": 5, "pct": 3.21 },
    { "days": 6, "count": 1, "pct": 0.64 },
    { "days": 7, "count": 3, "pct": 1.92 },
    { "days": 9, "count": 3, "pct": 1.92 },
    { "days": 11, "count": 1, "pct": 0.64 },
    { "days": 12, "count": 1, "pct": 0.64 },
    { "days": 13, "count": 1, "pct": 0.64 },
    { "days": 15, "count": 1, "pct": 0.64 }
  ],
  "insight": "83% of admissions discharged within 48 hours"
}
```

---

## NAVIGATION & UX FOR SUB-TOPICS

### Top-Level Navigation
- Side panel (collapsible) showing all 18 sections
- Each section in the side panel can expand to reveal sub-topics
- Keyboard: `←` `→` move between top-level sections
- Click section in sidebar to jump

### Sub-Topic Navigation
- When user enters a section, they see the **top-level screen**
- A subtle "Explore details ↓" indicator appears at bottom
- Pressing `↓` arrow or clicking the indicator reveals sub-topic list as cards
- Each sub-topic card → click to drill into that sub-topic
- Within sub-topic: `←` `→` cycles through sub-topics of the same section
- `Esc` returns to section top-level

### Breadcrumb
- Always show: `Section X · Sub-topic Y` at top of screen
- Clickable to navigate back up

---

## DATA-VIZ SUB-TOPICS (Section 3 specifically)

These sub-topics in Section 3 must feel like **Power BI / Tableau dashboards** — interactive, animated, polished.

### 3.1 Year-by-Year Volume
- **Animated bar chart**: 2023 (57) → 2024 (72) → 2025 (83) → 2026 (11 YTD)
- Bars grow from 0 on entry (Framer Motion)
- Hover on bar shows tooltip with breakdown
- Annotation: "46% growth 2023→2025"

### 3.2 Monthly Heatmap
- **12×4 grid** (months × years)
- Cell color intensity based on case count (light gold → deep gold)
- Hover shows exact count
- Annotation: "Peak season: Aug-Nov + Jan/Feb"

### 3.3 Diagnosis Profile
- **Horizontal bar chart** of 13 diagnosis categories
- Sorted by count (gastro at top with 39%)
- Bars animate in left-to-right
- Color coding by clinical group

### 3.4 Cash vs Insurance Split
- **Animated donut chart**: 78% Insurance / 22% Cash
- Center shows total: 200 cases
- Both years (2024 + 2025) side-by-side mini-donuts

### 3.5 Admission Profile
- **Stacked horizontal bar**: 74% Normal Room | 15% ICU | 10% Surgery
- Animated proportions

### 3.6 Age Distribution
- **Vertical bar chart** by age group
- 62% seniors highlighted
- Annotation: "Senior-dominant portfolio = higher medical complexity"

### 3.7 Length of Stay
- **Histogram**: days on X-axis, count on Y-axis
- Annotation: "83% discharged within 48 hours"

### 3.8 ADAC Share of German Market
- **Big hero stat**: "19%" in Georgia 120pt gold
- Subtitle: "of HMC's German patient volume"
- Three supporting stat cards: 161 ADAC / 847 total German / 1,262 over 5 years

### Animation Library
- **Recharts** for all charts
- **Framer Motion** for entry/exit
- **CountUp** for big numbers (already in your plan)

---

## EDITABILITY PRINCIPLE — DETAILED EXAMPLES

### Example 1: Owner wants to change the welcome message
- Owner opens `src/content/section-01-welcome.md` in any text editor
- Edits the markdown:
  ```markdown
  ---
  title: "Welcome to HMC"
  eyebrow: "Partnership Proposal"
  date: "19 May 2026"
  ---
  
  We are pleased to welcome the ADAC team back to Egypt.
  This presentation outlines our proposal for...
  ```
- Saves the file
- Browser auto-reloads
- Done.

### Example 2: Owner wants to add a new HMC location
- Owner opens `src/content/section-02b-locations.json`
- Adds a new entry to the locations array:
  ```json
  {
    "id": "loc-11",
    "name": "New Hurghada Clinic",
    "zone": "Hurghada",
    "coords": [27.18, 33.85],
    "services": ["GP", "ER", "Labs"]
  }
  ```
- Saves
- The map auto-updates, the locations list auto-updates, everything stays in sync

### Example 3: Owner wants to change a package price
- Owner opens `src/content/packages.json`
- Edits the price object:
  ```json
  { "code": "HMC-GI-01", ..., "prices": { "A": "To be agreed", "B": "210", "C": "380" } }
  ```
- Saves
- Pricing matrix, package cards, everywhere — all updated

### Example 4: Owner wants to add a new sub-topic to Section 7
- Owner opens `src/content/sections.json`
- Adds a new entry under section 7:
  ```json
  {
    "id": "7.8",
    "title": "Quality Assurance",
    "content": "section-07h-quality.md"
  }
  ```
- Creates `src/content/section-07h-quality.md` with content
- New sub-topic appears in navigation automatically

---

## TECH STACK ADDITIONS

Building on what you already have, add:
- **react-markdown** (`npm i react-markdown remark-gfm`) — renders markdown content
- **gray-matter** (`npm i gray-matter`) — parses frontmatter in MD files
- **next-mdx-remote** (optional, for richer markdown with embedded React)

---

## REVISED FILE STRUCTURE

```
hmc-adac-presentation/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Section 1 (Welcome)
│   │   └── [section]/[[...sub]]/page.tsx  ← Dynamic routing
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        ← 18-section nav
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── KeyboardNav.tsx
│   │   ├── sections/
│   │   │   ├── SectionFrame.tsx
│   │   │   ├── SubTopicGrid.tsx
│   │   │   └── ...
│   │   ├── charts/
│   │   │   ├── YearlyVolumeChart.tsx
│   │   │   ├── MonthlyHeatmap.tsx
│   │   │   ├── DiagnosisProfile.tsx
│   │   │   └── ...
│   │   ├── ui/
│   │   │   └── (shadcn components)
│   │   └── pricing/
│   │       ├── PackageCard.tsx
│   │       └── PricingMatrix.tsx
│   ├── content/                   ← EDITABLE BY OWNER
│   │   ├── sections.json
│   │   ├── section-01-welcome.md
│   │   ├── section-02-*.md
│   │   ├── ... (all 70-90 content files)
│   │   ├── packages.json
│   │   ├── adac-data.json
│   │   └── locations.json
│   ├── lib/
│   │   ├── content-loader.ts      ← Reads MD/JSON
│   │   ├── pricing-context.tsx    ← Cmd+1/2/3 scenarios
│   │   └── nav-config.ts
│   └── types/
│       └── content.ts
├── public/
│   ├── hmc-logo-white.png
│   └── hmc-logo-color.png
└── package.json
```

---

## BUILD PLAN (RESUME FROM WHERE YOU ARE)

1. **You've already started:** Continue with the foundation (layout, routing, pricing context).

2. **Refactor content loading** — Before building more components, set up the markdown/JSON content loader. This is the foundation for editability.

3. **Build the sidebar** with all 18 sections + sub-topic expansion.

4. **Build the SectionFrame component** that wraps every section consistently.

5. **Build SubTopicGrid** — the "explore details" reveal mechanism.

6. **Start with Section 3 (Partnership Data)** — this is the most data-rich and impressive section. Use the JSON data above. Build all 8 sub-topic charts.

7. **Then Section 2 (About HMC)** — including the interactive map.

8. **Then Section 12 (Packages)** — what you already built fits here.

9. **Fill in the remaining sections** using markdown content files.

10. **Polish the animations** — focus on entry transitions, chart reveals, sub-topic drill-downs.

---

## ANIMATION REMINDERS

- Every chart must animate in (bars grow, lines draw)
- Every number uses CountUp
- Page transitions are smooth horizontal slides
- Sub-topic reveals slide up from bottom
- All hover states have gold border glow
- Background particles always running on dark sections
- No animation should exceed 1.5 seconds for entry (keep snappy)

---

## DELIVERABLE

A Next.js application with:
- ✅ 18 main sections + 60+ sub-topics
- ✅ All content in editable Markdown/JSON files
- ✅ Hidden pricing scenarios (Cmd+1/2/3) preserved
- ✅ Interactive Power BI-style data visualizations in Section 3
- ✅ Side panel navigation with expand/collapse
- ✅ Keyboard navigation throughout
- ✅ Premium animations and cinematic feel
- ✅ Deployable as static site to GitHub Pages
- ✅ Hot-reload on content edits during development

When complete, Mohamed can:
1. Run `npm run dev` and present from his laptop
2. Or open the deployed GitHub Pages URL
3. Edit any content by editing markdown/JSON files
4. Use keyboard to navigate the meeting smoothly
5. Drill into sub-topics for detailed discussions
6. Switch pricing scenarios secretly with Cmd+1/2/3

Now resume the build with this expanded scope.
