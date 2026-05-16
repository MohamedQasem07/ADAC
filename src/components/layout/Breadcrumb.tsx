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
      className="pointer-events-none fixed top-0 left-0 right-0 z-30 flex justify-center px-8 pt-6"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded border border-white/5 bg-navy-deep/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] backdrop-blur-sm">
        <span className="text-ink-soft/60">§{route.sectionId}</span>
        <Link
          href={routeToHref({ sectionId: route.sectionId })}
          className="text-ink-soft transition-colors hover:text-gold"
        >
          {sectionTitle}
        </Link>
        {subTitle && (
          <>
            <span className="text-ink-soft/40">·</span>
            <span className="text-gold">{subTitle}</span>
          </>
        )}
      </div>
    </nav>
  );
}
