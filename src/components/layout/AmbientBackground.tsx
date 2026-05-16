'use client';

import { usePathname } from 'next/navigation';
import { getAllSectionsClient, parsePathname } from '@/lib/nav-config';
import { GradientMesh } from './GradientMesh';
import { NoiseOverlay } from './NoiseOverlay';
import { ParticleField } from './ParticleField';

/**
 * Renders the ambient background appropriate for the active section's
 * `type` field in sections.json:
 *
 *   - §1 cover     → WelcomeAmbient (radial gold glow + partnership
 *                    beam + softened GradientMesh; NO particle field)
 *   - "hero"       → GradientMesh + ParticleField (closing slide §18)
 *   - "dashboard"  → ParticleField (low density), GradientMesh subtle
 *   - "editorial"  → NoiseOverlay (paper texture on light backgrounds)
 *   - "flow"       → NoiseOverlay
 *   - "mixed"      → ParticleField (medium density)
 *   - "data-room"  → ParticleField (low density)
 *
 * Lives behind everything (z-0). All content sits on top of the body's
 * navy-deep bg, so the ambient layer is only visible where content lets it.
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
      {/* §1 cover gets its own welcome ambient — no star particles. */}
      {isWelcome && <WelcomeAmbient />}

      {/* Closing (§18) — type "hero" — keeps its cinematic ambient. */}
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
 * Premium ambient for the Welcome / Cover screen.
 *
 *   1. Large soft radial gold glow centred behind the logo lockup
 *   2. Softer secondary glow nearer the bottom for depth
 *   3. Thin diagonal gold hairline (the "partnership beam")
 *   4. GradientMesh kept at ~55% so it adds richness without distraction
 *
 * Pure CSS gradients + one SVG line — no JS, no extra dependencies.
 */
function WelcomeAmbient() {
  return (
    <>
      {/* Primary radial gold glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 48% at 50% 40%, rgba(201,169,97,0.22) 0%, rgba(201,169,97,0.10) 28%, rgba(201,169,97,0.03) 55%, transparent 75%)',
        }}
      />
      {/* Secondary low glow for depth */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 80%, rgba(46,117,182,0.10) 0%, transparent 60%)',
        }}
      />
      {/* Partnership diagonal beam — a single hairline at low opacity */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="welcome-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(201,169,97,0)" />
            <stop offset="45%" stopColor="rgba(201,169,97,0.18)" />
            <stop offset="55%" stopColor="rgba(201,169,97,0.18)" />
            <stop offset="100%" stopColor="rgba(201,169,97,0)" />
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
