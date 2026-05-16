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
 *   - "hero"     → GradientMesh + ParticleField (cinematic opener/closer)
 *   - "dashboard"→ ParticleField (low density), GradientMesh subtle
 *   - "editorial"→ NoiseOverlay (paper texture on light backgrounds)
 *   - "flow"     → NoiseOverlay
 *   - "mixed"    → ParticleField (medium density)
 *
 * Lives behind everything (z-0). All content sits on top of the body's
 * navy-deep bg, so the ambient layer is only visible where content lets it.
 */
export function AmbientBackground() {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);
  const section = getAllSectionsClient().find((s) => s.id === route.sectionId);
  const type = section?.type ?? 'mixed';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {(type === 'hero' || type === 'dashboard' || type === 'mixed' || type === 'data-room') && (
        <ParticleField
          density={
            type === 'hero'
              ? 50
              : type === 'dashboard'
                ? 30
                : type === 'data-room'
                  ? 24
                  : 35
          }
        />
      )}
      {type === 'hero' && <GradientMesh />}
      {(type === 'editorial' || type === 'flow') && <NoiseOverlay />}
    </div>
  );
}
