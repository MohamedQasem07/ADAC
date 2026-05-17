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
      <header
        className="flex items-center justify-between border-b border-white/10 px-5 py-3"
        style={{ background: 'var(--theme-badge-bg)' }}
      >
        <div className="flex items-center gap-2">
          <Stethoscope
            size={16}
            style={{ color: 'var(--theme-badge-text)' }}
          />
          <p
            className="font-mono text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'var(--theme-badge-text)' }}
          >
            Editable medical report template
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ice/70">
          {pkg.code}
        </p>
      </header>

      <div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
        {/* References + identity row */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TextRow
            label="Patient initials"
            value={fields.patientInitials}
            onChange={(v) => setField('patientInitials', v)}
          />
          <TextRow
            label="Date"
            value={fields.date}
            onChange={(v) => setField('date', v)}
          />
          <TextRow
            label="ADAC reference"
            value={fields.adacRef}
            onChange={(v) => setField('adacRef', v)}
          />
          <TextRow
            label="HMC case reference"
            value={fields.hmcRef}
            onChange={(v) => setField('hmcRef', v)}
          />
        </div>

        {/* Clinical fields — textarea per field */}
        <TextAreaRow
          label="Complaint"
          value={fields.complaint}
          onChange={(v) => setField('complaint', v)}
        />
        <TextAreaRow
          label="Vitals"
          value={fields.vitals}
          onChange={(v) => setField('vitals', v)}
        />
        <TextAreaRow
          label="Examination"
          value={fields.examination}
          onChange={(v) => setField('examination', v)}
        />
        <TextAreaRow
          label="Diagnosis"
          value={fields.diagnosis}
          onChange={(v) => setField('diagnosis', v)}
        />
        <TextAreaRow
          label="Investigations"
          value={fields.investigations}
          onChange={(v) => setField('investigations', v)}
        />
        <TextAreaRow
          label="Treatment"
          value={fields.treatment}
          onChange={(v) => setField('treatment', v)}
        />
        <TextAreaRow
          label="Medications"
          value={fields.medications}
          onChange={(v) => setField('medications', v)}
        />
        <TextAreaRow
          label="Procedures"
          value={fields.procedures}
          onChange={(v) => setField('procedures', v)}
        />
        <TextAreaRow
          label="Discharge advice"
          value={fields.dischargeAdvice}
          onChange={(v) => setField('dischargeAdvice', v)}
        />
        <TextAreaRow
          label="Follow-up"
          value={fields.followUp}
          onChange={(v) => setField('followUp', v)}
        />

        <p className="pt-2 text-[11px] italic text-ice/65">
          Demo preview only · No real patient data · Doctor / operator review
          required before submission.
        </p>
      </div>
    </div>
  );
}

function TextRow({
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
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ice/85">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-white/15 bg-navy-deep/70 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[var(--theme-accent)]"
      />
    </label>
  );
}

function TextAreaRow({
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
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ice/85">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="mt-1 w-full resize-y rounded-sm border border-white/15 bg-navy-deep/70 px-3 py-2 text-sm leading-relaxed text-white outline-none transition-colors focus:border-[var(--theme-accent)]"
      />
    </label>
  );
}

/* ───────────────── Invoice Panel ───────────────── */

function InvoicePanel({ pkg, fields }: { pkg: Package; fields: ReportFields }) {
  const items = splitIncluded(pkg.included);

  return (
    <div
      className="overflow-hidden rounded-sm border border-white/10 bg-navy/40 backdrop-blur-sm"
      aria-label="Package invoice preview"
    >
      <header
        className="flex items-center justify-between border-b border-white/10 px-5 py-3"
        style={{ background: 'var(--theme-badge-bg)' }}
      >
        <div className="flex items-center gap-2">
          <FileText
            size={16}
            style={{ color: 'var(--theme-badge-text)' }}
          />
          <p
            className="font-mono text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'var(--theme-badge-text)' }}
          >
            Package invoice preview
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ice/70">
          {pkg.code}
        </p>
      </header>

      {/* White invoice "sheet" — mirrors §10.1 SampleReportCard styling so
          the audience reads it as the same "kind of file" they saw at §10.1. */}
      <div className="relative bg-white p-5 text-ink-dark md:p-6">
        {/* Diagonal demo watermark */}
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

        {/* HMC letterhead band */}
        <div className="relative -mx-5 -mt-5 mb-4 bg-navy-medium px-5 py-3 text-white md:-mx-6 md:-mt-6 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold md:text-lg">
                Hurghada Medical Center
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                Package Invoice · Demo Preview
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
                Issued
              </p>
              <p className="font-mono text-xs md:text-sm">{fields.date}</p>
            </div>
          </div>
        </div>

        {/* Reference + identity row */}
        <div className="relative grid grid-cols-2 gap-3 text-[12px] md:grid-cols-4 md:text-[13px]">
          <Cell label="ADAC reference" value={fields.adacRef} />
          <Cell label="HMC reference" value={fields.hmcRef} />
          <Cell label="Patient initials" value={fields.patientInitials} />
          <Cell label="Date" value={fields.date} />
        </div>

        {/* Package line */}
        <div className="relative mt-5 rounded-sm border border-ink-medium/15 bg-ice/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-medium">
            Package
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-ink-dark">
            {pkg.code}
          </p>
          <p className="mt-1 font-display text-lg leading-snug text-ink-dark md:text-xl">
            {pkg.name}
          </p>
        </div>

        {/* Included items list — no per-item prices */}
        <div className="relative mt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-medium">
            Included items · transparency view (no per-item billing)
          </p>
          <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-ink-dark md:text-sm">
            {items.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="mt-1 shrink-0"
                  style={{ color: '#1B3A5C' }}
                />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Final total — single line, scenario-aware via PriceBadge */}
        <div className="relative mt-6 flex items-baseline justify-between border-t border-ink-medium/15 pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-medium">
              Total · single agreed package line
            </p>
            <p className="mt-1 text-[11px] italic text-ink-medium">
              Included items above are shown for transparency only.
            </p>
          </div>
          <PriceBadge pkg={pkg} size="lg" />
        </div>

        {/* Footnote */}
        <p className="relative mt-5 text-[11px] italic leading-relaxed text-ink-medium md:text-xs">
          Included items are shown for transparency. Billing remains a single
          agreed package line unless escalation or out-of-scope services are
          documented separately.
        </p>
        <p className="relative mt-2 text-[11px] italic text-ink-medium md:text-xs">
          Demo preview only · No real patient data · Doctor / operator review
          required before submission.
        </p>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink-medium md:text-[10px]">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[12px] text-ink-dark md:text-[13px]">
        {value || '—'}
      </p>
    </div>
  );
}
