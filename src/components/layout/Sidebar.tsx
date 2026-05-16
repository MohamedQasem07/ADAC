'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Sparkles } from 'lucide-react';
import {
  getAllSectionsClient,
  parsePathname,
  routeToHref,
} from '@/lib/nav-config';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Map string-id sections (overview, data-room, decisions) to a tight
 * 2–4 char badge so they don't overflow the fixed-width code column.
 * Numeric sections keep their number unchanged. Anything not mapped
 * falls back to "§•" so we never render an ugly cramped string.
 */
const BADGE_BY_ID: Record<string, string> = {
  overview: 'OVR',
  'data-room': 'DR',
  decisions: 'DEC',
};

function badgeFor(id: string): string {
  if (BADGE_BY_ID[id]) return BADGE_BY_ID[id];
  // Numeric (e.g. "1" through "18") — show as-is
  if (/^\d+$/.test(id)) return id;
  // Fallback — first 3 letters uppercase
  return id.slice(0, 3).toUpperCase();
}

/**
 * Left-edge collapsible navigation listing all sections with their
 * subtopics. Cover (§1) hides the sidebar by default; opening it
 * mid-deck animates in from the left with a backdrop dim.
 *
 * Layout (rewritten 2.4C):
 *   - Fixed 48 px code badge column with letter-spacing safely contained
 *   - Title column flex-1 with min-w-0 + truncate so long titles never
 *     collide with the badge or the caret
 *   - Active rows: stronger gold left border + white title + gold badge
 *   - Executive Data Room gets a small "Exec" gold pill so it's findable
 */
export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname() || '/';
  const current = parsePathname(pathname);
  const sections = getAllSectionsClient();

  // Track which sections are expanded. The current section auto-expands.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({
    [current.sectionId]: true,
  }));

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-navy-deep/40 backdrop-blur-sm transition-opacity duration-500',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      {/* Panel — slightly wider than 2.4B (20rem → 22rem) to accommodate
          the bigger code badge and the new Exec pill without cramping. */}
      <aside
        aria-label="Section navigation"
        className={cn(
          'fixed bottom-0 left-0 top-0 z-50 flex w-[min(22rem,calc(100vw-1rem))] flex-col border-r border-white/10 bg-navy-deep/95 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <header className="border-b border-white/5 px-6 py-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold">HMC × ADAC</p>
          <p className="mt-1 font-display text-base text-white">Partnership Proposal</p>
          <p className="mt-0.5 text-xs text-ink-soft/70">19 May 2026 · Hurghada</p>
        </header>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {sections.map((s) => {
              const isActive = current.sectionId === s.id && !current.subId;
              const hasSubs = (s.subtopics?.length ?? 0) > 0;
              const isOpen = expanded[s.id] ?? false;
              const badge = badgeFor(s.id);
              const isDataRoom = s.id === 'data-room';

              return (
                <li key={s.id}>
                  <div
                    className={cn(
                      'group relative flex items-stretch rounded-sm transition-colors',
                      isActive
                        ? 'bg-gold/10 text-gold'
                        : 'text-ice/85 hover:bg-white/5 hover:text-gold'
                    )}
                  >
                    {/* Active gold bar */}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-gold transition-all duration-300',
                        isActive
                          ? 'opacity-100 scale-y-100'
                          : 'opacity-0 scale-y-50 group-hover:opacity-60 group-hover:scale-y-100'
                      )}
                    />
                    <Link
                      href={routeToHref({ sectionId: s.id })}
                      onClick={onClose}
                      className="flex flex-1 items-center gap-3 px-3 py-2 text-left text-sm min-w-0"
                    >
                      {/* Code badge — fixed width, never overlaps */}
                      <span
                        className={cn(
                          'inline-flex w-12 shrink-0 items-center justify-center rounded-sm border px-1 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]',
                          isActive
                            ? 'border-gold/50 bg-gold/15 text-gold'
                            : 'border-white/10 bg-white/[0.03] text-ice/65 group-hover:border-gold/30 group-hover:text-gold'
                        )}
                      >
                        {badge}
                      </span>
                      {/* Title — flex-1, min-w-0 so it truncates instead of overlapping */}
                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate',
                          isActive ? 'text-white font-medium' : ''
                        )}
                      >
                        {s.title}
                      </span>
                      {/* Executive accent for the Data Room */}
                      {isDataRoom && (
                        <span
                          aria-label="Executive view"
                          className={cn(
                            'shrink-0 inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em]',
                            isActive
                              ? 'border-gold/60 bg-gold/15 text-gold'
                              : 'border-gold/35 bg-gold/[0.05] text-gold/85 group-hover:border-gold/55'
                          )}
                        >
                          <Sparkles size={9} />
                          Exec
                        </span>
                      )}
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={() => toggle(s.id)}
                        aria-label={isOpen ? 'Collapse subtopics' : 'Expand subtopics'}
                        className="shrink-0 px-3 py-2 text-ice/50 transition-transform duration-300 hover:text-gold"
                      >
                        <ChevronRight
                          size={14}
                          className={cn('transition-transform', isOpen && 'rotate-90')}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubs && (
                    <ul
                      className={cn(
                        'overflow-hidden pl-[3.75rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                      )}
                    >
                      {s.subtopics!.map((sub) => {
                        const subActive =
                          current.sectionId === s.id && current.subId === sub.id;
                        return (
                          <li key={sub.id}>
                            <Link
                              href={routeToHref({ sectionId: s.id, subId: sub.id })}
                              onClick={onClose}
                              className={cn(
                                'flex items-baseline gap-2 px-3 py-1.5 text-xs transition-colors min-w-0',
                                subActive
                                  ? 'text-gold'
                                  : 'text-ice/75 hover:text-gold'
                              )}
                            >
                              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-ice/45">
                                {sub.id}
                              </span>
                              <span className="min-w-0 flex-1 truncate">{sub.title}</span>
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
        </nav>

        <footer className="border-t border-white/5 px-6 py-4 text-[10px] uppercase tracking-[0.3em] text-ice/55">
          Press <span className="text-gold">?</span> for shortcuts
        </footer>
      </aside>
    </>
  );
}
