'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { MarkdownContent } from '@/types/content';
import type { SubtopicSummary } from '@/lib/content-loader';

interface FlowLayoutProps {
  content: MarkdownContent;
  summaries: SubtopicSummary[];
}

/**
 * Section top-level rendered as a numbered horizontal stepper. Wraps
 * onto a second row at >5 steps. Used for آ§7 Patient Journey (7 steps)
 * and آ§8 Medical Triage (4 steps).
 */
export function FlowLayout({ content, summaries }: FlowLayoutProps) {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
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

      <motion.ol
        ref={ref}
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-1 gap-4 px-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {summaries.map((sub, i) => (
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
              className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-theme/50 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-theme/40 bg-theme/10 font-display text-lg font-semibold text-theme">
                  {i + 1}
                </span>
                <p className="font-display text-base leading-snug text-white">
                  {sub.title}
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft/85">
                {sub.summary}
              </p>
            </Link>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

