import { loadReferencedContent, getSectionMeta } from '@/lib/content-loader';
import { MarkdownSection } from '@/components/sections/MarkdownSection';
import { PlaceholderSection } from '@/components/sections/PlaceholderSection';

/**
 * Home (Section 1 cover). Cinematic HeroSection treatment comes in
 * Phase 4 — for now this routes through the same content pipeline as
 * every other section so a single edit to section-01-welcome.md updates
 * the cover live in development.
 */
export default function HomePage() {
  const section = getSectionMeta('1');
  if (!section) return null;

  const content = loadReferencedContent(section.content);
  if (content?.kind === 'markdown') {
    return <MarkdownSection content={content.data} sectionId="1" />;
  }
  return <PlaceholderSection section={section} />;
}
