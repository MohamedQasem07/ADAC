'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fallbackPackagesData } from '@/data/fallback';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { usePricing } from '@/context/PricingContext';
import { ease, staggerTight } from '@/lib/motion';
import { categoryPriceRange } from '@/lib/pricing';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { Package, PackageCategory } from '@/types/content';

/**
 * Compact 9-card category grid for the Executive Data Room.
 *
 * Reads packages + categories from the existing fallback dataset.
 * Filters disabled / Removed packages via the override layer so the
 * dashboard count reflects what the audience will actually see in §12.
 * Renders price ranges via `categoryPriceRange` which already returns
 * "To be agreed" under Scenario A — so no scenario labels leak through.
 */
export function DataRoomPackages() {
  const { applyPackages } = useOverrides();
  const { scenario } = usePricing();
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  const allPackages = fallbackPackagesData.packages as Package[];
  const categories = fallbackPackagesData.categories as PackageCategory[];
  const effective = useMemo(() => applyPackages(allPackages), [applyPackages, allPackages]);

  const totalCount = effective.length;
  const isNegotiation = scenario === 'A';

  return (
    <div ref={ref}>
      {/* Header line */}
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <p className="font-display text-base text-white md:text-lg">
          <span style={{ color: 'var(--theme-accent)' }}>{totalCount}</span> packages ·{' '}
          <span style={{ color: 'var(--theme-accent)' }}>{categories.length}</span>{' '}
          categories · flat-rate framework
        </p>
        <p className="text-[11px] uppercase tracking-[0.25em] text-ice/70">
          Mode of delivery does not change the package price
        </p>
      </div>

      {/* 9 category cards */}
      <motion.ul
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((cat, i) => {
          const catPkgs = effective.filter((p) => p.category === cat.id);
          if (catPkgs.length === 0) return null;
          const range = categoryPriceRange(catPkgs, scenario);
          const subId = `12.${i + 1}`;

          return (
            <motion.li
              key={cat.id}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: ease.premium },
                },
              }}
            >
              <Link
                href={`/section/12/${subId}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-sm border bg-navy/40 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
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
                  className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l border-t opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    borderColor:
                      'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    borderColor:
                      'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
                  }}
                />
                <div className="flex items-baseline justify-between">
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: 'var(--theme-accent)' }}
                  >
                    {i + 1} · {cat.code}
                  </p>
                  <ArrowUpRight
                    size={12}
                    className="text-ice/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <p className="mt-2 font-display text-sm leading-snug text-white">
                  {cat.name}
                </p>
                <div className="mt-3 flex items-end justify-between border-t border-white/5 pt-2">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ice/70">
                    {catPkgs.length} {catPkgs.length === 1 ? 'package' : 'packages'}
                  </p>
                  <p
                    className={`font-display text-xs ${
                      isNegotiation ? 'text-ice/90 italic' : ''
                    }`}
                    style={
                      isNegotiation ? undefined : { color: 'var(--theme-accent-soft)' }
                    }
                    title={isNegotiation ? 'Package-based rate — to be finalized' : undefined}
                  >
                    {isNegotiation ? 'To be agreed' : range}
                  </p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>

      <p className="mt-5 text-xs leading-relaxed text-ice/80">
        Escalation is quoted separately when clinically required. Pre-authorization applies
        above EUR 250 in the standard framework.
      </p>
    </div>
  );
}
