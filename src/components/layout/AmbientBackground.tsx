'use client';

import { usePathname } from 'next/navigation';
import { getAllSectionsClient, parsePathname } from '@/lib/nav-config';
import { GradientMesh } from './GradientMesh';
import { NoiseOverlay } from './NoiseOverlay';
import { ParticleField } from './ParticleField';

/**
 * Renders the ambient background appropriate for the active section's
 * `type` field in sections.json. Theme-aware (Phase 2.4E.2) — the
 * welcome glow uses --theme-accent-rgb so it shifts from gold (Premium
 * Navy) to ADAC yellow / HMC blue (Partnership) without re-rendering.
 */
export function AmbientBackground() {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);
  const section = getAllSectionsClient().find((s) => s.id === route.sectionId);
  const type = section?.type ?? 'mixed';
  const isWelcome = route.sectionId === '1' && !route.subId;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {isWelcome && <WelcomeAmbient />}

      {!isWelcome && type === 'hero' && (
        <>
          <ParticleField density={50} />
          <GradientMesh />
        </>
      )}

      {!isWelcome &&
        (type === 'dashboard' || type === 'mixed' || type === 'data-room') && (
          <ParticleField
            density={
              type === 'dashboard' ? 30 : type === 'data-room' ? 24 : 35
            }
          />
        )}

      {!isWelcome && (type === 'editorial' || type === 'flow') && <NoiseOverlay />}
    </div>
  );
}

/**
 * Welcome / Cover ambient. Theme-aware:
 *   - Premium Navy: large gold radial glow + soft blue low glow + thin
 *     gold partnership beam (current look, unchanged).
 *   - Partnership: HMC blue radial glow (top-left) + ADAC yellow
 *     radial glow (bottom-right) + dual-brand beam.
 *
 * Implemented via --theme-accent-rgb on Premium Navy and a separate
 * data-theme branch for Partnership so the two themes feel
 * meaningfully different rather than the same gradient recoloured.
 */
function WelcomeAmbient() {
  return (
    <>
      {/* Primary radial glow — gold (default) / theme-accent. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 48% at 50% 40%, rgba(var(--theme-accent-rgb),0.22) 0%, rgba(var(--theme-accent-rgb),0.10) 28%, rgba(var(--theme-accent-rgb),0.03) 55%, transparent 75%)',
        }}
      />
      {/* Secondary low glow for depth — uses HMC blue accent so it
          reads "partnership" in both themes (blue is the HMC brand
          token regardless of which theme is active). */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 80%, rgba(31,111,229,0.10) 0%, transparent 60%)',
        }}
      />
      {/* Partnership diagonal beam — theme-aware accent-RGB. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="welcome-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(var(--theme-accent-rgb),0)" />
            <stop offset="45%" stopColor="rgba(var(--theme-accent-rgb),0.18)" />
            <stop offset="55%" stopColor="rgba(var(--theme-accent-rgb),0.18)" />
            <stop offset="100%" stopColor="rgba(var(--theme-accent-rgb),0)" />
          </linearGradient>
        </defs>
        <line
          x1="-5"
          y1="62"
          x2="105"
          y2="38"
          stroke="url(#welcome-beam)"
          strokeWidth="0.18"
        />
      </svg>
      {/* Gradient mesh, dimmed */}
      <div className="absolute inset-0 opacity-55">
        <GradientMesh />
      </div>
    </>
  );
}
