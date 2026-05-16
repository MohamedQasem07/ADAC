'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ease } from '@/lib/motion';

interface PartnershipLockupProps {
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
 * Sized to feel like the hero element of the page (not a small header).
 *   HMC  wrapper: h-[112px] md:h-[124px] lg:h-32     (96–128 px)
 *   ADAC wrapper: h-[92px]  md:h-[104px] lg:h-28     (92–112 px, visually balanced)
 *
 * Each logo uses next/image with `object-contain` + CSS-driven sizing.
 * On image-load failure, falls back to a Playfair typographic wordmark.
 *
 * Animation visible-from-projector:
 *   t+0.25  HMC slides in from x:-100 with opacity 0→1 + scale 0.92→1
 *   t+0.25  ADAC slides in from x:+100 with opacity 0→1 + scale 0.92→1
 *   t+1.10  Gold vertical rule scales 0→1 vertically
 *   t+1.35  × mark fades + scales 0.6→1 with bounce
 *
 * Parent (WelcomeCover) schedules title/subtitle/badges/CTA after this.
 */
export function PartnershipLockup({ className = '' }: PartnershipLockupProps) {
  const [hmcFailed, setHmcFailed] = useState(false);
  const [adacFailed, setAdacFailed] = useState(false);

  return (
    <div
      className={`flex w-full items-center justify-center gap-8 sm:gap-10 md:gap-14 lg:gap-16 ${className}`}
    >
      {/* HMC */}
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.9, ease: ease.premium }}
        className="flex h-[112px] shrink-0 items-center justify-end md:h-[124px] lg:h-32"
      >
        {!hmcFailed ? (
          <Image
            src={HMC_SRC}
            alt="Hurghada Medical Center"
            width={420}
            height={130}
            priority
            unoptimized
            onError={() => setHmcFailed(true)}
            className="h-full w-auto max-w-[260px] object-contain sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
          />
        ) : (
          <span
            className="font-display text-[88px] font-semibold leading-none tracking-wide text-white md:text-[100px] lg:text-[112px]"
          >
            HMC
          </span>
        )}
      </motion.div>

      {/* Divider — vertical gold rule + × mark */}
      <div className="relative flex h-[112px] items-center justify-center md:h-[124px] lg:h-32">
        <motion.span
          aria-hidden
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.9 }}
          transition={{ delay: 1.1, duration: 0.7, ease: ease.premium }}
          style={{
            transformOrigin: 'center',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(201,169,97,0.55) 15%, rgba(201,169,97,1) 50%, rgba(201,169,97,0.55) 85%, transparent 100%)',
          }}
          className="block h-[85%] w-px"
        />
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.35, duration: 0.45, ease: ease.bounce }}
          className="absolute inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/55 bg-navy-deep text-gold md:h-10 md:w-10"
          style={{
            fontSize: '1.15rem',
            fontFamily: 'var(--font-playfair), Georgia, serif',
            lineHeight: 1,
            boxShadow: '0 0 22px rgba(201,169,97,0.4)',
          }}
        >
          ×
        </motion.span>
      </div>

      {/* ADAC */}
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.9, ease: ease.premium }}
        className="flex h-[92px] shrink-0 items-center justify-start md:h-[104px] lg:h-28"
      >
        {!adacFailed ? (
          <Image
            src={ADAC_SRC}
            alt="ADAC"
            width={260}
            height={110}
            priority
            unoptimized
            onError={() => setAdacFailed(true)}
            className="h-full w-auto max-w-[220px] object-contain sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px]"
          />
        ) : (
          <span
            className="font-display text-[72px] font-semibold leading-none tracking-wide text-white md:text-[84px] lg:text-[96px]"
          >
            ADAC
          </span>
        )}
      </motion.div>
    </div>
  );
}
