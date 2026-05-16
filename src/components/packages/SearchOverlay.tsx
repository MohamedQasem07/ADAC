'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { fallbackPackagesData } from '@/data/fallback';
import { ease } from '@/lib/motion';
import { routeToHref } from '@/lib/nav-config';
import { emitHotkeyToast } from '@/components/layout/HotkeyToast';
import type { Package, PackageCategory } from '@/types/content';
import { PriceBadge } from './PriceBadge';

interface SearchOverlayProps {
  /** Optional global mount flag (passed by shell). Default true. */
  enabled?: boolean;
}

/**
 * Cmd/Ctrl+F overlay. Filters all 65 packages by code, name, or
 * "What's Included" text in real time. Centered input grows from
 * scale 0.9 → 1 on open; backdrop blur fades in. Results stagger in
 * as the user types; click a result navigates to its category subtopic.
 */
export function SearchOverlay({ enabled = true }: SearchOverlayProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { applyPackages } = useOverrides();

  const allPackages = fallbackPackagesData.packages as Package[];
  const categories = fallbackPackagesData.categories as PackageCategory[];
  // Disabled / Removed packages are filtered out so the audience-facing
  // search never surfaces them.
  const packages = useMemo(() => applyPackages(allPackages), [applyPackages, allPackages]);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl+F.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        // Don't intercept when typing inside an existing input.
        const target = e.target as HTMLElement | null;
        if (target) {
          const tag = target.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
            // Allow native find-in-page in form fields.
            return;
          }
        }
        e.preventDefault();
        setOpen(true);
        emitHotkeyToast({ keys: 'Ctrl+F', action: 'Search packages' });
        return;
      }
      // Esc closes overlay.
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, enabled]);

  useEffect(() => {
    if (open) {
      // Focus after the entry animation lands.
      const t = window.setTimeout(() => inputRef.current?.focus(), 150);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return packages.slice(0, 8);
    return packages
      .filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.included.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, packages]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-start justify-center bg-navy-deep/75 px-4 pt-24 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            setOpen(false);
            setQuery('');
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: ease.premium }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            {/* Input */}
            <div
              className="flex items-center gap-3 rounded-sm border bg-navy/95 px-5 py-4 shadow-card-hover"
              style={{
                borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
              }}
            >
              <Search size={18} style={{ color: 'var(--theme-accent)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search packages — code, name, or service…"
                className="flex-1 bg-transparent text-base text-white placeholder-ice/55 focus:outline-none"
              />
              <button
                onClick={() => {
                  setOpen(false);
                  setQuery('');
                }}
                className="text-ink-soft transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--theme-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <ul className="mt-3 max-h-[60vh] space-y-1.5 overflow-y-auto">
              {filtered.length === 0 && (
                <li className="rounded-sm border border-white/5 bg-navy/40 px-5 py-4 text-sm text-ice/80">
                  No packages match &ldquo;{query}&rdquo;.
                </li>
              )}
              {filtered.map((p, i) => {
                const subId = `12.${p.category}`;
                const cat = categories.find((c) => c.id === p.category);
                return (
                  <motion.li
                    key={p.code}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.025,
                      duration: 0.3,
                      ease: ease.premium,
                    }}
                  >
                    <Link
                      href={routeToHref({ sectionId: '12', subId })}
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                      }}
                      className="group flex items-center justify-between gap-4 rounded-sm border border-white/5 bg-navy/80 px-5 py-3 transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          'color-mix(in srgb, var(--theme-accent) 40%, transparent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '';
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-mono text-[10px] uppercase tracking-[0.3em]"
                          style={{ color: 'color-mix(in srgb, var(--theme-accent) 80%, transparent)' }}
                        >
                          {p.code} · {cat?.name}
                        </p>
                        <p className="mt-1 truncate font-display text-base text-white">
                          {p.name}
                        </p>
                      </div>
                      <PriceBadge pkg={p} size="sm" />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.3em] text-ice/75">
              {filtered.length} of {packages.length} packages · Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
