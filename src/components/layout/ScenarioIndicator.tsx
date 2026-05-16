'use client';

import { useEffect, useState } from 'react';
import { usePricing } from '@/context/PricingContext';
import type { PricingScenario } from '@/types/content';

/** Maps the hidden scenario to a subtle 4×4 px corner dot color. */
const COLORS: Record<PricingScenario, string> = {
  A: '#C9A961', // gold     — "To be agreed"
  B: '#2E75B6', // royal    — Standard (default)
  C: '#0096B4', // teal     — Premium ×1.8
};

/**
 * The 4×4 px corner dot that signals the active pricing scenario to
 * Mohamed only. Audience cannot read meaning into the color. When the
 * scenario changes, a subtle ripple emanates for 1 s.
 *
 * Position: bottom-left at 8 px, opacity 0.6 — readable up close,
 * invisible from across a meeting room.
 */
export function ScenarioIndicator() {
  const { scenario, ripple } = usePricing();
  const [rippleNonce, setRippleNonce] = useState<number | null>(null);

  useEffect(() => {
    if (!ripple) return;
    setRippleNonce(ripple.nonce);
    const t = window.setTimeout(() => setRippleNonce(null), 1100);
    return () => window.clearTimeout(t);
  }, [ripple]);

  const color = COLORS[scenario];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-2 left-2 z-[60]"
      style={{ width: 4, height: 4 }}
    >
      <span
        className="absolute inset-0 rounded-full transition-colors duration-500"
        style={{ background: color, opacity: 0.6 }}
      />
      {rippleNonce !== null && (
        <span
          key={rippleNonce}
          className="absolute -inset-2 rounded-full animate-[ripple_1s_ease-out_forwards]"
          style={{
            boxShadow: `0 0 0 0 ${color}`,
            background: 'transparent',
          }}
        />
      )}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.55;
            box-shadow: 0 0 0 0 ${color};
          }
          100% {
            transform: scale(4.5);
            opacity: 0;
            box-shadow: 0 0 0 12px ${color};
          }
        }
      `}</style>
    </div>
  );
}
