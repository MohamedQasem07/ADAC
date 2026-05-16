'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PartnershipLockup } from '@/components/layout/PartnershipLockup';
import { ease } from '@/lib/motion';
import type { MarkdownContent } from '@/types/content';

interface WelcomeCoverProps {
  content: MarkdownContent;
}

/**
 * Welcome / Cover page (آ§1) â€” Partnership Opening.
 *
 * Hero element is the HMC أ— ADAC partnership lockup. Sequence is tuned
 * to be obviously visible at projector distance:
 *
 *   t+0.00   Background visible
 *   t+0.10   Eyebrow "Partnership Opening" fades in
 *   t+0.25   HMC slides from x:-100, ADAC slides from x:+100
 *            (both with scale 0.92â†’1, duration 0.9 s)
 *   t+1.10   Vertical gold rule draws (scaleY 0â†’1, 0.7 s)
 *   t+1.35   أ— mark fades + bounces in
 *   t+1.65   Title "HMC أ— ADAC" word-stagger (Playfair)
 *   t+2.20   Subtitle fades up
 *   t+2.45   Tagline fades up
 *   t+2.70   5 badges stagger in (60 ms apart)
 *   t+3.10   Start Presentation CTA fades up
 *   t+3.40   Footer attribution fades up
 *
 * Behind the lockup: a soft horizontal gold beam that suggests
 * partnership without competing with the logos.
 */
export function WelcomeCover({ content }: WelcomeCoverProps) {
  const fm = content.frontmatter;
  const eyebrow = (fm.eyebrow as string) ?? 'Partnership Opening';
  const title = (fm.title as string) ?? 'HMC أ— ADAC';
  const subtitle = (fm.subtitle as string) ?? '';
  const tagline = (fm.tagline as string) ?? '';
  const badges = Array.isArray(fm.badges) ? (fm.badges as string[]) : [];
  const footerLines = Array.isArray(fm.footerLines) ? (fm.footerLines as string[]) : [];

  // CTA visible only once the title has landed, so the audience reads
  // the lockup â†’ title sequence before the button calls them to act.
  const [showCTA, setShowCTA] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowCTA(true), 3250);
    return () => window.clearTimeout(t);
  }, []);

  const words = title.split(' ');

  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 py-16 text-center sm:px-6 md:py-20">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: ease.premium }}
          className="font-sans text-[11px] uppercase tracking-[0.55em] text-theme sm:text-xs"
        >
          {eyebrow}
        </motion.p>

        {/* Partnership lockup â€” the main opening event. Two theme-aware
            radial glows sit behind it (left = HMC side, right = ADAC
            side). Under premium-navy both glows are gold/identical;
            under the partnership theme the left becomes HMC blue and
            the right becomes ADAC yellow. */}
        <div className="relative mt-10 w-full md:mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-[160%] w-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(50% 60% at 30% 50%, var(--theme-glow-hmc) 0%, transparent 70%)',
              filter: 'blur(4px)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 h-[160%] w-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(50% 60% at 70% 50%, var(--theme-glow-adac) 0%, transparent 70%)',
              filter: 'blur(4px)',
            }}
          />
          <PartnershipLockup />
        </div>

        {/* Title â€” comes in AFTER the logos meet and the connector draws */}
        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          className="mt-8 font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:mt-10 md:text-7xl lg:text-[5.25rem]"
        >
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              variants={titleWord}
              className="mr-[0.25em] inline-block"
              style={{ willChange: 'transform, opacity' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.7, ease: ease.premium }}
            className="mx-auto mt-6 max-w-3xl font-display text-xl leading-snug text-white/95 sm:text-2xl md:text-[1.75rem] lg:text-[2rem]"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Tagline */}
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.85, duration: 0.7, ease: ease.premium }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ice/90 md:text-lg lg:text-xl"
          >
            {tagline}
          </motion.p>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <motion.ul
            variants={badgeContainer}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
          >
            {badges.map((b, i) => (
              <motion.li key={`${b}-${i}`} variants={badgeItem}>
                <span
                  className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs uppercase tracking-[0.22em]"
                  style={{
                    background: 'var(--theme-badge-bg)',
                    border: '1px solid var(--theme-badge-border)',
                    color: 'var(--theme-badge-text)',
                  }}
                >
                  {b}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Start Presentation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: showCTA ? 1 : 0, y: showCTA ? 0 : 14 }}
          transition={{ duration: 0.6, ease: ease.premium }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/section/overview"
            className="group inline-flex min-h-12 items-center gap-3 rounded-full px-8 py-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-deep"
            style={{
              background: 'var(--theme-cta-bg)',
              color: 'var(--theme-cta-text)',
              border: '1px solid var(--theme-cta-bg)',
              boxShadow: '0 18px 55px var(--theme-cta-glow)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--theme-cta-bg-hover)';
              e.currentTarget.style.boxShadow = '0 24px 70px var(--theme-cta-glow-strong)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--theme-cta-bg)';
              e.currentTarget.style.boxShadow = '0 18px 55px var(--theme-cta-glow)';
            }}
          >
            Start Presentation
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Footer attribution */}
        {footerLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.55, duration: 0.7, ease: ease.premium }}
            className="mt-12 space-y-1 text-center md:mt-14"
          >
            {footerLines.map((line, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-xs uppercase tracking-[0.4em] text-ice/85'
                    : 'text-xs uppercase tracking-[0.35em] text-ice/70'
                }
              >
                {line}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

const titleContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 2.2, staggerChildren: 0.08 } },
};
const titleWord: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.premium } },
};
const badgeContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 3.0, staggerChildren: 0.06 } },
};
const badgeItem: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: ease.premium } },
};

