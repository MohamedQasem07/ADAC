'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

const INCLUDED = [
  'Doctor assessment',
  'Standard treatment within package scope',
  'Standard medication and consumables within package scope',
  'Medical report',
  'Same-day case summary',
  'Single package-coded invoice',
];

const SEPARATE = [
  'Ambulance dispatch',
  'ER coordination',
  'Hospital admission',
  'Advanced imaging beyond package scope',
  'Specialist escalation',
  'Third-party logistics',
  'Any red-flag or out-of-scope clinical escalation',
];

/**
 * Phase 2.4N — Universal Inclusions / Exclusions strip.
 *
 * Mounted on §12 (Package Catalogue cover) and §13 (Pricing Philosophy
 * cover). One compact two-column card so the audience can answer the
 * question "what's in the package number / what's quoted on top of it?"
 * without scrolling through §13's four subtopics.
 *
 * Theme-aware. No prices. No package codes. Static content.
 */
export function UniversalInclusionsStrip() {
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.7, ease: ease.premium }}
      className="mx-auto w-full max-w-6xl px-8"
      aria-label="Universal inclusions and exclusions"
    >
      <div className="rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          {/* Always included */}
          <div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex h-6 w-6 items-center justify-center rounded-sm border"
                style={{
                  borderColor: 'var(--theme-accent)',
                  color: 'var(--theme-accent)',
                }}
              >
                <CheckCircle2 size={13} />
              </span>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.32em]"
                style={{ color: 'var(--theme-accent)' }}
              >
                Always included
              </p>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ice/85">
              In every standard outpatient package
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ice/85 md:text-base">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                    style={{ background: 'var(--theme-accent)' }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quoted separately */}
          <div
            className="rounded-sm border p-5 backdrop-blur-sm"
            style={{
              background: 'var(--theme-badge-bg)',
              borderColor: 'var(--theme-badge-border)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex h-6 w-6 items-center justify-center rounded-sm border"
                style={{
                  borderColor: 'var(--theme-badge-border)',
                  color: 'var(--theme-badge-text)',
                }}
              >
                <AlertTriangle size={13} />
              </span>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.32em]"
                style={{ color: 'var(--theme-badge-text)' }}
              >
                Quoted separately · escalation
              </p>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ice/85">
              Outside the flat-rate envelope
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ice/85 md:text-base">
              {SEPARATE.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                    style={{ background: 'var(--theme-badge-text)' }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-xs italic text-ice/70 md:text-sm">
          Mode of delivery does not change the package logic unless clinical
          escalation or out-of-scope services are required.
        </p>
      </div>
    </motion.section>
  );
}
