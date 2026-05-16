import { notFound } from 'next/navigation';
import {
  getAllSections,
  getSectionMeta,
  loadReferencedContent,
} from '@/lib/content-loader';
import { HeroSection } from '@/components/sections/HeroSection';
import { MarkdownSection } from '@/components/sections/MarkdownSection';
import { PlaceholderSection } from '@/components/sections/PlaceholderSection';

export function generateStaticParams() {
  return getAllSections().map((s) => ({ id: s.id }));
}

export const dynamicParams = false;

export default function SectionPage({ params }: { params: { id: string } }) {
  const section = getSectionMeta(params.id);
  if (!section) notFound();

  const content = loadReferencedContent(section.content);

  // Hero treatment for cover and closing.
  if (section.type === 'hero' && content?.kind === 'markdown') {
    const fm = content.data.frontmatter;
    return (
      <HeroSection
        variant={section.id === '18' ? 'closing' : 'cover'}
        eyebrow={fm.eyebrow}
        title={fm.title ?? section.title}
        subtitle={fm.subtitle}
        body={content.data.body}
      />
    );
  }

  if (content?.kind === 'markdown') {
    return <MarkdownSection content={content.data} sectionId={section.id} />;
  }

  return <PlaceholderSection section={section} />;
}
