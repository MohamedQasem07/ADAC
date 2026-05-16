/**
 * Client-safe navigation helpers. Imports `sections.json` directly so
 * this module works in both server components (build time) and client
 * components (runtime). No `fs` dependency.
 *
 * Markdown reading still lives in `content-loader.ts` (server-only).
 */

import manifestRaw from '@/content/sections.json';
import type { PresentationManifest } from '@/types/content';

const MANIFEST = manifestRaw as unknown as PresentationManifest;

export interface RouteId {
  sectionId: string;
  subId?: string;
}

export function getManifestClient(): PresentationManifest {
  return MANIFEST;
}

export function getAllSectionsClient() {
  return MANIFEST.sections;
}

export function buildLinearOrder(): string[] {
  return MANIFEST.sections.map((s) => s.id);
}

export function buildSubtopicOrder(sectionId: string): string[] {
  const section = MANIFEST.sections.find((s) => s.id === sectionId);
  return section?.subtopics?.map((s) => s.id) ?? [];
}

/** Convert a route to its absolute URL path (no basePath). */
export function routeToHref(route: RouteId): string {
  if (route.sectionId === '1') return '/';
  return route.subId
    ? `/section/${route.sectionId}/${route.subId}`
    : `/section/${route.sectionId}`;
}

/**
 * Parses a pathname into a RouteId. Next.js App Router's usePathname()
 * returns the path *without* basePath in production, so we don't strip it.
 */
export function parsePathname(pathname: string): RouteId {
  if (pathname === '/' || pathname === '') return { sectionId: '1' };
  const match = pathname.match(/^\/section\/([^/]+)(?:\/([^/]+))?\/?$/);
  if (!match) return { sectionId: '1' };
  return { sectionId: match[1], subId: match[2] };
}

/**
 * Next/prev sibling at the current level. Subtopic boundaries advance to
 * the next section's top-level (so → keeps moving forward end-to-end).
 */
export function nextRoute(current: RouteId): RouteId | null {
  const sections = buildLinearOrder();
  const sectionIdx = sections.indexOf(current.sectionId);
  if (sectionIdx === -1) return null;

  if (current.subId) {
    const subs = buildSubtopicOrder(current.sectionId);
    const subIdx = subs.indexOf(current.subId);
    if (subIdx >= 0 && subIdx < subs.length - 1) {
      return { sectionId: current.sectionId, subId: subs[subIdx + 1] };
    }
    if (sectionIdx < sections.length - 1) {
      return { sectionId: sections[sectionIdx + 1] };
    }
    return null;
  }

  if (sectionIdx < sections.length - 1) {
    return { sectionId: sections[sectionIdx + 1] };
  }
  return null;
}

export function prevRoute(current: RouteId): RouteId | null {
  const sections = buildLinearOrder();
  const sectionIdx = sections.indexOf(current.sectionId);
  if (sectionIdx === -1) return null;

  if (current.subId) {
    const subs = buildSubtopicOrder(current.sectionId);
    const subIdx = subs.indexOf(current.subId);
    if (subIdx > 0) {
      return { sectionId: current.sectionId, subId: subs[subIdx - 1] };
    }
    return { sectionId: current.sectionId };
  }

  if (sectionIdx > 0) {
    return { sectionId: sections[sectionIdx - 1] };
  }
  return null;
}

export function firstSubtopic(sectionId: string): RouteId | null {
  const subs = buildSubtopicOrder(sectionId);
  if (subs.length === 0) return null;
  return { sectionId, subId: subs[0] };
}

export function getSectionTitle(sectionId: string): string {
  return MANIFEST.sections.find((s) => s.id === sectionId)?.title ?? '';
}

export function getSubtopicTitle(sectionId: string, subId: string): string {
  return (
    MANIFEST.sections
      .find((s) => s.id === sectionId)
      ?.subtopics?.find((sub) => sub.id === subId)?.title ?? ''
  );
}
