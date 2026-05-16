'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { parsePathname } from '@/lib/nav-config';

interface SideBrandWatermarksProps {
  /** Sidebar open state — used to dim the watermarks while the sidebar drawer is showing. */
  sidebarOpen: boolean;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const HMC_SRC = `${BASE_PATH}/brand/hmc-logo-white.png`;
const ADAC_SRC = `${BASE_PATH}/brand/adac-logo-white.png`;

/**
 * Phase 2.4K — fixed side brand watermarks.
 *
 * Renders two very low-opacity logos in the empty left/right column of
 * the viewport: HMC on the left (cool blue/cyan glow), ADAC on the
 * right (warm gold/yellow glow). The pair reads as a "partnership
 * watermark" framing the central content column without taking any
 * layout space.
 *
 * Visibility & layering rules:
 *   - `position: fixed`, vertically centred via top:50% + translateY(-50%)
 *   - `z-10` — sits above AmbientBackground (-z-10 / z-0 family) but
 *     below the main content slot (z-10 + relative) and modal/overlay
 *     chrome (z-40+). The sidebar (z-50) covers them when open.
 *   - `pointer-events: none` and `select-none` so they never block hover,
 *     clicks, tooltips, links, or chart interaction.
 *   - Hidden below `lg` (Tailwind's 1024 px breakpoint). On 1366×768
 *     projector screens they appear at a deliberately low opacity so
 *     they read as ghosted background, not foreground branding.
 *   - Welcome cover (`/` and `/section/1`) — hidden entirely so the
 *     centred partnership lockup is the only logo treatment on that
 *     opening screen.
 *   - Control Mode (`/control`) — hidden so the presenter's editor view
 *     stays free of decorative chrome.
 *   - Sidebar open — opacity drops by ~70 % so the watermarks don't
 *     compete with the sidebar's frosted panel.
 *
 * Assets:
 *   - public/brand/hmc-logo-white.png
 *   - public/brand/adac-logo-white.png
 */
export function SideBrandWatermarks({ sidebarOpen }: SideBrandWatermarksProps) {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);

  // Hide entirely on the cover and on Control Mode.
  const isCover = (route.sectionId === '1' && !route.subId) || pathname === '/';
  const isControl = pathname.startsWith('/control');
  if (isCover || isControl) return null;

  const baseOpacity = 0.18;
  const dimmedOpacity = 0.05;
  const opacity = sidebarOpen ? dimmedOpacity : baseOpacity;

  return (
    <div aria-hidden className="pointer-events-none select-none">
      {/* Left — HMC */}
      <div
        className="fixed left-6 top-1/2 z-10 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:left-10 2xl:left-12"
        style={{ opacity }}
      >
        <div className="relative" style={{ width: 'clamp(90px, 8vw, 170px)' }}>
          {/* Glow halo behind the logo — HMC blue/cyan */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(31,111,229,0.28) 0%, rgba(31,111,229,0.14) 40%, transparent 72%)',
              filter: 'blur(18px)',
            }}
          />
          <Image
            src={HMC_SRC}
            alt=""
            width={340}
            height={120}
            unoptimized
            priority={false}
            className="h-auto w-full object-contain"
            style={{
              filter: 'drop-shadow(0 0 18px rgba(31,111,229,0.18)) saturate(0.9)',
            }}
          />
        </div>
      </div>

      {/* Right — ADAC */}
      <div
        className="fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:right-10 2xl:right-12"
        style={{ opacity }}
      >
        <div className="relative" style={{ width: 'clamp(90px, 8vw, 170px)' }}>
          {/* Glow halo behind the logo — ADAC gold/yellow */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,210,0,0.26) 0%, rgba(255,210,0,0.12) 40%, transparent 72%)',
              filter: 'blur(18px)',
            }}
          />
          <Image
            src={ADAC_SRC}
            alt=""
            width={340}
            height={170}
            unoptimized
            priority={false}
            className="h-auto w-full object-contain"
            style={{
              filter: 'drop-shadow(0 0 18px rgba(255,210,0,0.20)) saturate(0.9)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
