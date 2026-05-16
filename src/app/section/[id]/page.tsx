import { notFound } from 'next/navigation';
import {
  getAllSections,
  getSectionMeta,
  loadReferencedContent,
} from '@/lib/content-loader';
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

  if (content?.kind === 'markdown') {
    return <MarkdownSection content={content.data} sectionId={section.id} />;
  }

  return <PlaceholderSection section={section} />;
}
