# HMC × ADAC — Premium Interactive Web Presentation

## YOUR MISSION

Build a **cinematic, board-grade interactive web application** that Hurghada Medical Center (HMC) will use to present a partnership proposal to **ADAC Versicherung AG and ARC Group** on **19 May 2026**. This is not a website. This is a presentation tool that runs the entire 90-minute meeting.

The user will project this on a large screen during the meeting. ADAC executives will be in the room. The web app must:

1. **Visually impress** from the first second — premium animations, motion design, cinematic feel
2. **Function as a complete pitch deck** — navigate forward/backward through sections like slides
3. **Allow the user to silently switch between hidden pricing scenarios** during the meeting if needed

This is the most important deliverable. Take your time. Use the best of every technology available.

---

## CONTEXT & BACKGROUND

The user (Mohamed Ramadan, Financial Director at HMC) has been working on this partnership for months. ADAC's Head of Medical Provider Management (Jörg Hédiard) is coming to Egypt specifically to discuss this. The previous attempts at static PowerPoints felt generic and weren't impressive enough. Mohamed needs a **technology-forward, premium experience** that signals HMC is a sophisticated partner.

The meeting goal: convince ADAC to consolidate their Red Sea outpatient case file with HMC under a flat-rate package framework.

---

## TECHNICAL STACK (REQUIRED)

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + custom CSS for advanced animations
- **Animations:** Framer Motion (essential — this is what makes it cinematic)
- **Charts:** Recharts for data visualizations
- **Icons:** Lucide React
- **UI Primitives:** shadcn/ui (Button, Dialog, Sheet, Tabs, Tooltip)
- **Fonts:** Inter (body), Playfair Display or Cormorant (display headers — gives a premium editorial feel)
- **Deployment:** Build for production (`npm run build`); user will run locally with `npm run start` or deploy to Vercel

Project name: `hmc-adac-presentation`

---

## DESIGN LANGUAGE — "NORDIC PREMIUM MEDICAL"

Think of this aesthetic intersection:
- **Stripe.com** (clean technology premium)
- **Apple Health iOS** (medical clarity with warmth)
- **Linear.app** (dark mode sophistication)
- **The Economist print** (editorial typography respect)

### Color Palette (use exact hex values)
```css
--navy-deep: #0A1929;       /* Backgrounds */
--navy: #0D1B2A;            /* Cards on dark */
--navy-medium: #1B3A5C;     /* HMC brand */
--royal-blue: #2E75B6;      /* Accents */
--teal: #0096B4;            /* Secondary */
--gold: #C9A961;            /* Premium accent */
--gold-soft: #E0C988;       /* Hover states */
--white: #FFFFFF;
--ice: #F4F8FC;             /* Light section bg */
--text-dark: #0F1B2D;
--text-medium: #4A5568;
--text-soft: #7A8B9D;
```

### Typography Scale
- **Hero numbers (data):** Playfair Display, 96-128px, weight 700, slight letter-spacing-tight
- **Section titles:** Playfair Display, 48-64px, weight 600
- **Subtitle:** Inter, 20-24px, weight 400, text-soft color
- **Body:** Inter, 16-18px, weight 400, leading-relaxed
- **Labels/captions:** Inter, 12-14px, weight 500, uppercase tracking-wide

### Visual Motifs (use throughout)
1. **Thin gold horizontal lines (2px)** as section dividers — like luxury print magazine design
2. **Subtle gold corner accents** on premium cards (top-left + bottom-right corners only)
3. **Floating particle backgrounds** on hero sections — slow-moving white/gold dots, very subtle
4. **Soft radial gradients** behind major numbers (gold glow at 5% opacity)
5. **Glass morphism** on overlay cards (backdrop-blur with semi-transparent navy)
6. **Generous whitespace** — premium feel comes from breathing room, not density

### What to AVOID
- ❌ Generic blue corporate look
- ❌ Heavy shadows
- ❌ Rounded buttons everywhere (use sharp corners for premium feel — slight 4-6px rounding only)
- ❌ Emojis as section icons (use proper Lucide icons or custom SVG)
- ❌ Excessive bold text
- ❌ Brigand color palettes — keep restraint

---

## CINEMATIC ANIMATION REQUIREMENTS

These are non-negotiable. The "wow factor" comes from motion design:

### On Page Load (Cover Screen)
1. **Logo fade-in** from opacity 0 → 1 over 1.5s with subtle scale (0.95 → 1.0)
2. **Title text** animates in with stagger: each word from `translateY(40px) opacity-0` to settled, 80ms delay between words
3. **Background particles** start drifting (very slow, 30-60s drift cycles)
4. **Gold underline** draws from left to right over 1.2s
5. **Subtitle** fades in last with slight delay

