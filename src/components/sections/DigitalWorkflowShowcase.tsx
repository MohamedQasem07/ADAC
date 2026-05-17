'use client';

import { motion } from 'framer-motion';
import {
  ClipboardList,
  Workflow,
  Stethoscope,
  Receipt,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

/**
 * §10.5 — Digital Package Workflow (Phase 2.4M-r2 · immersive redesign).
 *
 * Replaces the prior thumbnail grid with an 8-step sequential "story"
 * where each screenshot is the hero of its own panel.
 *
 * Image paths are prefixed with NEXT_PUBLIC_BASE_PATH so they resolve
 * correctly under GitHub Pages basePath '/ADAC' (and at root in dev).
 *
 * Wording rules kept verbatim per ADAC content guard:
 *   - "can prepare" / "semi-automatic" / "proposed" / "operator-confirmed"
 *     / "nurse-confirmed"
 *   - NO claim of fully automatic final invoice
 *   - NO AI-generated medical report
 *   - NO "no human review"
 *   - Internal workflow target sentence + disclaimer preserved
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const SHOT = (n: number) => `${BASE_PATH}/screenshots/digital-workflow/${n}.png`;

interface Stage {
  icon: typeof ClipboardList;
  label: string;
  body: string;
}

const stages: Stage[] = [
  {
    icon: ClipboardList,
    label: 'Register',
    body: 'Structured case file opens with patient, nationality, hotel and branch.',
  },
  {
    icon: Workflow,
    label: 'Route',
    body: 'Patient-settled, insurance, transfer or approved-free routing.',
  },
  {
    icon: Stethoscope,
    label: 'Clinical',
    body: '7-step medical report and nursing sheet on one connected case.',
  },
  {
    icon: Receipt,
    label: 'Code',
    body: 'Coded labs, services, medications, consumables and procedures.',
  },
  {
    icon: FileCheck2,
    label: 'Pack',
    body: 'Proposed coded invoice plus breakdowns prepared for ADAC.',
  },
];

interface Step {
  n: number;
  title: string;
  whatHappens: string;
  whySmart: string;
  adacValue: string;
}

const steps: Step[] = [
  {
    n: 1,
    title: 'Patient registration',
    whatHappens:
      'Reception registers the case digitally from any HMC location: patient details, nationality, hotel / resort, visit date, branch, case provider, and duty staff where available.',
    whySmart:
      'The case starts as one structured record instead of separate paper notes.',
    adacValue:
      'Clean case identity from the first minute, before report or invoice preparation begins.',
  },
  {
    n: 2,
    title: 'Case handling type',
    whatHappens:
      'The case is routed as patient-settled, insurance, transfer, or approved free case.',
    whySmart:
      'The system separates the financial and operational pathway early.',
    adacValue:
      'Insurance cases move immediately into the correct documentation and approval workflow.',
  },
  {
    n: 3,
    title: 'Medical stage gateway',
    whatHappens:
      'The medical workspace opens the structured report and nursing sheet from the same case.',
    whySmart:
      'Clinical documentation and nursing execution stay connected to one case file.',
    adacValue:
      'Less risk of missing medical or nursing documentation during claim review.',
  },
  {
    n: 4,
    title: 'Medical report wizard',
    whatHappens:
      'The doctor completes a structured seven-step report: Examination, Labs, Imaging, Procedures, Treatment & Medications, Follow-up, and Discharge.',
    whySmart:
      'The doctor does not write a blank report from scratch; the system guides the clinical structure.',
    adacValue:
      'Standardized report format across HMC locations, with no handwritten report issues.',
  },
  {
    n: 5,
    title: 'Clinical template picker',
    whatHappens:
      'Common outpatient / package cases can use templates that pre-fill complaint, vitals, exam, diagnosis, investigations, medications, treatment plan, and discharge instructions.',
    whySmart:
      'The doctor adjusts the case-specific details instead of rebuilding the full report manually.',
    adacValue:
      'Standard package cases can be documented faster while keeping clinical review.',
  },
  {
    n: 6,
    title: 'Coded labs and services',
    whatHappens:
      'Labs, services, medications, consumables, imaging, and procedures are selected from coded catalogue / price-list items where available.',
    whySmart:
      'Clinical selections connect to reviewed service codes instead of generic free-text invoice rows.',
    adacValue:
      'Cleaner invoice breakdowns and fewer clarification requests.',
  },
  {
    n: 7,
    title: 'Nursing sheet and proposed invoice',
    whatHappens:
      'After clinical confirmation, the system can prepare the nursing sheet and proposed coded invoice / breakdowns within seconds.',
    whySmart:
      'Doctor orders, nursing execution, and invoice preparation are connected but still human-reviewed.',
    adacValue:
      'Faster ADAC-ready file preparation with nurse-confirmed and operator-confirmed items.',
  },
  {
    n: 8,
    title: 'Generated medical report output',
    whatHappens:
      'The final output can be printed or prepared as part of the insurance file with report, invoice, breakdowns, and attachments when applicable.',
    whySmart:
      'One digital case record supports the whole submission pack.',
    adacValue:
      'A cleaner file can be reviewed and sent in minutes rather than hours for standard package cases.',
  },
];

const TOTAL = steps.length;

export function DigitalWorkflowShowcase() {
  const { ref: heroRef, inView: heroInView } = useScrollReveal({ threshold: 0.1 });

  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
      {/* Hero */}
      <motion.header
        ref={heroRef}
        initial={{ opacity: 0, y: 18 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7, ease: ease.premium }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          §10.5
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          Digital Package Workflow
        </h1>
        <p className="mt-3 max-w-3xl text-base text-ice/85 md:text-lg">
          One connected digital case file — registration, structured medical report,
          nursing sheet, coded invoice and breakdowns — moved from doctor confirmation
          to ADAC-ready pack in minutes for standard package cases.
        </p>
        <div className="gold-rule mt-6 w-20" />
        <p className="mt-5 text-xs italic text-ice/60">
          Demo workflow screens · no patient-sensitive data intended for presentation.
        </p>
      </motion.header>

      {/* Five-stage workflow strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ delay: 0.15, duration: 0.7, ease: ease.premium }}
        className="mt-12 grid grid-cols-1 gap-3 rounded-sm border border-white/10 bg-navy/40 p-5 backdrop-blur-sm sm:grid-cols-2 md:grid-cols-5 md:p-6"
      >
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="relative flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border"
                  style={{
                    borderColor: 'var(--theme-accent)',
                    color: 'var(--theme-accent)',
                  }}
                >
                  <Icon size={14} />
                </span>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  {String(i + 1).padStart(2, '0')} · {s.label}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-ice/80">{s.body}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Strong operational callout */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ delay: 0.3, duration: 0.7, ease: ease.premium }}
        className="mt-10 rounded-sm border p-6 backdrop-blur-sm md:p-8"
        style={{
          background: 'var(--theme-badge-bg)',
          borderColor: 'var(--theme-badge-border)',
        }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.35em]"
          style={{ color: 'var(--theme-badge-text)' }}
        >
          Operational target
        </p>
        <p className="mt-2 text-base leading-relaxed text-white md:text-lg">
          From doctor report to ADAC file in minutes — structured report, nursing
          execution, coded invoice and breakdowns from one digital case record.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ice/80">
          Internal workflow target: ADAC-ready report and invoice pack within one
          working minute after clinical confirmation for standard package cases.
          This is an internal operational target, not a contractual guarantee.
        </p>
      </motion.div>

      {/* Immersive 8-step walkthrough */}
      <section className="relative mt-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.35em]"
              style={{ color: 'var(--theme-accent)' }}
            >
              The walkthrough
            </p>
            <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">
              Eight steps · one connected case
            </h2>
          </div>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-ice/60 md:block">
            Scroll to reveal
          </p>
        </div>

        {/* Phase 2.4M polish: the previous continuous vertical gold rail
            was removed because it overlapped step text in flipped panels.
            Step ordering is now communicated only by STEP badges, the
            "n / 8" progress label, and per-step mini progress bars. */}

        <ol className="space-y-28 md:space-y-36">
          {steps.map((s, i) => (
            // index is forwarded for future variants; the new full-width
            // hero layout no longer alternates left/right.
            <StepPanel key={s.n} step={s} index={i} />
          ))}
        </ol>
      </section>

      {/* What this means for ADAC */}
      <motion.aside
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: ease.premium }}
        className="mt-24 rounded-sm border p-6 backdrop-blur-sm md:p-8"
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
              What this means for ADAC
            </p>
            <p className="mt-2 text-base leading-relaxed text-white md:text-lg">
              ADAC files arrive as a coherent pack: structured medical report,
              proposed coded invoice, labs / medication breakdowns and attachments
              — assembled from one digital case record, reviewed by clinicians and
              operators, and ready in minutes rather than hours for standard
              package cases.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ice/80">
              Semi-automatic preparation · nurse-confirmed execution ·
              operator-confirmed invoice. No claim of fully automatic final
              invoice; every dispatch is human-reviewed.
            </p>
          </div>
        </div>
      </motion.aside>
    </article>
  );
}

