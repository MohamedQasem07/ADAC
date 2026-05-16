'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BrandHeaderProps {
  /** Determines logo treatment. On light surfaces, a navy header strip wraps the white logo. */
  variant?: 'dark' | 'light';
  /** Size of the logo glyph in px. */
  height?: number;
  className?: string;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const LOGO_SRC = `${BASE_PATH}/brand/hmc-logo-white.png`;

/**
 * Renders the HMC mark from `public/brand/hmc-logo-white.png`.
 * If the asset is removed or fails to load, the component falls back to a
 * typographic Playfair "HMC" wordmark so the deck is never blocked.
 *
 * On `variant="light"`, a navy-medium header strip wraps the white logo
 * so it reads correctly on light backgrounds (per the spec).
 */
export function BrandHeader({ variant = 'dark', height = 32, className }: BrandHeaderProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  const logoOrFallback =
    !logoFailed ? (
      <Image
        src={LOGO_SRC}
        alt="Hurghada Medical Center"
        width={Math.round(height * 3.2)}
        height={height}
        priority
        unoptimized
        onError={() => setLogoFailed(true)}
        style={{ height, width: 'auto' }}
      />
    ) : (
      <span
        className="font-display font-semibold tracking-wide text-white"
        style={{ fontSize: height * 0.85, lineHeight: 1 }}
      >
        HMC
      </span>
    );

  if (variant === 'light') {
    return (
      <header
        className={cn(
          'flex w-full items-center bg-navy-medium px-6',
          className
        )}
        style={{ height: 50 }}
      >
        {logoOrFallback}
      </header>
    );
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      {logoOrFallback}
    </div>
  );
}
