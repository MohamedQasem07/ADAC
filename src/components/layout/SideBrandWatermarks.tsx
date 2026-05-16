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
 * Phase 2.4K.2 — repositioned and strengthened side brand watermarks.
 *
 * Layout:
 *   - HMC sits in the UPPER-LEFT empty area (top ≈ 28% of viewport).
 *     The upper-third placement reads as a header watermark, balancing
 *     the centred content column without crowding it.
 *   - ADAC sits in the LOWER-RIGHT empty area (top ≈ 65%). It anchors
 *     inside the warm gold light zone of the ambient background rather
 *     than floating mid-page.
 *
 * Ghost / frost treatment (stronger than 2.4K.1):
 *   - Larger halo (180% of logo box, blur 32 px) — radial gradient
 *     reaches outward so the logo feels embedded in atmosphere.
 *   - Combined CSS filter on the image: blur(0.2px) + saturate(0.75)
 *     + brightness(1.1) + drop-shadow glow. The micro-blur softens
 *     edges so the logo never reads "sharp PNG", and the saturate
 *     desaturation keeps it from competing with chart colours.
 *   - Wrapper opacity: 0.32 default, 0.07 when sidebar is open.
 *
 * Layering & interaction safety:
 *   - `position: fixed`, `z-20` — above content slot (z-10) and ambient
 *     (z-0), below MenuButton / ThemeSwitcher / Breadcrumb (z-30+) and
 *     the Sidebar (z-40 backdrop + z-50 panel).
 *   - `pointer-events: none` + `select-none`.
 *   - `hidden lg:block` — desktop / projector only.
 *
 * Routes hidden:
 *   - `/` and `/section/1` (Welcome cover already shows both logos
 *     centred via PartnershipLockup)
 *   - `/control` and `/control/*` (presenter editor view stays clean)
 *
 * Sidebar interaction: when sidebarOpen=true, opacity drops to 0.07
 * so the watermarks recede entirely behind the sidebar's frosted
 * panel (z-50). The sidebar always paints above them regardless.
 */
export function SideBrandWatermarks({ sidebarOpen }: SideBrandWatermarksProps) {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);

  // Hide entirely on the cover and on Control Mode.
  const isCover = (route.sectionId === '1' && !route.subId) || pathname === '/';
  const isControl = pathname.startsWith('/control');
  if (isCover || isControl) return null;

  const baseOpacity = 0.32;
  const dimmedOpacity = 0.07;
  const opacity = sidebarOpen ? dimmedOpacity : baseOpacity;

  // CSS filter applied to each logo image. The micro-blur is what gives
  // the "ghosted into the background" quality — too sharp would feel
  // like a plain logo overlay. Saturate dampens any colour cast in the
  // PNG; brightness lifts it slightly so it doesn't disappear into the
  // dark navy backdrop after the desaturation.
  const imageFilterHMC =
    'blur(0.3px) saturate(0.7) brightness(1.1) drop-shadow(0 0 26px rgba(31,111,229,0.32))';
  const imageFilterADAC =
    'blur(0.3px) saturate(0.7) brightness(1.1) drop-shadow(0 0 26px rgba(255,210,0,0.34))';

  return (
    <div aria-hidden className="pointer-events-none select-none">
      {/* HMC — upper-left */}
      <div
        className="fixed left-7 z-20 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:left-12 2xl:left-16"
        style={{ top: '28%', opacity }}
      >
        <div
          className="relative"
          style={{ width: 'clamp(150px, 12vw, 250px)' }}
        >
          {/* HMC blue/cyan halo — wider + softer than the logo */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(31,111,229,0.36) 0%, rgba(31,111,229,0.18) 38%, rgba(31,111,229,0.06) 60%, transparent 78%)',
              filter: 'blur(32px)',
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
            style={{ filter: imageFilterHMC }}
          />
        </div>
      </div>

      {/* ADAC — lower-right (anchored in the warm light zone) */}
      <div
        className="fixed right-7 z-20 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:right-12 2xl:right-16"
        style={{ top: '65%', opacity }}
      >
        <div
          className="relative"
          style={{ width: 'clamp(140px, 11vw, 240px)' }}
        >
          {/* ADAC gold/yellow halo — wider warm glow */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,210,0,0.34) 0%, rgba(255,210,0,0.18) 38%, rgba(255,210,0,0.06) 60%, transparent 78%)',
              filter: 'blur(32px)',
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
            style={{ filter: imageFilterADAC }}
          />
        </div>
      </div>
    </div>
  );
}
