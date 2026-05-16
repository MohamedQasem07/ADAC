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
| 2.4E | Optional Partnership theme system (CSS-var scaffold + Section 3 chart opt-ins) |
| **2.4E.2** | **Real Partnership visual mode + on-screen theme switcher + hotkey removed + console cleanup (this commit)** |

## 3. Current key features

- **Welcome cover (§1):** HMC × ADAC partnership lockup with animated entry, ambient gold radial glow (Premium Navy) or strong HMC blue + ADAC yellow side glows (Partnership), theme-aware connector × glyph.
- **Executive Data Room (`/section/data-room`):** KPI strip, mini chart grid, coverage strip, package framework grid, decisions summary — one-page board view; theme-aware end-to-end.
- **Section 3 dashboard:** 9 full charts (Yearly, Heatmap, Diagnosis, Financial donut, Admission, Age, LoS, Market share, German volume) with `n=X` subtitles + insight panels. **All 9 charts are theme-aware in 2.4E.2** (previously 4/9 — the holdouts DiagnosisProfile, AdmissionProfile, AgeDistribution, LengthOfStay, GermanVolumeSummary were migrated to `useThemeChartColors`).
- **Section 12 catalogue:** 9-category 3×3 grid → drill-down to category details → package modal. PricingMatrix at `/section/12/12.10`. Theme-aware borders, code, hover, price chip.
- **Presenter Control Mode (hidden):** `Ctrl/Cmd+Shift+E` overlay or `/control` standalone. Tabs: Slide Text · Package Catalogue · Pricing · **Theme** · Import/Export · Reset.
- **Hidden pricing scenarios (`Ctrl/Cmd + 1/2/3`):** A = "To be agreed", B = standard, C = round(B × 1.8 / 10) × 10. 4×4 px corner dot indicator only — never a label.
- **Theme system (2.4E + 2.4E.2):** Premium Navy default + optional HMC × ADAC Partnership theme (now a real alternate visual mode — background, sidebar, cards, CTAs, charts, package catalogue, and Data Room all shift). See §4.
- **On-screen Visual Theme switcher (2.4E.2):** Tiny glass button top-right of every audience page (hidden on `/control`). Click → 2-row dropdown with checkmark on the active theme. Silent switch — no toast.
- **Hotkeys:** `→/←` slides · `↓/↑` subtopics · `M` sidebar · `F` fullscreen · `Cmd/Ctrl+F` package search · `Cmd/Ctrl+B` sidebar · `Cmd/Ctrl+Shift+E` Control Mode · `?` cheatsheet · `Esc` close. **The `Ctrl/Cmd+Shift+T` theme hotkey was removed in 2.4E.2** (browser/system conflict). Theme switching is now via the top-right switcher, Control Mode → Theme tab, or the console rollback command.

## 4. Theme system (Phase 2.4E.2 — real dual-brand visual mode)

- **Two themes:**
  - `premium-navy` — gold + deep navy + ice. The default. Visually unchanged from the pre-2.4E live look.
  - `partnership` — HMC blue (`#0F6FE5`) + ADAC yellow (`#FFCC00`, the official Gelber Engel yellow) + medical cyan + subtle HMC red. Opt-in only. **Now a real alternate visual mode** — background gradient, sidebar surface + active row, cards, CTAs, badges, all 9 §3 charts, mini Data Room charts, KPI strip, package catalogue, modals, search overlay, breadcrumbs, sidebar header, ambient welcome glow, and the on-screen switcher itself all shift between themes.
- **Default:** Premium Navy. Any fresh visitor sees the current (pre-2.4E) look.
- **localStorage key:** `hmc-adac-visual-theme-v1`
- **Three ways to switch (Phase 2.4E.2 — no hotkey):**
  1. **Top-right on-screen Visual Theme switcher** — tiny glass icon button (`Sliders` icon, `aria-label="Visual Theme"`). Click → 2-row dropdown with checkmark on the active theme. Click a row → instant silent switch + dropdown closes. Hidden on `/control`. z-index 45 (above slide content, below modal overlays).
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
  Defensive: invalid values are wiped and the app falls back to Premium Navy. Removing the key entirely also returns to Premium Navy.
- **No flash of unstyled content:** a tiny inline script in `src/app/layout.tsx` `<head>` reads the storage key and sets `data-theme` on `<html>` pre-hydration.
- **Architecture:** Two layers, both required:
  1. **CSS custom properties** on `:root` (Premium Navy values) overridden by `[data-theme='partnership']` in `src/app/globals.css` — `--theme-accent`, `--theme-accent-rgb`, `--theme-cta-*`, `--theme-glow-hmc`, `--theme-glow-adac`, `--theme-page-bg-gradient`, `--theme-sidebar-*`, `--theme-card-*`, `--theme-badge-*`, `--theme-chart-*`, plus literal brand tokens `--theme-hmc-blue` / `--theme-hmc-red` / `--theme-adac-yellow`. `html, body { background: var(--theme-page-bg-gradient); }` is what makes the page background visibly shift.
  2. **Tailwind `theme` color token** in `tailwind.config.ts` mapped to `rgb(var(--theme-accent-rgb) / <alpha-value>)` so utilities like `text-theme/40`, `border-theme/50`, `bg-theme/10` work with Tailwind's standard opacity modifier syntax. Audience-facing components use `text-theme` / `border-theme` instead of `text-gold` / `border-gold`.
