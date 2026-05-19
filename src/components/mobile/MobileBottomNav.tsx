'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import {
  getSectionTitle,
  getSubtopicTitle,
  nextRoute,
  parsePathname,
  prevRoute,
  routeToHref,
  type RouteId,
} from '@/lib/nav-config';
import { audienceHref } from '@/context/AudienceModeContext';

interface MobileBottomNavProps {
  onOpenQuickJump: () => void;
}

/**
 * Phase 2.4W — Mobile audience-mode bottom navigation.
 *
 * Fixed-position prev / quick-jump / next strip. Honors iOS
 * safe-area-inset-bottom so it clears the home indicator. Reuses the
 * existing nav-config helpers (no duplication of nav logic).
 *
 * Only mounted by PresentationShell when audience mode is active.
 */
export function MobileBottomNav({ onOpenQuickJump }: MobileBottomNavProps) {
  const pathname = usePathname() || '/';
  const current = parsePathname(pathname);
  const prev = prevRoute(current);
  const next = nextRoute(current);

  return (
    <nav
      aria-label="Mobile audience navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy-deep/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-stretch gap-1 px-2 py-1.5">
        <NavButton route={prev} direction="prev" />

        <button
          type="button"
          onClick={onOpenQuickJump}
          aria-label="Jump to a section"
          className="mx-1 flex h-12 w-12 items-center justify-center self-center rounded-full border transition-all duration-200 active:scale-95"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-accent) 55%, transparent)',
            background: 'color-mix(in srgb, var(--theme-accent) 15%, transparent)',
            color: 'var(--theme-accent)',
            boxShadow:
              '0 0 20px color-mix(in srgb, var(--theme-accent) 25%, transparent)',
          }}
        >
          <LayoutGrid size={20} />
        </button>

        <NavButton route={next} direction="next" />
      </div>
    </nav>
  );
}

function NavButton({
  route,
  direction,
}: {
  route: RouteId | null;
  direction: 'prev' | 'next';
}) {
  const isPrev = direction === 'prev';

  if (!route) {
    return (
      <span
        aria-hidden
        className="flex min-h-[44px] items-center gap-2 rounded-sm px-3 py-2 text-ice/25"
      >
        {isPrev ? <ChevronLeft size={18} /> : null}
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          {isPrev ? 'Start' : 'End'}
        </span>
        {!isPrev ? <ChevronRight size={18} /> : null}
      </span>
    );
  }

  const title = route.subId
    ? getSubtopicTitle(route.sectionId, route.subId)
    : getSectionTitle(route.sectionId);

  const label = isPrev ? 'Previous' : 'Next';
  const href = audienceHref(routeToHref(route));

  return (
    <Link
      href={href}
      aria-label={`${label}: ${title}`}
      className={`flex min-h-[44px] items-center gap-2 rounded-sm px-3 py-2 text-ice/85 transition-all duration-200 hover:text-white active:scale-[0.97] ${
        isPrev ? 'justify-start' : 'justify-end'
      }`}
    >
      {isPrev && <ChevronLeft size={18} className="shrink-0" />}
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.3em] text-ice/55"
          style={{ textAlign: isPrev ? 'left' : 'right' }}
        >
          {label}
        </span>
        <span
          className="truncate text-[12px]"
          style={{ textAlign: isPrev ? 'left' : 'right' }}
        >
          {title}
        </span>
      </span>
      {!isPrev && <ChevronRight size={18} className="shrink-0" />}
    </Link>
  );
}
