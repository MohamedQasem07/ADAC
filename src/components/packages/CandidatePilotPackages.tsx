'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Brain,
  Droplets,
  FlaskConical,
  ScanLine,
  ShellIcon,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

interface Candidate {
  family: string;
  icon: LucideIcon;
  whyADAC: string;
  mayInclude: string;
  escalationTrigger: string;
}

const CANDIDATES: Candidate[] = [
  {
    family: 'UTI / uncomplicated urinary symptoms',
    icon: Droplets,
    whyADAC:
      'Common in female travelers post-flight or after heat exposure; predictable outpatient presentation.',
    mayInclude:
      'Doctor exam, urine dipstick, oral antibiotic course, oral analgesic, medical report.',
    escalationTrigger:
      'Pyelonephritis signs (high fever, flank pain) → §11 escalation pathway.',
  },
  {
    family: 'Acute migraine / headache',
    icon: Brain,
    whyADAC:
      'Frequent senior-traveler presentation; often after heat, dehydration, or sleep disruption.',
    mayInclude:
      'Doctor exam, IV antiemetic, IV fluids, oral analgesic, brief observation, report.',
    escalationTrigger:
      'Red-flag headache (sudden onset, focal neuro signs) → §11 ambulance pathway.',
  },
  {
    family: 'Cellulitis / soft-tissue infection',
    icon: Activity,
    whyADAC:
      'Common in resort settings (insect bites, abrasions, sun exposure); needs outpatient observation.',
    mayInclude:
      'Doctor exam, wound assessment, IV antibiotic loading dose, oral course, photo documentation, report.',
    escalationTrigger:
      'Sepsis or SIRS signs, lymphangitic spread → §11 admission pathway.',
  },
  {
    family: 'Extended laboratory add-on',
    icon: FlaskConical,
    whyADAC:
      'When the assistance team requests more workup than the base package includes.',
    mayInclude:
      'Selected from CBC, CRP, electrolytes, LFT, RFT, urinalysis per clinical question.',
    escalationTrigger:
      'Specialised assays (toxicology, advanced serology) → quoted separately.',
  },
  {
    family: 'Additional imaging add-on',
    icon: ScanLine,
    whyADAC:
      'When the base package did not include imaging but the case justifies one X-Ray or bedside ultrasound.',
    mayInclude:
      'Single additional X-Ray view + radiologist note, or bedside ultrasound with image attachment.',
    escalationTrigger:
      'Advanced imaging (CT / MRI / formal radiology) → quoted separately or escalation pathway.',
  },
  {
    family: 'Mild marine sting / jellyfish exposure',
    icon: Waves,
    whyADAC:
      'Mild presentations frequently seen at Red Sea resorts; today only the severe variant exists.',
    mayInclude:
      'Wound clean, topical or oral analgesic, brief observation, report.',
    escalationTrigger:
      'Anaphylaxis or systemic reaction → §11 ambulance pathway.',
  },
  {
    family: 'Vertigo / vestibular symptoms',
    icon: ShellIcon,
    whyADAC:
      'Maritime and diving travelers; common presentation that does not yet have a dedicated package.',
    mayInclude:
      'Doctor exam, Dix-Hallpike if appropriate, IV antiemetic, observation, report.',
    escalationTrigger:
      'Central neurological signs (focal deficit, ataxia, dysarthria) → §11 ambulance pathway.',
  },
];

/**
 * Phase 2.4N — Candidate Packages for Pilot Scope Alignment.
 *
 * These are NOT priced packages. They are discussion candidates for
 * ADAC pilot scope alignment, intentionally separate from the
 * 65 packages in packages.json. Each card carries the explicit
 * "To be scoped and priced during June preparation phase" chip so
 * the audience never confuses them with the live catalogue.
 *
 * Static content in this component; packages.json is not modified.
 */
export function CandidatePilotPackages() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="mx-auto mt-20 w-full max-w-6xl px-8"
      aria-label="Candidate packages for pilot scope alignment"
    >
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: ease.premium }}
        className="mb-8 max-w-3xl"
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.35em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          Pilot scope alignment
        </p>
        <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">
          Candidate Packages for Pilot Scope Alignment
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ice/85 md:text-base">
          The 65 active catalogue packages already cover the most common
          outpatient scenarios. The seven families below are <span className="text-white">discussion
          candidates only</span> — outpatient presentations HMC can scope for the pilot
          if ADAC wants broader coverage. None are priced today.
        </p>
      </motion.header>

      <motion.ul
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {CANDIDATES.map((c) => {
          const Icon = c.icon;
          return (
            <motion.li
              key={c.family}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: ease.premium },
                },
              }}
              className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-5 backdrop-blur-sm"
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

              <div className="flex items-start gap-2">
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
                <h3 className="font-display text-base leading-tight text-white md:text-lg">
                  {c.family}
                </h3>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ice/85">
                <div>
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.28em] text-ice/70"
                  >
                    Why ADAC may need it
                  </p>
                  <p className="mt-1">{c.whyADAC}</p>
                </div>
                <div>
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.28em] text-ice/70"
                  >
                    What it may include
                  </p>
                  <p className="mt-1">{c.mayInclude}</p>
                </div>
                <div>
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.28em] text-ice/70"
                  >
                    Escalation trigger
                  </p>
                  <p className="mt-1">{c.escalationTrigger}</p>
                </div>
              </div>

              <p
                className="mt-4 inline-flex items-center self-start rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.22em]"
                style={{
                  borderColor: 'var(--theme-badge-border)',
                  background: 'var(--theme-badge-bg)',
                  color: 'var(--theme-badge-text)',
                }}
              >
                To be scoped and priced during June preparation phase
              </p>
            </motion.li>
          );
        })}
      </motion.ul>

      <p className="mt-6 text-center text-xs italic text-ice/70 md:text-sm">
        Candidate families only. Not active catalogue packages. The 65-package
        catalogue above remains unchanged.
      </p>
    </section>
  );
}
