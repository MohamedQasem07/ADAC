'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Compass, Globe2, Info, MessageSquare, Target } from 'lucide-react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';

/**
 * §14.5 — Next Meeting · ARC Europe.
 *
 * Strategy-style slide with a HMC → ADAC pilot → ARC Europe partnership
 * header followed by five intent-cards. Language is deliberately
 * cautious: aims to / would like to / explore / proposed / exploratory.
 *
 * No claim of ARC Europe approval, formal partnership, or guaranteed
 * rollout is made.
 *
 * Visual style matches the rest of §14 roadmap cards (dark surface,
 * theme-accent eyebrow, corner-chrome detail). Logos are loaded from
 * /public via the NEXT_PUBLIC_BASE_PATH-aware `asset()` helper so they
 * resolve under both `npm run dev` and the GitHub Pages basePath
 * `/ADAC`.
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
function asset(src: string): string {
  return `${BASE_PATH}${src}`;
}

interface Card {
  eyebrow: string;
  title: string;
  body?: string;
  bullets?: string[];
  icon: typeof Compass;
  accent?: boolean;
}

const CARDS: Card[] = [
  {
    eyebrow: 'Card 1',
    title: 'Strategic next step',
    icon: Compass,
    body:
      'HMC aims to arrange a follow-up meeting in June with ARC Europe at their headquarters to present the Red Sea outpatient package framework as a documented pilot concept.',
  },
  {
    eyebrow: 'Card 2',
    title: 'Why ARC Europe matters',
    icon: Globe2,
    body:
      'ARC Europe is a pan-European mobility and assistance network associated with major European automobile clubs and assistance partners. This makes it a relevant strategic discussion point after the ADAC outpatient pilot.',
  },
  {
    eyebrow: 'Card 3',
    title: 'What HMC would like to discuss',
    icon: MessageSquare,
    bullets: [
      'Introduce the Red Sea outpatient package model',
      'Discuss pilot governance and documentation',
      'Explore relevance for other mobility / assistance partners',
      'Define a scalable cooperation pathway after the ADAC pilot',
    ],
  },
  {
    eyebrow: 'Card 4',
    title: 'Desired outcome',
    icon: Target,
    body:
      'A constructive exploratory discussion on whether the outpatient package model can serve as a reference architecture for wider European partner conversations.',
  },
  {
    eyebrow: 'Card 5',
    title: 'Important note',
    icon: Info,
    body:
      'This is a proposed exploratory follow-up opportunity only. No formal approval, partnership, or rollout is implied at this stage.',
    accent: true,
  },
];

export function ArcEuropeSlide() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  return (
    <section ref={ref} className="mx-auto w-full max-w-6xl px-8 py-24">
      {/* Eyebrow + Title */}
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7, ease: ease.premium }}
        className="mx-auto max-w-3xl text-center"
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.5em]"
          style={{ color: 'var(--theme-accent)' }}
        >
          §14.5 · Strategic follow-up
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          Next Meeting · <span className="italic">ARC Europe</span>
        </h1>
        <p className="mt-4 text-base text-ink-soft md:text-lg">
          A documented ADAC outpatient pilot becomes the natural conversation
          starter for the broader European assistance ecosystem.
        </p>
        <div className="gold-rule mx-auto mt-8 w-24" />
      </motion.header>

      {/* Partnership header: HMC → ADAC pilot → ARC Europe */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 0.85, delay: 0.15, ease: ease.premium }}
        className="relative mx-auto mt-14 flex max-w-4xl items-center justify-between gap-6 rounded-sm border border-white/10 bg-navy-deep/40 px-6 py-8 backdrop-blur-sm md:px-10 md:py-10"
      >
        {/* HMC */}
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="flex h-16 w-32 items-center justify-center md:h-20 md:w-40">
            <img
              src={asset('/brand/hmc-logo-white.png')}
              alt="HMC — Hurghada Medical Center"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ice/65">
            Hurghada Medical Center
          </p>
        </div>

        {/* Arrow + ADAC pilot label */}
        <div className="flex flex-1 flex-col items-center text-center">
          <ArrowRight
            size={28}
            className="opacity-70"
            style={{ color: 'var(--theme-accent)' }}
          />
          <p
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            ADAC pilot
          </p>
          <p className="mt-1 text-[10px] italic text-ink-soft/70">
            documented · governed
          </p>
        </div>

        {/* Arrow + follow-up label */}
        <div className="hidden flex-1 flex-col items-center text-center md:flex">
          <ArrowRight
            size={28}
            className="opacity-70"
            style={{ color: 'var(--theme-accent)' }}
          />
          <p
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'var(--theme-accent)' }}
          >
            Follow-up opportunity
          </p>
          <p className="mt-1 text-[10px] italic text-ink-soft/70">
            June · exploratory
          </p>
        </div>

        {/* ARC Europe */}
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="flex h-16 w-32 items-center justify-center md:h-20 md:w-40">
            <img
              src={asset('/brand/arc-europe.png')}
              alt="ARC Europe"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ice/65">
            ARC Europe
          </p>
        </div>
      </motion.div>

      {/* 5 strategy cards */}
      <motion.ul
        variants={staggerTight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {CARDS.map((c) => {
          const Icon = c.icon;
          const isAccent = !!c.accent;
          return (
            <motion.li
              key={c.title}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: ease.premium },
                },
              }}
              className={`group relative flex h-full flex-col overflow-hidden rounded-sm border bg-navy/40 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
                isAccent
                  ? 'md:col-span-2'
                  : ''
              } ${
                isAccent
                  ? 'border-theme/45 hover:border-theme/65 hover:shadow-card-hover'
                  : 'border-white/10 hover:border-theme/50 hover:shadow-card-hover'
              }`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-theme/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-theme/40 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-theme/30 bg-theme/10 text-theme">
                  <Icon size={18} />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ice/55">
                  {c.eyebrow}
                </p>
              </div>

              <h3 className="mt-4 font-display text-xl leading-tight text-white">
                {c.title}
              </h3>

              {c.body && (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft/90">
                  {c.body}
                </p>
              )}

              {c.bullets && (
                <ul className="mt-4 space-y-2.5 text-sm text-ink-soft/90">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full"
                        style={{ background: 'var(--theme-accent)' }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          );
        })}
      </motion.ul>

      <p className="mt-12 text-center text-xs italic text-ink-soft/65">
        Cautious framing: aims to · would like to explore · proposed · exploratory.
      </p>
    </section>
  );
}
