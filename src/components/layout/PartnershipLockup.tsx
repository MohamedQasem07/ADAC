'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ease } from '@/lib/motion';

interface PartnershipLockupProps {
  className?: string;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const HMC_SRC = `${BASE_PATH}/brand/hmc-logo-white.png`;
const ADAC_SRC = `${BASE_PATH}/brand/adac-logo-white.png`;

// Far-edge entry distance — large enough that movement is unmistakable
// at 1366/1920 projector widths. 500 px is roughly 36% of a 1366
// viewport and 26% of a 1920 viewport, so the logo enters from clearly
// off-centre on either machine.
const ENTRY_OFFSET_PX = 500;

/**
 * HMC × ADAC partnership lockup for the Welcome cover.
 *
 *   [ HMC logo ] | central connector ( × + halo + symmetrical lines ) | [ ADAC logo ]
 *
 * Logo sizing tuned for visual balance, not exact pixel parity:
 *   HMC  wrapper: h-[124px] md:h-[140px] lg:h-[156px]
 *                 max-width 280 → 340 → 400 px
 *   ADAC wrapper: h-[140px] md:h-[160px] lg:h-[180px]
 *                 max-width 240 → 300 → 360 px  (compact wordmark)
 *                 image scaled internally by 1.25× to compensate for
 *                 the transparent padding around the official ADAC PNG
 *
 * Animation visible at projector distance:
 *   t+0.20 → 1.40   HMC slides in from x:-500, opacity 0→1, scale 0.92→1
 *   t+0.20 → 1.40   ADAC slides in from x:+500, opacity 0→1, scale 0.92→1
 *   t+1.45 → 1.95   Central × + soft circular halo fades + scales 0.85→1
 *   t+1.65 → 2.20   Two short symmetrical gold hairlines draw from × outward
 *
 * A `started` flag gates the animation — gated by useEffect so the
 * audience always sees the entry play, even after hard refresh /
 * direct visits to the root URL.
 */
export function PartnershipLockup({ className = '' }: PartnershipLockupProps) {
  const [hmcFailed, setHmcFailed] = useState(false);
  const [adacFailed, setAdacFailed] = useState(false);
  const [started, setStarted] = useState(false);

  // Defer animation kickoff by one frame so React has settled the
  // initial paint at the offscreen position. Without this, fast
  // hydration can mask the entry motion.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setStarted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`relative mx-auto flex w-full max-w-[1100px] items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-14 ${className}`}
    >
      {/* HMC — enters from far left */}
      <motion.div
        initial={{ opacity: 0, x: -ENTRY_OFFSET_PX, scale: 0.92 }}
        animate={
          started
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: -ENTRY_OFFSET_PX, scale: 0.92 }
        }
        transition={{ delay: 0.2, duration: 1.2, ease: ease.premium }}
        className="flex h-[124px] flex-1 items-center justify-end md:h-[140px] lg:h-[156px]"
      >
        {!hmcFailed ? (
          <Image
            src={HMC_SRC}
            alt="Hurghada Medical Center"
            width={440}
            height={156}
            priority
            unoptimized
            onError={() => setHmcFailed(true)}
            className="h-full w-auto max-w-[280px] object-contain sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
          />
        ) : (
          <span
            className="font-display font-semibold leading-none tracking-wide text-white"
            style={{ fontSize: 'clamp(72px, 9vw, 120px)' }}
          >
            HMC
          </span>
        )}
      </motion.div>

      {/* Central connector — × mark, soft halo, two symmetrical lines */}
      <CentralConnector started={started} />

