import type { MarkdownContent, SubtopicMeta } from '@/types/content';
import type { SubtopicSummary } from '@/lib/content-loader';
import { EditorialLayout } from './layouts/EditorialLayout';
import { FlowLayout } from './layouts/FlowLayout';
import { GridLayout } from './layouts/GridLayout';
import { KpiHeroLayout } from './layouts/KpiHeroLayout';
import { TimelineLayout } from './layouts/TimelineLayout';
import { UniversalInclusionsStrip } from '@/components/packages/UniversalInclusionsStrip';
import { PackageOperatingKit } from '@/components/packages/PackageOperatingKit';

interface LayoutAwareSectionProps {
  sectionId: string;
  content: MarkdownContent;
  /** Compact summaries used by grid/flow/timeline layouts. */
  summaries: SubtopicSummary[];
  /** Raw subtopic meta used by KpiHeroLayout's SubTopicGrid. */
  subtopics: SubtopicMeta[];
}

/**
 * Section-top dispatcher. Routes to the right layout component based on
 * the markdown frontmatter `layout` field.
 *
 *   hero-stat  → KpiHeroLayout    (§2)
 *   grid-3     → GridLayout cols=3 (§6, §13, §17)
 *   grid-4     → GridLayout cols=4 (§4, §9, §16)
 *   grid-6     → GridLayout cols=6 (§15)
 *   flow       → FlowLayout       (§7, §8, §11)
 *   timeline   → TimelineLayout   (§14)
 *   editorial / undefined → EditorialLayout (§5, §10)
 *
 * Hero (§1/§18) and dashboard (§3) are handled before this dispatcher
 * in the route page; package catalogue (§12) has its own component.
 */
export function LayoutAwareSection({
  sectionId,
  content,
  summaries,
  subtopics,
}: LayoutAwareSectionProps) {
  const layout = content.frontmatter.layout as string | undefined;

  // Phase 2.4N — §13 Pricing Philosophy cover gets two extra blocks
  // (Universal Inclusions/Exclusions strip above the editorial body,
  // Package Operating Kit concept below it) so the audience can answer
  // the "what's in / what's quoted on top / how does it become an
  // ADAC file" questions without leaving the §13 cover.
  if (sectionId === '13') {
    return (
      <>
        <div className="pt-24">
          <UniversalInclusionsStrip />
        </div>
        <EditorialLayout content={content} />
        <PackageOperatingKit />
      </>
    );
  }

  switch (layout) {
    case 'hero-stat':
      return <KpiHeroLayout sectionId={sectionId} content={content} subtopics={subtopics} />;
    case 'grid-3':
      return <GridLayout content={content} summaries={summaries} columns={3} />;
    case 'grid-4':
      return <GridLayout content={content} summaries={summaries} columns={4} />;
    case 'grid-6':
      return <GridLayout content={content} summaries={summaries} columns={6} />;
    case 'flow':
      return <FlowLayout content={content} summaries={summaries} />;
    case 'timeline':
      return <TimelineLayout content={content} summaries={summaries} />;
    case 'editorial':
    default:
      return <EditorialLayout content={content} />;
  }
}
