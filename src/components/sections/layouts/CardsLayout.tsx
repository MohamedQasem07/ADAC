'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Ambulance,
  Anchor,
  Bandage,
  Compass,
  Ear,
  ImageIcon,
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
import { EquipmentGalleryModal } from './EquipmentGalleryModal';

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
  /**
   * Optional per-card photo gallery (§2.4 only). When present, the
   * card becomes clickable and opens an EquipmentGalleryModal showing
   * all listed photos. §5.5 (the other consumer of this layout) omits
   * this field and renders the original non-clickable card.
   */
  photos?: string[];
}

interface GalleryImage {
  src: string;
  label: string;
  alt?: string;
}

interface GalleryData {
  caption?: string;
  featured: GalleryImage[];
  thumbnails?: GalleryImage[];
}

interface CardsLayoutData {
  title?: string;
  eyebrow?: string;
  summary?: string;
  items: CardItem[];
  gallery?: GalleryData;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
function asset(src: string): string {
  if (!src) return src;
  if (src.startsWith('http')) return src;
  return `${BASE_PATH}${src}`;
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
  const [activeItem, setActiveItem] = useState<CardItem | null>(null);

  return (
    <section ref={ref} className="mx-auto w-full max-w-6xl px-8 py-24">
      <header className="mx-auto max-w-3xl text-center">
        {data.eyebrow && (
          <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-theme">
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
          const hasPhotos = Array.isArray(item.photos) && item.photos.length > 0;

          // Shared card visuals — keeps the design identical whether
          // the card is a clickable button (with photos) or a static
          // <div> (without).
          const cardClass =
            'group relative flex h-full w-full flex-col overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-theme/50 hover:shadow-card-hover';

          const innerContent = (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-theme/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-theme/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />
              {Icon && (
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-theme/30 bg-theme/10 text-theme">
                  <Icon size={18} />
                </span>
              )}
              <h3 className="mt-4 font-display text-lg leading-snug text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft/85">
                {item.body}
              </p>
              {hasPhotos && (
                <span
                  className="mt-5 inline-flex items-center gap-1.5 self-start rounded-sm border border-theme/30 bg-theme/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-theme transition-colors group-hover:bg-theme/[0.12]"
                  aria-hidden
                >
                  <ImageIcon size={11} />
                  View photos
                </span>
              )}
            </>
          );

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
            >
              {hasPhotos ? (
                <button
                  type="button"
                  className={`${cardClass} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]/55`}
                  onClick={() => setActiveItem(item)}
                  aria-label={`${item.title} — view photos`}
                >
                  {innerContent}
                </button>
              ) : (
                <div className={cardClass}>{innerContent}</div>
              )}
            </motion.li>
          );
        })}
      </motion.ul>

      {data.gallery && <GallerySection gallery={data.gallery} inView={inView} />}

      <EquipmentGalleryModal
        open={activeItem !== null}
        title={activeItem?.title ?? ''}
        description={activeItem?.body}
        photos={activeItem?.photos ?? []}
        onClose={() => setActiveItem(null)}
      />
    </section>
  );
}

function GallerySection({ gallery, inView }: { gallery: GalleryData; inView: boolean }) {
  return (
    <motion.div
      variants={staggerTight}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="mt-20"
    >
      <div className="mb-8 flex items-center gap-4">
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--theme-accent) 50%, transparent)',
          }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-theme">
          Operational evidence
        </span>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--theme-accent) 50%, transparent)',
          }}
        />
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.featured.map((img) => (
          <motion.li
            key={img.src}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease: ease.premium },
              },
            }}
            className="group relative overflow-hidden rounded-sm border border-white/10 bg-navy-deep/40"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={asset(img.src)}
                alt={img.alt ?? img.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 55%, rgba(7,7,11,0.85) 100%)',
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5 pt-2">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: 'var(--theme-accent)' }}
              >
                {img.label}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      {gallery.thumbnails && gallery.thumbnails.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.thumbnails.map((img) => (
            <motion.li
              key={img.src}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: ease.premium },
                },
              }}
              className="group relative overflow-hidden rounded-sm border border-white/10 bg-navy-deep/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={asset(img.src)}
                  alt={img.alt ?? img.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 60%, rgba(7,7,11,0.85) 100%)',
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-1.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ice/85">
                  {img.label}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {gallery.caption && (
        <p className="mt-6 text-center text-xs italic text-ink-soft/75">
          {gallery.caption}
        </p>
      )}
    </motion.div>
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
