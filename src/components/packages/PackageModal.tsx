'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { ease } from '@/lib/motion';
import type { Package } from '@/types/content';
import { PriceBadge } from './PriceBadge';

interface PackageModalProps {
  pkg: Package | null;
  onClose: () => void;
}

/**
 * Full-screen package modal. Slides up from bottom with backdrop blur
 * fade. Esc closes. Locks body scroll while open.
 */
export function PackageModal({ pkg, onClose }: PackageModalProps) {
  useEffect(() => {
    if (!pkg) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [pkg, onClose]);

  return (
    <AnimatePresence>
      {pkg && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-deep/70 backdrop-blur-md sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.article
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.premium }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-t-sm border border-gold/30 bg-navy/95 p-8 shadow-card-hover backdrop-blur-md sm:rounded-sm sm:p-10"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-ink-soft transition-colors hover:text-gold"
            >
              <X size={18} />
            </button>

            <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold">{pkg.code}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-white md:text-4xl">
              {pkg.name}
            </h2>
            <div className="gold-rule mt-6 w-16" />

            <section className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft/70">
                What&rsquo;s included
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">
                {pkg.included}
              </p>
            </section>

            <section className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft/70">
                  Flat-rate price
                </p>
                <p className="mt-1 text-xs text-ink-soft/60">
                  Inclusive of doctor exam · medication · medical report
                </p>
              </div>
              <PriceBadge pkg={pkg} size="lg" />
            </section>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