### On Section Transition
- **Pages slide horizontally** with overlap effect (current page slides left, new page slides in from right with 100ms overlap)
- **Background color shifts** smoothly between dark/light sections
- **Stagger animations** on grid items (cards animate in one by one, 60ms delays)

### On Data Reveal (Charts, Big Numbers)
- **CountUp animation** for all hero numbers (animate from 0 → final value over 2s with ease-out)
- **Chart bars/lines** draw progressively (left to right or bottom up)
- **Numbers count up** as user scrolls into view

### On Interaction
- **Hover states** with smooth scale (1.0 → 1.02) and gold border glow
- **Card click** triggers smooth expand-to-fullscreen animation
- **Package detail modal** slides up from bottom with backdrop blur fade-in

### Background Effects (Always Running)
- **Slow gold particle field** on dark sections (use canvas or framer-motion, 20-30 particles, very low opacity)
- **Subtle gradient mesh** that slowly rotates behind hero sections (10° rotation over 60s)

---

## CRITICAL FEATURE: HIDDEN PRICING SCENARIO TOGGLE

This is the most important interactive feature. Mohamed will be presenting and may need to switch pricing on the fly.

### Requirements
- **Three pricing scenarios stored in code:**
  - **Scenario A: "Negotiation Mode"** — All prices show "To be agreed" instead of EUR amounts
  - **Scenario B: "Standard"** — Lower price range (200-500 EUR — exactly as in the PDF catalogue)
  - **Scenario C: "Premium"** — Higher price range (multiply each price by 1.8x, so 360-900 EUR)

### How to Trigger (HIDDEN from audience)
- **Keyboard shortcut only:** `Cmd+1` / `Cmd+2` / `Cmd+3` (or `Ctrl+1/2/3` on Windows) switches between scenarios
- **Visual indicator:** A tiny dot in the bottom-left corner (4×4 pixels) changes color subtly. Color codes: gold=A, blue=B, teal=C. Audience won't notice but Mohamed will know which scenario is active.
- **NEVER show "Scenario A/B/C" labels visibly in the UI**
- **NEVER show buttons to switch scenarios**
- **Default:** Scenario B (Standard) loads on first visit
- **Persist in localStorage** so it remembers across reloads
- **Smooth crossfade** when switching — prices fade out → new prices fade in (500ms)

### Implementation Detail
```typescript
// Store in a context
const PricingContext = createContext<'A' | 'B' | 'C'>('B');

// Each package has three prices:
{
  code: 'HMC-GI-01',
  name: 'Mild Gastroenteritis — Oral Management',
  prices: { A: 'To be agreed', B: '200', C: '360' },
  // ...
}
```

---

## CONTENT STRUCTURE (10 SECTIONS)

Navigation is via:
1. **Top floating nav bar** (minimal, just section dots + arrows)
2. **Keyboard:** Arrow keys (left/right) to navigate between sections
3. **Click section dots** in nav bar

### Section 1: Cover / Hero
- Full-screen dark navy
- HMC name in elegant typography
- "Partnership Proposal" eyebrow text in gold
- Main title: "Outpatient Medical Care, Reimagined for ADAC"
- Subtitle: "A complete flat-rate framework for the Red Sea region"
- Date: "19 May 2026 · Hurghada, Egypt"
- Animated gold particles drifting in background
- Subtle "Press → to begin" indicator at bottom (auto-hides after 5 seconds)

### Section 2: Executive Summary
- 4 hero stat cards in 2×2 grid:
  - **10** Clinical Locations
  - **24/7** Operations
  - **5+ Years** Serving ADAC AG Holders
  - **EN / DE / AR / RU** Languages
- Each card with CountUp animation on first view
- Below: 2-paragraph executive summary text
- Right edge: a vertical timeline showing "Today → Pilot → Full Rollout"

### Section 3: HMC Network Coverage (Interactive Map)
- **Custom SVG illustrated map** of the Red Sea region showing:
  - Safaga (top)
  - Hurghada (middle)
  - Sahl Hasheesh (lower middle)
  - Marsa Alam (bottom)
- **10 numbered pins** for the 10 HMC locations, color-coded by zone
- **Hover on pin** → tooltip shows location name
- **Click on pin** → side panel slides in with full details (services offered, photo placeholder, hours)
- Map should be hand-illustrated style (NOT a Google Maps screenshot)
- Animated coastline (subtle wave motion)
- 10 locations with coordinates:
  1. Soma Bay Clinic (Safaga zone) — teal
  2. Pharaoh Azure Hotel (Hurghada) — navy
  3. Minamark Hotel (Hurghada) — navy
  4. Sheraton Hotel Branch (Hurghada) — navy
  5. Al-Kawther Branch (Hurghada) — navy
  6. Tourist Promenade Clinic 1 (Hurghada) — navy
  7. Tourist Promenade Clinic 2 (Hurghada) — navy
  8. Sahl Hasheesh Medical Center (Sahl Hasheesh) — gold
  9. Kay Soul Romance Clinic (Sahl Hasheesh) — gold
  10. Sahl Hasheesh Medical Center 2 (Sahl Hasheesh) — gold

