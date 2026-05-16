'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Clock,
  Layers,
  Phone,
  ShieldCheck,
  Tag,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import decisionsData from '@/content/section-decisions.json';

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  Calendar,
  Clock,
  Layers,
  Phone,
  ShieldCheck,
  Tag,
  Target,
};

/**
 * Compact 8-card Decision Points strip for the Executive Data Room.
 * Reads from section-decisions.json directly. Applies the same text
 * overrides as the full /section/decisions page so edits made in
 * Control Mode show here too.
 */
export function DataRoomDecisions() {
  const { textOf } = useOverrides();
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref}>
      <motion.ul
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {decisionsData.items.map((item, i) => {
          const Icon = item.icon ? ICONS[item.icon] : null;
          const num = i + 1;
          const title = textOf(`decisions.card.${num}.title`, item.title);
          const summary = textOf(`decisions.card.${num}.summary`, item.summary);
          return (
            <motion.li
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: ease.premium },
                },
              }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-sm border bg-navy/40 p-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{ borderColor: 'var(--theme-card-border)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--theme-card-hover-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--theme-card-border)';
                }}
              >
                <div className="flex items-center justify-between">
                  {Icon ? (
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-sm border"
                      style={{
                        borderColor:
                          'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
                        background:
                          'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
                        color: 'var(--theme-accent)',
                      }}
                    >
                      <Icon size={14} />
                    </span>
                  ) : (
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: 'var(--theme-accent)' }}
                    >
                      {item.id}
                    </span>
                  )}
                  <ArrowUpRight
                    size={12}
                    className="text-ice/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <p className="mt-2.5 font-display text-sm leading-snug text-white">
                  {title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ice/80">{summary}</p>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
