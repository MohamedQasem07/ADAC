# HMC × ADAC — Project Handoff

> Cold-start brief for the next Claude Code session working on this deck.

## 1. Project identity

- **Name:** HMC × ADAC Partnership Proposal (interactive presentation)
- **Repo:** `https://github.com/mohamedqasem07/ADAC`
- **Live URL:** `https://mohamedqasem07.github.io/ADAC/`
- **Local working directory:** `D:\ADAC Meeting`
- **Meeting date:** 19 May 2026 (Hurghada)
- **Audience:** ADAC executives
- **Owner:** Mohamed Qasem (`mohamedqasem436@gmail.com`)
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Recharts · `output: 'export'` static export deployed via GitHub Actions to GitHub Pages under `basePath: '/ADAC'`. No backend, no API routes, no DB.

## 2. Completed phases

| Phase | Scope |
|---|---|
| 1 | Initial cinematic scaffold (18 sections × ~70 subtopics, sidebar, hotkeys, hidden pricing scenarios, Section 3 dashboard) |
| 2 | Meeting-ready content backfill, MenuButton, LayoutAware renderers, PricingMatrix, 16:9 map |
| 2.2 | Contrast pass on projector-readable text |
| 2.3 | Presentation Overview agenda + Decision Points + closing outcome |
| 2.4A | Hidden Presenter Control Mode (`/control` + `Ctrl/Cmd+Shift+E`), Lenis disabled, mouse-wheel fix |
| 2.4B | Executive Data Room (`/section/data-room`) — single board-grade dashboard |
| 2.4C | Sidebar overlap fix, Executive Data Room polish |
| 2.4D | Welcome page redesign (HMC × ADAC partnership lockup) |
| 2.4D.2 | Welcome opening logo animation rebuild |
| **2.4E** | **Optional Partnership theme system (this commit)** |

## 3. Current key features

- **Welcome cover (§1):** HMC × ADAC partnership lockup with animated entry, ambient gold radial glow (Premium Navy) or blue+yellow side glows (Partnership), theme-aware connector × glyph.
- **Executive Data Room (`/section/data-room`):** KPI strip, mini chart grid, coverage strip, package framework grid, decisions summary — one-page board view.
- **Section 3 dashboard:** 9 full charts (Yearly, Heatmap, Diagnosis, Financial donut, Admission, Age, LoS, Market share, German volume) with `n=X` subtitles + insight panels.
- **Section 12 catalogue:** 9-category 3×3 grid → drill-down to category details → package modal. PricingMatrix at `/section/12/12.10`.
- **Presenter Control Mode (hidden):** `Ctrl/Cmd+Shift+E` overlay or `/control` standalone. Tabs: Slide Text · Package Catalogue · Pricing · **Theme** · Import/Export · Reset.
- **Hidden pricing scenarios (`Ctrl/Cmd + 1/2/3`):** A = "To be agreed", B = standard, C = round(B × 1.8 / 10) × 10. 4×4 px corner dot indicator only — never a label.
- **Theme system (this phase):** Premium Navy default + optional HMC × ADAC Partnership theme. See §4.
- **Hotkeys:** `→/←` slides · `↓/↑` subtopics · `M` sidebar · `F` fullscreen · `Cmd/Ctrl+F` package search · `Cmd/Ctrl+B` sidebar · `Cmd/Ctrl+Shift+E` Control Mode · `Cmd/Ctrl+Shift+T` toggle theme · `?` cheatsheet · `Esc` close.

## 4. Theme system (Phase 2.4E)

- **Two themes:**
  - `premium-navy` — gold + deep navy + ice. The default.
  - `partnership` — HMC blue (`#2F80ED`) + ADAC yellow (`#FFD200`) + medical cyan + subtle red. Opt-in only.
- **Default:** Premium Navy. Any fresh visitor sees the current (live, pre-2.4E) look.
- **localStorage key:** `hmc-adac-visual-theme-v1`
- **Three ways to switch:**
  1. `Ctrl/Cmd + Shift + T` toggles (emits a "Visual Theme: …" toast).
  2. Control Mode → Theme tab → click a card.
  3. Manual console:
     ```js
     localStorage.setItem('hmc-adac-visual-theme-v1', 'partnership');
     location.reload();
     ```