### Section 4: Service Delivery Modes
- 3 large cards in horizontal layout, each with animated icon:
  - **Mode A — Clinic Visit:** Patient attends one of HMC's 10 locations across Hurghada, Sahl Hasheesh, Safaga & Marsa Alam
  - **Mode B — Hotel Room Visit:** HMC doctor and nursing team travel to the patient's hotel with portable equipment & medications
  - **Mode C — Mobile Clinic Unit:** Fully equipped mobile clinic deployed to hotel Gates & Receptions for cases requiring extended observation or multiple simple interventions
- Each card has subtle hover effect (gold border glow)
- Below: "Mode of delivery does not change package price"

### Section 5: Package Architecture Overview
- **9 category cards** in a 3×3 grid (or scrollable)
- Each card shows:
  - Number badge (1-9)
  - Category code (GI, RX, WD, etc.)
  - Category name
  - Sub-package count
  - Price range (changes based on active pricing scenario)
- **Click any card** → navigates to that category's detail page (Section 6-14)

The 9 categories:
1. Gastroenteritis, GI Conditions & IV Therapy (14 packages)
2. Respiratory Conditions (7 packages)
3. Wound Care & Suturing (10 packages)
4. Trauma & Orthopedic (8 packages)
5. ENT (6 packages)
6. Dental Emergency (5 packages)
7. Allergic & Skin (5 packages)
8. Eye Conditions (3 packages)
9. Cardiac Outpatient (4 packages)

### Section 6-14: Category Detail Pages (one per category)
Each category page has:
- **Hero header** with category number, code, title, intro paragraph
- **Sub-section dividers** (some categories have A/B/C/D subsections)
- **Package cards** in 2-column grid, each showing:
  - Code (gold, small)
  - Name (bold)
  - "What's Included" (small text)
  - Price badge (large, prominent, animated on scroll)
- **Click any package card** → modal opens with full details
- **Escalation note** (if applicable) at bottom in amber-tinted box
- **Back button** to return to overview

ALL package data with all three pricing scenarios (A/B/C) is at the bottom of this prompt.

### Section 15: Pricing Summary Matrix
- Full table of all 9 categories with:
  - Category name
  - Price range (current scenario)
  - Most common package
  - Most common package price
- Highly polished table design, alternating row colors
- Scrollable if needed

### Section 16: Standard Terms
- Clean, editorial layout
- Sections: Inclusions / Mode of Service / Pre-authorization / Escalation / Currency & Payment
- Each as a clean card with icon

### Section 17: Closing / Next Steps
- Dark navy background, full-screen
- Hero statement: "Together, ADAC and HMC can deliver Germany's gold-standard for tourist medical care in the Red Sea."
- 3 numbered next steps:
  1. Agree on package scope today
  2. Launch a 3-month pilot starting July 2026
  3. Review and scale based on outcomes
- HMC logo + contact info at bottom

---

## NAVIGATION STRUCTURE

### Floating Nav Bar (top right)
- Minimal — just 10 small dots representing sections
- Active section dot is gold and slightly larger
- Hover on dot shows section name
- Click jumps to that section with smooth scroll
- Auto-hides after 3 seconds of inactivity, reappears on mouse movement

### Keyboard Shortcuts
- `→` Next section
- `←` Previous section
- `Esc` Return to overview from category detail
- `Cmd/Ctrl + 1/2/3` Switch pricing scenario (HIDDEN)
- `Cmd/Ctrl + F` Open package search overlay

### Search Overlay (Cmd+F)
- Triggers full-screen overlay with backdrop blur
- Search input at top
- Real-time filter of all packages by code, name, or category
- Click result → jumps to that package's detail modal

---

## DATA: COMPLETE PACKAGE LIST

Use this data structure. Every package has three prices (A/B/C).

