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
  LayoutDashboard,
  Map,
  MessagesSquare,
  Phone,
  ShieldCheck,
  Sparkles,
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
  /**
   * Optional "What 'yes' looks like" framing paragraph rendered above
   * the card grid. Currently used on the Decision Points page to make
   * the meeting close explicit.
   */
  framingNote?: string;
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
          <p
            className="font-sans text-[11px] uppercase tracking-[0.5em]"
            style={{ color: 'var(--theme-accent)' }}
          >
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

      {/* Data Room CTA — visible only on the Presentation Overview page,
          not on the Decision Points page that reuses this renderer. */}
      {keyPrefix === 'overview' && (
        <div className="mx-auto mt-12 max-w-4xl px-8">
          <Link
            href="/section/data-room"
            className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-sm border bg-gradient-to-br from-transparent to-transparent px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:gap-6"
            style={{
              borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 10%, transparent), color-mix(in srgb, var(--theme-accent) 4%, transparent), transparent)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                'color-mix(in srgb, var(--theme-accent) 70%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                'color-mix(in srgb, var(--theme-accent) 40%, transparent)';
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--theme-accent) 60%, transparent)',
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--theme-accent) 60%, transparent)',
              }}
            />
            <span
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--theme-accent) 50%, transparent)',
                background:
                  'color-mix(in srgb, var(--theme-accent) 15%, transparent)',
                color: 'var(--theme-accent)',
                boxShadow:
                  '0 0 24px color-mix(in srgb, var(--theme-accent) 20%, transparent)',
              }}
            >
              <LayoutDashboard size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.4em]"
                style={{ color: 'var(--theme-accent)' }}
              >
                <Sparkles size={11} />
                Executive view
              </p>
              <p className="mt-1 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
                Open Executive Data Room
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ice/85">
                View the full ADAC data, package framework, coverage, and decision dashboard
                — one consolidated boardroom page.
              </p>
            </div>
            <ArrowUpRight
              size={20}
              className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              style={{ color: 'var(--theme-accent)' }}
            />
          </Link>
        </div>
      )}

      {/* Framing paragraph — currently used by the Decision Points page
          to make the meeting close explicit ("what 'yes' looks like"). */}
      {data.framingNote && (
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.1, duration: 0.7, ease: ease.premium }}
          className="mx-auto mt-12 max-w-4xl rounded-sm border px-6 py-5 backdrop-blur-sm"
          style={{
            background: 'var(--theme-badge-bg)',
            borderColor: 'var(--theme-badge-border)',
          }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'var(--theme-badge-text)' }}
          >
            What &lsquo;yes&rsquo; looks like
          </p>
          <p className="mt-2 text-base leading-relaxed text-white md:text-lg">
            {textOf(`${keyPrefix}.framingNote`, data.framingNote)}
          </p>
        </motion.aside>
      )}

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
                className="group relative flex h-full flex-col overflow-hidden rounded-sm border bg-navy/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                style={{ borderColor: 'var(--theme-card-border)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--theme-card-hover-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--theme-card-border)';
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
                  }}
                />

                <div className="flex items-start justify-between">
                  {Icon ? (
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-sm border"
                      style={{
                        borderColor:
                          'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
                        background:
                          'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
                        color: 'var(--theme-accent)',
                      }}
                    >
                      <Icon size={18} />
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
                    size={14}
                    className="text-ink-soft/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <h3 className="mt-5 font-display text-lg leading-snug text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft/90">
                  {summary}
                </p>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-ice/70">
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
