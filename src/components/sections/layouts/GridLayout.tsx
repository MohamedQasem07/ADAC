'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight } from 'lucide-react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { MarkdownContent } from '@/types/content';
import type { SubtopicSummary } from '@/lib/content-loader';

interface GridLayoutProps {
  content: MarkdownContent;
  summaries: SubtopicSummary[];
  /** 3 / 4 / 6 columns at large breakpoint. */
  columns: 3 | 4 | 6;
}

const colsClass: Record<3 | 4 | 6, string> = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  6: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
};

/**
 * Section top-level rendered as a grid of subtopic cards. Each card
 * shows id آ· title آ· one-line summary and links into the subtopic page.
 * Used for آ§4, آ§6, آ§13, آ§15, آ§16, آ§17 â€” and any section with
 * frontmatter `layout: grid-3 | grid-4 | grid-6`.
 */
export function GridLayout({ content, summaries, columns }: GridLayoutProps) {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });
  const { frontmatter, body } = content;

  return (
    <section className="min-h-screen px-4 py-24">
      <header className="mx-auto max-w-3xl px-4 text-center">
        {frontmatter.eyebrow && (
          <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-theme">
            {frontmatter.eyebrow as string}
          </p>
        )}
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          {frontmatter.title as string}
        </h1>
        {frontmatter.subtitle && (
          <p className="mt-4 text-base text-ink-soft md:text-lg">
            {frontmatter.subtitle as string}
          </p>
        )}
        <div className="gold-rule mx-auto mt-8 w-24" />
        {body.trim() && (
          <div className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </div>
        )}
      </header>

      <motion.ul
        ref={ref}
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className={`mx-auto mt-16 grid w-full max-w-6xl grid-cols-1 gap-5 px-8 ${colsClass[columns]}`}
      >
        {summaries.map((sub) => (
          <motion.li
            key={sub.id}
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease: ease.premium },
              },
            }}
          >
            <Link
              href={sub.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-theme/50 hover:shadow-card-hover"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-theme/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-theme/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-theme/80">
                  {sub.eyebrow ?? sub.id}
                </p>
                <ArrowUpRight
                  size={14}
                  className="text-ink-soft/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-theme"
                />
              </div>
              <h3 className="mt-3 font-display text-lg leading-snug text-white">
                {sub.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft/85">
                {sub.summary}
              </p>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