- **Why the 2.4E partnership theme looked invisible (root cause):** the original implementation only swapped CSS variables, but ~374 hardcoded Tailwind classes (`bg-navy-deep`, `text-gold`, `border-gold/40`, `from-gold`, `text-gold-soft`, `bg-gold/10`) bypassed them entirely. 2.4E.2 fixes this by (a) adding the `theme` Tailwind token, (b) mass-converting `*-gold*` → `*-theme*` in every audience-facing layout, and (c) adding inline `style={{ ... var(--theme-...)}}` for the patterns that need translucency or color-mix.
- **Files for the theme system (2.4E.2):**
  - `src/context/VisualThemeContext.tsx` — provider only; **the hotkey listener and the `emitHotkeyToast` call were removed in 2.4E.2**.
  - `src/components/layout/ThemeSwitcher.tsx` — **new in 2.4E.2** (top-right on-screen switcher).
  - `src/components/layout/PresentationShell.tsx` — mounts `<ThemeSwitcher />` alongside `<MenuButton />` and `<Sidebar />`.
  - `src/components/control/ThemeTab.tsx` — Theme tab UI (Control Mode); copy updated to mention the on-screen switcher and drop the old hotkey kbd.
  - `src/lib/theme-colors.ts` — `useThemeChartColors`, `getThemeChartColors` (unchanged).
  - `src/app/globals.css` — full CSS variable token set + theme-aware body bg gradient.
  - `src/app/layout.tsx` — pre-hydration script (unchanged).
  - `tailwind.config.ts` — adds `theme` color (alpha-aware).
  - Theme-aware audience-facing components (~30): `Sidebar`, `MenuButton`, `Breadcrumb`, `AmbientBackground`, `WelcomeCover`, `PartnershipLockup`, `OverviewSection`, `MarkdownSection`, `EditorialLayout`, `CardsLayout`, `FlowLayout`, `GridLayout`, `KpiHeroLayout`, `TimelineLayout`, `HeroSection`, `DashboardOverview`, `PackageCatalogueOverview`, `SampleReportCard`, `SubTopicGrid`, `PlaceholderSection`, `NetworkMap`, `KpiStrip`, `ChartFrame`, `InsightPanel`, all 9 §3 charts (full + mini), `DataRoomPage`, `DataRoomCoverage`, `DataRoomDecisions`, `DataRoomPackages`, `DataRoomCharts`, `CategoryGrid`, `PackageCard`, `PackageModal`, `PriceBadge`, `PricingMatrix`, `CategoryDetail`, `SearchOverlay`.
- **Section 3 charts** — all 9 are now theme-aware (no more "where safe" holdouts).

### 4.1 Known external requests

A `GET https://mohamedqasem07.github.io/ADAC.txt?... 404` appears in some console sessions on the live URL. **It is not from the app code.** Grep across the codebase for `ADAC.txt`, `.txt'`, `fetch(`, service worker, manifest, robots.txt, and analytics SDK returns zero matches. The only network request the app issues is `fetch('${BASE_PATH}/data/adac-data.json')` and `/data/packages.json` in `src/lib/data-loader.ts`, both `*.json`. The 404 originates from a browser extension or browser-side feature (page-translation probe, site-checker, or similar) requesting `<basePath>.txt`. Safe to ignore. To confirm on demand: reproduce in an Incognito window with all extensions disabled — the 404 should disappear.

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

- Latest deployed commit before 2.4E.2: `Phase 2.4E — Optional HMC ADAC partnership theme` (CSS-var scaffold only; partnership theme was barely visible because most components used hardcoded `*-gold*` Tailwind classes).
- Phase 2.4E.2 commits on top with message `Phase 2.4E.2 — Real partnership visual theme mode`. Latest commit hash will be appended below after push.
- Route count after 2.4E.2: unchanged (no new routes — the on-screen switcher and the palette refactor are in-place changes).
- GitHub Action `deploy.yml`: builds on push to `main`, uploads `out/` to Pages.
- Live URL: `https://mohamedqasem07.github.io/ADAC/` — returns 200 on root + every static route.

## 9. Recommended next steps (post-meeting or final dress-rehearsal)

1. **Partnership theme visual QA on the projector.** Toggle via the top-right Visual Theme switcher and walk every screen at 1920×1080 and 1366×768 to confirm yellow CTA legibility and blue/yellow glow balance.
2. **Catalogue redesign pass.** Optional — package cards could get a second-pass typographic refinement; currently functional and on-brand.
3. **Projector QA on the actual meeting hardware.** Hurghada venue check: contrast, type sizing, particle density, fullscreen with `F`.
4. **Presenter notes update.** `docs/PRESENTER_NOTES_ADAC.md` was last touched at the 2.4B handoff — append theme-switch instructions before the meeting.
5. **Final rehearsal mode.** Walk the deck end-to-end with the Control Mode + scenarios + theme in the order Mohamed plans to use them on the day.
6. **§2.5 Reputation placeholder → real screenshots.** Drop verified Google Reviews PNGs into `public/reviews/` and update `section-02e-reputation.md`.

## 10. Prompt for the next Claude Code session

> Read `PROJECT_HANDOFF.md` at the repo root first — that's the cold-start brief for this deck.
>
> Context: HMC × ADAC partnership proposal, ADAC executive meeting 19 May 2026 in Hurghada, live at `https://mohamedqasem07.github.io/ADAC/`. The deck is feature-complete through Phase 2.4E.2 (Real Partnership Visual Theme + On-Screen Switcher + Console Cleanup). All locked numbers, locked rules, and current architecture are documented in the handoff.
>
> Before doing anything that touches numbers, competitor names, IBANs, fake reviews, scenario labels, or the Lenis disable: stop and confirm. Those are explicit, non-negotiable locks.
>
> Default theme is Premium Navy; the Partnership theme is opt-in via the top-right on-screen Visual Theme switcher or via Control Mode → Theme tab. localStorage key is `hmc-adac-visual-theme-v1`. There is no theme keyboard shortcut — `Ctrl/Cmd+Shift+T` was removed in 2.4E.2 (browser conflict).
>
> What I'd like you to work on: [describe the task here].
