'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { ease, staggerTight } from '@/lib/motion';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import type { MarkdownContent } from '@/types/content';

interface StructuredSubtopicProps {
  content: MarkdownContent;
  sectionId: string;
  subId?: string;
}

interface ParsedSection {
  heading: string;
  /** Original heading lowercased + trimmed for matcher logic. */
  key: string;
  /** Raw body lines for the section (markdown). */
  lines: string[];
}

interface ParsedDoc {
  intro: string[];
  sections: ParsedSection[];
}

/** Strip simple emphasis (**bold**, _italic_) for plain display text. */
function stripInline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .trim();
}

/** Extract a leading "**bold lead.**" from a bullet line. */
function splitLead(s: string): { lead?: string; rest: string } {
  const m = s.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (m) return { lead: m[1].trim(), rest: m[2].trim() };
  return { rest: s.trim() };
}

/** Parse a subtopic markdown body into intro + ##-delimited sections. */
function parseStructured(body: string): ParsedDoc {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const intro: string[] = [];
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      current = {
        heading: h[1].trim(),
        key: h[1].trim().toLowerCase(),
        lines: [],
      };
      sections.push(current);
      continue;
    }
    if (current) current.lines.push(line);
    else intro.push(line);
  }

  return { intro, sections };
}

/** Collect contiguous "- " bullet lines into an array of items. */
function extractBullets(lines: string[]): string[] {
  const out: string[] = [];
  for (const ln of lines) {
    const m = ln.match(/^\s*[-*]\s+(.*)$/);
    if (m) out.push(m[1]);
  }
  return out;
}

/** Strip leading/trailing blanks and join paragraph lines into text blocks. */
function paragraphBlocks(lines: string[]): string[] {
  const blocks: string[] = [];
  let buf: string[] = [];
  for (const ln of lines) {
    if (ln.match(/^\s*[-*]\s+/)) continue; // skip bullets here
    if (ln.trim() === '') {
      if (buf.length) {
        blocks.push(buf.join(' ').trim());
        buf = [];
      }
    } else {
      buf.push(ln.trim());
    }
  }
  if (buf.length) blocks.push(buf.join(' ').trim());
  return blocks.filter(Boolean);
}

const KEY_POINTS_ALIASES = new Set([
  'key points',
  'capabilities',
  'what hmc provides',
  'what we provide',
  'how it works',
  'in practice',
  'red flags',
  'metrics we report',
  'what is included',
  "what's included",
  'channels',
  'cadence',
  // Phase 2.4O — §17 Discussion Points restructure. The "HMC suggested
  // position" section in each §17 card is rendered as the bullet/insight
  // card grid (same visual slot as Key points), so the alias maps here.
  'hmc suggested position',
  'hmc position',
  'suggested position',
]);

const ADAC_MEANING_ALIASES = new Set([
  'what this means for adac',
  'what this means for ag holders',
  'operational meaning',
  'for adac',
  'why it matters for adac',
  // Phase 2.4O — §17 Discussion Points: the "What we need ADAC to
  // confirm" section is the partner-facing ask, rendered as the
  // themed callout (same visual slot as "What this means for ADAC").
  'what we need adac to confirm',
  'adac to confirm',
  'confirm',
]);

const CONTEXT_ALIASES = new Set([
  'context',
  'overview',
  'background',
  'the challenge',
  'why it matters',
  // Phase 2.4O — §17 Discussion Points: each card opens with the
  // "Question" section, rendered as the intro paragraph (same visual
  // slot as Context).
  'question',
  'the question',
]);

/**
 * Structured subtopic page. Parses the markdown body into:
 *   - intro paragraph (everything before the first `##` heading,
 *     or the `## Context` section if present)
 *   - 3–5 insight cards (from `## Key points` / similar bullet list)
 *   - an ADAC Meaning callout (from `## What this means for ADAC`)
 *
 * Any extra `##` sections beyond these are appended as small text blocks
 * before the ADAC callout, so authors aren't forced into a strict shape.
 *
 * Activated by `layout: "structured"` in the subtopic frontmatter.
 */
