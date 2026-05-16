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

/** Sidebar width token — matches `w-[min(22rem,...)]` in Sidebar.tsx. */
const SIDEBAR_WIDTH_REM = 22;

/**
 * Phase 2.4K.4 — corner-anchored watermark ghosts.
 *
 * HMC emerges from the **extreme upper-left corner** of the viewport,
 * ADAC emerges from the **extreme lower-right corner**. Neither has a
 * visible bounding rectangle: the previous 2.4K.3 navy frost scrim has
 * been removed because it drew a visible square behind the logo. What
 * remains is just:
 *
 *   1. A SOFT radial halo (no rectangle — pure radial gradient with
 *      strong outer falloff) sitting behind the logo.
 *   2. The white logo image itself, strongly blurred and dimmed, so it
 *      reads as a soft brand shape painted into the background rather
 *      than as a UI overlay.
 *
 * Subtlety: the watermarks are deliberately much dimmer than 2.4K.3.
 * The user should notice them only as faint brand presence, not as a
 * second logo demanding attention.
 *
 * Placement (corner-anchored):
 *   - HMC: top 130px, left -16px (so the logo bleeds slightly off the
 *     page edge — that's what makes it feel attached to the corner
 *     rather than floating). When the sidebar is open, HMC slides to
 *     left: calc(22rem - 16px) so it bleeds off the right edge of the
 *     sidebar instead.
 *   - ADAC: bottom 90px, right -16px. Same bleed treatment on the
 *     opposite corner. Does NOT move with the sidebar.
 *
 * Layering & safety unchanged from 2.4K.3:
 *   - z-20 (above ambient z-0, above content slot z-10, below shell
 *     chrome z-30+ and sidebar z-50)
 *   - pointer-events: none, select-none
 *   - Hidden below the lg breakpoint and on /, /section/1, /control/*
 */
export function SideBrandWatermarks({ sidebarOpen }: SideBrandWatermarksProps) {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);

  const isCover = (route.sectionId === '1' && !route.subId) || pathname === '/';
  const isControl = pathname.startsWith('/control');
  if (isCover || isControl) return null;

  // 2.4K.4: much dimmer wrapper. The image inside is also dimmer.
  const wrapperOpacity = sidebarOpen ? 0.06 : 0.18;

  // HMC slides right when the sidebar is open so it bleeds off the
  // sidebar's right edge instead of the viewport's left edge.
  const hmcLeft = sidebarOpen ? `calc(${SIDEBAR_WIDTH_REM}rem - 16px)` : `-16px`;

  // Image filter: heavier blur than 2.4K.3 (2.4 px). Brightness slightly
  // higher to compensate for the bigger blur. Saturate kept low so it
  // reads neutral white.
  const logoFilterHMC =
    'blur(2.4px) brightness(1.18) saturate(0.5) drop-shadow(0 0 32px rgba(31,111,229,0.30))';
  const logoFilterADAC =
    'blur(2.4px) brightness(1.18) saturate(0.5) drop-shadow(0 0 32px rgba(255,210,0,0.32))';

  return (
    <div aria-hidden className="pointer-events-none select-none">
      {/* HMC — extreme upper-left corner */}
      <div
        className="fixed z-20 hidden lg:block"
        style={{
          top: '130px',
          left: hmcLeft,
          opacity: wrapperOpacity,
          transition:
            'left 520ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="relative"
          style={{ width: 'clamp(200px, 16vw, 340px)' }}
        >
          {/* Radial-only halo. Very soft, big falloff — never reads as
              a rectangle. Sized larger than the logo so its outer
              transparency edge sits beyond the logo's bounding box. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(circle, rgba(31,111,229,0.30) 0%, rgba(31,111,229,0.12) 32%, rgba(31,111,229,0.03) 56%, transparent 75%)',
              filter: 'blur(34px)',
            }}
          />
          <Image
            src={HMC_SRC}
            alt=""
            width={340}
            height={120}
            unoptimized
            priority={false}
            className="relative h-auto w-full object-contain"
            style={{
              opacity: 0.4,
              filter: logoFilterHMC,
            }}
          />
        </div>
      </div>

      {/* ADAC — extreme lower-right corner */}
      <div
        className="fixed z-20 hidden lg:block"
        style={{
          bottom: '90px',
          right: '-16px',
          opacity: wrapperOpacity,
          transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="relative"
          style={{ width: 'clamp(190px, 15vw, 320px)' }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(circle, rgba(255,210,0,0.30) 0%, rgba(255,210,0,0.12) 32%, rgba(255,210,0,0.03) 56%, transparent 75%)',
              filter: 'blur(34px)',
            }}
          />
          <Image
            src={ADAC_SRC}
            alt=""
            width={340}
            height={170}
            unoptimized
            priority={false}
            className="relative h-auto w-full object-contain"
            style={{
              opacity: 0.4,
              filter: logoFilterADAC,
            }}
          />
        </div>
      </div>
    </div>
  );
}