```typescript
export const PACKAGES = [
  // CATEGORY 1: GI + IV
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-01',
    name: 'Mild Gastroenteritis — Oral Management',
    included: 'Doctor exam · Vital signs · Oral rehydration therapy · Anti-emetic/anti-diarrheal oral meds · Medical report',
    prices: { A: 'To be agreed', B: '200', C: '360' }
  },
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-02',
    name: 'Moderate Gastroenteritis with Mild Dehydration',
    included: 'Doctor exam · Vital signs · IV cannula + 1 IV bag · IM anti-emetic · Oral meds · Nursing · Report',
    prices: { A: 'To be agreed', B: '240', C: '430' }
  },
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-03',
    name: 'Acute Gastroenteritis with Dehydration',
    included: 'Doctor exam · Vital signs · IV cannula + 2 IV bags · IM/IV anti-emetic & anti-diarrheal · Oral meds · 2-hour observation · Report',
    prices: { A: 'To be agreed', B: '280', C: '500' }
  },
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-04',
    name: 'Severe Gastroenteritis + Basic Labs',
    included: 'All of GI-03 + CBC + CRP + Electrolytes + Urea/Creatinine · Re-assessment · Report',
    prices: { A: 'To be agreed', B: '330', C: '590' }
  },
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-05',
    name: 'Food Poisoning Protocol (Adult)',
    included: 'Doctor exam · IV cannula + 2 IV bags · Anti-emetic IV · Antibiotic if indicated · Anti-spasmodic · Observation 3 hr · Report',
    prices: { A: 'To be agreed', B: '320', C: '570' }
  },
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-06',
    name: 'Pediatric Gastroenteritis (Infant/Child)',
    included: 'Pediatric exam · Weight-based IV/ORT · Anti-emetic syrup · Probiotic · Nursing · Pediatric report · Follow-up call next day',
    prices: { A: 'To be agreed', B: '290', C: '520' }
  },
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-07',
    name: 'Acute Gastritis / Abdominal Colic (No Dehydration)',
    included: 'Doctor exam · IM anti-spasmodic · IM/oral PPI · Oral meds package · Report',
    prices: { A: 'To be agreed', B: '220', C: '390' }
  },
  {
    category: 1,
    section: 'A',
    code: 'HMC-GI-08',
    name: 'Severe GI + Extended Observation (4–6 hrs)',
    included: 'Full GI-04 + Extended observation 4–6 hr · 2nd doctor re-assessment · Discharge planning · Report',
    prices: { A: 'To be agreed', B: '400', C: '720' }
  },
  // Section 1.B — IV Therapy
  {
    category: 1,
    section: 'B',
    code: 'HMC-IV-01',
    name: 'Mild Dehydration — Single IV Session',
    included: 'Doctor exam · IV cannula · 1 IV bag · Vitamin supplement · Nursing · Report',
    prices: { A: 'To be agreed', B: '220', C: '390' }
  },
  {
    category: 1,
    section: 'B',
    code: 'HMC-IV-02',
    name: 'Moderate Dehydration — Dual IV',
    included: 'Doctor exam · IV cannula · 2 IV bags · Electrolyte supplement · Anti-emetic if needed · Nursing · Report',
    prices: { A: 'To be agreed', B: '270', C: '480' }
  },
  {
    category: 1,
    section: 'B',
    code: 'HMC-IV-03',
    name: 'Severe Dehydration — Triple IV + Electrolytes',
    included: 'Doctor exam · IV cannula · 3 IV bags · IV potassium/electrolyte correction · 2-hr observation · Report',
    prices: { A: 'To be agreed', B: '340', C: '610' }
  },
  {
    category: 1,
    section: 'B',
    code: 'HMC-IV-04',
    name: 'Heat Exhaustion / Sunstroke Recovery',
    included: 'Doctor exam · IV cannula + 2 IV bags · Cooling protocol · Anti-emetic · Pain relief · 3-hr observation · Report',
    prices: { A: 'To be agreed', B: '310', C: '560' }
  },
  {
    category: 1,
    section: 'B',
    code: 'HMC-IV-05',
    name: 'Travel Fatigue & Recovery IV',
    included: 'Doctor exam · IV cannula · 1 IV bag with B-complex + vitamin C · Anti-emetic · Analgesic · Nursing · Report',
    prices: { A: 'To be agreed', B: '240', C: '430' }
  },
  {
    category: 1,
    section: 'B',
    code: 'HMC-IV-06',
    name: 'Extended IV Therapy + 4-hr Observation',
    included: 'All of IV-03 + Extended monitoring 4 hr · Re-assessment · Re-hydration verification · Report',
    prices: { A: 'To be agreed', B: '410', C: '740' }
  },
  
  // CATEGORY 2: RESPIRATORY
  {
    category: 2,
    code: 'HMC-RX-01',
    name: 'Mild URTI / Pharyngitis — Oral Management',
    included: 'Doctor exam · Throat assessment · Oral analgesics + antipyretics · Lozenges · Report',
    prices: { A: 'To be agreed', B: '200', C: '360' }
  },
  {
    category: 2,
    code: 'HMC-RX-02',
    name: 'Acute Bronchitis — Oral + IM Injection',
    included: 'Doctor exam · Chest auscultation · IM antibiotic loading dose · Oral antibiotic + mucolytic · Report',
    prices: { A: 'To be agreed', B: '230', C: '410' }
  },
  {
    category: 2,
    code: 'HMC-RX-03',
    name: 'Acute Tonsillitis — Moderate Fever',
    included: 'Doctor exam · Throat swab assessment · IM/IV antibiotic + analgesic · Antipyretic · Oral package · Report',
    prices: { A: 'To be agreed', B: '260', C: '470' }
  },
  {
    category: 2,
    code: 'HMC-RX-04',
    name: 'Acute Tonsillitis — High Fever + Labs',
    included: 'All of RX-03 + CBC + CRP · IV fluids if needed · 2-hr observation · Report',
    prices: { A: 'To be agreed', B: '320', C: '570' }
  },
  {
    category: 2,
    code: 'HMC-RX-05',
    name: 'Pneumonia — Outpatient + X-Ray + Labs',
    included: 'Doctor exam · Chest X-Ray + radiology report · CBC + CRP · IM/IV antibiotic · Nebulizer · Oral package · Report',
    prices: { A: 'To be agreed', B: '380', C: '680' }
  },
  {
    category: 2,
    code: 'HMC-RX-06',
    name: 'Acute Asthmatic Bronchitis — Nebulizer Session',
    included: 'Doctor exam · SpO₂ measurement · Nebulizer (bronchodilator + steroid) × 2–3 sessions · IM steroid · Report',
    prices: { A: 'To be agreed', B: '290', C: '520' }
  },
  {
    category: 2,
    code: 'HMC-RX-07',
    name: 'Acute Sinusitis / Rhinitis',
    included: 'Doctor (or ENT) exam · Nasal decongestant · IM antibiotic if indicated · Oral package · Report',
    prices: { A: 'To be agreed', B: '220', C: '390' }
  },
  
  // CATEGORY 3: WOUND CARE & SUTURING
  // Section A: Simple wounds
  { category: 3, section: 'A', code: 'HMC-WD-01', name: 'Superficial Wound — Cleaning Only (No Suture)', included: 'Doctor exam · Wound cleaning · Antiseptic dressing · Tetanus advice · IM antibiotic if indicated · Report', prices: { A: 'To be agreed', B: '200', C: '360' } },
  { category: 3, section: 'A', code: 'HMC-WD-02', name: 'Wound Dressing Follow-up (Single Session)', included: 'Wound inspection · Re-dressing · Antiseptic application · Brief nursing visit · Note', prices: { A: 'To be agreed', B: '200', C: '360' } },
  { category: 3, section: 'A', code: 'HMC-WD-03', name: 'Infected Wound — Drainage + Dressing', included: 'Doctor exam · Pus drainage · Wound irrigation · Sterile dressing · IM antibiotic · Oral meds · Report', prices: { A: 'To be agreed', B: '260', C: '470' } },
  // Section B: Standard suturing
  { category: 3, section: 'B', code: 'HMC-WD-04', name: 'Suturing — 1 to 3 Stitches (No X-Ray)', included: 'Doctor exam · Local anaesthesia · Wound cleaning · Suturing · Dressing · Tetanus · Removal visit · Report', prices: { A: 'To be agreed', B: '230', C: '410' } },
  { category: 3, section: 'B', code: 'HMC-WD-05', name: 'Suturing — 4 to 6 Stitches (No X-Ray)', included: 'Doctor exam · Local anaesthesia · Wound cleaning · Suturing · Dressing · IM antibiotic · Removal visit · Report', prices: { A: 'To be agreed', B: '270', C: '480' } },
  { category: 3, section: 'B', code: 'HMC-WD-06', name: 'Suturing — 7 to 10 Stitches (No X-Ray)', included: 'Doctor exam · Local anaesthesia · Wound cleaning · Suturing · Dressing · IM antibiotic · 2 removal visits · Report', prices: { A: 'To be agreed', B: '320', C: '570' } },
  { category: 3, section: 'B', code: 'HMC-WD-07', name: 'Suturing + X-Ray — 1 to 5 Stitches', included: 'Doctor exam · Local anaesthesia · X-Ray · Suturing · Dressing · Antibiotic · Report', prices: { A: 'To be agreed', B: '310', C: '560' } },
  { category: 3, section: 'B', code: 'HMC-WD-08', name: 'Suturing + X-Ray — 6 to 10 Stitches', included: 'All of WD-07 with 6–10 stitches · 2 removal visits · Report', prices: { A: 'To be agreed', B: '370', C: '670' } },
  // Section C: Facial/plastic
  { category: 3, section: 'C', code: 'HMC-WD-09', name: 'Facial Wound — Plastic Suturing 1 to 5 cm', included: 'Doctor (plastic technique) · Local anaesthesia · Fine-suture material · Cosmetic closure · Dressing · 2 removal visits · Report', prices: { A: 'To be agreed', B: '320', C: '570' } },
  { category: 3, section: 'C', code: 'HMC-WD-10', name: 'Facial Wound — Plastic Suturing 5 to 10 cm', included: 'All of WD-09 for larger wound · 3 removal visits · Anti-scar advice · Report', prices: { A: 'To be agreed', B: '400', C: '720' } },
  // Section D: Marine injuries
  { category: 3, section: 'D', code: 'HMC-WD-11', name: 'Sea Urchin Removal — Small (1–3 spines)', included: 'Doctor exam · Local anaesthesia · Surgical spine extraction · Antiseptic · Dressing · Tetanus · IM antibiotic · Report', prices: { A: 'To be agreed', B: '280', C: '500' } },
  { category: 3, section: 'D', code: 'HMC-WD-12', name: 'Sea Urchin Removal — Large (4+ spines)', included: 'All of WD-11 for larger extraction · Multiple sessions · 2 dressing changes · Report', prices: { A: 'To be agreed', B: '370', C: '670' } },
  { category: 3, section: 'D', code: 'HMC-WD-13', name: 'Jellyfish / Marine Sting — Severe', included: 'Doctor exam · Wound irrigation · Pain management · Anti-histamine · Steroid if needed · Topical · Report', prices: { A: 'To be agreed', B: '230', C: '410' } },
  
  // CATEGORY 4: TRAUMA & ORTHOPEDIC
  { category: 4, code: 'HMC-OR-01', name: 'Sprain / Strain — No X-Ray', included: 'Doctor exam · Clinical assessment · Cold therapy · Elastic compression bandage · Pain meds · Crutches if needed · Report', prices: { A: 'To be agreed', B: '230', C: '410' } },
  { category: 4, code: 'HMC-OR-02', name: 'Sprain / Strain — With X-Ray', included: 'All of OR-01 + X-Ray + Radiology report · Confirmation of no fracture · Report', prices: { A: 'To be agreed', B: '290', C: '520' } },
  { category: 4, code: 'HMC-OR-03', name: 'Contusion / Soft Tissue Injury — No X-Ray', included: 'Doctor exam · Clinical assessment · Pain management · Topical anti-inflammatory · Bandage if needed · Report', prices: { A: 'To be agreed', B: '240', C: '430' } },
  { category: 4, code: 'HMC-OR-04', name: 'Contusion + X-Ray (Rule out Fracture)', included: 'All of OR-03 + X-Ray + report · Pain management · Soft splint if indicated · Report', prices: { A: 'To be agreed', B: '300', C: '540' } },
  { category: 4, code: 'HMC-OR-05', name: 'Suspected Fracture — X-Ray + Bandage', included: 'Doctor exam · X-Ray · Radiology report · Pain management · Bandage / sling · Orthopedic referral if positive · Report', prices: { A: 'To be agreed', B: '330', C: '590' } },
  { category: 4, code: 'HMC-OR-06', name: 'Confirmed Fracture — X-Ray + Plaster Cast', included: 'All of OR-05 + Plaster cast application · Cast care instructions · 1 follow-up visit · Report', prices: { A: 'To be agreed', B: '440', C: '790' } },
  { category: 4, code: 'HMC-OR-07', name: 'Joint Dislocation — Reduction + Immobilization', included: 'Doctor exam · X-Ray · IV/IM analgesia + sedation · Closed reduction · Post-reduction X-Ray · Immobilization · Report', prices: { A: 'To be agreed', B: '490', C: '880' } },
  { category: 4, code: 'HMC-OR-08', name: 'Acute Back Pain / Lumbago — Outpatient Management', included: 'Doctor exam · Clinical assessment · IM analgesic + muscle relaxant · Oral package · Postural advice · Report', prices: { A: 'To be agreed', B: '240', C: '430' } },
  
  // CATEGORY 5: ENT
  { category: 5, code: 'HMC-EN-01', name: 'Otitis Externa / Swimmer\'s Ear — Simple', included: 'Doctor exam · Otoscopy · Ear cleaning · Antibiotic ear drops · Oral analgesic · Swimming advice · Report', prices: { A: 'To be agreed', B: '210', C: '380' } },
  { category: 5, code: 'HMC-EN-02', name: 'Otitis Media — Simple', included: 'Doctor exam · Otoscopy · IM/oral antibiotic · Decongestant · Analgesic · Report', prices: { A: 'To be agreed', B: '240', C: '430' } },
  { category: 5, code: 'HMC-EN-03', name: 'Severe Otitis — Ear Pack / Lavage + Treatment', included: 'Doctor exam · Otoscopy · Ear pack OR therapeutic lavage · Topical + systemic antibiotic · Pain control · Report', prices: { A: 'To be agreed', B: '290', C: '520' } },
  { category: 5, code: 'HMC-EN-04', name: 'Ear Wax Removal — Single Ear', included: 'Doctor exam · Portable ear-wash system · Pre-softening drops · Post-procedure assessment · Report', prices: { A: 'To be agreed', B: '200', C: '360' } },
  { category: 5, code: 'HMC-EN-05', name: 'Ear Wax Removal — Both Ears', included: 'Doctor exam · Portable ear-wash both ears · Pre-softening drops · Post-procedure assessment · Report', prices: { A: 'To be agreed', B: '270', C: '480' } },
  { category: 5, code: 'HMC-EN-06', name: 'Epistaxis (Nosebleed) with Anterior Packing', included: 'Doctor exam · Nasal cautery if needed · Anterior packing · Anti-hypertensive if indicated · Post-care advice · Report', prices: { A: 'To be agreed', B: '320', C: '570' } },
  
  // CATEGORY 6: DENTAL
  { category: 6, code: 'HMC-DN-01', name: 'Dental Pain — Examination + Medication', included: 'Dental exam · Pain/infection assessment · Oral analgesic + antibiotic · Emergency advice · Report', prices: { A: 'To be agreed', B: '200', C: '360' } },
  { category: 6, code: 'HMC-DN-02', name: 'Simple Tooth Extraction', included: 'Dental exam · Local anaesthesia · Simple extraction · Wound packing · Oral meds · Post-extraction advice · Report', prices: { A: 'To be agreed', B: '280', C: '500' } },
  { category: 6, code: 'HMC-DN-03', name: 'Tooth Filling — Amalgam (One Tooth)', included: 'Dental exam · Local anaesthesia · Filling preparation · Amalgam restoration · Bite check · Report', prices: { A: 'To be agreed', B: '310', C: '560' } },
  { category: 6, code: 'HMC-DN-04', name: 'Complicated Extraction + X-Ray', included: 'Dental exam · X-Ray + report · Local anaesthesia · Surgical extraction · Suturing if needed · Antibiotic · Report', prices: { A: 'To be agreed', B: '390', C: '700' } },
  { category: 6, code: 'HMC-DN-05', name: 'Dental Abscess — Drainage + Antibiotics', included: 'Dental exam · X-Ray · Drainage under local anaesthesia · IM/oral antibiotic · Analgesic · Follow-up advice · Report', prices: { A: 'To be agreed', B: '430', C: '770' } },
  
  // CATEGORY 7: ALLERGIC & SKIN
  { category: 7, code: 'HMC-DR-01', name: 'Mild Allergic Reaction / Insect Bite', included: 'Doctor exam · IM anti-histamine · IM/oral steroid if needed · Topical preparation · Oral package · Report', prices: { A: 'To be agreed', B: '200', C: '360' } },
  { category: 7, code: 'HMC-DR-02', name: 'Moderate Allergic Reaction / Urticaria', included: 'Doctor exam · IM/IV anti-histamine + steroid · IV fluids if needed · 2-hr observation · Oral meds · Report', prices: { A: 'To be agreed', B: '270', C: '480' } },
  { category: 7, code: 'HMC-DR-03', name: 'Severe Allergic Reaction with Shortness of Breath', included: 'Doctor exam · IV access · IV anti-histamine + IV steroid · Nebulizer · O₂ if needed · 4-hr observation · Report', prices: { A: 'To be agreed', B: '340', C: '610' } },
  { category: 7, code: 'HMC-DR-04', name: '1st-degree Burn / Sunburn (Adult)', included: 'Doctor exam · Burn cleaning · Topical preparation · Pain management · Hydration · Oral package · Report', prices: { A: 'To be agreed', B: '230', C: '410' } },
  { category: 7, code: 'HMC-DR-05', name: '2nd-degree Burn / Severe Sunburn', included: 'Doctor exam · Wound cleaning · Sterile dressing · IM analgesic · Anti-histamine · Antibiotic if indicated · Report', prices: { A: 'To be agreed', B: '300', C: '540' } },
  
  // CATEGORY 8: EYE
  { category: 8, code: 'HMC-EY-01', name: 'Conjunctivitis / Photosensitivity', included: 'Doctor exam · Eye assessment · Antibiotic eye drops · Anti-inflammatory drops · Patching advice · Report', prices: { A: 'To be agreed', B: '200', C: '360' } },
  { category: 8, code: 'HMC-EY-02', name: 'Eye Irritation + Foreign Body Removal', included: 'Doctor exam · Local anaesthetic drops · Foreign-body extraction · Antibiotic drops · Eye pad · Report', prices: { A: 'To be agreed', B: '250', C: '450' } },
  { category: 8, code: 'HMC-EY-03', name: 'Severe Eye Infection / Keratitis', included: 'Doctor exam · Detailed eye assessment · Fluorescein stain · Combined antibiotic + steroid drops · Oral meds · Follow-up · Report', prices: { A: 'To be agreed', B: '290', C: '520' } },
  
  // CATEGORY 9: CARDIAC
  { category: 9, code: 'HMC-CR-01', name: 'Hypertensive Emergency — Outpatient Control', included: 'Doctor exam · BP monitoring · ECG · IM/IV anti-hypertensive · 2-hr observation · Oral package · Report', prices: { A: 'To be agreed', B: '320', C: '570' } },
  { category: 9, code: 'HMC-CR-02', name: 'Hypotension / Syncope — Investigation', included: 'Doctor exam · ECG · CBC + Electrolytes · IV fluids · 3-hr observation · Re-assessment · Report', prices: { A: 'To be agreed', B: '360', C: '650' } },
  { category: 9, code: 'HMC-CR-03', name: 'Low-risk Chest Pain — Cardiac Screening', included: 'Doctor exam · ECG · Troponin · CBC · Basic metabolic panel · BP/SpO₂ monitoring · Outpatient assessment · Report', prices: { A: 'To be agreed', B: '420', C: '760' } },
  { category: 9, code: 'HMC-CR-04', name: 'Acute Arrhythmia / Palpitations', included: 'Doctor exam · ECG · Cardiac auscultation · IM/IV anti-arrhythmic if indicated · 4-hr monitoring · Report', prices: { A: 'To be agreed', B: '470', C: '850' } }
];
```

