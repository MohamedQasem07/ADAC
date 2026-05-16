'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { parsePathname } from '@/lib/nav-config';

interface SideBrandWatermarksProps {
  /** Sidebar open state — used to dim AND reposition HMC while the sidebar drawer is showing. */
  sidebarOpen: boolean;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const HMC_SRC = `${BASE_PATH}/brand/hmc-logo-white.png`;
const ADAC_SRC = `${BASE_PATH}/brand/adac-logo-white.png`;

/**
 * Sidebar width token. Matches `w-[min(22rem,calc(100vw-1rem))]` from
 * Sidebar.tsx — when the sidebar opens, the HMC watermark slides
 * horizontally to sit just outside its right edge so it remains in the
 * visible "page background" region rather than disappearing under the
 * sidebar panel.
 */
const SIDEBAR_WIDTH_REM = 22;
const HMC_GAP_FROM_SIDEBAR_PX = 32;

/**
 * Phase 2.4K.3 — true background-dimmed brand watermarks.
 *
 * The earlier 2.4K iterations read as "semi-transparent UI logos." This
 * version aims for the look of white atmospheric watermark paint
 * embedded in the page background — soft, frosted, slightly blurred,
 * similar in spirit to how the main content reads when the sidebar
 * overlay is open.
 *
 * Technique stack (per logo):
 *   1. Large radial atmospheric halo behind the logo (180% box, 38 px
 *      blur). HMC halo is HMC-blue, ADAC halo is ADAC-yellow. This
 *      establishes a coloured "light pool" in the corner before any
 *      logo is drawn.
 *   2. Logo image with filter `blur(1.4px) brightness(1.12) saturate(0.55)`
 *      and opacity 0.55. The micro-blur is the single most important
 *      step: it strips the logo of its sharp PNG edge so it reads as
 *      background paint. The saturate desaturates any colour cast and
 *      the brightness lift keeps the white visible against dark navy.
 *   3. A faint navy frost scrim positioned ON TOP of the logo
 *      (`bg-navy-deep/15` + `backdrop-blur-[2px]`). This is what gives
 *      the "logo embedded in frosted glass" feel — the same family of
 *      treatment as the sidebar-open page dim.
 *   4. Wrapper opacity 0.92 — the per-piece opacities above (halo, logo
 *      0.55, scrim 0.15) already do most of the dimming; the wrapper
 *      gets a small final attenuation, then drops to 0.10 when the
 *      sidebar is open.
 *
 * Placement (Phase 2.4K.3):
 *   - HMC sits UPPER-LEFT (top ~26 %), `left: 32 px` when the sidebar is
 *     closed. When the sidebar opens, HMC slides right to
 *     `calc(22rem + 32 px)` so it stays in the visible content area
 *     rather than disappearing behind the frosted sidebar panel. A 500
 *     ms premium ease transitions the `left` value smoothly.
 *   - ADAC sits LOWER-RIGHT (top ~74 %) inside the warm gold-light zone,
 *     never moves on sidebar toggle.
 *
 * Layering & safety:
 *   - `z-20` — above ambient (z-0) and content slot (z-10), below the
 *     sidebar (z-50) and shell chrome (z-30+).
 *   - `pointer-events: none` + `select-none` so nothing is blocked.
 *   - Hidden below the `lg` breakpoint (≥ 1024 px CSS).
 *
 * Hidden routes: `/`, `/section/1`, `/control` and `/control/*`.
 */
export function SideBrandWatermarks({ sidebarOpen }: SideBrandWatermarksProps) {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);

  // Hide entirely on the cover and on Control Mode.
  const isCover = (route.sectionId === '1' && !route.subId) || pathname === '/';
  const isControl = pathname.startsWith('/control');
  if (isCover || isControl) return null;

  const wrapperOpacity = sidebarOpen ? 0.1 : 0.92;

  // HMC slides right when the sidebar opens so it sits at the
  // left edge of the visible page-background area, not under the
  // sidebar's frosted panel.
  const hmcLeft = sidebarOpen
    ? `calc(${SIDEBAR_WIDTH_REM}rem + ${HMC_GAP_FROM_SIDEBAR_PX}px)`
    : `32px`;

  // Combined filter applied to the logo IMAGE itself. The blur(1.4px)
  // is the painted-into-background look; brightness + saturate keep
  // the white intact against dark navy without becoming washed out.
  const logoFilterHMC =
    'blur(1.4px) brightness(1.12) saturate(0.55) drop-shadow(0 0 30px rgba(31,111,229,0.34))';
  const logoFilterADAC =
    'blur(1.4px) brightness(1.12) saturate(0.55) drop-shadow(0 0 30px rgba(255,210,0,0.36))';

  return (
    <div aria-hidden className="pointer-events-none select-none">
      {/* HMC — upper-left, slides right with sidebar */}
      <div
        className="fixed z-20 hidden -translate-y-1/2 lg:block"
        style={{
          top: '26%',
          left: hmcLeft,
          opacity: wrapperOpacity,
          transition:
            'left 520ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="relative"
          style={{ width: 'clamp(190px, 15vw, 330px)' }}
        >
          {/* 1. Atmospheric blue/cyan halo — paints the corner before the logo */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(31,111,229,0.40) 0%, rgba(31,111,229,0.20) 36%, rgba(31,111,229,0.08) 58%, transparent 78%)',
              filter: 'blur(38px)',
            }}
          />
          {/* 2. The logo — white, blurred, slightly brightened */}
          <Image
            src={HMC_SRC}
            alt=""
            width={340}
            height={120}
            unoptimized
            priority={false}
            className="relative h-auto w-full object-contain"
            style={{
              opacity: 0.55,
              filter: logoFilterHMC,
            }}
          />
          {/* 3. Frost scrim — sits ON TOP of the logo. Subtle navy tint
              + backdrop-blur. Gives the "logo dimmed into the page
              background" feel that opacity alone cannot. */}
          <span
            aria-hidden
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{
              background:
                'linear-gradient(135deg, rgba(10,25,41,0.18) 0%, rgba(10,25,41,0.10) 60%, rgba(10,25,41,0.04) 100%)',
            }}
          />
        </div>
      </div>

      {/* ADAC — lower-right, anchored in the warm light zone (never moves on sidebar toggle) */}
      <div
        className="fixed z-20 hidden -translate-y-1/2 lg:block"
        style={{
          top: '74%',
          right: '32px',
          opacity: wrapperOpacity,
          transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="relative"
          style={{ width: 'clamp(180px, 14vw, 310px)' }}
        >
          {/* 1. Atmospheric gold/yellow halo */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,210,0,0.38) 0%, rgba(255,210,0,0.20) 36%, rgba(255,210,0,0.08) 58%, transparent 78%)',
              filter: 'blur(38px)',
            }}
          />
          {/* 2. Logo — white, blurred */}
          <Image
            src={ADAC_SRC}
            alt=""
            width={340}
            height={170}
            unoptimized
            priority={false}
            className="relative h-auto w-full object-contain"
            style={{
              opacity: 0.55,
              filter: logoFilterADAC,
            }}
          />
          {/* 3. Frost scrim */}
          <span
            aria-hidden
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{
              background:
                'linear-gradient(225deg, rgba(10,25,41,0.18) 0%, rgba(10,25,41,0.10) 60%, rgba(10,25,41,0.04) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
