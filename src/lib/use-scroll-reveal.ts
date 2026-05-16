'use client';

import { useInView } from 'react-intersection-observer';

/**
 * Scroll-into-view trigger. Returns a ref + `inView` flag.
 *
 * Default: triggers when 15% of the element is visible; reveals only
 * once (so re-scrolling past doesn't replay the animation). Component
 * authors gate animations on `inView` and use `motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'}`.
 */
export function useScrollReveal(
  options: { threshold?: number; triggerOnce?: boolean; rootMargin?: string } = {}
) {
  const { ref, inView } = useInView({
    threshold: options.threshold ?? 0.15,
    triggerOnce: options.triggerOnce ?? true,
    rootMargin: options.rootMargin,
  });
  return { ref, inView };
}
