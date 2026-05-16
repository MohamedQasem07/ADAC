'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { fallbackADACData } from '@/data/fallback';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChartFrame } from './ChartFrame';

/**
 * §3.8 — ADAC Market Share Hero.
 *
 * Big "20.37%" hero stat. CountUp from 0 over 1.5s. Gold glow pulses
 * once on arrival. Supporting cards: 156 of 766 · Rank #1 · 1 in 5.
 *
 * NO competitor names appear here, ever (per user instruction).
 */
export function MarketShareHero() {
  const ms = fallbackADACData.marketShare;
  const pct = Number(ms.adacShare.replace('%', ''));
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });

  const supportingCards = [
    {
      value: `${ms.adacCases} of ${ms.totalInsuredGermanCases}`,
      label: 'ADAC cases of all insured German',
    },
    { value: 'Rank #1', label: 'among German insurance partners' },
    { value: '1 in every 5', label: 'insured German patients' },
  ];

  return (
    <ChartFrame
      subId="3.8"
      eyebrow="§3.8"
      title="ADAC Market Share of Insured German Cases"
      populationLabel="n=766 insured German cases · 2024–2025"
    >
      <div ref={ref} className="flex flex-col items-center gap-12">
        {/* Hero number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 1, ease: ease.premium }}
          className="relative flex flex-col items-center"
        >
          <p
            className="font-display font-semibold leading-none tracking-tight text-gold md:text-[10rem] lg:text-[12rem]"
            style={{
              fontSize: 'clamp(5rem, 14vw, 12rem)',
              filter: inView ? 'drop-shadow(0 0 32px rgba(201,169,97,0.35))' : 'none',
              transition: 'filter 1.2s ease',
            }}
          >
            {inView ? (
              <CountUp
                end={pct}
                duration={1.6}
                decimals={2}
                suffix="%"
                preserveValue
                useEasing
              />
            ) : (
              '0%'
            )}
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 1.0, duration: 1.0, ease: ease.premium }}
            style={{ transformOrigin: 'left center' }}
            className="gold-rule mt-4 w-40"
          />
          <p className="mt-6 max-w-xl text-center text-base text-ink-soft md:text-lg">
            of insured German cases at HMC come through ADAC.
          </p>
        </motion.div>

        {/* Supporting trio */}
        <motion.div
          variants={staggerTight}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delayChildren: 1.4 }}
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-3"
        >
          {supportingCards.map((c) => (
            <motion.div
              key={c.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: ease.premium },
                },
              }}
              className="rounded-sm border border-white/10 bg-navy/30 p-5 text-center backdrop-blur-sm"
            >
              <p className="font-display text-xl text-white">{c.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ink-soft/70">
                {c.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <p className="max-w-2xl text-center text-sm italic text-gold-soft">
          {ms.phrasing}
        </p>
      </div>
    </ChartFrame>
  );
}
