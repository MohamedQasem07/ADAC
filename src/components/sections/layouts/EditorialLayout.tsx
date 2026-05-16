import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { MarkdownContent } from '@/types/content';

/**
 * Centered editorial prose. The default treatment for sections that
 * don't specify a richer layout in their frontmatter.
 */
export function EditorialLayout({ content }: { content: MarkdownContent }) {
  const { frontmatter, body } = content;
  const title = (frontmatter.title as string) ?? '';
  const eyebrow = frontmatter.eyebrow as string | undefined;
  const subtitle = frontmatter.subtitle as string | undefined;

  return (
    <article className="mx-auto max-w-3xl px-8 py-24">
      {eyebrow && (
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
      )}
      <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-white md:text-6xl">
        {title}
      </h1>
      {subtitle && <p className="mt-4 text-lg text-ink-soft">{subtitle}</p>}
      <div className="gold-rule mt-8 w-24" />
      <div className="prose-invert mt-10 max-w-none text-base leading-relaxed text-ink-soft">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </article>
  );
}
