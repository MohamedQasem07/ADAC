'use client';

import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

/**
 * آ§10.1 â€” Sample medical report mock. Uses realistic but clearly dummy
 * fields and bears a prominent "SAMPLE آ· NOT A REAL PATIENT" watermark
 * across the card so there's no chance of misinterpretation.
 *
 * Content is intentionally hardcoded here because the dummy patient
 * data should not live alongside other editable content â€” the watermark
 * makes the ethics clear.
 */
export function SampleReportCard() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="mx-auto w-full max-w-4xl px-8 py-24">
      <motion.header
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: ease.premium }}
        className="mb-10 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-theme">آ§10.1</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Medical Report Template
        </h2>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-ink-soft/70">
          What every ADAC case receives â€” same day
        </p>
      </motion.header>

      {/* The report card */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.9, ease: ease.premium }}
        className="relative overflow-hidden rounded-sm border border-theme/30 bg-white text-ink-dark shadow-card-hover"
      >
        {/* Diagonal watermark */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            transform: 'rotate(-22deg)',
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontFamily: 'var(--font-playfair), Georgia, serif',
            color: 'rgba(201, 169, 97, 0.18)',
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}
        >
          SAMPLE آ· NOT A REAL PATIENT
        </span>

        {/* Top strip */}
        <div className="relative bg-navy-medium px-8 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Stethoscope size={18} className="text-theme" />
              <div>
                <p className="font-display text-base font-semibold">Hurghada Medical Center</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                  Detailed Medical Report
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                Report ID
              </p>
              <p className="font-mono text-sm">HMC-2026-0517-0089</p>
            </div>
          </div>
        </div>

        {/* Body â€” two-column */}
        <div className="relative grid gap-6 px-8 py-10 md:grid-cols-2">
          <Field label="Patient" value="M.K. (initials only)" />
          <Field label="DOB / Age" value="1962-04-11 آ· 63 yrs" />
          <Field label="Nationality" value="DE â€” German" />
          <Field label="Insurance" value="ADAC AG Holder" />
          <Field label="Date of attendance" value="2026-05-17 آ· 19:42" />
          <Field label="Location" value="Hotel room visit â€” Sahl Hasheesh" />
          <FieldFull
            label="Presenting complaint"
            value="Acute watery diarrhea (â‰¥6 episodes/24h), nausea, low-grade fever, mild dehydration."
          />
          <FieldFull
            label="Examination"
            value="GCS 15 آ· BP 124/78 آ· HR 92 آ· SpOâ‚‚ 98% آ· Temp 37.6 آ°C. Mild dehydration. Soft abdomen, mild diffuse tenderness, no peritonism. CV/RS unremarkable."
          />
          <FieldFull
            label="Diagnosis"
            value="Acute gastroenteritis with mild dehydration آ· ICD-10 A09"
          />
          <FieldFull
            label="Treatment delivered (HMC-GI-02)"
            value="IV cannula + 1أ— 1 L Ringer's lactate آ· IM metoclopramide 10 mg آ· Oral loperamide 4 mg loading dose آ· Oral rehydration salts آ· Nursing observation 90 min. Patient stable on discharge, tolerating oral fluids."
          />
          <FieldFull
            label="Disposition"
            value="Discharged to hotel. Safety-net advice provided. Follow-up phone check at 12 h."
          />
          <Field label="Treating physician" value="Dr. A.S., MD" />
          <Field label="Package code" value="HMC-GI-02" />
        </div>

        {/* Footer strip */}
        <div className="relative flex items-center justify-between border-t border-ink-medium/10 bg-ice px-8 py-3 text-[10px] uppercase tracking-[0.25em] text-ink-medium">
          <span>Issued same day آ· digitally signed</span>
          <span>Page 1 of 1</span>
        </div>
      </motion.article>

      <p className="mt-6 text-center text-xs italic text-ink-soft/70">
        All clinical details fabricated for demonstration. Real ADAC reports follow this exact structure and are dispatched within the same operational day.
      </p>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-ink-medium/70">{label}</p>
      <p className="mt-1 text-sm text-ink-dark">{value}</p>
    </div>
  );
}

function FieldFull({ label, value }: { label: string; value: string }) {
  return (
    <div className="md:col-span-2">
      <p className="text-[10px] uppercase tracking-[0.25em] text-ink-medium/70">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-dark">{value}</p>
    </div>
  );
}

