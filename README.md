# HMC × ADAC — Partnership Proposal

Cinematic interactive presentation for the ADAC executive meeting on **19 May 2026** in Hurghada. Replaces a static PDF/PowerPoint deck.

## Run it

```bash
npm install
npm run dev          # open http://localhost:3000
```

Production build (static export for GitHub Pages):

```bash
npm run build        # produces ./out
npx serve out        # preview locally at localhost:3000/ADAC/
```

## Deploy

The repo is configured to deploy automatically to GitHub Pages via `.github/workflows/deploy.yml` when pushed to the `main` branch of `github.com/mohamedqasem07/ADAC`.

**First-time setup:**
1. Make sure the GitHub repo exists and is **public** (required for GitHub Pages on the free tier).
2. In repo Settings → Pages, set source to **GitHub Actions**.
3. `git push -u origin main` from this directory.

Live URL when deployed: `https://mohamedqasem07.github.io/ADAC/`

## Keyboard shortcuts

| Key | Action |
|---|---|
| `→` `←` | Next / previous section or subtopic |
| `↓` | Reveal subtopic grid (when at section top) |
| `↑` `Esc` | Back up one level |
| `Home` | Jump to cover |
| `Ctrl + B` | Toggle sidebar |
| `Ctrl + F` | Open package search overlay |
| `Ctrl + 1 / 2 / 3` | Switch pricing scenario (HIDDEN) |
| `?` | Show keyboard cheatsheet |

The hidden Ctrl+1/2/3 toggle changes the 4×4 px corner dot color (gold/blue/teal) — audience can't see it from across the room.

## Editing content

All content lives in `src/content/`. **Never edit React components to change copy.**

- `sections.json` — master nav: order of sections, subtopics, renderer mapping
- `section-*.md` — markdown with frontmatter (title, eyebrow, subtitle, layout)
- `packages.json` — 65 packages × 3 pricing scenarios (verified against PDF)
- `adac-data.json` — every chart number in §3 (verified against ADAC Partnership Overview PDF)

For mid-meeting hotfixes (typo in a price, wrong number on a chart), edit the matching file in `public/data/` on GitHub — the deployed deck fetches that at runtime over the bundled defaults. No rebuild required, just hard-reload the browser.

## Drop your real HMC logo

Put `hmc-logo-white.png` at `public/brand/hmc-logo-white.png` and the cover + closing will use it automatically. Until then, a Playfair "HMC" typographic fallback renders so the deck is never blocked.

## What's inside

- **18 sections × ~70 subtopics** — 107 static routes
- **Section 3 dashboard** — 9 Recharts visualizations with verified ADAC data (268 cases / 200 in analysis window / 1,127 German / 20.37% market share rank #1). Every chart shows its `n=X · window` population to avoid conflation.
- **Section 12 catalogue** — all 65 packages across 9 categories with PDF wording, scenario-aware pricing, package modal, Ctrl+F search.
- **Section 2.2 Red Sea map** — hand-illustrated SVG with 10 numbered pins, coastline draw-in, pin drop with bounce + pulse-glow, click-to-detail side panel.
- **Cinematic motion** — Lenis smooth scroll at root, blur+scale+slide page transitions, CountUp on every number, ambient particle drift on dark sections, scroll-into-view stagger reveals, gold-glow on §3.8 hero, +70% growth arrow on §3.1, gold-confetti burst on §18 closing.

## Tech stack

Next.js 14 App Router (TypeScript) · Tailwind CSS · Framer Motion · GSAP · Lenis · @react-spring/web · Recharts · lucide-react · react-markdown · gray-matter · canvas-confetti · react-countup · Inter + Playfair Display.

Static export, no Supabase, no API routes, no auth, no DB.

## License

Internal. Not for redistribution.
