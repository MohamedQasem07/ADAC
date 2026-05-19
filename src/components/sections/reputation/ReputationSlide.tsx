'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import type { MarkdownContent } from '@/types/content';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { StructuredSubtopic } from '@/components/sections/layouts/StructuredSubtopic';

/**
 * §2.5 — Our Reputation.
 *
 * Composes the existing structured-subtopic markdown rendering with a
 * trailing premium "Live evidence" CTA card that points to HMC's public
 * Google reviews page. We deliberately do not embed review screenshots
 * or excerpts that we cannot verify in this build pipeline — the
 * promise this slide makes is that any figure or quote shared with
 * ADAC is independently verifiable. The CTA is that promise rendered.
 *
 * The Google search URL is the same long URL the user provided; ADAC
 * can click through right now and see the live, unedited reviews.
 */

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=Hurghada+Medical+Center+Reviews';

interface ReputationSlideProps {
  content: MarkdownContent;
  sectionId: string;
  subId?: string;
}

export function ReputationSlide({ content, sectionId, subId }: ReputationSlideProps) {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <>
      {/* Existing structured markdown rendering — context, key points,
          ADAC callout. Unchanged. */}
      <StructuredSubtopic content={content} sectionId={sectionId} subId={subId} />

      {/* Live evidence trailer */}
      <section ref={ref} className="mx-auto w-full max-w-5xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.7, ease: ease.premium }}
          className="mt-4"
        >
          {/* Divider with label */}
          <div className="mb-8 flex items-center gap-4">
            <span
              aria-hidden
              className="block h-px flex-1"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--theme-accent) 50%, transparent)',
              }}
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.4em]"
              style={{ color: 'var(--theme-accent)' }}
            >
              Reputation evidence
            </span>
            <span
              aria-hidden
              className="block h-px flex-1"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--theme-accent) 50%, transparent)',
              }}
            />
          </div>

          {/* Hero evidence card */}
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-sm border border-theme/30 bg-navy-deep/55 px-7 py-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-theme/60 hover:shadow-card-hover md:px-10 md:py-10"
          >
            {/* corner chrome */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-theme/50 opacity-80"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-theme/50 opacity-80"
            />

            <div className="flex flex-col gap-7 md:flex-row md:items-center md:gap-10">
              {/* Left — Google block */}
              <div className="flex flex-col items-start gap-3 md:w-60 md:shrink-0">
                <span
                  className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ice/85"
                >
                  Google
                </span>
                <div
                  aria-hidden
                  className="flex items-center gap-1"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ice/55">
                  Public reviews · live source
                </p>
              </div>

              {/* Right — copy + CTA */}
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold leading-tight text-white md:text-3xl">
                  Hurghada Medical Center
                  <br />
                  <span
                    className="italic"
                    style={{ color: 'var(--theme-accent)' }}
                  >
                    on public Google reviews.
                  </span>
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ice/85 md:text-base">
                  Real, unedited patient comments visible to anyone with the
                  link. We deliberately do not curate or quote selectively — the
                  evidence is what the public sees in real time.
                </p>

                <span
                  className="mt-6 inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] transition-all"
                  style={{
                    background: 'var(--theme-accent)',
                    color: 'var(--theme-cta-text, #0a1929)',
                    borderColor: 'transparent',
                    boxShadow: '0 0 24px var(--theme-cta-glow)',
                  }}
                >
                  View live Google reviews
                  <ExternalLink size={13} />
                </span>
              </div>
            </div>
          </a>

          <p className="mt-6 text-center text-xs italic text-ink-soft/70">
            Source: Public Google reviews for Hurghada Medical Center · selected
            for presentation support · independently verifiable in real time.
          </p>
        </motion.div>
      </section>
    </>
  );
}
