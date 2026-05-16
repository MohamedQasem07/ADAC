'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { SubtopicMeta } from '@/types/content';

interface SubTopicGridProps {
  sectionId: string;
  subtopics: SubtopicMeta[];
}

const subtopicCard = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.premium },
  },
};

/**
 * Drill-down card grid shown below a section's top-level content. Each
 * card links to /section/X/Y. Press `↓` from the section top to jump
 * straight to the first subtopic; click to jump to a specific one.
 */
export function SubTopicGrid({ sectionId, subtopics }: SubTopicGridProps) {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  if (subtopics.length === 0) return null;

  return (
    <div ref={ref} className="mx-auto mt-24 w-full max-w-6xl px-8">
      <p className="mb-6 text-center font-sans text-[11px] uppercase tracking-[0.4em] text-ink-soft/60">
        Explore details
      </p>
      <motion.ul
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {subtopics.map((sub) => (
          <motion.li key={sub.id} variants={subtopicCard}>
            <Link
              href={`/section/${sectionId}/${sub.id}`}
              className="group relative flex h-full items-start justify-between gap-4 overflow-hidden rounded-sm border border-white/10 bg-navy/40 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
                  {sub.id}
                </p>
                <p className="mt-1.5 font-display text-base leading-snug text-white">
                  {sub.title}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="mt-1 shrink-0 text-ink-soft/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
              />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
