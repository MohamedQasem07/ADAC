'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
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
 * Renders the HMC mark. If `public/brand/hmc-logo-white.png` exists, it
 * is rendered at full opacity; otherwise the component falls back to a
 * typographic Playfair "HMC" wordmark so the deck is never blocked by
 * a missing asset. Detection runs once per mount.
 *
 * On `variant="light"`, a navy-medium header strip wraps the white logo
 * so it reads correctly on light backgrounds (per the spec).
 */
export function BrandHeader({ variant = 'dark', height = 32, className }: BrandHeaderProps) {
  const [hasLogo, setHasLogo] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Probe the asset. On 404 we fall back to typography.
    fetch(LOGO_SRC, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setHasLogo(res.ok);
      })
      .catch(() => {
        if (!cancelled) setHasLogo(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logoOrFallback =
    hasLogo === true ? (
      <Image
        src={LOGO_SRC}
        alt="Hurghada Medical Center"
        width={Math.round(height * 3.2)}
        height={height}
        priority
        unoptimized
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
