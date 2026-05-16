import { notFound } from 'next/navigation';
import {
  getAllSections,
  getSectionMeta,
  getSubtopicMeta,
  loadReferencedContent,
} from '@/lib/content-loader';
import { CHART_REGISTRY } from '@/components/charts';
import { MarkdownSection } from '@/components/sections/MarkdownSection';
import { PlaceholderSection } from '@/components/sections/PlaceholderSection';

export function generateStaticParams() {
  const params: Array<{ id: string; sub: string }> = [];
  for (const s of getAllSections()) {
    for (const sub of s.subtopics ?? []) {
      params.push({ id: s.id, sub: sub.id });
    }
  }
  return params;
}

export const dynamicParams = false;

export default function SubtopicPage({
  params,
}: {
  params: { id: string; sub: string };
}) {
  const section = getSectionMeta(params.id);
  if (!section) notFound();

  const subtopic = getSubtopicMeta(params.id, params.sub);
  if (!subtopic) notFound();

  // Chart renderers (§3 family) — wired in Phase 5.
  if (subtopic.renderer && subtopic.renderer.startsWith('chart-')) {
    const ChartComponent = CHART_REGISTRY[subtopic.renderer];
    if (ChartComponent) return <ChartComponent />;
    return (
      <PlaceholderSection
        section={section}
        subtopic={subtopic}
        reason="renderer-not-built"
      />
    );
  }

  // Other non-markdown renderers (map, cards, sample-report, package-category)
  // are wired in later phases — fall back to placeholder for now.
  if (subtopic.renderer && subtopic.renderer !== 'markdown') {
    return (
      <PlaceholderSection
        section={section}
        subtopic={subtopic}
        reason="renderer-not-built"
      />
    );
  }

  const content = loadReferencedContent(subtopic.content);
  if (content?.kind === 'markdown') {
    return <MarkdownSection content={content.data} sectionId={section.id} subId={subtopic.id} />;
  }

  return <PlaceholderSection section={section} subtopic={subtopic} />;
}
