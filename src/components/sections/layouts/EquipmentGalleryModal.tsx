'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ease } from '@/lib/motion';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
function asset(src: string): string {
  if (!src) return src;
  if (src.startsWith('http')) return src;
  return `${BASE_PATH}${src}`;
}

interface EquipmentGalleryModalProps {
  open: boolean;
  title: string;
  description?: string;
  photos: string[];
  onClose: () => void;
}

/**
 * §2.4 — Per-equipment photo lightbox.
 *
 * Opens when an equipment card is clicked. Shows all photos in that
 * card's gallery folder as a responsive grid (1 col on mobile, 2 on
 * tablet, 3 on wide desktop). ESC closes; click on the dark backdrop
 * closes; close-X in the top-right closes. While open, body scroll is
 * locked via `data-scroll-locked="true"` (existing CSS hook in
 * globals.css — matches the pattern used by other modal/overlay
 * components in the deck).
 */
export function EquipmentGalleryModal({
  open,
  title,
  description,
  photos,
  onClose,
}: EquipmentGalleryModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // ESC closes + body-scroll lock while open.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);

    try {
      document.body.setAttribute('data-scroll-locked', 'true');
    } catch {
      /* ignore */
    }

    // Focus the close button so screen readers + Tab cycle land sensibly.
    closeRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      try {
        document.body.removeAttribute('data-scroll-locked');
      } catch {
        /* ignore */
      }
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="equipment-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: ease.premium }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 md:px-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo gallery`}
          onClick={(e) => {
            // Click-on-backdrop (i.e. not on the inner panel) closes.
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            background: 'rgba(7, 7, 11, 0.86)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.4, ease: ease.premium }}
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-white/15 bg-navy-deep/95 shadow-card-hover backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* corner chrome */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t opacity-70"
              style={{ borderColor: 'var(--theme-accent)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r opacity-70"
              style={{ borderColor: 'var(--theme-accent)' }}
            />

            {/* Header */}
            <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 md:px-8 md:py-6">
              <div className="min-w-0 flex-1">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.4em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  Equipment gallery
                </p>
                <h2 className="mt-1 truncate font-display text-xl font-semibold leading-tight text-white md:text-2xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-xs leading-relaxed text-ice/75 md:text-sm">
                    {description}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close gallery"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/15 bg-white/[0.04] text-ice/85 transition-colors hover:border-[var(--theme-accent)]/55 hover:text-white"
              >
                <X size={16} />
              </button>
            </header>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-6 md:px-8 md:py-8">
              {photos.length === 0 ? (
                <p className="text-center text-sm text-ink-soft/80">
                  No photos available for this item.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((src, i) => (
                    <li
                      key={src}
                      className="overflow-hidden rounded-sm border border-white/10 bg-navy/40"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-deep">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset(src)}
                          alt={`${title} · photo ${i + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ice/65">
                        {title} · photo {i + 1}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
