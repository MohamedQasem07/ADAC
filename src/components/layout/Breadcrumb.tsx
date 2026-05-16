'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getSectionTitle,
  getSubtopicTitle,
  parsePathname,
  routeToHref,
} from '@/lib/nav-config';

/**
 * Top breadcrumb. Hidden on the cover (§1) so the opener stays clean.
 * Renders "Section X · Subtopic Y" with the section title clickable.
 */
export function Breadcrumb() {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);

  // Hide on the cover screen.
  if (route.sectionId === '1' && !route.subId) return null;

  const sectionTitle = getSectionTitle(route.sectionId);
  const subTitle = route.subId ? getSubtopicTitle(route.sectionId, route.subId) : null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex justify-center px-4 pt-6 sm:px-8"
    >
      <div className="pointer-events-auto flex max-w-full min-w-0 items-center gap-2 rounded border border-white/5 bg-navy-deep/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] backdrop-blur-sm sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.25em]">
        <span className="shrink-0 text-ink-soft/60">§{route.sectionId}</span>
        <Link
          href={routeToHref({ sectionId: route.sectionId })}
          className="min-w-0 truncate text-ink-soft transition-colors hover:text-gold"
        >
          {sectionTitle}
        </Link>
        {subTitle && (
          <>
            <span className="shrink-0 text-ink-soft/40">·</span>
            <span className="min-w-0 truncate text-gold">{subTitle}</span>
          </>
        )}
      </div>
    </nav>
  );
}
