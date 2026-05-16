'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Stethoscope, Truck } from 'lucide-react';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

interface Zone {
  id: string;
  name: string;
  /** Vertical position % from top of the strip. */
  y: number;
  caption: string;
}

const ZONES: Zone[] = [
  { id: 'safaga', name: 'Safaga · Soma Bay', y: 12, caption: 'Northern resort cluster' },
  { id: 'hurghada', name: 'Hurghada', y: 36, caption: 'Six clinics across the corridor' },
  { id: 'sahl', name: 'Sahl Hasheesh', y: 60, caption: 'Three on-zone clinics' },
  { id: 'marsa', name: 'Marsa Alam', y: 86, caption: 'Extended coverage via transport' },
];

const MODES = [
  {
    icon: <Stethoscope size={16} />,
    title: 'Clinic Visit',
    body: 'Traveler attends one of the 10 HMC locations.',
  },
  {
    icon: <Building2 size={16} />,
    title: 'Hotel Room Visit',
    body: 'Physician and nurse arrive with portable equipment.',
  },
  {
    icon: <Truck size={16} />,
    title: 'Mobile Clinic Unit',
    body: 'Deployed to hotel gates for extended observation.',
  },
];

/**
 * Stylized vertical Red Sea coverage strip for the Executive Data Room.
 * Four zone dots with soft pulsing rings; three service-mode cards on
 * the right; a "Open full network map →" link to the detailed §2.2 map.
 *
 * Intentionally compact and elegant — the full pin-by-pin network map
 * with side-panel details lives at /section/2/2.2 and is preserved.
 */
export function DataRoomCoverage() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">
      {/* Coverage strip */}
      <div className="relative mx-auto h-[280px] w-[140px] sm:w-[160px] md:w-full md:max-w-[180px]">
        {/* Coastline */}
        <svg
          viewBox="0 0 60 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="dr-sea" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(46,117,182,0.05)" />
              <stop offset="100%" stopColor="rgba(0,150,180,0.18)" />
            </linearGradient>
          </defs>
          {/* Sea (right portion) */}
          <rect x="22" y="0" width="38" height="100" fill="url(#dr-sea)" />
          {/* Land (left) — stylized coastline */}
          <motion.path
            d="
              M 0 0
              L 22 0
              C 20 12, 28 22, 24 32
              C 20 42, 30 52, 26 62
              C 22 74, 32 82, 26 92
              C 24 98, 30 99, 22 100
              L 0 100 Z
            "
            fill="rgba(15,30,45,0.7)"
            stroke="rgba(var(--theme-accent-rgb),0.4)"
            strokeWidth="0.35"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.4, ease: ease.premium }}
          />
        </svg>

        {/* Zone dots */}
        {ZONES.map((z, i) => (
          <motion.div
            key={z.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease: ease.premium }}
            className="absolute"
            style={{ left: '36%', top: `${z.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Pulsing ring */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-block h-3 w-3 rounded-full opacity-60 animate-[pulseRing_2.4s_ease-out_infinite]"
              style={{
                boxShadow: '0 0 0 0 rgba(var(--theme-accent-rgb),0.55)',
                background: 'transparent',
              }}
            />
            {/* Dot */}
            <span
              className="relative inline-block h-2.5 w-2.5 rounded-full"
              style={{
                background: 'var(--theme-accent)',
                boxShadow: '0 0 6px rgba(var(--theme-accent-rgb),0.6)',
              }}
            />
            {/* Label */}
            <p
              className="absolute left-[200%] top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-xs text-white"
              style={{ textShadow: '0 1px 3px rgba(10,25,41,0.85)' }}
            >
              {z.name}
              <span className="block text-[10px] font-normal uppercase tracking-[0.18em] text-ice/70">
                {z.caption}
              </span>
            </p>
          </motion.div>
        ))}

        <style jsx>{`
          @keyframes pulseRing {
            0% {
              box-shadow: 0 0 0 0 rgba(var(--theme-accent-rgb), 0.55);
              opacity: 0.7;
            }
            70% {
              box-shadow: 0 0 0 14px rgba(var(--theme-accent-rgb), 0);
              opacity: 0;
            }
            100% {
              box-shadow: 0 0 0 0 rgba(var(--theme-accent-rgb), 0);
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* Mode legend + link */}
      <div className="space-y-4">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MODES.map((m, i) => (
            <motion.li
              key={m.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.55, ease: ease.premium }}
              className="rounded-sm border border-white/10 bg-navy/40 p-4"
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border"
                style={{
                  borderColor:
                    'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
                  background:
                    'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
                  color: 'var(--theme-accent)',
                }}
              >
                {m.icon}
              </span>
              <p className="mt-3 font-display text-sm text-white">{m.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ice/80">{m.body}</p>
            </motion.li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-ice/80">
          Hotel pickup and mobile medical support available across the Red Sea resort corridor.
          Target response times set by zone and confirmed during operational setup.
        </p>
        <Link
          href="/section/2/2.2"
          className="group inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] uppercase tracking-[0.25em] transition-colors"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)',
            background: 'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
            color: 'var(--theme-accent)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'color-mix(in srgb, var(--theme-accent) 20%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'color-mix(in srgb, var(--theme-accent) 10%, transparent)';
          }}
        >
          Open full network map
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
