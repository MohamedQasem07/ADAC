'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FileText, RefreshCw, Stethoscope } from 'lucide-react';
import { fallbackPackagesData } from '@/data/fallback';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { Package, PackageCategory } from '@/types/content';
import { PriceBadge } from './PriceBadge';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const HMC_LOGO = `${BASE_PATH}/brand/hmc-logo-white.png`;

/**
 * Phase 2.4Q — Package Template Simulator (§13.6).
 *
 * Live demo page. Presenter picks a category and a package, clicks
 * Load Package Template, and the page generates a category-level
 * editable medical report template + a scenario-aware invoice
 * preview that uses the package's real "included" items from
 * packages.json.
 *
 * Default-loaded package on mount: HMC-GI-03 (matches §13.5 Worked
 * Example so the audience can connect the two pages mentally).
 *
 * Locked rules respected:
 *   - No invented prices — uses pkg.prices via existing <PriceBadge>
 *   - No invented patient identity — defaults are obvious placeholders
 *   - Scenario A continues to render "To be agreed"
 *   - No Scenario A/B/C audience labels
 *   - No localStorage / persistence
 *   - Override-aware: respects Control Mode applyPackages()
 */

interface ReportFields {
  patientInitials: string;
  adacRef: string;
  hmcRef: string;
  date: string;
  complaint: string;
  vitals: string;
  examination: string;
  diagnosis: string;
  investigations: string;
  treatment: string;
  medications: string;
  procedures: string;
  dischargeAdvice: string;
  followUp: string;
}

type CategoryTemplate = Omit<
  ReportFields,
  'patientInitials' | 'adacRef' | 'hmcRef' | 'date'
>;

/* ───────────────── Category-level templates (9) ───────────────── */

