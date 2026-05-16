'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { fallbackADACData } from '@/data/fallback';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { useThemeChartColors } from '@/lib/theme-colors';
import { ChartFrame } from './ChartFrame';

/**
 * §3.5 — Admission Profile (stacked horizontal bar).
 *
 * 74% Normal Room · 15% ICU · ~10% Surgery (5 surgery tiers merged).
 *
 * Theme-aware (Phase 2.4E.2): primary = ADAC/main (gold or yellow),
 * ICU = HMC blue / royal blue (secondary), Surgery = teal / cyan
 * (tertiary). ICU keeps the blue tone under both themes — it signals
 * the medical-operational dimension and stays consistent.
 */
export function AdmissionProfile() {
  const palette = useThemeChartColors();
  const PRIMARY = palette.primary;
  const BLUE = palette.secondary;
  const TEAL = palette.tertiary;
  const ap = fallbackADACData.admissionProfile;
  const surgeryCount =
    ap.majorSurgery.count +
    ap.skilledSurgery.count +
    ap.advancedSurgery.count +
    ap.minorSurgery.count +
    ap.mediumSurgery.count;
  const surgeryPct = Number(
    (
      ap.majorSurgery.pct +
      ap.skilledSurgery.pct +
      ap.advancedSurgery.pct +
      ap.minorSurgery.pct +
      ap.mediumSurgery.pct
    ).toFixed(2)
  );

  const segments = [
    { label: 'Normal Room', count: ap.normalRoom.count, pct: ap.normalRoom.pct, color: PRIMARY },
    { label: 'ICU',         count: ap.icu.count,         pct: ap.icu.pct,         color: BLUE },
    { label: 'Surgery',     count: surgeryCount,         pct: surgeryPct,         color: TEAL },
  ];

  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <ChartFrame
      subId="3.5"
      eyebrow="§3.5"
      title="Admission Profile"
      populationLabel="n=156 ADAC admissions · 2024–2025"
      dataWindow="Clinical breakdown · 2024–2025"
      annotation="78% of all ADAC cases require inpatient admission · 22% are outpatient (the flat-rate target)"
      insight={{
        keyInsight:
          'A meaningful portion of ADAC cases required admission, but the outpatient segment still needs a clear, efficient model.',
        meaning:
          'The flat-rate outpatient framework manages earlier-stage cases before unnecessary escalation and keeps admission decisions clinically driven.',
      }}
    >
      <div ref={ref} className="space-y-10">
        {/* Stacked bar */}
        <div className="overflow-hidden rounded-sm">
          <div className="flex h-16 w-full overflow-hidden rounded-sm border border-white/10">
            {segments.map((seg, i) => (
              <motion.div
                key={seg.label}
                initial={{ width: 0 }}
                animate={inView ? { width: `${seg.pct}%` } : { width: 0 }}
                transition={{ delay: 0.2 + i * 0.18, duration: 0.9, ease: ease.premium }}
                style={{ background: seg.color }}
                className="relative flex items-center justify-center"
              >
                <span className="font-display text-sm font-semibold text-navy-deep">
                  {inView ? (
                    <CountUp
                      end={seg.pct}
                      duration={1.2}
                      decimals={1}
                      suffix="%"
                      preserveValue
                      useEasing
                    />
                  ) : (
                    `${seg.pct}%`
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend with counts */}
        <div className="grid grid-cols-3 gap-4">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.6, ease: ease.premium }}
              className="flex items-baseline gap-3 border-t border-white/10 pt-4"
            >
              <span
                className="inline-block h-2 w-2 rounded-sm"
                style={{ background: seg.color }}
              />
              <div>
                <p className="font-display text-2xl text-white">
                  {inView ? <CountUp end={seg.count} duration={1.5} preserveValue useEasing /> : 0}
                </p>
                <p className="text-[12px] uppercase tracking-[0.3em] text-ice/85">{seg.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}
