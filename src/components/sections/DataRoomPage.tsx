'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ArrowUpRight,
  Briefcase,
  ClipboardList,
  HeartPulse,
  Layers3,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { fallbackPackagesData } from '@/data/fallback';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { MarkdownContent, Package } from '@/types/content';
import { type KpiItem } from './KpiStrip';
import {
  MiniAdmission,
  MiniAge,
  MiniDiagnosis,
  MiniFinancialDonut,
  MiniHeatmap,
  MiniLengthOfStay,
  MiniMarketShare,
  MiniYearlyBars,
} from './data-room/DataRoomCharts';
import { FourYearContextCard } from './data-room/FourYearContextCard';
import { SectionDivider } from './data-room/SectionDivider';
import {
  Age2026YTDCard,
  Cash2026YTDCard,
} from './data-room/Supplementary2026YTDCard';
import { DataRoomCoverage } from './data-room/DataRoomCoverage';
import { DataRoomDecisions } from './data-room/DataRoomDecisions';
import { DataRoomPackages } from './data-room/DataRoomPackages';

interface DataRoomPageProps {
  content: MarkdownContent;
}

const BADGES = [
  'ADAC historical cooperation',
  'German traveler care',
  'Red Sea coverage',
  'Outpatient package framework',
  'Pricing discussion ready',
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: ease.premium },
  },
};

/**
 * Executive Data Room — `/section/data-room`.
 *
 * Single board-grade dashboard that consolidates the meeting story.
 * Lives between the Presentation Overview (/section/overview) and
 * About HMC (/section/2) in the sidebar and keyboard nav.
 *
 * All data is locked (read from src/data/fallback.ts). No new chart
 * library. Compact dashboard-only chart variants live in
 * data-room/DataRoomCharts.tsx — the full §3 chart routes are unchanged.
 */