const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  GI: {
    complaint:
      'Acute watery diarrhoea, nausea / vomiting, mild abdominal cramps over the past 24 hours.',
    vitals: 'BP 124/78 · HR 92 · Temp 37.6 °C · SpO2 98% · GCS 15.',
    examination:
      'Mild dehydration · soft abdomen · mild diffuse tenderness · no peritonism · CV / RS unremarkable.',
    diagnosis: 'Acute gastroenteritis with mild dehydration · ICD-10 A09.',
    investigations:
      'Bedside vitals · clinical hydration assessment · labs as per package scope.',
    treatment:
      'IV cannula + 1–2 IV bags (Ringer / saline) · IM/IV anti-emetic · oral anti-diarrhoeal · nursing observation 60–120 min.',
    medications:
      'Per package scope — anti-emetic, anti-diarrhoeal, oral rehydration salts.',
    procedures: 'IV access · fluid administration · clinical reassessment at 60 min.',
    dischargeAdvice:
      'Oral rehydration · small frequent fluids · bland diet · return if vomiting persists or signs of severe dehydration.',
    followUp: 'Phone check at 12 h · return to clinic if not improving in 24 h.',
  },
  RX: {
    complaint:
      'Cough, fever, sore throat, with or without shortness of breath, over the past 48–72 hours.',
    vitals: 'BP 122/76 · HR 96 · Temp 38.4 °C · SpO2 97% · RR 18 · GCS 15.',
    examination:
      'Throat erythematous · tonsils mildly enlarged · chest auscultation as appropriate · no respiratory distress at rest.',
    diagnosis:
      'Acute upper respiratory tract infection / pharyngotonsillitis · ICD-10 J06.',
    investigations:
      'Bedside vitals · oxygen saturation · labs / imaging only if package scope includes them.',
    treatment:
      'Symptomatic antipyretic · oral analgesic · nebulizer session if indicated · supportive measures.',
    medications:
      'Per package scope — antipyretic, oral analgesic, antibiotic if clinically indicated.',
    procedures: 'Nebulizer session if package includes it · throat assessment.',
    dischargeAdvice:
      'Hydration · rest · antipyretic at fever > 38 °C · return if shortness of breath or persistent high fever.',
    followUp: 'Phone check at 24 h · return to clinic if no improvement in 72 h.',
  },
  WD: {
    complaint:
      'Open wound / laceration / minor trauma sustained in the past hours; bleeding controlled at presentation.',
    vitals: 'BP 126/78 · HR 84 · Temp 36.9 °C · SpO2 99% · GCS 15.',
    examination:
      'Wound site assessed · depth and length documented · neurovascular status distal to wound intact · no foreign body palpable.',
    diagnosis:
      'Laceration · sutured / dressed · ICD-10 by anatomical site (e.g. S01 head, S61 wrist/hand).',
    investigations:
      'Bedside inspection · X-ray included only if package includes imaging (e.g. suspected foreign body).',
    treatment:
      'Wound cleaning · local anaesthetic infiltration · suturing or steri-strip · dressing per protocol.',
    medications: 'Per package scope — local anaesthetic, oral analgesic, tetanus prophylaxis if required.',
    procedures: 'Wound cleaning · suturing · dressing application · neurovascular re-check.',
    dischargeAdvice:
      'Keep wound dry 24 h · return for suture removal per anatomical site · return earlier if signs of infection.',
    followUp:
      'Suture removal visit (3–14 days depending on site) · phone check at 48 h.',
  },
  OR: {
    complaint:
      'Acute musculoskeletal pain / suspected sprain or fracture following injury within the past 24 hours.',
    vitals: 'BP 128/80 · HR 88 · Temp 37.0 °C · SpO2 98% · GCS 15.',
    examination:
      'Affected limb / joint examined · swelling and range of motion documented · neurovascular status distal intact · weight-bearing status noted.',
    diagnosis:
      'Soft tissue injury / sprain / suspected fracture · ICD-10 by anatomical site (e.g. S93 ankle).',
    investigations:
      'Clinical exam · X-ray of affected site if package includes imaging.',
    treatment:
      'Ice · elevation · compression · immobilization (splint / sling / plaster) per package scope.',
    medications: 'Per package scope — oral analgesic, anti-inflammatory.',
    procedures:
      'X-ray (if package scope) · immobilization application · neurovascular re-check post-immobilization.',
    dischargeAdvice:
      'Elevation · ice 20 minutes every 2–3 h for 24–48 h · weight-bearing per advice · return if neurovascular compromise.',
    followUp: 'Re-assessment in 5–7 days · earlier if pain or swelling worsens.',
  },
  EN: {
    complaint:
      'Ear pain / discharge / blocked sensation; or sore throat with difficulty swallowing.',
    vitals: 'BP 124/78 · HR 86 · Temp 37.4 °C · SpO2 98% · GCS 15.',
    examination:
      'Ear canal inspected with otoscope · tympanic membrane assessed · throat and tonsils examined · cervical lymph nodes palpated.',
    diagnosis:
      'Acute otitis externa / media · or acute pharyngotonsillitis · ICD-10 H60 / H66 / J03.',
    investigations: 'Otoscopic examination · throat inspection.',
    treatment:
      'Ear cleaning / wash if indicated · topical ear drops · oral analgesic · antibiotic if clinically indicated.',
    medications:
      'Per package scope — topical ear preparation, oral analgesic, antibiotic when justified.',
    procedures: 'Ear cleaning / lavage if included in package · foreign body removal if applicable.',
    dischargeAdvice:
      'Keep ear dry · avoid swimming until follow-up · return if hearing loss persists or neurological signs develop.',
    followUp: 'Re-assessment in 7 days · earlier if symptoms worsen.',
  },
  DN: {
    complaint:
      'Acute dental pain / dental trauma / suspected dental abscess.',
    vitals: 'BP 122/78 · HR 84 · Temp 37.2 °C · SpO2 98% · GCS 15.',
    examination:
      'Oral cavity inspected · affected tooth identified · gingival inspection · no airway compromise.',
    diagnosis: 'Acute dental pain · pulpitis / periapical pathology · ICD-10 K04.',
    investigations:
      'Clinical dental examination · dental X-ray (if package scope includes imaging).',
    treatment:
      'Pain control · drainage if abscess and within scope · temporary filling or extraction if package scope.',
    medications:
      'Per package scope — oral analgesic, antibiotic if clinically indicated.',
    procedures:
      'Temporary filling · extraction · abscess drainage — as per selected package.',
    dischargeAdvice:
      'Soft diet 24 h · avoid hot fluids · return if swelling spreads or fever develops.',
    followUp:
      'Dental follow-up appointment as scheduled · phone check at 48 h.',
  },
  DR: {
    complaint:
      'Skin rash / itching / allergic reaction / insect bite / sunburn over the past hours.',
    vitals: 'BP 120/76 · HR 88 · Temp 37.1 °C · SpO2 99% · GCS 15.',
    examination:
      'Affected skin area examined · distribution and morphology noted · no signs of anaphylaxis · airway clear.',
    diagnosis: 'Acute allergic reaction / urticaria / dermatitis · ICD-10 L50 / T78.',
    investigations: 'Clinical skin examination · vital signs monitoring.',
    treatment:
      'Antihistamine (IM/IV/oral) · corticosteroid if package scope · topical preparation as indicated.',
    medications:
      'Per package scope — antihistamine, corticosteroid, topical cream.',
    procedures: 'Skin assessment · cool compress application if appropriate.',
    dischargeAdvice:
      'Avoid known triggers · use prescribed cream · return immediately if shortness of breath, swelling of face or throat.',
    followUp: 'Phone check at 24 h · return to clinic if rash spreads or fails to improve in 72 h.',
  },
  EY: {
    complaint:
      'Acute eye redness / irritation / foreign body sensation / discharge.',
    vitals: 'BP 122/78 · HR 84 · Temp 36.9 °C · SpO2 99% · GCS 15.',
    examination:
      'Visual acuity recorded · external eye examination · conjunctiva assessed · cornea inspected with magnification.',
    diagnosis: 'Acute conjunctivitis / corneal foreign body · ICD-10 H10 / S05.',
    investigations: 'Slit-lamp-style external examination · fluorescein assessment if package includes it.',
    treatment:
      'Eye wash · topical antibiotic eye drops · foreign body removal under magnification if scope.',
    medications:
      'Per package scope — topical antibiotic, lubricant drops, analgesic.',
    procedures: 'Foreign body removal · eye irrigation · post-removal assessment.',
    dischargeAdvice:
      'No eye rubbing · sunglasses for comfort · return if pain, vision loss, or photophobia worsens.',
    followUp: 'Re-assessment in 48–72 h.',
  },
  CR: {
    complaint:
      'Chest pain / palpitations / hypertensive symptoms / syncope — outpatient-screening presentation.',
    vitals: 'BP 148/92 · HR 96 · Temp 36.9 °C · SpO2 97% · GCS 15.',
    examination:
      'Cardiac auscultation · peripheral perfusion · neurological status · ECG performed at first contact.',
    diagnosis:
      'Outpatient cardiac assessment · low-risk chest pain / hypertensive urgency · ICD-10 R07 / I10.',
    investigations:
      '12-lead ECG · troponin if package scope · vital signs monitoring.',
    treatment:
      'Anti-hypertensive titration if indicated · oral analgesic · monitoring.',
    medications:
      'Per package scope — anti-hypertensive, anti-anginal, oral analgesic.',
    procedures: '12-lead ECG · serial vital signs · cardiac monitoring per package scope.',
    dischargeAdvice:
      'Strict return precautions — chest pain, shortness of breath, syncope, palpitations → return immediately or call emergency.',
    followUp:
      'Cardiology outpatient referral within 7 days · phone check at 24 h.',
  },
};

