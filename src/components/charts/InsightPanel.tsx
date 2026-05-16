'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Target } from 'lucide-react';
import { ease } from '@/lib/motion';

export interface ChartInsight {
  keyInsight: string;
  meaning: string;
}

interface InsightPanelProps {
  insight: ChartInsight;
  /** Whether the parent ChartFrame is in view; gates the entry animation. */
  inView: boolean;
}

/**
 * Two-card insight panel rendered under every Section 3 chart.
 *
 *   Card 1 — Key Insight (what the data shows)
 *   Card 2 — What this means for ADAC (operational implication)
 *
 * Concise by design: 80–140 words max combined. Projector-readable.
 */
export function InsightPanel({ insight, inView }: InsightPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay: 1.0, duration: 0.7, ease: ease.premium }}
      className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <Card
        icon={<Lightbulb size={16} />}
        label="Key insight"
        body={insight.keyInsight}
        accent="gold"
      />
      <Card
        icon={<Target size={16} />}
        label="What this means for ADAC"
        body={insight.meaning}
        accent="navy"
      />
    </motion.div>
  );
}

function Card({
  icon,
  label,
  body,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
  accent: 'gold' | 'navy';
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border p-5 backdrop-blur-sm ${
        accent === 'gold'
          ? 'border-gold/30 bg-gold/[0.04]'
          : 'border-white/15 bg-navy-deep/40'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-sm border ${
            accent === 'gold'
              ? 'border-gold/40 bg-gold/10 text-gold'
              : 'border-white/15 bg-white/5 text-ice'
          }`}
        >
          {icon}
        </span>
        <p
          className={`font-mono text-[10px] uppercase tracking-[0.3em] ${
            accent === 'gold' ? 'text-gold' : 'text-ice/80'
          }`}
        >
          {label}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ice/90 md:text-[15px]">{body}</p>
    </div>
  );
}
