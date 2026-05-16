/**
 * Build-time content compilation.
 *
 * Reads sections.json + all referenced .md/.json files at build time and
 * returns a typed, frozen PresentationManifest. Components consume the
 * result via getSectionMeta() / getSectionContent() / getSubtopicContent().
 *
 * Runtime override for packages + adac-data lives in src/lib/data-loader.ts.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {
  MarkdownContent,
  PresentationManifest,
  SectionMeta,
  SubtopicMeta,
} from '@/types/content';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

let cachedManifest: PresentationManifest | null = null;

/** Loads sections.json once and caches it. */
export function getManifest(): PresentationManifest {
  if (cachedManifest) return cachedManifest;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'sections.json'), 'utf8');
  cachedManifest = JSON.parse(raw) as PresentationManifest;
  return cachedManifest;
}

export function getAllSections(): SectionMeta[] {
  return getManifest().sections;
}

export function getSectionMeta(id: string): SectionMeta | undefined {
  return getManifest().sections.find((s) => s.id === id);
}

export function getSubtopicMeta(sectionId: string, subId: string): SubtopicMeta | undefined {
  return getSectionMeta(sectionId)?.subtopics?.find((s) => s.id === subId);
}

/**
 * Returns all (sectionId, subtopicId|null) pairs needed for static route generation.
 * Used by `generateStaticParams` in the dynamic route files.
 */
export function getAllRoutes(): Array<{ section: string; sub?: string }> {
  const out: Array<{ section: string; sub?: string }> = [];
  for (const s of getAllSections()) {
    out.push({ section: s.id });
    for (const sub of s.subtopics ?? []) {
      out.push({ section: s.id, sub: sub.id });
    }
  }
  return out;
}

/**
 * Reads a markdown file from src/content/ and parses its frontmatter.
 * Returns undefined if the file does not exist (graceful — missing
 * content files render as placeholder, never crash the build).
 */
export function readMarkdown(relativePath: string): MarkdownContent | undefined {
  const full = path.join(CONTENT_DIR, relativePath);
  if (!fs.existsSync(full)) return undefined;
  const raw = fs.readFileSync(full, 'utf8');
  const parsed = matter(raw);
  return {
    frontmatter: parsed.data,
    body: parsed.content,
  };
}

/**
 * Reads a JSON file from src/content/. Returns undefined if missing.
 */
export function readJson<T = unknown>(relativePath: string): T | undefined {
  const full = path.join(CONTENT_DIR, relativePath);
  if (!fs.existsSync(full)) return undefined;
  const raw = fs.readFileSync(full, 'utf8');
  return JSON.parse(raw) as T;
}

/**
 * Loads the content file referenced by a section or subtopic.
 * Auto-detects MD vs JSON from extension.
 */
export function loadReferencedContent(
  ref: string | undefined
): { kind: 'markdown'; data: MarkdownContent } | { kind: 'json'; data: unknown } | undefined {
  if (!ref) return undefined;
  if (ref.endsWith('.md')) {
    const md = readMarkdown(ref);
    return md ? { kind: 'markdown', data: md } : undefined;
  }
  if (ref.endsWith('.json')) {
    const json = readJson(ref);
    return json !== undefined ? { kind: 'json', data: json } : undefined;
  }
  return undefined;
}
