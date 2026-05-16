'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import type { ReactNode } from 'react';

/**
 * Root-level Lenis smooth-scroll wrapper. Per the cinematic spec, this is
 * the single biggest premium-feel multiplier: mouse-wheel input becomes
 * buttery instead of native-snappy.
 *
 * Tuning rationale:
 *   duration:        1.6  — slow enough to feel cinematic, not slow enough
 *                            to feel laggy mid-meeting.
 *   easing:          ease-out-quartic — soft landing on each scroll burst.
 *   wheelMultiplier: 0.9  — slight damping so each notch is more deliberate.
 *   touchMultiplier: 1.4  — boost touch scroll to compensate for inertia.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.6,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  );
}
