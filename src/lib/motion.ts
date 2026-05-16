/**
 * Centralized motion primitives — used everywhere.
 *
 * Every component that animates must import from this file. This keeps
 * the choreography consistent across the deck (a Stripe-Sessions-grade
 * feel comes from uniform easings + timings, not from individual flair).
 */

import type { Variants, Transition } from 'framer-motion';

/** Standard cubic-bezier easing curves. */
export const ease = {
  /** Slow-fast-slow — the cinematic default. Use for entries and section transitions. */
  premium: [0.16, 1, 0.3, 1] as const,
  /** Crisp for interactions (button press, toggle). */
  snap: [0.4, 0, 0.2, 1] as const,
  /** Bouncy reveal — use sparingly (map pin drops). */
  bounce: [0.34, 1.56, 0.64, 1] as const,
  /** Soft entrance for muted fades. */
  soft: [0.25, 0.46, 0.45, 0.94] as const,
};

/** Standard durations in seconds. */
export const duration = {
  instant: 0.15,
  quick: 0.3,
  standard: 0.6,
  slow: 1.2,
  hero: 2.0,
} as const;

/** Standard transition presets. */
export const transition = {
  premium: { duration: duration.standard, ease: ease.premium } as Transition,
  premiumSlow: { duration: duration.slow, ease: ease.premium } as Transition,
  snap: { duration: duration.quick, ease: ease.snap } as Transition,
  soft: { duration: duration.standard, ease: ease.soft } as Transition,
};

/** Fade up with a 40 px translate — the default reveal for headings + paragraphs. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: ease.premium },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: ease.soft },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: ease.premium },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: ease.premium },
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: ease.premium },
  },
};

/**
 * Stagger container — children with `variants` that include "hidden"/"visible"
 * states animate in sequence when this parent transitions to "visible".
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Snappier stagger for dense grids (chart cards, package cards). */
export const staggerTight: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** Slow heroic stagger for cover-style word-by-word reveals. */
export const staggerHero: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

/**
 * Page transition (cinematic blur + scale + opacity).
 * Direction-aware horizontal slide handled separately in PageTransition.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: ease.premium },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    filter: 'blur(8px)',
    transition: { duration: 0.4, ease: ease.snap },
  },
};

/** Card rest/hover preset — y -4 px, scale 1.02, soft → elevated gold-tinted shadow. */
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: '0 20px 40px -10px rgba(201,169,97,0.18)',
    transition: { duration: 0.3, ease: ease.premium },
  },
};

/** Force GPU compositing for transform-only animations. */
export const gpuPaint = { willChange: 'transform, opacity' } as const;