function StepPanel({ step }: { step: Step; index: number }) {
  const { ref, inView } = useScrollReveal({ threshold: 0.12 });

  return (
    <li ref={ref} className="flex flex-col gap-8">
      {/* 1. Step header row — STEP 01 · Title · 1 / 8 */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.6, ease: ease.premium }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            Step {String(step.n).padStart(2, '0')}
          </p>
          <p
            className="font-mono text-[10px] tracking-[0.25em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            {step.n} / {TOTAL}
          </p>
        </div>
        {/* Per-step progress bar */}
        <motion.div
          aria-hidden
          className="mt-2 h-px w-full origin-left"
          style={{ background: 'var(--theme-accent)', opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: step.n / TOTAL } : { scaleX: 0 }}
          transition={{ duration: 1.0, ease: ease.premium, delay: 0.1 }}
        />
        <h3 className="mt-4 font-display text-2xl leading-tight text-white md:text-3xl lg:text-4xl">
          {step.title}
        </h3>
      </motion.header>

      {/* 2. Full-width screenshot — the hero of the step */}
      <motion.figure
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={
          inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.97 }
        }
        transition={{ duration: 0.9, ease: ease.premium, delay: 0.15 }}
        className="w-full"
      >
        <div
          className="relative mx-auto overflow-hidden rounded-sm border border-white/10 bg-navy/40"
          style={{
            boxShadow:
              '0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,97,0.08)',
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-3 z-10 h-3.5 w-3.5 border-l border-t opacity-70"
            style={{ borderColor: 'var(--theme-accent)' }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 z-10 h-3.5 w-3.5 border-b border-r opacity-60"
            style={{ borderColor: 'var(--theme-accent)' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SHOT(step.n)}
            alt={`Step ${step.n} — ${step.title}`}
            className="mx-auto block h-auto w-full object-contain"
            style={{ maxHeight: '70vh' }}
            loading="lazy"
          />
        </div>
      </motion.figure>

      {/* 3. Three compact caption blocks underneath — desktop 3-up, stacked on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: ease.premium, delay: 0.3 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
      >
        {/* What happens */}
        <div className="rounded-sm border border-white/10 bg-navy/40 p-4 backdrop-blur-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ice/85">
            What happens
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ice/85">
            {step.whatHappens}
          </p>
        </div>

        {/* Why it is smart */}
        <div className="rounded-sm border border-white/10 bg-navy/40 p-4 backdrop-blur-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ice/85">
            Why it is smart
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ice/85">
            {step.whySmart}
          </p>
        </div>

        {/* ADAC value — theme accent emphasis */}
        <div
          className="rounded-sm border p-4 backdrop-blur-sm"
          style={{
            background: 'var(--theme-badge-bg)',
            borderColor: 'var(--theme-badge-border)',
          }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: 'var(--theme-badge-text)' }}
          >
            ADAC value
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white">
            {step.adacValue}
          </p>
        </div>
      </motion.div>
    </li>
  );
}
