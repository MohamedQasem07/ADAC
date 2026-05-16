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
 * Hero element is the HMC × ADAC partnership lockup. Sequence is tuned
 * to be obviously visible at projector distance:
 *
 *   t+0.00   Background visible
 *   t+0.10   Eyebrow "Partnership Opening" fades in
 *   t+0.25   HMC slides from x:-100, ADAC slides from x:+100
 *            (both with scale 0.92→1, duration 0.9 s)
 *   t+1.10   Vertical gold rule draws (scaleY 0→1, 0.7 s)
 *   t+1.35   × mark fades + bounces in
 *   t+1.65   Title "HMC × ADAC" word-stagger (Playfair)
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
  const title = (fm.title as string) ?? 'HMC × ADAC';
  const subtitle = (fm.subtitle as string) ?? '';
  const tagline = (fm.tagline as string) ?? '';
  const badges = Array.isArray(fm.badges) ? (fm.badges as string[]) : [];
  const footerLines = Array.isArray(fm.footerLines) ? (fm.footerLines as string[]) : [];

  // CTA visible only once the title has landed, so the audience reads
  // the lockup → title sequence before the button calls them to act.
  const [showCTA, setShowCTA] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowCTA(true), 3100);
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
          className="font-sans text-[11px] uppercase tracking-[0.55em] text-gold sm:text-xs"
        >
          {eyebrow}
        </motion.p>

        {/* Partnership lockup region — relative wrapper so the horizontal
            partnership beam sits behind the logos. */}
        <div className="relative mt-10 w-full md:mt-12">
          {/* Soft horizontal gold beam behind the lockup */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1.4, ease: ease.premium }}
            style={{
              transformOrigin: 'center',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(201,169,97,0.16) 22%, rgba(201,169,97,0.30) 50%, rgba(201,169,97,0.16) 78%, transparent 100%)',
              filter: 'blur(14px)',
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[110%] -translate-x-1/2 -translate-y-1/2"
          />
          {/* Hairline gold rule along the beam axis */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.45, scaleX: 1 }}
            transition={{ delay: 0.55, duration: 1.4, ease: ease.premium }}
            style={{ transformOrigin: 'center' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[88%] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(201,169,97,0.6)_30%,rgba(201,169,97,0.85)_50%,rgba(201,169,97,0.6)_70%,transparent_100%)]"
          />

          <PartnershipLockup />
        </div>

        {/* Title — sits close to the lockup as the same hero block */}
        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          className="mt-10 font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
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

        {/* Subtitle — larger and more readable */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.7, ease: ease.premium }}
            className="mx-auto mt-6 max-w-3xl font-display text-xl leading-snug text-white/95 sm:text-2xl md:text-[1.75rem] lg:text-[2rem]"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Tagline — bigger than before for projector legibility */}
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.45, duration: 0.7, ease: ease.premium }}
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
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold/35 bg-gold/[0.07] px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-gold-soft">
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
            transition={{ delay: 3.4, duration: 0.7, ease: ease.premium }}
            className="mt-14 space-y-1 text-center"
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
  visible: { transition: { delayChildren: 1.65, staggerChildren: 0.08 } },
};
const titleWord: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.premium } },
};
const badgeContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 2.7, staggerChildren: 0.06 } },
};
const badgeItem: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: ease.premium } },
};
