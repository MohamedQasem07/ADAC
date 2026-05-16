import { notFound } from 'next/navigation';
import {
  getAllSections,
  getSectionMeta,
  getSubtopicMeta,
  loadReferencedContent,
  readJson,
} from '@/lib/content-loader';
import { CHART_REGISTRY } from '@/components/charts';
import { NetworkMap, type NetworkMapData } from '@/components/map/NetworkMap';
import { CategoryDetail } from '@/components/packages/CategoryDetail';
import { MarkdownSection } from '@/components/sections/MarkdownSection';
import { PlaceholderSection } from '@/components/sections/PlaceholderSection';
import type { Package, PackageCategory } from '@/types/content';

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

  // §12.1–12.9 — package category detail screens.
  if (subtopic.renderer === 'package-category') {
    const data = readJson<{ categories: PackageCategory[]; packages: Package[] }>(
      'packages.json'
    );
    // subtopic.data is shaped like "packages.json#category=N"
    const m = subtopic.data?.match(/category=(\d+)/);
    const catId = m ? Number(m[1]) : null;
    const category = data?.categories.find((c) => c.id === catId);
    const catPackages = data?.packages.filter((p) => p.category === catId) ?? [];
    if (category) {
      return <CategoryDetail category={category} packages={catPackages} />;
    }
    return (
      <PlaceholderSection
        section={section}
        subtopic={subtopic}
        reason="missing-content"
      />
    );
  }

  // Map renderer (§2.2) — wired in Phase 6.
  if (subtopic.renderer === 'map') {
    const content = loadReferencedContent(subtopic.content);
    if (content?.kind === 'json') {
      return (
        <NetworkMap
          data={content.data as NetworkMapData}
          title="HMC Clinical Network"
          populationLabel="10 locations across the Red Sea region"
          annotation="24/7 operations · Hotel coverage by mode A/B/C"
        />
      );
    }
    return (
      <PlaceholderSection
        section={section}
        subtopic={subtopic}
        reason="missing-content"
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
