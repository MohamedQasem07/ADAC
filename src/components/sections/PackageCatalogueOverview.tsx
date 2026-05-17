'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { MarkdownContent, Package, PackageCategory } from '@/types/content';
import { CategoryGrid } from '@/components/packages/CategoryGrid';
import { UniversalInclusionsStrip } from '@/components/packages/UniversalInclusionsStrip';
import { CandidatePilotPackages } from '@/components/packages/CandidatePilotPackages';

interface PackageCatalogueOverviewProps {
  sectionId: string;
  content: MarkdownContent;
  categories: PackageCategory[];
  packages: Package[];
}

/**
 * آ§12 top-level: editorial header + 3أ—3 category grid.
 * The hidden Cmd/Ctrl+1/2/3 toggle affects the per-category price range
 * shown on each card â€” it crossfades automatically.
 */
export function PackageCatalogueOverview({
  sectionId,
  content,
  categories,
  packages,
}: PackageCatalogueOverviewProps) {
  const { ref, inView } = useScrollReveal();
  const fm = content.frontmatter;

  return (
    <section className="min-h-screen py-24">
      <motion.header
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: ease.premium }}
        className="mx-auto mb-16 max-w-3xl px-8 text-center"
      >
        {fm.eyebrow && (
          <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-theme">
            {fm.eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          {fm.title}
        </h1>
        {fm.subtitle && (
          <p className="mt-4 text-base text-ink-soft md:text-lg">{fm.subtitle}</p>
        )}
        <div className="gold-rule mx-auto mt-8 w-24" />
        {content.body.trim() && (
          <div className="mt-8 text-sm leading-relaxed text-ink-soft md:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.body}</ReactMarkdown>
          </div>
        )}
      </motion.header>

      {/* Phase 2.4N — Universal Inclusions / Exclusions strip above the grid */}
      <div className="mb-16">
        <UniversalInclusionsStrip />
      </div>

      <CategoryGrid sectionId={sectionId} categories={categories} packages={packages} />

      {/* Phase 2.4N — Candidate Packages for Pilot Scope Alignment below the grid */}
      <CandidatePilotPackages />
    </section>
  );
}

