'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ease } from '@/lib/motion';

interface PartnershipLockupProps {
  /** Logo height in px; both logos sized to match. */
  height?: number;
  className?: string;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const HMC_SRC = `${BASE_PATH}/brand/hmc-logo-white.png`;
const ADAC_SRC = `${BASE_PATH}/brand/adac-logo-white.png`;

/**
 * HMC × ADAC partnership lockup for the Welcome cover.
 *
 *   [ HMC logo ]   |   ×   |   [ ADAC logo ]
 *
 * Each logo renders from /public/brand/*-logo-white.png with a graceful
 * typographic fallback (same pattern as BrandHeader.tsx). The vertical
 * gold rule and the × mark are SVG, so they animate cleanly via
 * Framer Motion without dragging in extra assets.
 *
 * Animation sequence (parent passes `initial`/`animate` for orchestration):
 *   t+0.30  HMC slides in from x:-24
 *   t+0.55  ADAC slides in from x:+24
 *   t+0.95  Gold vertical rule scales 0→1 (top-to-bottom feel)
 *   t+1.15  × mark fades + scales 0.6→1 with bounce
 */
export function PartnershipLockup({ height = 88, className = '' }: PartnershipLockupProps) {
  const [hmcFailed, setHmcFailed] = useState(false);
  const [adacFailed, setAdacFailed] = useState(false);

  // Approximate aspect 3.2:1 for both logos so they balance visually.
  const width = Math.round(height * 3.2);

  return (
    <div
      className={`flex items-center justify-center gap-6 sm:gap-8 md:gap-10 ${className}`}
    >
      {/* HMC */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: ease.premium }}
        className="flex shrink-0 items-center justify-end"
        style={{ minWidth: width }}
      >
        {!hmcFailed ? (
          <Image
            src={HMC_SRC}
            alt="Hurghada Medical Center"
            width={width}
            height={height}
            priority
            unoptimized
            onError={() => setHmcFailed(true)}
            style={{ height, width: 'auto' }}
          />
        ) : (
          <span
            className="font-display font-semibold tracking-wide text-white"
            style={{ fontSize: height * 0.85, lineHeight: 1 }}
          >
            HMC
          </span>
        )}
      </motion.div>

      {/* Divider — vertical gold rule + × mark */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: height * 1.05 }}
      >
        <motion.span
          aria-hidden
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.85 }}
          transition={{ delay: 0.95, duration: 0.6, ease: ease.premium }}
          style={{
            transformOrigin: 'center',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(201,169,97,0.6) 18%, rgba(201,169,97,0.9) 50%, rgba(201,169,97,0.6) 82%, transparent 100%)',
          }}
          className="block h-full w-px"
        />
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.15, duration: 0.4, ease: ease.bounce }}
          className="absolute inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold/50 bg-navy-deep text-gold"
          style={{
            fontSize: '0.95rem',
            fontFamily: 'var(--font-playfair), Georgia, serif',
            lineHeight: 1,
            boxShadow: '0 0 16px rgba(201,169,97,0.35)',
          }}
        >
          ×
        </motion.span>
      </div>

      {/* ADAC */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: ease.premium }}
        className="flex shrink-0 items-center justify-start"
        style={{ minWidth: width }}
      >
        {!adacFailed ? (
          <Image
            src={ADAC_SRC}
            alt="ADAC"
            width={width}
            height={height}
            priority
            unoptimized
            onError={() => setAdacFailed(true)}
            style={{ height, width: 'auto' }}
          />
        ) : (
          <span
            className="font-display font-semibold tracking-wide text-white"
            style={{ fontSize: height * 0.85, lineHeight: 1 }}
          >
            ADAC
          </span>
        )}
      </motion.div>
    </div>
  );
}
