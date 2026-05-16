'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePricing } from '@/context/PricingContext';
import { ease } from '@/lib/motion';
import { categoryPriceRange } from '@/lib/pricing';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { Package, PackageCategory } from '@/types/content';

interface PricingMatrixProps {
  categories: PackageCategory[];
  packages: Package[];
}

/**
 * Pricing summary matrix — 9 categories × range × most-common package
 * × package count. All price-bearing cells crossfade when the hidden
 * scenario toggle (Cmd/Ctrl + 1/2/3) changes. No scenario label appears
 * anywhere — the corner dot indicator is the only signal.
 */
export function PricingMatrix({ categories, packages }: PricingMatrixProps) {
  const { scenario } = usePricing();
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref} className="mx-auto w-full max-w-6xl px-6 py-24">
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">§12.10</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          Pricing Summary Matrix
        </h1>
        <p className="mt-3 text-base text-ink-soft md:text-lg">
          9 categories, 65 packages — one number per clinical presentation.
        </p>
        <div className="gold-rule mx-auto mt-8 w-24" />
      </header>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: ease.premium }}
        className="mt-12 overflow-hidden rounded-sm border border-white/10 bg-navy/50 backdrop-blur-sm"
      >
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-navy-deep/80 text-[10px] uppercase tracking-[0.25em] text-ink-soft/70 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3 font-medium md:px-6">Category</th>
              <th className="px-4 py-3 font-medium md:px-6">Packages</th>
              <th className="px-4 py-3 font-medium md:px-6">Range</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell md:px-6">Most common</th>
              <th className="px-4 py-3 text-right font-medium md:px-6">Common price</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const catPkgs = packages.filter((p) => p.category === cat.id);
              const range = categoryPriceRange(catPkgs, scenario);
              const common = pickMostCommon(catPkgs);
              const commonPrice =
                scenario === 'A'
                  ? 'To be agreed'
                  : `€${scenario === 'B' ? common.prices.B : common.prices.C}`;

              return (
                <tr
                  key={cat.id}
                  className="group border-t border-white/5 transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <td className="relative px-4 py-4 md:px-6">
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-8 w-[2px] -translate-y-1/2 scale-y-0 bg-gold transition-transform duration-300 group-hover:scale-y-100"
                    />
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
                      {cat.code}
                    </p>
                    <p className="mt-1 font-display text-base text-white">{cat.name}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-ink-soft md:px-6">
                    {catPkgs.length}
                  </td>
                  <td className="px-4 py-4 font-display text-base text-gold-soft md:px-6">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${cat.id}-range-${scenario}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.4, ease: ease.premium }}
                        className="inline-block"
                      >
                        {range}
                      </motion.span>
                    </AnimatePresence>
                  </td>
                  <td className="hidden px-4 py-4 text-sm md:table-cell md:px-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft/70">
                      {common.code}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">{common.name}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-display text-base text-white md:px-6">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${cat.id}-common-${scenario}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.4, ease: ease.premium }}
                        className="inline-block"
                      >
                        {commonPrice}
                      </motion.span>
                    </AnimatePresence>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <p className="mt-6 text-center text-xs italic text-ink-soft/60">
        Totals: 9 categories · 65 packages · single flat-rate per case.
      </p>
    </section>
  );
}

/** Pick the lowest-priced standard-tier package as "most common" representative. */
function pickMostCommon(catPkgs: Package[]): Package {
  return catPkgs.reduce((acc, p) => (p.prices.B < acc.prices.B ? p : acc), catPkgs[0]);
}
