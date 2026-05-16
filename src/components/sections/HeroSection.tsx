'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { ArrowRight } from 'lucide-react';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { ease } from '@/lib/motion';

interface HeroSectionProps {
  variant: 'cover' | 'closing';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Body markdown rendered below the gold rule. */
  body?: string;
  /** Cover-only: shown at bottom, auto-hides. */
  pressHint?: string;
}

/**
 * Cinematic §1 cover and §18 closing. The exact 4-second opener
 * choreography from the spec:
 *
 *   0.0s  logo fades in (opacity 0→1, scale 0.95→1, 1.2s)
 *   0.5s  ambient particles already drifting (no opacity transition needed)
 *   1.0s  eyebrow types/word-staggers in
 *   1.4s  title words stagger in (Playfair, 80 ms between words)
 *   2.6s  gold underline draws left → right (1.2 s, ease.premium)
 *   3.0s  subtitle fades in
 *   3.5s  body/date fades in
 *   4.5s  "Press → to begin" appears, auto-hides at 9.5s
 *
 * Closing (variant="closing") plays the same sequence in mirror order
 * and, on full reveal, fires a minimal 5-8-particle gold canvas-confetti
 * burst from the logo.
 */
export function HeroSection({
  variant,
  eyebrow,
  title,
  subtitle,
  body,
  pressHint,
}: HeroSectionProps) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (variant !== 'cover') return;
    const showAt = window.setTimeout(() => setShowHint(true), 4500);
    return () => {
      window.clearTimeout(showAt);
    };
  }, [variant]);

  // Trigger the confetti burst on §18 once the closing animation lands.
  useEffect(() => {
    if (variant !== 'closing') return;
    const t = window.setTimeout(() => {
      const root = document.getElementById('hero-logo-anchor');
      const rect = root?.getBoundingClientRect();
      const origin = rect
        ? {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          }
        : { x: 0.5, y: 0.85 };
      confetti({
        particleCount: 8,
        spread: 40,
        startVelocity: 22,
        gravity: 0.8,
        ticks: 90,
        scalar: 0.9,
        colors: ['#C9A961', '#E0C988'],
        origin,
      });
    }, 4200);
    return () => window.clearTimeout(t);
  }, [variant]);

  // Word-by-word title stagger.
  const titleWords = title.split(' ');

  return (
    <section className="relative flex min-h-screen items-center justify-center px-8 py-24 text-center">
      <div className="relative mx-auto max-w-3xl">
        {/* Logo */}
        <motion.div
          id="hero-logo-anchor"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: ease.premium }}
          className="mb-12 flex justify-center"
        >
          <BrandHeader variant="dark" height={88} />
        </motion.div>

        {/* Eyebrow */}
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: ease.premium }}
            className="font-sans text-xs uppercase tracking-[0.5em] text-gold"
          >
            {eyebrow}
          </motion.p>
        )}

        {/* Title (word-by-word stagger, starts at 1.4s) */}
        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-white md:text-7xl"
        >
          {titleWords.map((word, i) => (
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

        {/* Gold underline — draws left→right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.6, duration: 1.2, ease: ease.premium }}
          style={{ transformOrigin: 'left center' }}
          className="gold-rule mx-auto mt-10 w-32"
        />

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.7, ease: ease.premium }}
            className="mt-8 text-lg text-ink-soft md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Start presentation button (cover only) */}
        {variant === 'cover' && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: showHint ? 1 : 0, y: showHint ? 0 : 14 }}
            transition={{ duration: 0.6, ease: ease.premium }}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/section/overview"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-gold/50 bg-gold px-7 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-navy-deep shadow-[0_18px_55px_rgba(201,169,97,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-[0_24px_70px_rgba(201,169,97,0.32)] focus:outline-none focus:ring-2 focus:ring-gold-soft focus:ring-offset-2 focus:ring-offset-navy-deep"
            >
              {pressHint ?? 'Start Presentation'}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        )}

        {/* Body */}
        {body && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.7, ease: ease.premium }}
            className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft/80"
          >
            {body}
          </motion.div>
        )}

      </div>
    </section>
  );
}

const titleContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 1.4,
      staggerChildren: 0.08,
    },
  },
};

const titleWord: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: ease.premium },
  },
};