/* ───────────────── Helpers ───────────────── */

function makeDefaults(pkg: Package | null): ReportFields {
  const today = new Date().toISOString().slice(0, 10);
  const code = (pkg?.code ?? '').toLowerCase();
  // Find the matching template by 2-letter family within the code.
  const familyKey =
    ['GI', 'IV', 'RX', 'WD', 'OR', 'EN', 'DN', 'DR', 'EY', 'CR'].find((k) =>
      code.includes(`-${k.toLowerCase()}-`)
    ) ?? 'GI';
  // IV packages reuse the GI template (they are linked clinically and live in the GI category).
  const templateKey = familyKey === 'IV' ? 'GI' : familyKey;
  const t = CATEGORY_TEMPLATES[templateKey] ?? CATEGORY_TEMPLATES.GI;
  return {
    patientInitials: 'M.K.',
    adacRef: 'ADAC-DEMO-REF',
    hmcRef: 'HMC-DEMO-CASE',
    date: today,
    ...t,
  };
}

function splitIncluded(included?: string): string[] {
  if (!included) return [];
  return included
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ───────────────── Component ───────────────── */

export function PackageTemplateSimulator() {
  const { applyPackages } = useOverrides();
  const { ref, inView } = useScrollReveal({ threshold: 0.05 });

  // Override-aware package list so Control Mode edits flow through.
  const allPackages = useMemo(
    () => applyPackages(fallbackPackagesData.packages as Package[]),
    [applyPackages]
  );
  const categories = fallbackPackagesData.categories as PackageCategory[];

  // Pre-load HMC-GI-03 by default (matches §13.5 Worked Example) so the
  // page already shows a populated demo on first paint — meets the
  // 20-second-usability constraint.
  const defaultPkg =
    allPackages.find((p) => p.code === 'HMC-GI-03') ?? allPackages[0] ?? null;
  const defaultCategoryId = defaultPkg?.category ?? 1;

  // PENDING (dropdowns) and LOADED (the package whose template + invoice are showing)
  const [pendingCategoryId, setPendingCategoryId] = useState<number>(defaultCategoryId);
  const [pendingPkgCode, setPendingPkgCode] = useState<string>(defaultPkg?.code ?? '');
  const [loadedPkg, setLoadedPkg] = useState<Package | null>(defaultPkg);
  const [fields, setFields] = useState<ReportFields>(() => makeDefaults(defaultPkg));

  // Filtered package options based on pending category.
  const pendingPackageOptions = useMemo(
    () => allPackages.filter((p) => p.category === pendingCategoryId),
    [allPackages, pendingCategoryId]
  );

  // Keep pending package valid when category changes.
  useEffect(() => {
    const stillValid = pendingPackageOptions.some((p) => p.code === pendingPkgCode);
    if (!stillValid && pendingPackageOptions.length > 0) {
      setPendingPkgCode(pendingPackageOptions[0].code);
    }
  }, [pendingPackageOptions, pendingPkgCode]);

  // "Load" commits the pending selection and rebuilds the form defaults
  // for the new package's category template. This is the explicit gate
  // the user asked for so dropdown changes alone never overwrite edits.
  function handleLoad() {
    const next = allPackages.find((p) => p.code === pendingPkgCode);
    if (!next) return;
    setLoadedPkg(next);
    setFields(makeDefaults(next));
  }

  function setField<K extends keyof ReportFields>(key: K, value: ReportFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <article
      ref={ref}
      className="mx-auto w-full max-w-7xl px-6 py-20 md:py-24"
    >
      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7, ease: ease.premium }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          §13.6 · live demo
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          Package Template Simulator
        </h1>
        <p className="mt-3 max-w-3xl text-base text-ice/85 md:text-lg">
          Pick a category, pick a package, click Load — the demo medical
          report template and the package invoice preview generate for that
          package. Edit any field live; nothing is saved or transmitted.
        </p>
        <div className="gold-rule mt-6 w-20" />
      </motion.header>

      {/* Controls panel */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ delay: 0.15, duration: 0.7, ease: ease.premium }}
        className="mt-10 rounded-sm border border-white/10 bg-navy/40 p-5 backdrop-blur-sm md:p-6"
        aria-label="Simulator controls"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-ice/85">
              Category
            </label>
            <select
              value={pendingCategoryId}
              onChange={(e) => setPendingCategoryId(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-white/15 bg-navy-deep/70 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[var(--theme-accent)]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-ice/85">
              Package
            </label>
            <select
              value={pendingPkgCode}
              onChange={(e) => setPendingPkgCode(e.target.value)}
              className="mt-2 w-full rounded-sm border border-white/15 bg-navy-deep/70 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[var(--theme-accent)]"
            >
              {pendingPackageOptions.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleLoad}
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-sm border px-5 text-sm font-semibold uppercase tracking-[0.2em] transition-colors"
            style={{
              borderColor: 'var(--theme-accent)',
              background: 'var(--theme-badge-bg)',
              color: 'var(--theme-badge-text)',
            }}
          >
            <RefreshCw size={14} />
            Load Package Template
          </button>
        </div>
      </motion.section>

      {/* Loaded package banner */}
      {loadedPkg && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.premium }}
          className="mt-6 rounded-sm border p-4 backdrop-blur-sm md:p-5"
          style={{
            background: 'var(--theme-badge-bg)',
            borderColor: 'var(--theme-badge-border)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: 'var(--theme-badge-text)' }}
              >
                Currently loaded
              </p>
              <p className="mt-1 font-display text-lg text-white md:text-xl">
                {loadedPkg.code} · {loadedPkg.name}
              </p>
            </div>
            <PriceBadge pkg={loadedPkg} size="md" />
          </div>
        </motion.section>
      )}

      {/* Two large preview panels */}
      <AnimatePresence mode="wait">
        <motion.section
          key={loadedPkg?.code ?? 'empty'}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: ease.premium }}
          className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {loadedPkg && (
            <>
              <ReportPanel pkg={loadedPkg} fields={fields} setField={setField} />
              <InvoicePanel pkg={loadedPkg} fields={fields} />
            </>
          )}
        </motion.section>
      </AnimatePresence>

      {/* Safety strip */}
      <p className="mt-10 text-center text-xs italic text-ice/70 md:text-sm">
        Demo preview only · No real patient data · Doctor / operator review
        required before submission.
      </p>
    </article>
  );
}