export function StructuredSubtopic({ content, sectionId, subId }: StructuredSubtopicProps) {
  const { frontmatter, body } = content;
  const title = (frontmatter.title as string) ?? `Section ${subId ?? sectionId}`;
  const eyebrow = (frontmatter.eyebrow as string | undefined) ?? `§${subId ?? sectionId}`;
  const subtitle = frontmatter.subtitle as string | undefined;

  const parsed = useMemo(() => parseStructured(body), [body]);

  // Resolve sections by alias.
  const contextSection = parsed.sections.find((s) => CONTEXT_ALIASES.has(s.key));
  const keyPointsSection = parsed.sections.find((s) => KEY_POINTS_ALIASES.has(s.key));
  const adacSection = parsed.sections.find((s) => ADAC_MEANING_ALIASES.has(s.key));

  // Intro: prefer `## Context` body, else whatever appeared before any heading.
  const introParagraphs = contextSection
    ? paragraphBlocks(contextSection.lines)
    : paragraphBlocks(parsed.intro);

  // Cards come from the first matching "key points"-style section.
  const cards = keyPointsSection
    ? extractBullets(keyPointsSection.lines).map(splitLead)
    : [];

  // Anything that isn't intro / key-points / ADAC becomes an extra block.
  const extraSections = parsed.sections.filter(
    (s) =>
      !CONTEXT_ALIASES.has(s.key) &&
      !KEY_POINTS_ALIASES.has(s.key) &&
      !ADAC_MEANING_ALIASES.has(s.key)
  );

  const adacText = adacSection ? paragraphBlocks(adacSection.lines).join(' ') : undefined;

  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <article ref={ref} className="mx-auto w-full max-w-5xl px-6 py-20 md:py-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7, ease: ease.premium }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-3 max-w-3xl text-base text-ice/85 md:text-lg">{subtitle}</p>}
        <div className="gold-rule mt-6 w-20" />
      </motion.header>

      {/* Intro paragraph(s) */}
      {introParagraphs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.15, duration: 0.7, ease: ease.premium }}
          className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-ice/85 md:text-lg"
        >
          {introParagraphs.map((p, i) => (
            <p key={i}>{stripInline(p)}</p>
          ))}
        </motion.div>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <motion.ul
          variants={staggerTight}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: ease.premium },
                },
              }}
              className="group relative overflow-hidden rounded-sm border border-white/10 bg-navy/40 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-gold/40"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-2.5 top-2.5 h-2.5 w-2.5 border-l border-t opacity-70"
                style={{ borderColor: 'var(--theme-accent)' }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2.5 right-2.5 h-2.5 w-2.5 border-b border-r opacity-50"
                style={{ borderColor: 'var(--theme-accent)' }}
              />
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: 'var(--theme-accent)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              {card.lead && (
                <p className="mt-2 font-display text-lg leading-snug text-white">{card.lead}</p>
              )}
              <p className={`text-sm leading-relaxed text-ice/85 ${card.lead ? 'mt-2' : 'mt-2'}`}>
                {stripInline(card.rest)}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Extra ## sections rendered as compact prose blocks */}
      {extraSections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.35, duration: 0.7, ease: ease.premium }}
          className="mt-10 grid gap-6 md:grid-cols-2"
        >
          {extraSections.map((s) => {
            const bullets = extractBullets(s.lines);
            const blocks = paragraphBlocks(s.lines);
            return (
              <div
                key={s.heading}
                className="rounded-sm border border-white/10 bg-navy/30 p-5 backdrop-blur-sm"
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  {s.heading}
                </p>
                {blocks.map((b, i) => (
                  <p key={`b${i}`} className="mt-3 text-sm leading-relaxed text-ice/85">
                    {stripInline(b)}
                  </p>
                ))}
                {bullets.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm text-ice/85">
                    {bullets.map((b, i) => {
                      const { lead, rest } = splitLead(b);
                      return (
                        <li key={i} className="leading-relaxed">
                          {lead && <span className="font-medium text-white">{lead}. </span>}
                          {stripInline(rest)}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </motion.div>
      )}

      {/* ADAC Meaning callout */}
      {adacText && (
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ delay: 0.45, duration: 0.7, ease: ease.premium }}
          className="mt-12 rounded-sm border p-6 backdrop-blur-sm md:p-8"
          style={{
            background: 'var(--theme-badge-bg)',
            borderColor: 'var(--theme-badge-border)',
          }}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border"
              style={{
                borderColor: 'var(--theme-badge-border)',
                color: 'var(--theme-badge-text)',
              }}
            >
              <Sparkles size={14} />
            </span>
            <div className="min-w-0">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.35em]"
                style={{ color: 'var(--theme-badge-text)' }}
              >
                {adacSection?.heading ?? 'What this means for ADAC'}
              </p>
              <p className="mt-2 text-base leading-relaxed text-white md:text-lg">{stripInline(adacText)}</p>
            </div>
          </div>
        </motion.aside>
      )}
    </article>
  );
}