export function DataRoomPage({ content }: DataRoomPageProps) {
  const fm = content.frontmatter;
  const { applyPackages } = useOverrides();
  const packageCount = applyPackages(fallbackPackagesData.packages as Package[]).length;

  // KPI items with `highlight` flag — important values get gold treatment.
  const kpis: Array<KpiItem & { highlight?: boolean }> = [
    { value: '268', label: 'ADAC cases 2023–2026', highlight: true },
    { value: '200', label: 'Cases in 2024–2025', highlight: true },
    { value: '1,127', label: 'German patients 2024–2025', highlight: true },
    { value: '20.37%', label: 'Share of insured German cases', highlight: true },
    { value: String(fallbackPackagesData.categories.length), label: 'Package categories' },
    { value: String(packageCount), label: 'Active packages' },
  ];

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-24">
      {/* Block 1 — Hero / Executive Summary */}
      <Hero
        eyebrow={(fm.eyebrow as string) ?? 'Decision-ready summary'}
        title={(fm.title as string) ?? 'Executive Data Room'}
        subtitle={fm.subtitle as string | undefined}
        body={content.body}
      />

      {/* Block 2 — KPI Strip (6 cards) */}
      <Section delay={0.15}>
        <SixUpKpis items={kpis} />
      </Section>

      {/* Phase 2.4I — section divider: 4-year operational context */}
      <SectionDivider
        eyebrow="4-Year Operational Context"
        caption="2023 → 2026 YTD"
      />

      {/* Block 3 — Historical ADAC Performance (now the grouped monthly chart) */}
      <Section>
        <Card
          eyebrow="Historical performance"
          title="ADAC monthly case pattern · 2023–2026"
          insight="Across four years, monthly ADAC volume holds a consistent Aug–Nov peak. 2024–2025 remains the primary complete analysis window."
          openHref="/section/3/3.1"
          openLabel="Open full view · §3.1"
          featured
        >
          <MiniYearlyBars />
        </Card>
      </Section>

      {/* Block 3b — 4-Year Partnership Context (Phase 2.4H) */}
      <Section delay={0.05}>
        <FourYearContextCard />
      </Section>

      {/* Block 4 — German Traveler Market Context (Heatmap featured + Market Share) */}
      <Section>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
          <Card
            eyebrow="Market context"
            title="German Traveler Monthly Flow 2023–2026"
            subtitle="Full German traveler flow across the operation · 2026 YTD only"
            insight="German traveler flow provides the operational context for ADAC demand planning, staffing readiness, and mobile service coverage."
            openHref="/section/3/3.2"
            openLabel="Open full view · §3.2"
            featured
          >
            <MiniHeatmap />
          </Card>
          <Card
            eyebrow="Market share"
            title="ADAC share of insured German cases"
            insight="ADAC is the largest single German insurance partner — roughly 1 in every 5 insured German patients."
            openHref="/section/3/3.8"
            openLabel="Open full view · §3.8"
            compact
          >
            <MiniMarketShare />
          </Card>
        </div>
      </Section>

      {/* Phase 2.4I — section divider: primary clinical/financial */}
      <SectionDivider
        eyebrow="Primary Clinical & Financial Analysis"
        caption="2024–2025"
      />

      {/* Block 5 — Payment / Handling Profile + 2026 YTD sibling */}
      <Section>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          <Card
            eyebrow="Payment profile"
            title="Cash vs Insurance · 2024–2025"
            insight="The majority of cases in the analysis window were insurance-handled, supporting the value of structured documentation, package clarity, and predictable approval workflows."
            openHref="/section/3/3.4"
            openLabel="Open full view · §3.4"
          >
            <MiniFinancialDonut />
          </Card>
          <Cash2026YTDCard />
        </div>
      </Section>

      {/* Block 6 — Clinical Profile Grid (2×2 → 3-up with the 2026 YTD age sibling) */}
      <Section>
        <p
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          Clinical profile · 2024–2025
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card
            title="Diagnosis profile"
            subtitle="Top 5 categories · 156 admissions"
            insight="Top 3 categories = 75.6% of admissions — suits structured packages."
            openHref="/section/3/3.3"
            openLabel="Open full · §3.3"
          >
            <MiniDiagnosis />
          </Card>
          <Card
            title="Admission profile"
            subtitle="156 admissions of 200 cases · 2024–2025"
            insight="78% admitted · 22% outpatient — the outpatient slice is the package target."
            openHref="/section/3/3.5"
            openLabel="Open full · §3.5"
          >
            <MiniAdmission />
          </Card>
          <Card
            title="Length of stay"
            subtitle="156 ADAC admissions"
            insight="83% discharged within 48 hours — same-day documentation aligned with ADAC's case closure."
            openHref="/section/3/3.7"
            openLabel="Open full · §3.7"
          >
            <MiniLengthOfStay />
          </Card>
          {/* Age + 2026 YTD sibling pair — visible together so the audience reads them as one story */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
            <Card
              title="Age distribution"
              subtitle="156 ADAC admissions"
              insight="62% seniors · 82% over 40 · higher clinical responsibility, structured triage."
              openHref="/section/3/3.6"
              openLabel="Open full · §3.6"
            >
              <MiniAge />
            </Card>
            <Age2026YTDCard />
          </div>
        </div>
      </Section>

      {/* Block 7 — Red Sea Coverage */}
      <Section>
        <Card
          eyebrow="Service coverage"
          title="Red Sea operational footprint"
          subtitle="Hurghada · Sahl Hasheesh · Safaga · Marsa Alam — with hotel-zone and mobile capability"
        >
          <DataRoomCoverage />
        </Card>
      </Section>

      {/* Block 8 — Outpatient Package Framework (featured) */}
      <Section>
        <Card
          eyebrow="Outpatient package framework"
          title="Flat-rate clinical packages"
          subtitle="One number per clinical presentation · scope agreed before treatment starts"
          openHref="/section/12"
          openLabel="Open full catalogue · §12"
          featured
        >
          <DataRoomPackages />
        </Card>
      </Section>

      {/* Block 9 — Pricing Discussion Readiness */}
      <Section>
        <PricingReadiness />
      </Section>

      {/* Block 10 — Decision Points Summary */}
      <Section>
        <Card
          eyebrow="Decisions for today"
          title="Eight items to land in this meeting"
          openHref="/section/decisions"
          openLabel="Open Decision Points"
        >
          <DataRoomDecisions />
        </Card>
      </Section>

      {/* Block 11 — Closing nav strip */}
      <Section delay={0.05}>
        <ClosingNav />
      </Section>

      {/* Used `fadeUp` constant directly inside Section. */}
    </article>
  );
}

