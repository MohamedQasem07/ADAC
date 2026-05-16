'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

export interface KpiItem {
  value: string;
  label: string;
  /** Optional small line below the label (e.g. "EN · DE · AR · RU"). */
  sublabel?: string;
}

/**
 * Pick a value-size class set based on string length so long values
 * (e.g. "EN/DE/AR/RU") don't blow past the card edges. CountUp numbers
 * always fit in 4-5 chars (e.g. "1,127", "20.37%") so they stay large.
 */
function valueSizeClass(value: string): string {
  const len = value.length;
  if (len <= 4) return 'text-4xl md:text-5xl lg:text-6xl';
  if (len <= 7) return 'text-3xl md:text-4xl lg:text-5xl';
  if (len <= 11) return 'text-2xl md:text-3xl lg:text-4xl';
  return 'text-xl md:text-2xl lg:text-3xl';
}

interface KpiStripProps {
  items: KpiItem[];
  /** Optional eyebrow above the strip. */
  eyebrow?: string;
}

/**
 * Horizontal strip of 4 hero KPI cards. Numbers CountUp from 0 on first
 * reveal. Each value is parsed: integer / decimal / "%" suffix / comma
 * separator detected automatically from the string.
 *
 * Used on §3 top-level (268 / 200 / 1,127 / 20.37%) and §2 top-level.
 */
export function KpiStrip({ items, eyebrow }: KpiStripProps) {
  const { ref, inView } = useScrollReveal();

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-8">
      {eyebrow && (
        <p
          className="mb-6 text-center font-sans text-[11px] uppercase tracking-[0.5em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          {eyebrow}
        </p>
      )}
      <motion.div
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 gap-6 md:grid-cols-4"
      >
        {items.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={kpiCard}
            className="group relative overflow-hidden rounded-sm border bg-navy/40 px-6 py-8 backdrop-blur-sm transition-colors duration-300"
            style={{ borderColor: 'var(--theme-card-border)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--theme-card-hover-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--theme-card-border)';
            }}
          >
            <div className="text-center">
              <p
                className={`font-display font-semibold tracking-tight text-white ${valueSizeClass(
                  kpi.value
                )} whitespace-nowrap leading-[1.05]`}
              >
                {inView ? <KpiNumber raw={kpi.value} /> : kpi.value}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-ink-soft/80">
                {kpi.label}
              </p>
              {kpi.sublabel && (
                <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-ice/70">
                  {kpi.sublabel}
                </p>
              )}
            </div>
            {/* Top-left + bottom-right theme-accent corner marks */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t transition-opacity duration-300 group-hover:opacity-100"
              style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r transition-opacity duration-300 group-hover:opacity-100"
              style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)' }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/** Parses a KPI string into a CountUp-friendly format. Returns the raw
 *  string if it can't be confidently parsed as a number. */
function KpiNumber({ raw }: { raw: string }) {
  // Match patterns:  "268"   "1,127"   "20.37%"   "23%"   "24/7"
  const m = raw.match(/^(\d[\d,]*\.?\d*)(.*)$/);
  if (!m) return <>{raw}</>;

  const numStr = m[1].replace(/,/g, '');
  const suffix = m[2] ?? '';
  const value = Number(numStr);
  if (Number.isNaN(value)) return <>{raw}</>;

  const hasDecimal = numStr.includes('.');
  const useThousands = m[1].includes(',') || value >= 1000;

  return (
    <CountUp
      start={0}
      end={value}
      duration={2}
      separator={useThousands ? ',' : ''}
      decimals={hasDecimal ? 2 : 0}
      preserveValue
      suffix={suffix}
      useEasing
    />
  );
}

const kpiCard = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.premium },
  },
};
