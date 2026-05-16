'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef } from 'react';
import { ease } from '@/lib/motion';

/**
 * Wraps page content in a Framer Motion AnimatePresence that runs a
 * filmic blur + scale + opacity transition keyed off the pathname.
 *
 * Direction-aware horizontal slide:
 *   - Forward navigation: exit left → enter from right
 *   - Backward navigation: exit right → enter from left
 *
 * Because Next.js App Router doesn't expose history direction, we infer
 * it by comparing the new pathname's linearized position against the
 * previous one for /section/N/M routes.
 */

const variants: Variants = {
  initial: (dir: 1 | -1) => ({
    opacity: 0,
    scale: 0.96,
    x: dir === 1 ? 80 : -80,
    filter: 'blur(8px)',
  }),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: ease.premium },
  },
  exit: (dir: 1 | -1) => ({
    opacity: 0,
    scale: 1.04,
    x: dir === 1 ? -80 : 80,
    filter: 'blur(8px)',
    transition: { duration: 0.4, ease: ease.snap },
  }),
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const prevPathnameRef = useRef<string>(pathname);
  const directionRef = useRef<1 | -1>(1);

  useEffect(() => {
    directionRef.current =
      orderOf(pathname) >= orderOf(prevPathnameRef.current) ? 1 : -1;
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false} custom={directionRef.current}>
      <motion.div
        key={pathname}
        custom={directionRef.current}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Heuristic linear position used to infer navigation direction. */
function orderOf(pathname: string): number {
  if (pathname === '/' || pathname === '') return 0;
  const m = pathname.match(/^\/section\/([^/]+)(?:\/([^/]+))?/);
  if (!m) return 0;
  const section = Number(m[1]) || 0;
  const subStr = m[2]?.split('.').pop() ?? '0';
  const sub = Number(subStr) || 0;
  return section * 100 + sub;
}
