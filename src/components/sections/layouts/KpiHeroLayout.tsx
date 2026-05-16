import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { KpiStrip, type KpiItem } from '@/components/sections/KpiStrip';
import { SubTopicGrid } from '@/components/sections/SubTopicGrid';
import type { MarkdownContent, SubtopicMeta } from '@/types/content';

interface KpiHeroLayoutProps {
  sectionId: string;
  content: MarkdownContent;
  subtopics: SubtopicMeta[];
}

/**
 * Section top-level with a KPI strip pulled from frontmatter.stats.
 * Used for §2 "About HMC" (10 locations · 24/7 · 5+ years · 4 languages).
 */
export function KpiHeroLayout({ sectionId, content, subtopics }: KpiHeroLayoutProps) {
  const { frontmatter, body } = content;
  const stats = Array.isArray(frontmatter.stats)
    ? (frontmatter.stats as Array<{ value: string | number; label: string }>).map(
        (s): KpiItem => ({ value: String(s.value), label: s.label })
      )
    : [];

  return (
    <section className="min-h-screen px-4 py-24">
      <header className="mx-auto max-w-3xl px-4 text-center">
        {frontmatter.eyebrow && (
          <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-gold">
            {frontmatter.eyebrow as string}
          </p>
        )}
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
          {frontmatter.title as string}
        </h1>
        {frontmatter.subtitle && (
          <p className="mt-4 text-base text-ink-soft md:text-lg">
            {frontmatter.subtitle as string}
          </p>
        )}
        <div className="gold-rule mx-auto mt-8 w-24" />
      </header>

      {stats.length > 0 && (
        <div className="mt-16">
          <KpiStrip items={stats} />
        </div>
      )}

      {body.trim() && (
        <div className="mx-auto mt-16 max-w-3xl px-4 text-center text-base leading-relaxed text-ink-soft">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      )}

      <SubTopicGrid sectionId={sectionId} subtopics={subtopics} />
    </section>
  );
}
