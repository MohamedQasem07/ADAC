'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Sparkles, Star } from 'lucide-react';
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
 */
const BADGE_BY_ID: Record<string, string> = {
  overview: 'OVR',
  'data-room': 'DR',
  decisions: 'DEC',
};

function badgeFor(id: string): string {
  if (BADGE_BY_ID[id]) return BADGE_BY_ID[id];
  if (/^\d+$/.test(id)) return id;
  return id.slice(0, 3).toUpperCase();
}

/**
 * Phase 2.4V — Gold Focus Markers (presenter-facing, sidebar-only).
 *
 * The 14 anchor routes the presenter must not miss during the meeting.
 * Each row in the Sidebar that matches one of these ids gets a small
 * gold star next to its title. Audience never sees these markers
 * because they live inside the (presenter-only) sidebar.
 *
 * Section ids:  'data-room', '3', '4', '12', '13', '17', 'decisions'
 * Subtopic ids: '3.1', '3.4', '3.8', '10.5', '12.10', '13.5', '13.6'
 */
const FOCUS_ROUTES: ReadonlySet<string> = new Set([
  'data-room',
  '3',
  '3.1',
  '3.4',
  '3.8',
  '4',
  '10.5',
  '12',
  '12.10',
  '13',
  '13.5',
  '13.6',
  'decisions',
  '17',
]);

function FocusMarker() {
  return (
    <Star
      aria-label="Anchor page"
      size={10}
      fill="currentColor"
      className="shrink-0"
      style={{
        color: 'var(--theme-accent)',
        opacity: 0.85,
      }}
    />
  );
}

/**
 * Left-edge collapsible navigation. Theme-aware (Phase 2.4E.2) — uses
 * --theme-sidebar-* and --theme-accent CSS variables so the entire
 * sidebar (background, active row, code badge, hover, footer accent)
 * shifts between Premium Navy and HMC × ADAC Partnership modes.
 */
export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname() || '/';
  const current = parsePathname(pathname);
  const sections = getAllSectionsClient();

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
          'fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-500',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        style={{ background: 'var(--theme-sidebar-backdrop)' }}
      />

      {/* Panel */}
      <aside
        aria-label="Section navigation"
        className={cn(
          'fixed bottom-0 left-0 top-0 z-50 flex w-[min(22rem,calc(100vw-1rem))] flex-col border-r border-white/10 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: 'var(--theme-sidebar-bg)' }}
      >
        <header className="border-b border-white/5 px-6 py-6">
          <p
            className="font-sans text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            HMC × ADAC
          </p>
          <p className="mt-1 font-display text-base text-white">Partnership Proposal</p>
          <p className="mt-0.5 text-xs text-ink-soft/70">19 May 2026 · Hurghada</p>
          {/* Phase 2.4W polish — the Phase 2.4E.3 dual-brand strip
              (HMC blue + ADAC yellow halves) read as a small two-stripe
              flag when the sidebar was open, which was visually
              distracting. The ThemeSwitcher (top-right) is the
              authoritative theme indicator; no extra cue is needed
              inside the sidebar header. */}
        </header>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {sections.map((s) => {
              const isActive = current.sectionId === s.id && !current.subId;
              const hasSubs = (s.subtopics?.length ?? 0) > 0;
              const isOpen = expanded[s.id] ?? false;
              const badge = badgeFor(s.id);
              const isDataRoom = s.id === 'data-room';
              const isFocus = FOCUS_ROUTES.has(s.id);

              return (
                <li key={s.id}>
                  <div
                    className={cn(
                      'group relative flex items-stretch rounded-sm transition-colors',
                      isActive
                        ? 'text-white'
                        : 'text-ice/85 hover:bg-white/5'
                    )}
                    style={
                      isActive
                        ? { background: 'var(--theme-sidebar-active-bg)' }
                        : undefined
                    }
                  >
                    {/* Active left accent bar */}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r transition-all duration-300',
                        isActive
                          ? 'opacity-100 scale-y-100'
                          : 'opacity-0 scale-y-50 group-hover:opacity-60 group-hover:scale-y-100'
                      )}
                      style={{ background: 'var(--theme-sidebar-active-border)' }}
                    />
                    <Link
                      href={routeToHref({ sectionId: s.id })}
                      onClick={onClose}
                      className="flex flex-1 items-center gap-3 px-3 py-2 text-left text-sm min-w-0"
                    >
                      {/* Code badge */}
                      <span
                        className={cn(
                          'inline-flex w-12 shrink-0 items-center justify-center rounded-sm border px-1 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors'
                        )}
                        style={
                          isActive
                            ? {
                                borderColor:
                                  'color-mix(in srgb, var(--theme-accent) 50%, transparent)',
                                background: 'var(--theme-sidebar-active-bg)',
                                color: 'var(--theme-sidebar-active-text)',
                              }
                            : {
                                borderColor: 'rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.03)',
                                color: 'rgba(244,248,252,0.65)',
                              }
                        }
                      >
                        {badge}
                      </span>
                      {/* Title */}
                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate',
                          isActive ? 'text-white font-medium' : ''
                        )}
                      >
                        {s.title}
                      </span>
                      {/* Phase 2.4V — Gold Focus Marker (presenter-only). */}
                      {isFocus && <FocusMarker />}
                      {/* Executive accent for the Data Room */}
                      {isDataRoom && (
                        <span
                          aria-label="Executive view"
                          className="shrink-0 inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em]"
                          style={{
                            background: 'var(--theme-badge-bg)',
                            border: '1px solid var(--theme-badge-border)',
                            color: 'var(--theme-badge-text)',
                          }}
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
                        className="shrink-0 px-3 py-2 text-ice/50 transition-colors duration-300"
                        style={{}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--theme-accent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '';
                        }}
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
                        const subFocus = FOCUS_ROUTES.has(sub.id);
                        return (
                          <li key={sub.id}>
                            <Link
                              href={routeToHref({ sectionId: s.id, subId: sub.id })}
                              onClick={onClose}
                              className={cn(
                                'flex items-baseline gap-2 px-3 py-1.5 text-xs transition-colors min-w-0',
                                subActive ? '' : 'text-ice/75'
                              )}
                              style={
                                subActive
                                  ? { color: 'var(--theme-sidebar-active-text)' }
                                  : undefined
                              }
                              onMouseEnter={(e) => {
                                if (!subActive) {
                                  e.currentTarget.style.color = 'var(--theme-accent)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!subActive) {
                                  e.currentTarget.style.color = '';
                                }
                              }}
                            >
                              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-ice/45">
                                {sub.id}
                              </span>
                              <span className="min-w-0 flex-1 truncate">{sub.title}</span>
                              {subFocus && <FocusMarker />}
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

        <footer className="border-t border-white/5 px-6 py-4 text-[11px] uppercase tracking-[0.3em] text-ice/75">
          Press <span style={{ color: 'var(--theme-accent)' }}>?</span> for shortcuts
        </footer>
      </aside>
    </>
  );
}
