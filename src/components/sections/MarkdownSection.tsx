import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { MarkdownContent } from '@/types/content';
import { StructuredSubtopic } from './layouts/StructuredSubtopic';

interface MarkdownSectionProps {
  content: MarkdownContent;
  sectionId: string;
  subId?: string;
}

/**
 * Generic markdown renderer used as a fallback for any section/subtopic
 * whose content is `.md`. Layout-specific renderers (charts, maps, cards,
 * sample-report, etc.) handle their own visuals; this is the catch-all.
 *
 * Animation choreography is intentionally added in Phase 4 once the
 * motion primitives are in place. For now this renders cleanly so that
 * all ~88 routes resolve without errors.
 */
export function MarkdownSection({ content, sectionId, subId }: MarkdownSectionProps) {
  const { frontmatter, body } = content;

  // Structured-layout dispatch: opt-in via `layout: "structured"` in
  // frontmatter. Parses `## Context / ## Key points / ## What this means
  // for ADAC` into intro + insight cards + ADAC callout. Older subtopic
  // pages without `layout: "structured"` fall through to the original
  // editorial renderer below — no breaking change.
  if (frontmatter.layout === 'structured') {
    return <StructuredSubtopic content={content} sectionId={sectionId} subId={subId} />;
  }

  const title = (frontmatter.title as string) ?? `Section ${subId ?? sectionId}`;
  const eyebrow = frontmatter.eyebrow as string | undefined;
  const subtitle = frontmatter.subtitle as string | undefined;

  return (
    <article className="mx-auto max-w-3xl px-8 py-24">
      {eyebrow && (
        <p
          className="font-sans text-xs uppercase tracking-[0.4em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          {eyebrow}
        </p>
      )}
      <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-white md:text-6xl">
        {title}
      </h1>
      {subtitle && <p className="mt-4 text-lg text-ice/85">{subtitle}</p>}
      <div className="gold-rule mt-8 w-24" />
      <div className="prose-invert mt-10 max-w-none text-base leading-relaxed text-ice/85">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </article>
  );
}
