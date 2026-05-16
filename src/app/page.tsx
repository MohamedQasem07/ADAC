import { loadReferencedContent, getSectionMeta } from '@/lib/content-loader';
import { HeroSection } from '@/components/sections/HeroSection';

/**
 * Home (Section 1 cover). Renders the cinematic HeroSection driven by
 * frontmatter from `section-01-welcome.md`. Editing the markdown file
 * updates the cover live in dev.
 */
export default function HomePage() {
  const section = getSectionMeta('1');
  const content = loadReferencedContent(section?.content);

  if (content?.kind !== 'markdown') {
    return null;
  }
  const fm = content.data.frontmatter;
  return (
    <HeroSection
      variant="cover"
      eyebrow={fm.eyebrow ?? 'Partnership Proposal'}
      title={fm.title ?? 'HMC × ADAC'}
      subtitle={fm.subtitle}
      body={content.data.body}
    />
  );
}
