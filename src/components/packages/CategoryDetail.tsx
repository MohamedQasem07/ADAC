'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { Package, PackageCategory } from '@/types/content';
import { PackageCard } from './PackageCard';
import { PackageModal } from './PackageModal';

interface CategoryDetailProps {
  category: PackageCategory;
  packages: Package[];
}

/**
 * Category drill-down screen for §12.1–12.9. Hero header (number/code/
 * name/description) → subsection-grouped package cards in 2-column grid
 * → escalation note callout (when present).
 */
export function CategoryDetail({ category, packages }: CategoryDetailProps) {
  const [open, setOpen] = useState<Package | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  const { applyPackages } = useOverrides();

  // Apply presenter overrides — disabled/removed packages drop out,
  // name/included/prices use overridden values where present.
  const effective = useMemo(() => applyPackages(packages), [applyPackages, packages]);

  // Group by section if the category has subsections.
  const grouped = category.subsections
    ? category.subsections.map((sub) => ({
        subsection: sub,
        items: effective.filter((p) => p.section === sub.id),
      }))
    : [{ subsection: null, items: effective }];

  return (
    <section ref={ref} className="mx-auto w-full max-w-6xl px-8 py-24">
      {/* Hero header */}
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: ease.premium }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Category {category.id} · {category.code}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          {category.name}
        </h1>
        <div className="gold-rule mx-auto mt-8 w-20" />
        <p className="mt-8 text-base leading-relaxed text-ink-soft md:text-lg">
          {category.description}
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-ice/75">
          {effective.length} {effective.length === 1 ? 'package' : 'packages'}
        </p>
      </motion.header>

      {/* Package cards grouped by subsection */}
      <div className="mt-16 space-y-16">
        {grouped.map(({ subsection, items }) => (
          <div key={subsection?.id ?? 'default'}>
            {subsection && (
              <motion.h2
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.7, ease: ease.premium }}
                className="mb-6 flex items-baseline gap-3 font-display text-xl text-white"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                  {category.code}.{subsection.id}
                </span>
                <span>{subsection.title}</span>
              </motion.h2>
            )}
            <motion.div
              variants={staggerTight}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {items.map((p) => (
                <motion.div
                  key={p.code}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: ease.premium },
                    },
                  }}
                >
                  <PackageCard pkg={p} onClick={() => setOpen(p)} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Escalation callout */}
      {category.escalationNote && (
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.6, duration: 0.7, ease: ease.premium }}
          className="mt-16 rounded-sm border-l-2 border-l-amber-400/80 border border-amber-400/20 bg-amber-400/5 p-5"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200">
                Escalation criteria
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
                {category.escalationNote}
              </p>
            </div>
          </div>
        </motion.aside>
      )}

      <PackageModal pkg={open} onClose={() => setOpen(null)} />
    </section>
  );
}
