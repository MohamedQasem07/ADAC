'use client';

import { motion } from 'framer-motion';
import {
  UserPlus,
  Wallet,
  Stethoscope,
  Receipt,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

/**
 * Section 10.5 — Digital Package Workflow.
 *
 * Premium animated screenshot story showing the real digital case workflow
 * behind HMC's outpatient package model (case registration → handling type →
 * structured medical report → coded services → nursing sheet → semi-automatic
 * invoice & breakdowns → discharge / generated output).
 *
 * Wording rules respected:
 *  - "can prepare" · "semi-automatic" · "operator-confirmed" · "nurse-confirmed"
 *  - "proposed coded invoice rows" · "within seconds after clinical confirmation"
 *  - Internal time target labelled as operational target, not a guarantee
 *  - Screenshots flagged as demo material, no patient-sensitive data intended
 *
 * 8 demo screenshots in numeric order from /public/screenshots/digital-workflow/.
 * Each reveals with a subtle staggered motion (opacity 0→1 · y 24→0 · scale 0.97→1).
 * A soft gold progress line connects the cards on desktop · vertical on mobile.
 */

interface FiveStage {
  number: string;
  title: string;
  icon: LucideIcon;
  body: string;
}

interface Frame {
  step: string;
  src: string;
  title: string;
  caption: string;
}

export function DigitalWorkflowShowcase() {
  const { ref: headerRef, inView: headerIn } = useScrollReveal({ threshold: 0.1 });
  const { ref: stagesRef, inView: stagesIn } = useScrollReveal({ threshold: 0.15 });
  const { ref: storyRef, inView: storyIn } = useScrollReveal({ threshold: 0.05 });
  const { ref: outroRef, inView: outroIn } = useScrollReveal({ threshold: 0.2 });

  const fiveStages: FiveStage[] = [
    {
      number: '01',
      title: 'Patient registration',
      icon: UserPlus,
      body:
        'Patient demographics, nationality, hotel/resort, dates, branch / location, case provider, and doctor / nurse on duty when available — captured digitally from any HMC clinic.',
    },
    {
      number: '02',
      title: 'Case handling type',
      icon: Wallet,
      body:
        'Settled by patient / cash · settled by insurance · transfer · or free case when approved. Chosen up-front so the rest of the file pack is composed accordingly.',
    },
    {
      number: '03',
      title: 'Structured medical report',
      icon: Stethoscope,
      body:
        'Doctor works inside a 7-step digital report: Examination · Labs · Imaging · Procedures · Treatment & Medications · Follow-up · Discharge. Ready clinical templates can be used for common package cases; the doctor reviews and adjusts case-specific details.',
    },
    {
      number: '04',
      title: 'Coded invoice & breakdowns',
      icon: Receipt,
      body:
        'Proposed coded invoice rows and itemized breakdowns (labs · medications · imaging · procedures · consumables · services) are prepared from the structured clinical data and operator-confirmed before final save.',
    },
    {
      number: '05',
      title: 'Discharge & file pack',
      icon: CheckCircle2,
      body:
        'Discharge instructions and follow-up plan complete the case. The file pack — medical report, nursing execution record, coded invoice, and breakdowns — is ready for review and ADAC submission.',
    },
  ];

  const frames: Frame[] = [
    {
      step: '01',
      src: 'screenshots/digital-workflow/1.png',
      title: 'Patient registration',
      caption:
        'Case is registered digitally with patient details, branch, dates, and provider — the start of the structured file.',
    },
    {
      step: '02',
      src: 'screenshots/digital-workflow/2.png',
      title: 'Case handling type',
      caption:
        'Cash · insurance · transfer · or free case — selected up-front so the downstream report and invoice are routed correctly.',
    },
    {
      step: '03',
      src: 'screenshots/digital-workflow/3.png',
      title: 'Medical stage gateway',
      caption:
        'Entry point to the 7-stage clinical report. Each stage is structured rather than free-text, supporting consistent reporting across all HMC locations.',
    },
    {
      step: '04',
      src: 'screenshots/digital-workflow/4.png',
      title: 'Medical report wizard',
      caption:
        'Doctor completes the structured report stage-by-stage — no handwritten paper. Empty sections are omitted from print automatically.',
    },
    {
      step: '05',
      src: 'screenshots/digital-workflow/5.png',
      title: 'Clinical template picker',
      caption:
        'Ready clinical templates can pre-fill complaint, vitals, examination, diagnosis, suggested labs, imaging, procedures, medications, treatment plan, and discharge instructions for common package cases.',
    },
    {
      step: '06',
      src: 'screenshots/digital-workflow/6.png',
      title: 'Coded labs & services',
      caption:
        'Labs, services, procedures, imaging, medications, and consumables can be selected from HMC’s coded catalogue — reducing free-text errors and avoiding generic invoice rows.',
    },
    {
      step: '07',
      src: 'screenshots/digital-workflow/7.png',
      title: 'Nursing sheet & proposed invoice',
      caption:
        'After clinical confirmation, the system can prepare a nursing sheet and proposed coded invoice rows + breakdowns within seconds. Nurse confirms executed items; operator reviews the invoice before final save.',
    },
    {
      step: '08',
      src: 'screenshots/digital-workflow/8.png',
      title: 'Generated medical report output',
      caption:
        'Final print-ready medical report — same structured output on either HMC or SMC letterhead, ready to bundle with the coded invoice and breakdowns into an ADAC file pack.',
    },
  ];

  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
      {/* ───── Hero header ───────────────────────────────────────────── */}
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: 18 }}
        animate={headerIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
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
          From case registration to ADAC-ready file. HMC&rsquo;s outpatient package model is
          supported by a real digital case workflow — structured medical report, coded
          services, nursing sheet, and semi-automatic invoice preparation — not handwritten
          paperwork.
        </p>
        <div className="gold-rule mt-6 w-20" />
      </motion.header>

      {/* ───── Five-stage workflow strip ─────────────────────────────── */}
      <motion.ol
        ref={stagesRef}
        variants={staggerTight}
        initial="hidden"
        animate={stagesIn ? 'visible' : 'hidden'}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {fiveStages.map((s) => {
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
                  Stage {s.number}
                </p>
                <Icon
                  size={16}
                  style={{ color: 'var(--theme-accent)' }}
                  className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <p className="mt-2 font-display text-base leading-snug text-white">
                {s.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ice/80">{s.body}</p>
            </motion.li>
          );
        })}
      </motion.ol>

      {/* ───── Operational target callout ────────────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        animate={stagesIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ delay: 0.35, duration: 0.7, ease: ease.premium }}
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
        <p className="mt-3 text-base leading-relaxed text-white md:text-lg">
          For standard package cases, once the doctor confirms the report, the system can
          prepare the nursing sheet and proposed coded invoice / breakdowns within seconds —
          allowing the case file to be reviewed and sent to ADAC in minutes rather than hours.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-ice/75 md:text-sm">
          Internal workflow target: ADAC-ready report and invoice pack within one working
          minute after clinical confirmation for standard package cases. This is an internal
          operational target, not a contractual guarantee.
        </p>
      </motion.aside>

      {/* ───── Animated screenshot story (8 frames in order) ─────────── */}
      <div ref={storyRef} className="relative mt-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={storyIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, ease: ease.premium }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.4em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            Workflow walkthrough · 8 stages
          </p>
          <h2 className="mt-3 font-display text-2xl text-white md:text-3xl">
            From registration to generated report — one digital case record
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ice/80 md:text-base">
            Demo workflow screens · no patient-sensitive data intended for presentation.
          </p>
        </motion.div>

        {/* Gold progress rail · runs behind the cards on desktop, vertical on mobile */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-32 hidden h-[1px] w-full opacity-30 md:block"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--theme-accent) 12%, var(--theme-accent) 88%, transparent 100%)',
          }}
        />

        <motion.ol
          variants={staggerTight}
          initial="hidden"
          animate={storyIn ? 'visible' : 'hidden'}
          className="relative mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {frames.map((f) => (
            <motion.li
              key={f.step}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.97 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.7, ease: ease.premium },
                },
              }}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/50 p-3 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-gold/40 hover:shadow-[0_18px_40px_-10px_rgba(201,169,97,0.22)]"
            >
              {/* Step badge */}
              <div className="flex items-baseline justify-between px-1 pb-2">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.35em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  Step {f.step}
                </span>
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full opacity-70"
                  style={{ background: 'var(--theme-accent)' }}
                />
              </div>

              {/* Screenshot frame */}
              <div
                className="relative w-full overflow-hidden rounded-[2px] border border-white/10 bg-black/40"
                style={{ aspectRatio: '16 / 10' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.src}
                  alt={`Demo screen ${f.step} — ${f.title}. No real patient data.`}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Title + caption */}
              <div className="mt-3 flex flex-col px-1 pb-1">
                <p className="font-display text-sm font-semibold leading-snug text-white">
                  {f.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ice/75">{f.caption}</p>
              </div>

              {/* Corner accents (mirrors stage strip) */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1 top-1 h-2 w-2 border-l border-t opacity-70"
                style={{ borderColor: 'var(--theme-accent)' }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r opacity-50"
                style={{ borderColor: 'var(--theme-accent)' }}
              />
            </motion.li>
          ))}
        </motion.ol>

        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ice/55">
          Demo workflow screens · no patient-sensitive data intended for presentation.
        </p>
      </div>

      {/* ───── What this means for ADAC ──────────────────────────────── */}
      <motion.aside
        ref={outroRef}
        initial={{ opacity: 0, y: 18 }}
        animate={outroIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7, ease: ease.premium }}
        className="mt-16 rounded-sm border p-6 backdrop-blur-sm md:p-8"
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
              ADAC receives a structured medical report, a nursing execution record, a
              coded invoice, and itemized breakdowns when requested — composed from one
              digital case record, with fewer documentation gaps and a consistent format
              across every HMC location.
            </p>
          </div>
        </div>
      </motion.aside>

      {/* ───── Strong final callout ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={outroIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ delay: 0.25, duration: 0.7, ease: ease.premium }}
        className="mt-10 rounded-sm border border-white/10 bg-navy/40 p-8 text-center backdrop-blur-sm md:p-10"
      >
        <p className="mx-auto max-w-3xl font-display text-xl leading-snug text-white md:text-2xl">
          From doctor report to ADAC file in minutes — structured report, nursing execution,
          coded invoice, and breakdowns from{' '}
          <span style={{ color: 'var(--theme-accent)' }}>one digital case record.</span>
        </p>
      </motion.div>
    </article>
  );
}
