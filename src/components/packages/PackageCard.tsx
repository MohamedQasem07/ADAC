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
 * Includes code (gold mono), name (Playfair), included excerpt (Inter),
 * price badge (animated on scenario change).
 */
export function PackageCard({ pkg, onClick }: PackageCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.3, ease: ease.premium }}
      className="group relative flex w-full flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-5 text-left backdrop-blur-sm transition-shadow duration-300 hover:border-gold/50 hover:shadow-card-hover"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
          {pkg.code}
        </p>
        <p className="mt-2 font-display text-lg leading-snug text-white">
          {pkg.name}
        </p>
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ink-soft/80">
          {pkg.included}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <PriceBadge pkg={pkg} size="sm" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft/50 transition-colors duration-300 group-hover:text-gold">
          View details →
        </span>
      </div>
    </motion.button>
  );
}
