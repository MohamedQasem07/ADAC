'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePricing } from '@/context/PricingContext';
import { ease } from '@/lib/motion';
import type { Package } from '@/types/content';

interface PriceBadgeProps {
  pkg: Package;
  /** Optional size variant. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Animated price chip. Smoothly crossfades when the active pricing
 * scenario changes (Cmd/Ctrl+1/2/3). Scenario A renders the literal
 * "To be agreed" text; B and C render "€NNN".
 */
export function PriceBadge({ pkg, size = 'md' }: PriceBadgeProps) {
  const { scenario } = usePricing();

  const text =
    scenario === 'A'
      ? 'To be agreed'
      : `€${scenario === 'B' ? pkg.prices.B : pkg.prices.C}`;

  const sizing = {
    sm: 'text-base px-3 py-1',
    md: 'text-xl px-4 py-1.5',
    lg: 'text-3xl px-6 py-2',
  }[size];

  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-sm border font-display font-semibold ${sizing}`}
      style={{
        borderColor: 'var(--theme-badge-border)',
        background: 'var(--theme-badge-bg)',
        color: 'var(--theme-badge-text)',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={`${scenario}-${text}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: ease.premium }}
          className="block whitespace-nowrap"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
