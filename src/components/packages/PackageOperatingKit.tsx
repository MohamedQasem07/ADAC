'use client';

import { motion } from 'framer-motion';
import {
  ClipboardList,
  Stethoscope,
  CheckSquare,
  Shield,
  FileText,
  HeartPulse,
  Receipt,
  Layers,
  Send,
  type LucideIcon,
} from 'lucide-react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

interface KitBlock {
  label: string;
  icon: LucideIcon;
  example: string;
}

const BLOCKS: KitBlock[] = [
  {
    label: 'Package code',
    icon: ClipboardList,
    example: 'HMC-GI-03',
  },
  {
    label: 'Clinical indication',
    icon: Stethoscope,
    example: 'Acute gastroenteritis with dehydration (ICD-10 A09).',
  },
  {
    label: 'Included scope',
    icon: CheckSquare,
    example:
      'Doctor exam · vital signs · IV cannula + 2 IV bags · IM/IV anti-emetic · oral meds · 2-hour observation · report.',
  },
  {
    label: 'Excluded / escalation',
    icon: Shield,
    example:
      'Persistent vomiting beyond limit, severe dehydration unresponsive to IV, bloody diarrhoea, paediatric under 1 year — §11 admission pathway.',
  },
  {
    label: 'Medical report template',
    icon: FileText,
    example:
      'Structured 7-block report — presenting complaint, examination, diagnosis, treatment, disposition, physician sign-off, package code.',
  },
  {
    label: 'Nursing sheet template',
    icon: HeartPulse,
    example:
      'IV cannula site, fluid type / volume / rate, medications administered with time stamps, observation vitals, nurse confirmation.',
  },
  {
    label: 'Coded invoice line',
    icon: Receipt,
    example:
      'Single line: package code · description · flat-rate · case ID · GOP reference.',
  },
  {
    label: 'Breakdown template',
    icon: Layers,
    example:
      'On request: medication and consumables breakdown attached as supporting document — no change to the headline invoice line.',
  },
  {
    label: 'ADAC reporting output',
    icon: Send,
    example:
      'Same-day case summary + medical report + invoice + supporting breakdown delivered as one ADAC-ready pack.',
  },
];

/**
 * Phase 2.4N — Package Operating Kit concept (concise version).
 *
 * Single horizontal flow showing how a package becomes operational
 * across nine connected blocks: code → indication → included →
 * excluded → report template → nursing template → invoice → breakdown
 * → ADAC reporting output.
 *
 * GI-03 is used purely as the example — matches §13.5 Worked Example
 * and §10.1 Sample Report so the audience can connect the three views
 * to one shared example.
 *
 * Static visual concept. No prices, no new templates rendered. Mounted
 * inside §13 cover.
 */
export function PackageOperatingKit() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="mx-auto mt-20 w-full max-w-6xl px-8"
      aria-label="Package operating kit concept"
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
          Package operating kit · concept
        </p>
        <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">
          From package code to ADAC file — one connected kit
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ice/85 md:text-base">
          Each package family can be supported by a matching operating
          kit: clinical indication, included scope, escalation boundary,
          medical report template, nursing sheet template, coded invoice
          line, breakdown template, and the ADAC reporting output. The
          chain below uses <span className="text-white">HMC-GI-03 Acute Gastroenteritis with Dehydration</span> as
          the worked example — already shown in §13.5 (Worked Example) and §10.1 (Sample Report).
        </p>
      </motion.header>

      <motion.ol
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {BLOCKS.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.li
              key={b.label}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: ease.premium },
                },
              }}
              className="relative overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-4 backdrop-blur-sm"
            >
              <div className="flex items-baseline justify-between">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  Block {String(i + 1).padStart(2, '0')}
                </p>
                <Icon
                  size={14}
                  style={{ color: 'var(--theme-accent)' }}
                  className="opacity-80"
                />
              </div>
              <p className="mt-2 font-display text-base leading-tight text-white">
                {b.label}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ice/85 md:text-sm">
                {b.example}
              </p>
            </motion.li>
          );
        })}
      </motion.ol>

      <p className="mt-6 text-center text-xs italic text-ice/70 md:text-sm">
        Concept view. Full per-category templates can be prepared during
        the June preparation phase.
      </p>
      <p className="mt-3 text-center text-sm leading-relaxed text-white md:text-base">
        Every approved package family can receive a matching medical report
        template, nursing sheet template, invoice line, and breakdown format
        during the June preparation phase.
      </p>
    </section>
  );
}
