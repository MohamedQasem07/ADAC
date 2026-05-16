'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { MarkdownContent, SubtopicMeta } from '@/types/content';
import { KpiStrip } from './KpiStrip';
import { SubTopicGrid } from './SubTopicGrid';

interface DashboardOverviewProps {
  sectionId: string;
  content: MarkdownContent;
  kpi: Array<{ value: string; label: string }>;
  subtopics: SubtopicMeta[];
}

/**
 * Top-level layout for a "dashboard" section type (e.g. §3 Partnership
 * Track Record). Renders KPI strip → markdown heading/body → subtopic
 * drill-down grid. Press `↓` to navigate to the first chart.
 */
export function DashboardOverview({
  sectionId,
  content,
  kpi,
  subtopics,
}: DashboardOverviewProps) {
  const { ref: headRef, inView: headIn } = useScrollReveal();
  const fm = content.frontmatter;

  return (
    <section className="min-h-screen px-4 py-24">
      <motion.header
        ref={headRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: ease.premium }}
        className="mx-auto max-w-3xl px-4 text-center"
      >
        {fm.eyebrow && (
          <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-gold">
            {fm.eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
          {fm.title}
        </h1>
        {fm.subtitle && (
          <p className="mt-4 text-base text-ink-soft md:text-lg">{fm.subtitle}</p>
        )}
        <div className="gold-rule mx-auto mt-8 w-24" />
      </motion.header>

      <div className="mt-16">
        <KpiStrip items={kpi} />
      </div>

      {content.body.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.3, duration: 0.7, ease: ease.premium }}
          className="mx-auto mt-16 max-w-3xl px-4 text-center text-base leading-relaxed text-ink-soft"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.body}</ReactMarkdown>
        </motion.div>
      )}

      <SubTopicGrid sectionId={sectionId} subtopics={subtopics} />
    </section>
  );
}