- **Console rollback (if anything looks wrong):**
  ```js
  localStorage.setItem('hmc-adac-visual-theme-v1', 'premium-navy');
  location.reload();
  ```
  Defensive: invalid values are wiped and the app falls back to Premium Navy.
- **No flash of unstyled content:** a tiny inline script in `src/app/layout.tsx` `<head>` reads the storage key and sets `data-theme` on `<html>` pre-hydration.
- **Architecture:** CSS custom properties on `:root` (default Premium Navy values) overridden by `[data-theme='partnership']` in `src/app/globals.css`. Audience-facing accents consume the vars via inline `style={{ background: 'var(--theme-accent)' }}` or via `useThemeChartColors()` for Recharts.
- **Files for the theme system:**
  - `src/context/VisualThemeContext.tsx` (provider + hotkey)
  - `src/lib/theme-colors.ts` (`useThemeChartColors`, `getThemeChartColors`)
  - `src/components/control/ThemeTab.tsx` (Theme tab UI)
  - `src/app/globals.css` (CSS variables)
  - `src/app/layout.tsx` (pre-hydration script)
  - `src/components/layout/PresentationShell.tsx` (provider mount point)
  - Theme-aware components: `WelcomeCover.tsx`, `PartnershipLockup.tsx`, `Sidebar.tsx` (Exec pill), `PriceBadge.tsx`, `PricingMatrix.tsx`, `CategoryGrid.tsx`, `YearlyVolumeChart.tsx`, `FinancialDonuts.tsx`, `MarketShareHero.tsx`, `GermanMonthlyHeatmap.tsx`, `DataRoomCharts.tsx`.
- **Section 3 charts intentionally NOT migrated** (stay gold under both themes): `DiagnosisProfile`, `AdmissionProfile`, `AgeDistribution`, `LengthOfStay`, `GermanVolumeSummary`. This is the "where safe" restraint — keeps the partnership theme from looking too colorful.

## 5. Critical locked rules

- **Numbers are locked.** Never change: `268` (ADAC cases total) · `57/103/97/11` (yearly) · `200` (analysis window) · `44/156` (cash/insurance) · `1,127` (German patients) · `20.37%` (market share) · `78%` (insurance combined 2024–25) · `22%` (cash combined).
- **No competitor insurer names anywhere.** No Allianz, Euro Center, Deutsche Assistance, HUK, Roland, HanseMerkur, MD Medicus, R+V, Malteser, etc.
- **No IBAN, SWIFT, or bank details on projected slides.**
- **No fake reviews / invented review counts / fake reputation claims.** §2.5 is a "Reputation evidence to be inserted" placeholder.
- **No scenario A/B/C labels visible to audience.** Only the corner-dot indicator. Pricing Discussion Readiness card is text-only and audience-safe.
- **No Lenis re-enable.** Smooth scroll was removed in 2.4A to fix mouse-wheel; native scroll stays.
- **No backend.** No Supabase, no API routes, no login, no DB, no analytics, no telemetry.
- **No new heavy libraries.** Recharts + Framer Motion + Lucide cover the entire deck.
- **Tone:** "travelers" not "ADAC patients"; "AG Holders" not "members"; "target" not "guaranteed".

## 6. Locked numbers (canonical)

| Metric | Value | Source |
|---|---|---|
| ADAC cases 2023–2026 | **268** | `fallbackADACData.yearlyADAC` |
| ADAC cases 2024–2025 (analysis window) | **200** | `fallbackADACData.financialMix.combined.total` |
| Cash combined | **44 cases · 22%** | same |
| Insurance combined | **156 cases · 78%** | same |
| ADAC admissions 2024–2025 | **156** | `diagnosisProfile`, `admissionProfile` populations |
| German patients 2024–2025 | **1,127** | `germanMonthly` totals |
| ADAC share of insured German cases | **20.37%** | `marketShare.adacShare` |
| Yearly breakdown | 2023=57 · 2024=103 · 2025=97 · 2026=11 (YTD) | `yearlyADAC` |
| Admission profile | Normal Room 74% · ICU 15% · Surgery ~10% | `admissionProfile` |
| Length of stay | 83% within 48h | `lengthOfStay` |
| Age profile | 62% seniors (61+) · 82% over 40 | `ageProfile` |
| Catalogue | **65** packages across **9** categories | `fallbackPackagesData` |

## 7. Important files

