'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Ambulance,
  Anchor,
  Bandage,
  Compass,
  Ear,
  MapPin,
  Sailboat,
  Stethoscope,
  Syringe,
  TestTube,
  Truck,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Ambulance,
  Anchor,
  Bandage,
  Compass,
  Ear,
  MapPin,
  Sailboat,
  Stethoscope,
  Syringe,
  TestTube,
  Truck,
  Wind,
  Zap,
};

interface CardItem {
  icon?: string;
  title: string;
  body: string;
}

interface CardsLayoutData {
  title?: string;
  eyebrow?: string;
  summary?: string;
  items: CardItem[];
}

/**
 * Renders a JSON-backed card grid. Each card has an optional Lucide icon
 * name (e.g. "Stethoscope"), a title, and a one-paragraph body.
 *
 * Used for subtopics whose renderer is "cards":
 *   - §2.4 Equipment
 *   - §5.5 Response Time
 */
export function CardsLayout({ data }: { data: CardsLayoutData }) {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref} className="mx-auto w-full max-w-6xl px-8 py-24">
      <header className="mx-auto max-w-3xl text-center">
        {data.eyebrow && (
          <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-gold">
            {data.eyebrow}
          </p>
        )}
        {data.title && (
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            {data.title}
          </h1>
        )}
        {data.summary && (
          <p className="mt-4 text-base text-ink-soft md:text-lg">{data.summary}</p>
        )}
        <div className="gold-rule mx-auto mt-8 w-24" />
      </header>

      <motion.ul
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {data.items.map((item) => {
          const Icon = pickLucideIcon(item.icon);
          return (
            <motion.li
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: ease.premium },
                },
              }}
              className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />
              {Icon && (
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-gold/30 bg-gold/10 text-gold">
                  <Icon size={18} />
                </span>
              )}
              <h3 className="mt-4 font-display text-lg leading-snug text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft/85">
                {item.body}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}

/**
 * Resolve an icon name like "Stethoscope" to the Lucide component.
 * Returns null if the name is not in the allow-list. We use an explicit
 * map (not a wildcard import) so tree-shaking keeps the bundle small.
 */
function pickLucideIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null;
  return ICON_MAP[name] ?? null;
}
