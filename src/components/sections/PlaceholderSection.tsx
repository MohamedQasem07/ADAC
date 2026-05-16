import type { SectionMeta, SubtopicMeta } from '@/types/content';

interface PlaceholderSectionProps {
  section: SectionMeta;
  subtopic?: SubtopicMeta;
  reason?: 'missing-content' | 'renderer-not-built';
}

/**
 * Renders when a section/subtopic exists in sections.json but its content
 * file doesn't exist yet, or when the requested renderer (chart, map,
 * sample-report) is not yet wired. This keeps the build green and all
 * routes resolvable during Phase 2 stub generation.
 */
export function PlaceholderSection({
  section,
  subtopic,
  reason = 'missing-content',
}: PlaceholderSectionProps) {
  const id = subtopic?.id ?? section.id;
  const title = subtopic?.title ?? section.title;
  const renderer = subtopic?.renderer ?? (section.type === 'dashboard' ? 'dashboard' : 'markdown');

  return (
    <article className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-8 py-24">
      <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold/70">Section {id}</p>
      <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-white md:text-6xl">
        {title}
      </h1>
      <div className="gold-rule mt-8 w-24" />
      <p className="mt-10 text-base text-ink-soft">
        {reason === 'missing-content'
          ? 'Content file not yet authored. Awaiting copy in src/content/.'
          : `Renderer "${renderer}" is wired in a later build phase.`}
      </p>
      <p className="mt-2 text-xs uppercase tracking-widest text-ink-soft/60">
        Placeholder · phase 2 stub
      </p>
    </article>
  );
}