      {/* ADAC — enters from far right; visually scaled to balance HMC */}
      <motion.div
        initial={{ opacity: 0, x: ENTRY_OFFSET_PX, scale: 0.92 }}
        animate={
          started
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: ENTRY_OFFSET_PX, scale: 0.92 }
        }
        transition={{ delay: 0.2, duration: 1.2, ease: ease.premium }}
        className="flex h-[140px] flex-1 items-center justify-start md:h-[160px] lg:h-[180px]"
      >
        {!adacFailed ? (
          <div className="relative flex h-full w-full max-w-[240px] items-center justify-start overflow-hidden sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px]">
            {/* The official ADAC PNG carries a wide transparent padding
                around the wordmark. We scale the image inside its
                wrapper so the visible letters reach HMC's visual mass. */}
            <Image
              src={ADAC_SRC}
              alt="ADAC"
              width={360}
              height={180}
              priority
              unoptimized
              onError={() => setAdacFailed(true)}
              className="h-full w-auto object-contain"
              style={{ transform: 'scale(1.25)', transformOrigin: 'left center' }}
            />
          </div>
        ) : (
          <span
            className="font-display font-semibold leading-none tracking-wide text-white"
            style={{ fontSize: 'clamp(64px, 8vw, 112px)' }}
          >
            ADAC
          </span>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Central connector — replaces the asymmetric horizontal beam from 2.4D.1.
 *
 *   ┃   <- thin gold vertical hairline (subtle, fades on top and bottom)
 *   ●   <- soft circular gold halo behind the × mark (centred, symmetric)
 *   ×   <- gold × glyph
 *  ←/→  <- two short symmetrical hairlines drawing outward
 */
function CentralConnector({ started }: { started: boolean }) {
  return (
    <div className="relative flex h-[140px] w-[112px] shrink-0 items-center justify-center md:h-[160px] md:w-[128px] lg:h-[180px] lg:w-[144px]">
      {/* Soft circular halo behind the × — theme-aware. Premium navy
          uses gold (rgb(201,169,97)); partnership uses ADAC yellow
          (rgb(255,210,0)) via --theme-accent-rgb. */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.65 }}
        animate={started ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.65 }}
        transition={{ delay: 1.45, duration: 0.55, ease: ease.premium }}
        className="absolute h-16 w-16 rounded-full md:h-20 md:w-20"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.34) 0%, rgba(var(--theme-accent-rgb), 0.18) 40%, transparent 72%)',
          filter: 'blur(2px)',
        }}
      />

      {/* Two short symmetrical hairlines drawing outward from the ×.
          Theme-aware: under premium-navy both lines are gold; under
          partnership the left line runs from HMC blue → transparent
          and the right line runs from transparent → ADAC yellow,
          visually connecting blue (HMC) to yellow (ADAC). */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        animate={started ? { scaleX: 1, opacity: 0.85 } : { scaleX: 0, opacity: 0 }}
        transition={{ delay: 1.65, duration: 0.55, ease: ease.premium }}
        style={{
          transformOrigin: 'right center',
          background:
            'linear-gradient(90deg, transparent 0%, var(--theme-connector-from) 100%)',
        }}
        className="absolute right-[58%] h-px w-10 md:w-12 lg:w-14"
      />
      <motion.span
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        animate={started ? { scaleX: 1, opacity: 0.85 } : { scaleX: 0, opacity: 0 }}
        transition={{ delay: 1.65, duration: 0.55, ease: ease.premium }}
        style={{
          transformOrigin: 'left center',
          background:
            'linear-gradient(90deg, var(--theme-connector-to) 0%, transparent 100%)',
        }}
        className="absolute left-[58%] h-px w-10 md:w-12 lg:w-14"
      />

      {/* × glyph — colour taken from --theme-accent for theme awareness */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={started ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ delay: 1.55, duration: 0.5, ease: ease.premium }}
        className="relative inline-flex items-center justify-center font-display font-medium"
        style={{
          fontSize: 'clamp(40px, 4.5vw, 56px)',
          fontFamily: 'var(--font-playfair), Georgia, serif',
          lineHeight: 1,
          color: 'var(--theme-accent)',
          textShadow: '0 0 18px rgba(var(--theme-accent-rgb), 0.45)',
        }}
      >
        ×
      </motion.span>
    </div>
  );
}
