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
 * Welcome / Cover page (§1) — Partnership Opening.
 *
 * Replaces the previous HeroSection-with-single-logo cover with a
 * balanced HMC × ADAC partnership lockup, a stronger title sequence,
 * a clear executive subtitle and tagline, five premium badges, the
 * Start Presentation CTA, and a two-line footer attribution.
 *
 * Background here is intentionally minimal — AmbientBackground.tsx
 * skips its star-particle field for §1 and renders a soft radial gold
 * glow + diagonal partnership beam instead. We add nothing extra here.
 */
export function WelcomeCover({ content }: WelcomeCoverProps) {
  const fm = content.frontmatter;
  const eyebrow = (fm.eyebrow as string) ?? 'Partnership Opening';
  const title = (fm.title as string) ?? 'HMC × ADAC';
  const subtitle = (fm.subtitle as string) ?? '';
  const tagline = (fm.tagline as string) ?? '';
  const badges = Array.isArray(fm.badges) ? (fm.badges as string[]) : [];
  const footerLines = Array.isArray(fm.footerLines) ? (fm.footerLines as string[]) : [];

  // Defer the CTA so the audience reads the title before the button appears.
  const [showCTA, setShowCTA] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowCTA(true), 3000);
    return () => window.clearTimeout(t);
  }, []);

  const words = title.split(' ');

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 py-20 text-center sm:px-8">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: ease.premium }}
          className="font-sans text-[11px] uppercase tracking-[0.55em] text-gold sm:text-xs"
        >
          {eyebrow}
        </motion.p>

        {/* Partnership lockup — HMC × ADAC */}
        <div className="mt-10 md:mt-12">
          <PartnershipLockup height={88} />
        </div>

        {/* Title (word-by-word stagger at 1.4s) */}
        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          className="mt-12 font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:mt-14 md:text-7xl lg:text-[5.5rem]"
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
            transition={{ delay: 2.1, duration: 0.7, ease: ease.premium }}
            className="mx-auto mt-7 max-w-3xl font-display text-xl leading-snug text-white/95 md:text-2xl"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Tagline */}
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.35, duration: 0.7, ease: ease.premium }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ice/85 md:text-base"
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
            className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
          >
            {badges.map((b, i) => (
              <motion.li key={`${b}-${i}`} variants={badgeItem}>
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold/35 bg-gold/[0.07] px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-gold-soft">
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
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-gold/55 bg-gold px-8 py-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-navy-deep shadow-[0_18px_55px_rgba(201,169,97,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-[0_24px_70px_rgba(201,169,97,0.4)] focus:outline-none focus:ring-2 focus:ring-gold-soft focus:ring-offset-2 focus:ring-offset-navy-deep"
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
            transition={{ delay: 3.3, duration: 0.7, ease: ease.premium }}
            className="mt-16 space-y-1 text-center"
          >
            {footerLines.map((line, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-[11px] uppercase tracking-[0.4em] text-ice/80'
                    : 'text-[11px] uppercase tracking-[0.35em] text-ice/65'
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
  visible: { transition: { delayChildren: 1.4, staggerChildren: 0.08 } },
};
const titleWord: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.premium } },
};
const badgeContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 2.5, staggerChildren: 0.06 } },
};
const badgeItem: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: ease.premium } },
};
