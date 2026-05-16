'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { ease } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

export interface MapLocation {
  id: string;
  number: number;
  name: string;
  zone: string;
  color: 'teal' | 'navy' | 'gold' | 'ink';
  x: number; // % across map width
  y: number; // % down map height
  services: string[];
  hours: string;
}

export interface MapZone {
  id: string;
  name: string;
  x: number;
  y: number;
  color: 'teal' | 'navy' | 'gold' | 'ink';
}

export interface NetworkMapData {
  regionTitle: string;
  zones: MapZone[];
  locations: MapLocation[];
}

const COLOR: Record<MapLocation['color'], string> = {
  teal: '#0096B4',
  navy: '#2E75B6',
  gold: '#C9A961',
  ink:  '#7A8B9D',
};

interface NetworkMapProps {
  data: NetworkMapData;
  title?: string;
  populationLabel?: string;
  annotation?: string;
}

/**
 * Hand-illustrated Red Sea network map. Stylized SVG coastline draws
 * via stroke-dasharray over 1.5s; 10 numbered pins drop N→S with bounce
 * ease; each pin pulse-glows once on arrival. Clicking a pin opens a
 * side panel slide-in with details.
 */
export function NetworkMap({ data, title, populationLabel, annotation }: NetworkMapProps) {
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });

  // Sort N→S for staggered drop-in.
  const orderedPins = [...data.locations].sort((a, b) => a.y - b.y);

  return (
    <section
      ref={ref}
      className="mx-auto w-full max-w-6xl px-8 py-24"
    >
      {(title || populationLabel) && (
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: ease.premium }}
          className="mb-10 text-center"
        >
          {title && (
            <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
              {title}
            </h2>
          )}
          {populationLabel && (
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink-soft/70">
              {populationLabel}
            </p>
          )}
        </motion.header>
      )}

      <div className="relative">
        {/* Map SVG */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, ease: ease.premium }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-white/10 bg-gradient-to-b from-navy-deep via-navy to-navy-deep"
        >
          <svg
            viewBox="0 0 100 125"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="HMC clinical network across the Red Sea region"
          >
            <defs>
              <linearGradient id="seaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(46, 117, 182, 0.10)" />
                <stop offset="100%" stopColor="rgba(0, 150, 180, 0.20)" />
              </linearGradient>
              <pattern id="waves" x="0" y="0" width="20" height="6" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 3 Q 5 0, 10 3 T 20 3"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.2"
                  fill="none"
                />
              </pattern>
            </defs>

            {/* Sea (right side) */}
            <rect width="100" height="125" fill="url(#seaGradient)" />
            <rect width="100" height="125" fill="url(#waves)" />

            {/* Land mass — hand-drawn-style stylized Red Sea western coastline */}
            <motion.path
              d="
                M 0 0
                L 30 0
                C 28 8, 32 12, 30 16
                C 28 22, 36 26, 34 32
                C 32 38, 40 42, 36 50
                C 32 58, 44 62, 40 68
                C 36 76, 48 80, 44 88
                C 40 98, 50 102, 48 110
                C 46 118, 56 122, 50 125
                L 0 125
                Z
              "
              fill="rgba(15, 30, 45, 0.7)"
              stroke="rgba(201, 169, 97, 0.35)"
              strokeWidth="0.25"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: ease.premium }}
            />

            {/* Zone labels */}
            {data.zones.map((z, i) => (
              <motion.text
                key={z.id}
                x={z.x}
                y={z.y}
                textAnchor="middle"
                fill={COLOR[z.color]}
                fontSize="2.2"
                fontFamily="var(--font-playfair), Georgia, serif"
                fontStyle="italic"
                letterSpacing="0.15em"
                opacity="0.7"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.7 } : { opacity: 0 }}
                transition={{ delay: 1.0 + i * 0.15, duration: 0.6, ease: ease.premium }}
              >
                {z.name.toUpperCase()}
              </motion.text>
            ))}

            {/* Pins (drop-in N→S with bounce, then one-shot pulse) */}
            {orderedPins.map((loc, i) => (
              <motion.g
                key={loc.id}
                initial={{ y: -20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
                transition={{
                  delay: 1.6 + i * 0.12,
                  duration: 0.7,
                  ease: ease.bounce,
                }}
                style={{ cursor: 'pointer', willChange: 'transform' }}
                onClick={() => setSelected(loc)}
              >
                {/* Pulse ring (one-shot on arrival) */}
                <motion.circle
                  cx={loc.x}
                  cy={loc.y}
                  r="2"
                  fill="none"
                  stroke={COLOR[loc.color]}
                  strokeWidth="0.3"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={
                    inView
                      ? { opacity: [0, 0.7, 0], scale: [1, 3, 4] }
                      : { opacity: 0, scale: 1 }
                  }
                  transition={{
                    delay: 1.8 + i * 0.12,
                    duration: 1.2,
                    ease: ease.premium,
                  }}
                  style={{ transformOrigin: `${loc.x}px ${loc.y}px`, transformBox: 'fill-box' }}
                />
                {/* Pin body */}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r="2.2"
                  fill={COLOR[loc.color]}
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="0.25"
                />
                {/* Number label inside pin */}
                <text
                  x={loc.x}
                  y={loc.y + 0.7}
                  textAnchor="middle"
                  fill="#0A1929"
                  fontSize="1.6"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  {loc.number}
                </text>
              </motion.g>
            ))}
          </svg>
        </motion.div>

        {/* Side panel for selected location */}
        {selected && <LocationPanel location={selected} onClose={() => setSelected(null)} />}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.6, duration: 0.7, ease: ease.premium }}
        className="mt-8 grid gap-3 text-sm sm:grid-cols-2 md:grid-cols-4"
      >
        {data.zones.map((z) => {
          const count = data.locations.filter((l) => l.zone === z.name).length;
          if (count === 0) return null;
          return (
            <div
              key={z.id}
              className="flex items-center gap-3 rounded-sm border border-white/10 bg-navy/30 px-4 py-3"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLOR[z.color] }}
              />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/70">{z.name}</p>
                <p className="font-display text-base text-white">
                  {count} {count === 1 ? 'clinic' : 'clinics'}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {annotation && (
        <p className="mt-6 text-center text-sm italic text-gold-soft">{annotation}</p>
      )}
    </section>
  );
}

function LocationPanel({
  location,
  onClose,
}: {
  location: MapLocation;
  onClose: () => void;
}) {
  return (
    <motion.aside
      key={location.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5, ease: ease.premium }}
      className="pointer-events-auto absolute right-4 top-4 z-10 w-72 rounded-sm border border-gold/40 bg-navy-deep/95 p-5 shadow-card-hover backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
            Location {location.number}
          </p>
          <h3 className="mt-1 font-display text-lg text-white">{location.name}</h3>
          <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-ink-soft/70">
            {location.zone}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-ink-soft transition-colors hover:text-gold"
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      </div>
      <div className="gold-rule mt-4 w-12" />
      <dl className="mt-4 space-y-3 text-xs">
        <div>
          <dt className="uppercase tracking-[0.2em] text-ink-soft/70">Services</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5 text-ink-soft">
            {location.services.map((s) => (
              <span
                key={s}
                className="rounded-sm border border-white/10 bg-white/5 px-2 py-0.5 text-[11px]"
              >
                {s}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-[0.2em] text-ink-soft/70">Hours</dt>
          <dd className="mt-1 font-display text-base text-white">{location.hours}</dd>
        </div>
      </dl>
    </motion.aside>
  );
}