/* ───────────────── Report Panel ───────────────── */

/* ───────────────── Shared document chrome ───────────────── */

/**
 * White-sheet HMC letterhead used by both the medical-report and the
 * invoice document previews. Mirrors §10.1 SampleReportCard's pattern so
 * the audience reads both pages as "the same kind of HMC file."
 */
function HMCLetterhead({
  documentTitle,
  documentTitleArabic,
  rightLabel,
  rightValue,
}: {
  documentTitle: string;
  documentTitleArabic?: string;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <div className="relative -mx-5 -mt-5 mb-6 bg-navy-medium px-5 py-4 text-white md:-mx-7 md:-mt-7 md:px-7 md:py-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HMC_LOGO}
            alt=""
            className="hidden h-10 w-auto object-contain sm:block"
            aria-hidden
          />
          <div>
            <p className="font-display text-base font-semibold leading-tight md:text-lg">
              Hurghada Medical Center
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
              Outpatient Operations · Red Sea Region
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
            {rightLabel}
          </p>
          <p className="font-mono text-xs md:text-sm">{rightValue}</p>
        </div>
      </div>
      {/* Thin gold separator + document title row */}
      <div
        className="mt-3 h-px w-full"
        style={{ background: 'rgba(201,169,97,0.55)' }}
      />
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className="font-display text-xl tracking-[0.06em] text-white md:text-2xl">
          {documentTitle}
        </p>
        {documentTitleArabic && (
          <p
            className="text-sm text-white/70"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {documentTitleArabic}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Diagonal watermark used on every document sheet so the demo nature is
 * unmistakable at a glance.
 */
function DemoWatermark() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        transform: 'rotate(-22deg)',
        fontSize: 'clamp(1.5rem, 4.5vw, 3.5rem)',
        fontFamily: 'var(--font-playfair), Georgia, serif',
        color: 'rgba(201, 169, 97, 0.16)',
        fontWeight: 700,
        letterSpacing: '0.1em',
      }}
    >
      DEMO PREVIEW · NO REAL PATIENT DATA
    </span>
  );
}

