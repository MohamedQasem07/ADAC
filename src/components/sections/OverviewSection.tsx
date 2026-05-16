'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  Clock,
  FileText,
  Layers,
  Map,
  MessagesSquare,
  Phone,
  ShieldCheck,
  Stethoscope,
  Tag,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

interface OverviewItem {
  id: string;
  icon?: string;
  title: string;
  summary: string;
  href: string;
}

interface OverviewData {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  items: OverviewItem[];
}

/**
 * Prefix used for text-override lookups. `overview` is the original 8-card
 * agenda; `decisions` is the Phase 2.3 Decision Points page. Both reuse
 * this renderer.
 */
type OverviewKeyPrefix = 'overview' | 'decisions';

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  Clock,
  FileText,
  Layers,
  Map,
  MessagesSquare,
  Phone,
  ShieldCheck,
  Stethoscope,
  Tag,
  Target,
};

/**
 * Presentation Overview — the agenda screen that appears immediately
 * after the cover. 8 premium cards, each linking to the section they
 * represent. Acts as a one-page meeting roadmap.
 */
export function OverviewSection({
  data,
  keyPrefix = 'overview',
}: {
  data: OverviewData;
  keyPrefix?: OverviewKeyPrefix;
}) {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });
  const { textOf } = useOverrides();

  return (
    <section className="min-h-screen px-4 py-24">
      <header className="mx-auto max-w-3xl px-4 text-center">
        {data.eyebrow && (
          <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-gold">
            {data.eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="mt-4 text-base text-ink-soft md:text-lg">{data.subtitle}</p>
        )}
        <div className="gold-rule mx-auto mt-8 w-24" />
      </header>

      <motion.ul
        ref={ref}
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-1 gap-5 px-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {data.items.map((item, i) => {
          const Icon = item.icon ? ICONS[item.icon] : null;
          const cardNum = i + 1;
          const title = textOf(`${keyPrefix}.card.${cardNum}.title`, item.title);
          const summary = textOf(`${keyPrefix}.card.${cardNum}.summary`, item.summary);
          return (
            <motion.li
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: ease.premium },
                },
              }}
            >
              <Link
                href={item.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="flex items-start justify-between">
                  {Icon ? (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-gold/30 bg-gold/10 text-gold">
                      <Icon size={18} />
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                      {item.id}
                    </span>
                  )}
                  <ArrowUpRight
                    size={14}
                    className="text-ink-soft/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  />
                </div>

                <h3 className="mt-5 font-display text-lg leading-snug text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft/90">
                  {summary}
                </p>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft/50">
                  {item.id}
                </p>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