// ─── Block 1 — Hero ────────────────────────────────────────────
function Hero({
  eyebrow,
  title,
  subtitle,
  body,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  body: string;
}) {
  const words = title.split(' ');
  return (
    <header className="relative mx-auto max-w-4xl text-center">
      {/* Soft gold halo behind hero — subtle, non-distracting */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[120%] -translate-x-1/2 opacity-50"
        style={{
          background:
            'radial-gradient(50% 60% at 50% 30%, rgba(var(--theme-accent-rgb),0.22) 0%, rgba(var(--theme-accent-rgb),0.06) 35%, transparent 70%)',
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.premium }}
        className="font-sans text-[11px] uppercase tracking-[0.55em]"
        style={{ color: 'var(--theme-accent)' }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={titleContainer}
        initial="hidden"
        animate="visible"
        className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-white md:text-6xl lg:text-7xl"
      >
        {words.map((w, i) => (
          <motion.span
            key={`${w}-${i}`}
            variants={titleWord}
            className="mr-[0.25em] inline-block"
          >
            {w}
          </motion.span>
        ))}
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.0, duration: 1.0, ease: ease.premium }}
        style={{ transformOrigin: 'center' }}
        className="gold-rule mx-auto mt-6 w-32"
      />
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: ease.premium }}
          className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ice/90 md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Trust line — verified-since chip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.6, ease: ease.premium }}
        className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.3em]"
        style={{
          borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
          background: 'color-mix(in srgb, var(--theme-accent) 6%, transparent)',
          color: 'var(--theme-accent-soft)',
        }}
      >
        <ShieldCheck size={12} />
        Numbers verified against the 2025 ADAC Partnership Overview
      </motion.p>

      {/* Badges */}
      <motion.ul
        variants={staggerTight}
        initial="hidden"
        animate="visible"
        className="mt-7 flex flex-wrap items-center justify-center gap-2"
      >
        {BADGES.map((b) => (
          <motion.li
            key={b}
            variants={{
              hidden: { opacity: 0, scale: 0.92 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, ease: ease.premium },
              },
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 text-[10px] uppercase tracking-[0.25em]"
              style={{
                borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
                background: 'color-mix(in srgb, var(--theme-accent) 5%, transparent)',
                color: 'var(--theme-accent-soft)',
              }}
            >
              <Sparkles size={11} />
              {b}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      {body.trim() && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: ease.premium }}
          className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-ice/80 md:text-base"
        >
          {body.trim()}
        </motion.p>
      )}
    </header>
  );
}

const titleContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.4, staggerChildren: 0.08 } },
};
const titleWord: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.premium } },
};

// ─── Block 2 — 6 KPI cards ─────────────────────────────────────
function SixUpKpis({ items }: { items: Array<KpiItem & { highlight?: boolean }> }) {
  // 4 large highlighted KPIs on the left/top, 2 secondary KPIs on the right.
  // At narrow widths everything stacks 2-up.
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((k) => (
        <KpiCard key={k.label} item={k} />
      ))}
    </div>
  );
}