/**
 * Light document footer mirroring §10.1's footer strip.
 */
function DocumentFooter({
  leftText,
  rightText,
}: {
  leftText: string;
  rightText: string;
}) {
  return (
    <div className="relative mt-6 flex items-center justify-between border-t border-ink-medium/15 bg-ice px-1 pt-3 text-[10px] uppercase tracking-[0.22em] text-ink-medium md:text-[11px]">
      <span>{leftText}</span>
      <span>{rightText}</span>
    </div>
  );
}

/* ───────────────── Medical Report Panel ───────────────── */

const REPORT_SECTIONS: Array<{
  key: keyof ReportFields;
  label: string;
  rows?: number;
}> = [
  { key: 'complaint', label: 'Chief Complaint', rows: 2 },
  { key: 'vitals', label: 'Vitals', rows: 2 },
  { key: 'examination', label: 'Clinical Examination', rows: 3 },
  { key: 'diagnosis', label: 'Diagnosis', rows: 2 },
  { key: 'investigations', label: 'Investigations', rows: 2 },
  { key: 'treatment', label: 'Treatment Given', rows: 3 },
  { key: 'medications', label: 'Medications', rows: 2 },
  { key: 'procedures', label: 'Procedures', rows: 2 },
  { key: 'dischargeAdvice', label: 'Discharge Advice', rows: 2 },
  { key: 'followUp', label: 'Follow-up Plan', rows: 2 },
];

