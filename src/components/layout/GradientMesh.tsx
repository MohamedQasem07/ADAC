'use client';

/**
 * Slow-rotating conic gradient for hero sections. Sits behind hero
 * content at low opacity to create subtle depth — never distracting.
 *
 * Per the cinematic spec:
 *   - 60 s rotation cycle (`animate-rotate-mesh` Tailwind keyframe)
 *   - Navy → teal blend
 *   - ~8% effective opacity
 */
export function GradientMesh() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 animate-rotate-mesh"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(27,58,92,0.45) 0deg, rgba(0,150,180,0.35) 90deg, rgba(10,25,41,0) 180deg, rgba(201,169,97,0.2) 270deg, rgba(27,58,92,0.45) 360deg)',
          opacity: 0.08,
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}
