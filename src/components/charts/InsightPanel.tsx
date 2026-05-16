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
 *   Card 1 — Key Insight  (accent — gold / ADAC yellow)
 *   Card 2 — What this means for ADAC  (neutral navy)
 *
 * Theme-aware (Phase 2.4E.2): accent card uses --theme-accent so the
 * panel reads as HMC × ADAC dual-brand under Partnership.
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
        accent="accent"
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
  accent: 'accent' | 'navy';
}) {
  const isAccent = accent === 'accent';
  return (
    <div
      className="relative overflow-hidden rounded-sm border p-5 backdrop-blur-sm"
      style={
        isAccent
          ? {
              borderColor:
                'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
              background:
                'color-mix(in srgb, var(--theme-accent) 4%, transparent)',
            }
          : {
              borderColor: 'rgba(255,255,255,0.15)',
              background: 'rgba(10,25,41,0.4)',
            }
      }
    >
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-sm border"
          style={
            isAccent
              ? {
                  borderColor:
                    'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
                  background:
                    'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
                  color: 'var(--theme-accent)',
                }
              : {
                  borderColor: 'rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#f4f8fc',
                }
          }
        >
          {icon}
        </span>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{
            color: isAccent ? 'var(--theme-accent)' : 'rgba(244,248,252,0.8)',
          }}
        >
          {label}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ice/90 md:text-[15px]">{body}</p>
    </div>
  );
}