function ReportPanel({
  pkg,
  fields,
  setField,
}: {
  pkg: Package;
  fields: ReportFields;
  setField: <K extends keyof ReportFields>(k: K, v: ReportFields[K]) => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-sm border border-white/10 bg-navy/40 backdrop-blur-sm"
      aria-label="Editable medical report template"
    >
      {/* Outer dark chrome label band */}
      <header
        className="flex items-center justify-between border-b border-white/10 px-5 py-2.5"
        style={{ background: 'var(--theme-badge-bg)' }}
      >
        <div className="flex items-center gap-2">
          <Stethoscope size={14} style={{ color: 'var(--theme-badge-text)' }} />
          <p
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: 'var(--theme-badge-text)' }}
          >
            Editable Medical Report Template
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ice/70">
          {pkg.code}
        </p>
      </header>

      {/* White document sheet */}
      <div className="relative bg-white p-5 text-ink-dark md:p-7">
        <DemoWatermark />

        <HMCLetterhead
          documentTitle="MEDICAL REPORT"
          rightLabel="Issued"
          rightValue={fields.date || '—'}
        />

        {/* Metadata grid — four-up on desktop */}
        <div className="relative grid grid-cols-2 gap-x-5 gap-y-3 text-[12px] md:grid-cols-4 md:text-[13px]">
          <EditableMetaCell
            label="Patient initials"
            value={fields.patientInitials}
            onChange={(v) => setField('patientInitials', v)}
          />
          <EditableMetaCell
            label="ADAC reference"
            value={fields.adacRef}
            onChange={(v) => setField('adacRef', v)}
          />
          <EditableMetaCell
            label="HMC reference"
            value={fields.hmcRef}
            onChange={(v) => setField('hmcRef', v)}
          />
          <EditableMetaCell
            label="Date"
            value={fields.date}
            onChange={(v) => setField('date', v)}
          />
        </div>

        {/* Package code + name row */}
        <div className="relative mt-4 rounded-sm border border-ink-medium/15 bg-ice/60 p-3 md:p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-medium">
              Package
            </p>
            <p className="font-mono text-[12px] font-semibold text-ink-dark md:text-[13px]">
              {pkg.code}
            </p>
          </div>
          <p className="mt-1 font-display text-base leading-snug text-ink-dark md:text-lg">
            {pkg.name}
          </p>
        </div>

        {/* Report sections — each renders as a labelled document block with
            a white textarea matching the surrounding paper. */}
        <div className="relative mt-5 space-y-4">
          {REPORT_SECTIONS.map(({ key, label, rows }) => (
            <ReportSection
              key={key}
              label={label}
              value={fields[key] as string}
              rows={rows}
              onChange={(v) => setField(key, v)}
            />
          ))}
        </div>

        {/* Doctor / operator review note */}
        <div className="relative mt-6 rounded-sm border border-ink-medium/15 bg-ice/60 p-3 text-[12px] leading-relaxed text-ink-medium md:p-4 md:text-[13px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-medium">
            Doctor / operator review
          </p>
          <p className="mt-1">
            This is a template preview. The treating doctor and the
            operations team review and sign off every real medical report
            before it is submitted to the assistance partner.
          </p>
        </div>

        <DocumentFooter
          leftText="Demo preview · digitally signed in production"
          rightText="Page 1 of 1"
        />

        {/* In-panel safety strip */}
        <p className="relative mt-3 text-[11px] italic leading-relaxed text-ink-medium md:text-xs">
          Demo preview only · No real patient data · Doctor / operator review
          required before submission.
        </p>
      </div>
    </div>
  );
}

function EditableMetaCell({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-medium md:text-[10px]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full border-b border-ink-medium/30 bg-transparent py-1 font-mono text-[12px] text-ink-dark outline-none transition-colors focus:border-navy-medium md:text-[13px]"
      />
    </label>
  );
}

function ReportSection({
  label,
  value,
  rows = 2,
  onChange,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-medium">
        {label}
      </p>
      <div
        className="mt-1.5 h-px w-full"
        style={{ background: 'rgba(27,58,92,0.18)' }}
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y border border-transparent bg-transparent text-[13px] leading-relaxed text-ink-dark outline-none transition-colors hover:border-ink-medium/15 focus:border-navy-medium/40 md:text-sm"
        style={{ padding: '4px 2px' }}
      />
    </div>
  );
}

/* ───────────────── Package Invoice Panel ───────────────── */