function KpiCard({ item }: { item: KpiItem & { highlight?: boolean } }) {
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });
  const m = item.value.match(/^(\d[\d,]*\.?\d*)(.*)$/);
  let display: React.ReactNode = item.value;
  if (m && inView) {
    const numStr = m[1].replace(/,/g, '');
    const suffix = m[2] ?? '';
    const v = Number(numStr);
    if (Number.isFinite(v)) {
      const hasDecimal = numStr.includes('.');
      const useThousands = m[1].includes(',') || v >= 1000;
      display = (
        <CountUp
          start={0}
          end={v}
          duration={2.0}
          separator={useThousands ? ',' : ''}
          decimals={hasDecimal ? 2 : 0}
          preserveValue
          suffix={suffix}
          useEasing
        />
      );
    }
  }

  const isHighlighted = item.highlight;

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="relative overflow-hidden rounded-sm border p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
      style={
        isHighlighted
          ? {
              borderColor:
                'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 10%, transparent), rgba(13,27,42,0.4) 60%, rgba(13,27,42,0.4))',
              boxShadow:
                '0 0 24px color-mix(in srgb, var(--theme-accent) 8%, transparent)',
            }
          : {
              borderColor: 'var(--theme-card-border)',
              background: 'rgba(13,27,42,0.4)',
            }
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--theme-card-hover-border)';
        if (isHighlighted) {
          e.currentTarget.style.boxShadow =
            '0 0 32px color-mix(in srgb, var(--theme-accent) 18%, transparent)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isHighlighted
          ? 'color-mix(in srgb, var(--theme-accent) 40%, transparent)'
          : 'var(--theme-card-border)';
        if (isHighlighted) {
          e.currentTarget.style.boxShadow =
            '0 0 24px color-mix(in srgb, var(--theme-accent) 8%, transparent)';
        }
      }}
    >
      <p
        className={`font-display font-semibold leading-none ${
          isHighlighted
            ? 'text-3xl sm:text-4xl lg:text-[2.5rem]'
            : 'text-2xl text-white sm:text-3xl'
        }`}
        style={
          isHighlighted
            ? {
                color: 'var(--theme-accent)',
                filter:
                  'drop-shadow(0 0 14px rgba(var(--theme-accent-rgb),0.28))',
              }
            : undefined
        }
      >
        {display}
      </p>
      <p
        className={`mt-3 text-[10px] uppercase leading-tight tracking-[0.22em] ${
          isHighlighted ? 'text-ice/90' : 'text-ice/80'
        }`}
      >
        {item.label}
      </p>
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l border-t"
        style={{
          borderColor: `color-mix(in srgb, var(--theme-accent) ${
            isHighlighted ? 70 : 40
          }%, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r"
        style={{
          borderColor: `color-mix(in srgb, var(--theme-accent) ${
            isHighlighted ? 70 : 40
          }%, transparent)`,
        }}
      />
    </motion.div>
  );
}

// ─── Generic dashboard card ────────────────────────────────────
function Card({
  eyebrow,
  title,
  subtitle,
  insight,
  openHref,
  openLabel,
  compact,
  featured,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  insight?: string;
  openHref?: string;
  openLabel?: string;
  compact?: boolean;
  /** Featured cards get larger type + a subtle gold halo on hover. */
  featured?: boolean;
  children: React.ReactNode;
}) {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`group relative overflow-hidden rounded-sm border backdrop-blur-sm transition-all duration-300 ${
        featured
          ? 'bg-gradient-to-br from-navy/55 via-navy/45 to-navy/40 p-7 md:p-9'
          : compact
            ? 'bg-navy/40 p-5'
            : 'bg-navy/40 p-6 md:p-7'
      }`}
      style={{
        borderColor: featured ? 'rgba(255,255,255,0.15)' : 'var(--theme-card-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--theme-card-hover-border)';
        if (featured) {
          e.currentTarget.style.boxShadow =
            '0 0 32px color-mix(in srgb, var(--theme-accent) 12%, transparent)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = featured
          ? 'rgba(255,255,255,0.15)'
          : 'var(--theme-card-border)';
        if (featured) e.currentTarget.style.boxShadow = '';
      }}
    >
      <header className="mb-5">
        {eyebrow && (
          <p
            className={`font-mono uppercase tracking-[0.4em] ${
              featured ? 'text-[11px]' : 'text-[10px] tracking-[0.35em]'
            }`}
            style={{ color: 'var(--theme-accent)' }}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`mt-1.5 font-display font-semibold leading-tight text-white ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-1.5 uppercase tracking-[0.22em] text-ice/80 ${
              featured ? 'text-[13px]' : 'text-xs'
            }`}
          >
            {subtitle}
          </p>
        )}
      </header>

      {children}

      {(insight || openHref) && (
        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {insight ? (
            <p
              className={`max-w-2xl italic leading-relaxed ${
                featured ? 'text-sm md:text-base' : 'text-xs md:text-sm'
              }`}
              style={{ color: 'var(--theme-accent-soft)' }}
            >
              {insight}
            </p>
          ) : (
            <span />
          )}
          {openHref && (
            <Link
              href={openHref}
              className="group/btn inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] transition-colors"
              style={{
                borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
                background: 'color-mix(in srgb, var(--theme-accent) 7%, transparent)',
                color: 'var(--theme-accent)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'color-mix(in srgb, var(--theme-accent) 15%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'color-mix(in srgb, var(--theme-accent) 7%, transparent)';
              }}
            >
              {openLabel ?? 'Open full view'}
              <ArrowUpRight
                size={12}
                className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
              />
            </Link>
          )}
        </footer>
      )}
    </motion.section>
  );
}

// ─── Block 9 — Pricing Readiness (audience-safe) ───────────────
function PricingReadiness() {
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });
  const items = [
    {
      icon: <Layers3 size={16} />,
      title: 'Package framework first',
      body: 'Align on scope, categories, and operational fit before discussing numbers.',
    },
    {
      icon: <Briefcase size={16} />,
      title: 'Pricing confirmation after scope alignment',
      body: 'Confirm the agreed flat-rate framework once the package perimeter is set.',
    },
    {
      icon: <HeartPulse size={16} />,
      title: 'Escalation quoted separately',
      body: 'Inpatient or ER pathway cases are handled outside the outpatient package framework.',
    },
  ];

  return (
    <motion.section
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="relative overflow-hidden rounded-sm border p-6 backdrop-blur-sm md:p-8"
      style={{
        borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
        background: 'color-mix(in srgb, var(--theme-accent) 4%, transparent)',
      }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.35em]"
        style={{ color: 'var(--theme-accent)' }}
      >
        Pricing discussion readiness
      </p>
      <h2 className="mt-1 font-display text-lg font-semibold leading-tight text-white md:text-xl">
        Pricing presentation can be aligned to the discussion stage
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {items.map((it) => (
          <li
            key={it.title}
            className="rounded-sm border border-white/10 bg-navy-deep/30 p-4"
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
                background:
                  'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
                color: 'var(--theme-accent)',
              }}
            >
              {it.icon}
            </span>
            <p className="mt-3 font-display text-sm font-semibold text-white">{it.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ice/85">{it.body}</p>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

// ─── Block 11 — Closing nav ────────────────────────────────────
function ClosingNav() {
  const links = [
    { href: '/section/3', label: 'ADAC Track Record', icon: <ClipboardList size={14} /> },
    { href: '/section/12', label: 'Package Catalogue', icon: <Layers3 size={14} /> },
    { href: '/section/decisions', label: 'Decision Points', icon: <MapPin size={14} /> },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group inline-flex items-center gap-2 rounded-full border bg-navy/40 px-4 py-2 text-[11px] uppercase tracking-[0.25em] transition-colors"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
            color: 'var(--theme-accent)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'color-mix(in srgb, var(--theme-accent) 15%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '';
          }}
        >
          {l.icon}
          {l.label}
          <ArrowUpRight
            size={12}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      ))}
    </div>
  );
}

// ─── Spacing wrapper ───────────────────────────────────────────
function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  void delay; // Reserved — currently using per-card scroll reveals.
  return <div className="mt-10 md:mt-14">{children}</div>;
}
