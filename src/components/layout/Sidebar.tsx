'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
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
 * Left-edge collapsible navigation listing all 18 sections with their
 * subtopics. The cover (§1) hides the sidebar by default; opening it
 * mid-deck animates in from the left with a backdrop dim.
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

      {/* Panel */}
      <aside
        aria-label="Section navigation"
        className={cn(
          'fixed bottom-0 left-0 top-0 z-50 flex w-80 flex-col border-r border-white/10 bg-navy-deep/95 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
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
              const isActive = current.sectionId === s.id;
              const hasSubs = (s.subtopics?.length ?? 0) > 0;
              const isOpen = expanded[s.id] ?? false;

              return (
                <li key={s.id}>
                  <div
                    className={cn(
                      'group relative flex items-center rounded-sm transition-colors',
                      isActive && !current.subId
                        ? 'bg-white/5 text-gold'
                        : 'text-ink-soft hover:bg-white/5 hover:text-gold'
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
                      className="flex-1 px-4 py-2 text-left text-sm"
                    >
                      <span className="mr-3 inline-block w-6 text-[10px] uppercase tracking-widest text-ink-soft/60">
                        §{s.id}
                      </span>
                      {s.title}
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={() => toggle(s.id)}
                        aria-label={isOpen ? 'Collapse subtopics' : 'Expand subtopics'}
                        className="px-3 py-2 text-ink-soft/50 transition-transform duration-300 hover:text-gold"
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
                        'overflow-hidden pl-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
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
                                'flex items-baseline gap-2 px-3 py-1.5 text-xs transition-colors',
                                subActive
                                  ? 'text-gold'
                                  : 'text-ink-soft/70 hover:text-gold'
                              )}
                            >
                              <span className="text-[10px] uppercase tracking-widest text-ink-soft/40">
                                {sub.id}
                              </span>
                              <span>{sub.title}</span>
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

        <footer className="border-t border-white/5 px-6 py-4 text-[10px] uppercase tracking-[0.3em] text-ink-soft/50">
          Press <span className="text-gold">?</span> for shortcuts
        </footer>
      </aside>
    </>
  );
}