function InvoicePanel({ pkg, fields }: { pkg: Package; fields: ReportFields }) {
  const items = splitIncluded(pkg.included);

  return (
    <div
      className="overflow-hidden rounded-sm border border-white/10 bg-navy/40 backdrop-blur-sm"
      aria-label="Package invoice preview"
    >
      {/* Outer dark chrome label band */}
      <header
        className="flex items-center justify-between border-b border-white/10 px-5 py-2.5"
        style={{ background: 'var(--theme-badge-bg)' }}
      >
        <div className="flex items-center gap-2">
          <FileText size={14} style={{ color: 'var(--theme-badge-text)' }} />
          <p
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: 'var(--theme-badge-text)' }}
          >
            Package Invoice Preview
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ice/70">
          {pkg.code}
        </p>
      </header>

      {/* White document sheet */}
      <div className="relative bg-white p-5 text-ink-dark md:p-7">
        <DemoWatermark />

        <HMCLetterhead
          documentTitle="PACKAGE INVOICE"
          rightLabel="Issued"
          rightValue={fields.date || '—'}
        />

        {/* Metadata grid — six fields, three per row on desktop */}
        <div className="relative grid grid-cols-2 gap-x-5 gap-y-3 text-[12px] md:grid-cols-3 md:text-[13px]">
          <MetaCell label="HMC reference" value={fields.hmcRef} />
          <MetaCell label="ADAC reference" value={fields.adacRef} />
          <MetaCell label="Date" value={fields.date} />
          <MetaCell label="Patient initials" value={fields.patientInitials} />
          <MetaCell label="Package code" value={pkg.code} mono />
          <MetaCell label="Package name" value={pkg.name} wide />
        </div>

        {/* Invoice table — Item / Description / Billing type. No per-item prices. */}
        <div className="relative mt-6 overflow-hidden rounded-sm border border-ink-medium/15">
          <table className="w-full text-left text-[13px] md:text-sm">
            <thead className="bg-ice/80 text-[10px] uppercase tracking-[0.22em] text-ink-medium">
              <tr>
                <th className="w-12 px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Description</th>
                <th className="hidden px-3 py-2 font-medium md:table-cell">
                  Billing type
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr
                  key={it}
                  className="border-t border-ink-medium/10 align-top"
                >
                  <td className="px-3 py-2 font-mono text-[11px] text-ink-medium">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td className="px-3 py-2 font-medium text-ink-dark">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2
                        size={13}
                        className="shrink-0"
                        style={{ color: '#1B3A5C' }}
                      />
                      {it}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-ink-dark">
                    Included in package scope.
                  </td>
                  <td className="hidden px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-medium md:table-cell">
                    Included · package
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr
                className="border-t-2 align-baseline"
                style={{ borderColor: '#1B3A5C' }}
              >
                <td colSpan={2} className="px-3 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-medium">
                    Total
                  </p>
                  <p className="mt-1 font-display text-base leading-tight text-ink-dark md:text-lg">
                    Single agreed package line
                  </p>
                </td>
                <td className="px-3 py-3 text-[12px] italic text-ink-medium">
                  Included items above are shown for transparency only.
                </td>
                <td className="px-3 py-3 text-right" colSpan={1}>
                  <div className="flex justify-end">
                    <PriceBadge pkg={pkg} size="lg" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <p className="relative mt-5 text-[12px] italic leading-relaxed text-ink-medium md:text-[13px]">
          Included items are shown for transparency. Billing remains a single
          agreed package line unless escalation or out-of-scope services are
          documented separately.
        </p>

        <DocumentFooter
          leftText="Demo preview · operator-confirmed in production"
          rightText="Page 1 of 1"
        />

        {/* In-panel safety strip */}
        <p className="relative mt-3 text-[11px] italic leading-relaxed text-ink-medium md:text-xs">
          Demo preview only · No real patient data · Doctor / operator review
          required before submission.
        </p>
      </div>
    </div>
  );
}

function MetaCell({
  label,
  value,
  mono,
  wide,
}: {
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'col-span-2 md:col-span-2' : undefined}>
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-medium md:text-[10px]">
        {label}
      </p>
      <p
        className={`mt-0.5 ${mono ? 'font-mono' : ''} text-[13px] text-ink-dark md:text-sm`}
      >
        {value || '—'}
      </p>
    </div>
  );
}
