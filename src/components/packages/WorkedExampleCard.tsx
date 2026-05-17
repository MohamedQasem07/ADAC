'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  FileText,
  Phone,
  Receipt,
  Stethoscope,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { fallbackPackagesData } from '@/data/fallback';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { Package } from '@/types/content';
import { PriceBadge } from './PriceBadge';

interface Step {
  number: string;
  title: string;
  icon: LucideIcon;
  body: string;
}

/**
 * Phase 2.4L (L2.1) — Worked Example · Package Flow.
 *
 * One screen demonstrating how a single outpatient package moves from
 * ADAC notification → reporting + invoice. Uses `HMC-GI-03 Acute
 * Gastroenteritis with Dehydration` because it is the modal scenario
 * from the §3 clinical breakdown (GI is the top diagnosis category)
 * and the package definition is concrete enough to walk in 2 minutes.
 *
 * Locked content rules respected:
 *   - No invented patient identity (name / DOB / claim number / hotel name)
 *   - Wording is "German traveler at a Red Sea hotel — example workflow"
 *   - Package code, name, and "What's included" text are read from
 *     packages.json so they always match the catalogue
 *   - Price is rendered via <PriceBadge>, so Scenario A still shows
 *     "To be agreed" and Scenarios B/C show the catalogue figure —
 *     no audience-visible Scenario label
 */
export function WorkedExampleCard() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  // Pull the package directly from the catalogue.
  const pkg = (fallbackPackagesData.packages as Package[]).find(
    (p) => p.code === 'HMC-GI-03'
  );
  // Defensive fallback — keeps the page renderable if someone disables
  // the package via Control Mode overrides. Code is still real.
  const safePkg: Package =
    pkg ?? ({
      category: 1,
      code: 'HMC-GI-03',
      name: 'Acute Gastroenteritis with Dehydration',
      included:
        'Doctor exam · Vital signs · IV cannula + 2 IV bags · IM/IV anti-emetic & anti-diarrheal · Oral meds · 2-hour observation · Report',
      prices: { A: 'To be agreed', B: 280, C: 500 },
    } as Package);

  const steps: Step[] = [
    {
      number: '01',
      title: 'ADAC notification',
      icon: Phone,
      body:
        'ADAC sends the case notification / GOP request through the agreed assistance channel. HMC Operations acknowledges receipt, opens the case file, and assigns a named coordinator within the SLA target window.',
    },
    {
      number: '02',
      title: 'Triage',
      icon: Activity,
      body:
        'On-duty physician reviews symptoms and vitals: persistent vomiting, loose stools, signs of dehydration. Severity classified Yellow under the §8 triage model. Case fits the GI · IV Therapy package family.',
    },
    {
      number: '03',
      title: 'Assignment',
      icon: Stethoscope,
      body:
        'Doctor and nurse assigned to the appropriate delivery mode — clinic, hotel-room visit, or mobile unit — based on traveler location and severity. Mode of delivery does not change the package price; only clinical escalation does.',
    },
    {
      number: '04',
      title: 'Treatment',
      icon: CheckCircle2,
      body: `Per the ${safePkg.code} package: ${safePkg.included}. Escalation flagged immediately if clinical reality exceeds package scope — quoted separately and documented as a distinct event.`,
    },
    {
      number: '05',
      title: 'Documentation',
      icon: FileText,
      body:
        'Same-day case summary captured at point of care — diagnosis (ICD-10 A09 acute gastroenteritis), vitals, IV inputs, medications, physician sign-off. Report ready for ADAC by close of day of service.',
    },
    {
      number: '06',
      title: 'Invoice and reporting',
      icon: Receipt,
      body:
        'Single package-coded invoice line referencing the case ID, package code, and date of service. Monthly performance report aggregates these closures by category, package code, and outcome.',
    },
  ];

  return (
    <article
      ref={ref}
      className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7, ease: ease.premium }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          §13.5
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          Worked Example · Package Flow
        </h1>
        <p className="mt-3 max-w-3xl text-base text-ice/85 md:text-lg">
          One illustrative case showing how a single outpatient package moves from ADAC
          notification to reporting and invoice. Example workflow only — no real patient data.
        </p>
        <div className="gold-rule mt-6 w-20" />
      </motion.header>

      {/* Package header card — code, name, included, price chip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ delay: 0.15, duration: 0.7, ease: ease.premium }}
        className="mt-10 grid grid-cols-1 gap-5 rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm md:grid-cols-[1fr_auto] md:items-center md:p-8"
      >
        <div className="min-w-0">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            Example scenario · German traveler at a Red Sea hotel
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-ice/85">
            {safePkg.code}
          </p>
          <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">
            {safePkg.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ice/85 md:text-base">
            <span className="text-white">What&rsquo;s included:</span> {safePkg.included}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ice/85">
            Flat-rate price
          </p>
          <PriceBadge pkg={safePkg} size="lg" />
        </div>
      </motion.div>

      {/* 6-step grid */}
      <motion.ol
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <motion.li
              key={s.number}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: ease.premium },
                },
              }}
              className="group relative overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-gold/40"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-2.5 top-2.5 h-2.5 w-2.5 border-l border-t opacity-70"
                style={{ borderColor: 'var(--theme-accent)' }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2.5 right-2.5 h-2.5 w-2.5 border-b border-r opacity-50"
                style={{ borderColor: 'var(--theme-accent)' }}
              />

              <div className="flex items-baseline justify-between">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  Step {s.number}
                </p>
                <Icon
                  size={16}
                  style={{ color: 'var(--theme-accent)' }}
                  className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <p className="mt-2 font-display text-lg leading-snug text-white">
                {s.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ice/85">{s.body}</p>
            </motion.li>
          );
        })}
      </motion.ol>

      {/* What this proves for ADAC callout */}
      <motion.aside
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ delay: 0.45, duration: 0.7, ease: ease.premium }}
        className="mt-12 rounded-sm border p-6 backdrop-blur-sm md:p-8"
        style={{
          background: 'var(--theme-badge-bg)',
          borderColor: 'var(--theme-badge-border)',
        }}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border"
            style={{
              borderColor: 'var(--theme-badge-border)',
              color: 'var(--theme-badge-text)',
            }}
          >
            <Sparkles size={14} />
          </span>
          <div className="min-w-0">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.35em]"
              style={{ color: 'var(--theme-badge-text)' }}
            >
              What this proves for ADAC
            </p>
            <p className="mt-2 text-base leading-relaxed text-white md:text-lg">
              ADAC receives a predictable package workflow: defined scope, documented
              treatment, clean invoice line, and a clear escalation boundary.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ice/80">
              This worked example is operationally supported by HMC&rsquo;s digital case file
              and smart invoice workflow described in{' '}
              <a
                href="/section/10/10.5"
                className="underline-offset-4 hover:underline"
                style={{ color: 'var(--theme-badge-text)' }}
              >
                §10.5 Digital Package Workflow
              </a>
              .
            </p>
          </div>
        </div>
      </motion.aside>
    </article>
  );
}
