'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Layers,
  LayoutDashboard,
  MessagesSquare,
  Stethoscope,
  Tag,
  X,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllSectionsClient,
  parsePathname,
  routeToHref,
} from '@/lib/nav-config';
import { audienceHref } from '@/context/AudienceModeContext';

interface MobileQuickJumpSheetProps {
  open: boolean;
  onClose: () => void;
}

interface AnchorTile {
  id: string;
  icon: LucideIcon;
  label: string;
  caption: string;
  href: string;
}

/**
 * The 8 anchor tiles surfaced at the top of the quick-jump sheet —
 * matches the user-confirmed list for the mobile audience meeting flow.
 */
const ANCHOR_TILES: AnchorTile[] = [
  {
    id: 'data-room',
    icon: LayoutDashboard,
    label: 'Executive Data Room',
    caption: 'Consolidated dashboard',
    href: '/section/data-room',
  },
  {
    id: '3',
    icon: BarChart3,
    label: 'Track Record',
    caption: '§3 · ADAC partnership history',
    href: '/section/3',
  },
  {
    id: '4',
    icon: Stethoscope,
    label: 'Why Outpatient Packages',
    caption: '§4 · Framework rationale',
    href: '/section/4',
  },
  {
    id: '10.5',
    icon: FileText,
    label: 'Digital Workflow',
    caption: '§10.5 · Sample report flow',
    href: '/section/10/10.5',
  },
  {
    id: '12',
    icon: Layers,
    label: 'Package Catalogue',
    caption: '§12 · 9 categories',
    href: '/section/12',
  },
  {
    id: '13',
    icon: Tag,
    label: 'Pricing Philosophy',
    caption: '§13 · Pricing approach',
    href: '/section/13',
  },
  {
    id: '13.6',
    icon: FileText,
    label: 'Package Simulator',
    caption: '§13.6 · Template demo',
    href: '/section/13/13.6',
  },
  {
    id: 'decisions',
    icon: MessagesSquare,
    label: 'Decision Points',
    caption: 'What yes looks like',
    href: '/section/decisions',
  },
];

/**
 * Phase 2.4W — Mobile audience quick-jump sheet.
 *
 * Slide-up sheet with 8 anchor tiles + the full section/subsection
 * tree. Triggered by the center button in MobileBottomNav. Locks body
 * scroll while open. Esc and backdrop dismiss.
 */
export function MobileQuickJumpSheet({ open, onClose }: MobileQuickJumpSheetProps) {
  const pathname = usePathname() || '/';
  const current = parsePathname(pathname);
  const sections = getAllSectionsClient();

  // Esc + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-[55] bg-navy-deep/70 backdrop-blur-sm"
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Quick jump to section"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed inset-x-0 bottom-0 z-[56] flex max-h-[80vh] flex-col rounded-t-xl border-t border-white/15 bg-navy-deep/95 backdrop-blur-md"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Drag handle */}
            <div className="flex items-center justify-center pt-2.5 pb-1">
              <span
                aria-hidden
                className="h-1 w-10 rounded-full bg-white/25"
              />
            </div>

            {/* Header row */}
            <div className="flex items-baseline justify-between border-b border-white/10 px-5 pb-3">
              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.4em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  Jump to section
                </p>
                <p className="mt-1 text-xs text-ice/70">
                  Tap a topic to navigate
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick jump"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 text-ice/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ice/65">
                Anchor sections
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2.5">
                {ANCHOR_TILES.map((tile) => {
                  const Icon = tile.icon;
                  const isHere =
                    tile.id === current.sectionId ||
                    tile.id === current.subId ||
                    (tile.id === '10.5' && current.subId === '10.5');
                  return (
                    <li key={tile.id}>
                      <Link
                        href={audienceHref(tile.href)}
                        onClick={onClose}
                        className="group relative block h-full rounded-sm border bg-navy/40 px-3 py-3 transition-colors"
                        style={{
                          borderColor: isHere
                            ? 'color-mix(in srgb, var(--theme-accent) 70%, transparent)'
                            : 'var(--theme-card-border)',
                          background: isHere
                            ? 'color-mix(in srgb, var(--theme-accent) 12%, transparent)'
                            : undefined,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border"
                            style={{
                              borderColor:
                                'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
                              background:
                                'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
                              color: 'var(--theme-accent)',
                            }}
                          >
                            <Icon size={14} />
                          </span>
                          {isHere && (
                            <CheckCircle2
                              size={14}
                              style={{ color: 'var(--theme-accent)' }}
                            />
                          )}
                        </div>
                        <p className="mt-2.5 text-[13px] font-medium leading-tight text-white">
                          {tile.label}
                        </p>
                        <p className="mt-1 text-[10.5px] leading-snug text-ice/70">
                          {tile.caption}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.3em] text-ice/65">
                All sections
              </p>
              <ul className="mt-3 space-y-1">
                {sections.map((s) => {
                  const isHere = current.sectionId === s.id && !current.subId;
                  return (
                    <li key={s.id}>
                      <Link
                        href={audienceHref(routeToHref({ sectionId: s.id }))}
                        onClick={onClose}
                        className="flex min-h-[44px] items-center justify-between gap-3 rounded-sm border px-3 py-2 transition-colors"
                        style={{
                          borderColor: isHere
                            ? 'color-mix(in srgb, var(--theme-accent) 55%, transparent)'
                            : 'transparent',
                          background: isHere
                            ? 'color-mix(in srgb, var(--theme-accent) 10%, transparent)'
                            : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <span className="flex min-w-0 items-baseline gap-2">
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-ice/55">
                            {/^\d+$/.test(s.id) ? `§${s.id}` : s.id.slice(0, 4)}
                          </span>
                          <span className="min-w-0 truncate text-sm text-ice/90">
                            {s.title}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-ice/45"
                        />
                      </Link>
                      {s.subtopics && s.subtopics.length > 0 && (
                        <ul className="mt-1 ml-7 space-y-0.5 border-l border-white/8 pl-3">
                          {s.subtopics.map((sub) => {
                            const subHere =
                              current.sectionId === s.id &&
                              current.subId === sub.id;
                            return (
                              <li key={sub.id}>
                                <Link
                                  href={audienceHref(
                                    routeToHref({
                                      sectionId: s.id,
                                      subId: sub.id,
                                    })
                                  )}
                                  onClick={onClose}
                                  className="flex min-h-[36px] items-baseline gap-2 rounded-sm px-2 py-1.5 text-[12px] text-ice/75 transition-colors hover:text-white"
                                  style={
                                    subHere
                                      ? { color: 'var(--theme-accent)' }
                                      : undefined
                                  }
                                >
                                  <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.15em] text-ice/45">
                                    {sub.id}
                                  </span>
                                  <span className="min-w-0 flex-1 truncate">
                                    {sub.title}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
