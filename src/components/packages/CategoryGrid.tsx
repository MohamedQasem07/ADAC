'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { usePricing } from '@/context/PricingContext';
import { ease, staggerTight } from '@/lib/motion';
import { routeToHref } from '@/lib/nav-config';
import { categoryPriceRange } from '@/lib/pricing';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { Package, PackageCategory } from '@/types/content';

interface CategoryGridProps {
  /** Section id this grid links into, e.g. "12" for §12 → /section/12/12.1 */
  sectionId: string;
  categories: PackageCategory[];
  packages: Package[];
}

/**
 * 3×3 grid of the 9 package categories. Each card shows the category
 * code, name, package count, current scenario price range, and links
 * into the category detail subtopic (12.1–12.9).
 *
 * Cards stagger in 200ms apart (3×3 grid order). Hover lifts the card
 * with gold border + price-range subtly emphasizing.
 */
export function CategoryGrid({ sectionId, categories, packages }: CategoryGridProps) {
  const { scenario } = usePricing();
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <motion.ul
      ref={ref}
      variants={staggerTight}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {categories.map((cat, i) => {
        const catPkgs = packages.filter((p) => p.category === cat.id);
        const subId = `${sectionId}.${i + 1}`; // 12.1, 12.2, ...
        const range = categoryPriceRange(catPkgs, scenario);

        return (
          <motion.li
            key={cat.id}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: ease.premium },
              },
            }}
          >
            <Link
              href={routeToHref({ sectionId, subId })}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover"
            >
              {/* Top-left + bottom-right gold corner accents */}
              <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
              <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

              <div>
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                    {i + 1} · {cat.code}
                  </p>
                  <ArrowUpRight
                    size={14}
                    className="text-ink-soft/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  />
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight text-white">
                  {cat.name}
                </h3>
              </div>

              <div className="mt-8 flex items-end justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft/70">
                    Packages
                  </p>
                  <p className="font-display text-xl text-white">
                    {catPkgs.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft/70">
                    Range
                  </p>
                  <p className="font-display text-base text-gold-soft">
                    {range}
                  </p>
                </div>
              </div>
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