---

## BUILD INSTRUCTIONS

### Step 1: Project Setup
```bash
npx create-next-app@latest hmc-adac-presentation --typescript --tailwind --app --src-dir --import-alias "@/*"
cd hmc-adac-presentation
npm install framer-motion recharts lucide-react clsx tailwind-merge
npm install -D @types/node
```

### Step 2: Install shadcn/ui essentials
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog sheet tabs tooltip
```

### Step 3: Set up Google Fonts in `layout.tsx`
```typescript
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
```

### Step 4: Build in this order
1. **Pricing context + provider** (with keyboard listener for Cmd+1/2/3)
2. **Layout shell** (top nav, keyboard handler, particle background)
3. **Cover page** (Section 1) — perfect the animations here, reuse pattern elsewhere
4. **Executive summary** (Section 2)
5. **Network map** (Section 3) — most complex; SVG illustration
6. **Service modes** (Section 4)
7. **Package architecture overview** (Section 5)
8. **Category detail pages** (Sections 6-14)
9. **Pricing matrix** (Section 15)
10. **Standard terms** (Section 16)
11. **Closing** (Section 17)
12. **Search overlay** (Cmd+F)

### Step 5: Test
- Open in browser at full-screen
- Use arrow keys to navigate
- Test Cmd+1/2/3 to switch scenarios — verify NO visual labels appear
- Test on a projector/large screen if possible

### Step 6: Build for production
```bash
npm run build
npm run start
```

User will deploy to Vercel separately if needed.

---

## CRITICAL REMINDERS

1. **This is the most important presentation of Mohamed's year.** Every detail matters.
2. **Hidden scenario toggle is critical.** Audience must NEVER see scenario indicators.
3. **Premium feel comes from restraint:** generous whitespace, refined typography, subtle animations. Don't over-decorate.
4. **Test the keyboard shortcuts thoroughly.** Mohamed will rely on them during the meeting.
5. **Make sure all 60+ packages are included** with correct three-tier pricing.
6. **Never mention competitor company names** anywhere (Global Assistance, Balt, Euro Center, etc.).
7. **Tone is neutral:** "travelers" not "ADAC patients" in clinical descriptions.
8. **The PDF catalogue is the source of truth** for content. Mirror its content exactly.

---

## DELIVERABLE

A complete Next.js project ready to run with `npm run dev` (development) or `npm run build && npm run start` (production). When the user runs it and opens `localhost:3000`, they should see a cinematic, board-grade interactive presentation that they can use to run their entire ADAC meeting on 19 May 2026.

Now begin the build. Take the time you need. Quality over speed.