| Path | Purpose |
|---|---|
| `src/content/sections.json` | Master nav — all 18 sections + subtopics |
| `src/content/section-*.md` + `*.json` | All human-readable content (markdown frontmatter + JSON cards) |
| `src/data/fallback.ts` | Locked ADAC numbers + 65-package fallback |
| `src/context/PricingContext.tsx` | Hidden Cmd+1/2/3 scenario state |
| `src/context/PresentationOverridesContext.tsx` | Control Mode localStorage edits |
| `src/context/VisualThemeContext.tsx` | Theme state + Cmd+Shift+T hotkey |
| `src/lib/theme-colors.ts` | `useThemeChartColors()` palette resolver |
| `src/app/globals.css` | CSS variables for both themes |
| `src/app/layout.tsx` | Pre-hydration theme script |
| `src/components/layout/PresentationShell.tsx` | Provider mount order, MenuButton, Sidebar, Breadcrumb |
| `src/components/layout/Sidebar.tsx` | Section navigation |
| `src/components/control/ControlPanel.tsx` | Presenter Control Mode UI |
| `src/components/control/ThemeTab.tsx` | Theme switcher inside Control Mode |
| `src/components/sections/WelcomeCover.tsx` | §1 cover |
| `src/components/sections/DataRoomPage.tsx` | Executive Data Room (`/section/data-room`) |
| `src/components/packages/CategoryGrid.tsx` | §12 9-category grid |
| `src/components/packages/PricingMatrix.tsx` | §12.10 |
| `src/components/charts/*.tsx` | §3 charts (full) |
| `src/components/sections/data-room/DataRoomCharts.tsx` | Mini chart variants for the dashboard |
| `.github/workflows/deploy.yml` | GitHub Pages CI |
| `next.config.mjs` | `output: 'export'`, `basePath: '/ADAC'` |

## 8. Last known build/deploy state

- Latest commit before this phase: `12e0ac2 — Phase 2.4D.2 — Welcome opening logo animation rebuild`
- Phase 2.4E will commit on top with message `Phase 2.4E — Optional HMC ADAC partnership theme`.
- Route count after 2.4E: unchanged from previous build (no new routes — theme system is overlay-only).
- GitHub Action `deploy.yml`: builds on push to `main`, uploads `out/` to Pages.
- Live URL: `https://mohamedqasem07.github.io/ADAC/` — returns 200 on root + every static route.

## 9. Recommended next steps (post-meeting or final dress-rehearsal)

1. **Partnership theme visual QA on the projector.** Toggle with `Ctrl/Cmd + Shift + T` and walk every screen at 1920×1080 and 1366×768 to confirm yellow CTA legibility and blue/yellow glow balance.
2. **Catalogue redesign pass.** Optional — package cards could get a second-pass typographic refinement; currently functional and on-brand.
3. **Projector QA on the actual meeting hardware.** Hurghada venue check: contrast, type sizing, particle density, fullscreen with `F`.
4. **Presenter notes update.** `docs/PRESENTER_NOTES_ADAC.md` was last touched at the 2.4B handoff — append theme-switch instructions before the meeting.
5. **Final rehearsal mode.** Walk the deck end-to-end with the Control Mode + scenarios + theme in the order Mohamed plans to use them on the day.
6. **§2.5 Reputation placeholder → real screenshots.** Drop verified Google Reviews PNGs into `public/reviews/` and update `section-02e-reputation.md`.

## 10. Prompt for the next Claude Code session

> Read `PROJECT_HANDOFF.md` at the repo root first — that's the cold-start brief for this deck.
>
> Context: HMC × ADAC partnership proposal, ADAC executive meeting 19 May 2026 in Hurghada, live at `https://mohamedqasem07.github.io/ADAC/`. The deck is feature-complete through Phase 2.4E (Optional Partnership Theme System). All locked numbers, locked rules, and current architecture are documented in the handoff.
>
> Before doing anything that touches numbers, competitor names, IBANs, fake reviews, scenario labels, or the Lenis disable: stop and confirm. Those are explicit, non-negotiable locks.
>
> Default theme is Premium Navy; the Partnership theme is opt-in via `Ctrl/Cmd + Shift + T` or via Control Mode → Theme tab. localStorage key is `hmc-adac-visual-theme-v1`.
>
> What I'd like you to work on: [describe the task here].
