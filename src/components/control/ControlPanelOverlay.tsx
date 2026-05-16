'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ease } from '@/lib/motion';
import { ControlPanel } from './ControlPanel';

/**
 * Hidden Control Mode overlay. Mounted globally in PresentationShell.
 * Toggled by Ctrl/Cmd + Shift + E. Audience cannot reach it via the
 * sidebar or any visible control — Mohamed only.
 *
 * The standalone /control route renders the same ControlPanel without
 * the overlay chrome, for use when overlay UX is too cramped.
 */
export function ControlPanelOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + E (case-insensitive)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        // Esc closes — but only when no other overlay (modal / search) has focus.
        // Those overlays each set body[data-scroll-locked]; we check that flag.
        if (document.body.dataset.scrollLocked !== 'true' || open) {
          // we are the active overlay; close
          e.preventDefault();
          setOpen(false);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      document.body.dataset.scrollLocked = 'true';
    } else if (document.body.dataset.scrollLocked === 'true') {
      delete document.body.dataset.scrollLocked;
    }
    return () => {
      if (typeof document !== 'undefined' && document.body.dataset.scrollLocked === 'true') {
        delete document.body.dataset.scrollLocked;
      }
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex justify-center bg-navy-deep/85 px-3 pt-3 pb-3 backdrop-blur-md sm:px-6 sm:pt-6 sm:pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: ease.premium }}
            className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-sm border border-gold/30 bg-navy-deep shadow-card-hover"
          >
            <button
              type="button"
              aria-label="Close Control Mode"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 bg-navy-deep/80 text-ink-soft transition-colors hover:border-gold/50 hover:text-gold"
            >
              <X size={16} />
            </button>
            <div className="h-full overflow-y-auto">
              <ControlPanel />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
