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
 * Phase 2.4K / 2.4K.1 — fixed side brand watermarks.
 *
 * Renders two low-opacity logos vertically centred on the left/right
 * edges of the viewport. HMC on the left with a soft blue/cyan glow,
 * ADAC on the right with a soft ADAC-yellow glow. The pair reads as a
 * "partnership watermark" framing the central content column.
 *
 * Phase 2.4K.1 fix:
 *   The 2.4K version mounted at `z-10`, identical to the
 *   PresentationShell content slot's `z-10`. Sections inside that slot
 *   span the full viewport width with their own backgrounds, so the
 *   watermarks were painted but then obscured. Lifting to `z-20`
 *   places the watermarks ABOVE the content slot but still BELOW the
 *   MenuButton / ThemeSwitcher / Breadcrumb (z-30+) and the Sidebar
 *   (z-40 backdrop + z-50 panel). With `pointer-events: none` they
 *   never intercept clicks, hover, or chart tooltips even though
 *   they sit visually on top.
 *
 * Visibility & layering:
 *   - `position: fixed`, vertically centred via top:50% + translateY(-50%)
 *   - `z-20` — above content (z-10) and ambient background (z-0),
 *     below the sidebar (z-50), breadcrumb / menu button / theme
 *     switcher (z-30+), and any modal overlays.
 *   - `pointer-events: none` + `select-none`
 *   - Hidden below `lg` (1024 px). Shown on desktop + projector.
 *   - Welcome cover (`/` and `/section/1`) — hidden entirely
 *     (PartnershipLockup already shows both logos centred there).
 *   - Control Mode (`/control` + `/control/*`) — hidden.
 *   - Sidebar open — opacity drops dramatically so the watermarks
 *     don't compete with the frosted sidebar surface.
 *
 * Opacity / size values were tuned in 2.4K.1 for clear visibility at
 * 75–100% browser zoom on a 1366–1920 px projector without
 * overpowering the centre content.
 */
export function SideBrandWatermarks({ sidebarOpen }: SideBrandWatermarksProps) {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);

  // Hide entirely on the cover and on Control Mode.
  const isCover = (route.sectionId === '1' && !route.subId) || pathname === '/';
  const isControl = pathname.startsWith('/control');
  if (isCover || isControl) return null;

  // 2.4K.1: bumped from 0.18 → 0.30 so the ghost logos are
  // clearly noticeable but still recede behind the content.
  const baseOpacity = 0.3;
  const dimmedOpacity = 0.07;
  const opacity = sidebarOpen ? dimmedOpacity : baseOpacity;

  return (
    <div aria-hidden className="pointer-events-none select-none">
      {/* Left — HMC */}
      <div
        className="fixed left-6 top-1/2 z-20 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:left-10 2xl:left-12"
        style={{ opacity }}
      >
        <div className="relative" style={{ width: 'clamp(120px, 10vw, 220px)' }}>
          {/* Glow halo behind the logo — HMC blue/cyan. Positioned
              absolutely behind the image via DOM order; no negative
              z-index needed (was a 2.4K bug). */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(31,111,229,0.32) 0%, rgba(31,111,229,0.16) 40%, transparent 72%)',
              filter: 'blur(22px)',
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
              filter: 'drop-shadow(0 0 22px rgba(31,111,229,0.22)) saturate(0.85)',
            }}
          />
        </div>
      </div>

      {/* Right — ADAC */}
      <div
        className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:right-10 2xl:right-12"
        style={{ opacity }}
      >
        <div className="relative" style={{ width: 'clamp(120px, 10vw, 220px)' }}>
          {/* Glow halo — ADAC gold/yellow. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,210,0,0.30) 0%, rgba(255,210,0,0.14) 40%, transparent 72%)',
              filter: 'blur(22px)',
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
              filter: 'drop-shadow(0 0 22px rgba(255,210,0,0.24)) saturate(0.85)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
