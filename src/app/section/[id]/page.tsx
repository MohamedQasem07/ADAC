import { notFound } from 'next/navigation';
import {
  getAllSections,
  getSectionMeta,
  getSubtopicSummaries,
  loadReferencedContent,
  readJson,
} from '@/lib/content-loader';
import { DashboardOverview } from '@/components/sections/DashboardOverview';
import { DataRoomPage } from '@/components/sections/DataRoomPage';
import { HeroSection } from '@/components/sections/HeroSection';
import { LayoutAwareSection } from '@/components/sections/LayoutAwareSection';
import { OverviewSection } from '@/components/sections/OverviewSection';
import { PackageCatalogueOverview } from '@/components/sections/PackageCatalogueOverview';
import { PlaceholderSection } from '@/components/sections/PlaceholderSection';
import type { ADACDataset, Package, PackageCategory } from '@/types/content';

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
        proposedOutcome={
          typeof fm.proposedOutcome === 'string' ? fm.proposedOutcome : undefined
        }
      />
    );
  }

  // Dashboard treatment for §3 (and any future section.type === 'dashboard').
  if (section.type === 'dashboard' && content?.kind === 'markdown') {
    const adac = readJson<ADACDataset & { section3HeroStats?: Array<{ value: string; label: string }> }>(
      'adac-data.json'
    );
    const kpi = (adac && 'section3HeroStats' in adac && adac.section3HeroStats) || [];
    return (
      <DashboardOverview
        sectionId={section.id}
        content={content.data}
        kpi={kpi}
        subtopics={section.subtopics ?? []}
      />
    );
  }

  // Executive Data Room — id "data-room", consolidated dashboard.
  if (section.type === 'data-room' && content?.kind === 'markdown') {
    return <DataRoomPage content={content.data} />;
  }

  // Card-grid sections backed by a JSON file with `items`:
  //   - "overview"  → Presentation Overview (agenda)
  //   - "decisions" → Decision Points for Today
  if (
    (section.id === 'overview' || section.id === 'decisions') &&
    content?.kind === 'json'
  ) {
    const data = content.data as {
      title: string;
      eyebrow?: string;
      subtitle?: string;
      items: Array<{ id: string; icon?: string; title: string; summary: string; href: string }>;
    };
    return <OverviewSection data={data} keyPrefix={section.id} />;
  }

  // §12 package catalogue top-level: 3×3 category grid.
  if (section.id === '12' && content?.kind === 'markdown') {
    const data = readJson<{ categories: PackageCategory[]; packages: Package[] }>(
      'packages.json'
    );
    if (data) {
      return (
        <PackageCatalogueOverview
          sectionId={section.id}
          content={content.data}
          categories={data.categories}
          packages={data.packages}
        />
      );
    }
  }

  // Generic layout-aware dispatch for every other section top-level.
  if (content?.kind === 'markdown') {
    const summaries = getSubtopicSummaries(section.id);
    return (
      <LayoutAwareSection
        sectionId={section.id}
        content={content.data}
        summaries={summaries}
        subtopics={section.subtopics ?? []}
      />
    );
  }

  return <PlaceholderSection section={section} />;
}
