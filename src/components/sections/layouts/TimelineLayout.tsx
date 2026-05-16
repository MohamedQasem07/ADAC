'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { MarkdownContent } from '@/types/content';
import type { SubtopicSummary } from '@/lib/content-loader';

interface TimelineLayoutProps {
  content: MarkdownContent;
  summaries: SubtopicSummary[];
}

/**
 * Horizontal phase timeline â€” used for آ§14 Roadmap (May / June / Jul-Sep / October 2026).
 * Each phase is a numbered card on a horizontal track with a dashed gold connector.
 */
export function TimelineLayout({ content, summaries }: TimelineLayoutProps) {
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

      <div ref={ref} className="relative mx-auto mt-20 w-full max-w-6xl px-8">
        {/* Dashed gold connector (desktop only) */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: ease.premium }}
          style={{ transformOrigin: 'left center' }}
          className="pointer-events-none absolute left-[12%] right-[12%] top-[2.5rem] hidden h-px bg-[repeating-linear-gradient(90deg,rgba(201,169,97,0.6)_0,rgba(201,169,97,0.6)_8px,transparent_8px,transparent_14px)] lg:block"
        />

        <motion.ol
          variants={staggerTight}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {summaries.map((sub, i) => (
            <motion.li
              key={sub.id}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: ease.premium },
                },
              }}
            >
              <Link
                href={sub.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-theme/50 hover:shadow-card-hover"
              >
                {/* Phase dot on the connector */}
                <span
                  aria-hidden
                  className="mx-auto -mt-12 mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border border-theme/40 bg-navy-deep font-display text-2xl font-semibold text-theme"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-center font-display text-base font-semibold text-white">
                  {sub.title}
                </p>
                <p className="mt-3 text-center text-sm leading-relaxed text-ink-soft/85">
                  {sub.summary}
                </p>
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

