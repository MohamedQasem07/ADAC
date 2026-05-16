import { loadReferencedContent, getSectionMeta } from '@/lib/content-loader';
import { WelcomeCover } from '@/components/sections/WelcomeCover';

/**
 * Home (Section 1 cover). Renders the premium WelcomeCover with the
 * HMC × ADAC partnership lockup. Content is driven by frontmatter from
 * `section-01-welcome.md`.
 */
export default function HomePage() {
  const section = getSectionMeta('1');
  const content = loadReferencedContent(section?.content);

  if (content?.kind !== 'markdown') {
    return null;
  }
  return <WelcomeCover content={content.data} />;
}
