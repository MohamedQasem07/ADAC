'use client';

import { motion } from 'framer-motion';
import { ease } from '@/lib/motion';
import type { Package } from '@/types/content';
import { PriceBadge } from './PriceBadge';

interface PackageCardProps {
  pkg: Package;
  onClick?: () => void;
}

/**
 * Single package card. Click → opens PackageModal with full details.
 * Theme-aware (Phase 2.4E.2) — code, border, hover, and "View details
 * →" hover all consume --theme-accent / --theme-card-* tokens.
 */
export function PackageCard({ pkg, onClick }: PackageCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.3, ease: ease.premium }}
      className="group relative flex w-full flex-col justify-between overflow-hidden rounded-sm border bg-navy/40 p-5 text-left backdrop-blur-sm transition-shadow duration-300 hover:shadow-card-hover"
      style={{ borderColor: 'var(--theme-card-border)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--theme-card-hover-border)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--theme-card-border)';
      }}
    >
      <div>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: 'color-mix(in srgb, var(--theme-accent) 80%, transparent)' }}
        >
          {pkg.code}
        </p>
        <p className="mt-2 font-display text-lg leading-snug text-white">
          {pkg.name}
        </p>
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ice/80">
          {pkg.included}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <PriceBadge pkg={pkg} size="sm" />
        <span
          className="text-[11px] uppercase tracking-[0.25em] text-ice/75 transition-colors duration-300"
        >
          View details →
        </span>
      </div>
    </motion.button>
  );
}
