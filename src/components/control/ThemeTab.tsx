'use client';

import { Check, Palette } from 'lucide-react';
import { useVisualTheme, type VisualTheme } from '@/context/VisualThemeContext';

interface ThemeOption {
  id: VisualTheme;
  label: string;
  description: string;
  swatchA: string;
  swatchB: string;
  swatchC: string;
}

const OPTIONS: ThemeOption[] = [
  {
    id: 'premium-navy',
    label: 'Premium Navy',
    description:
      'Default. Gold accents on deep navy with ice typography. The safe meeting-ready theme.',
    swatchA: '#0A1929',
    swatchB: '#C9A961',
    swatchC: '#F4F8FC',
  },
  {
    id: 'partnership',
    label: 'HMC × ADAC Partnership',
    description:
      'Optional. Real dual-brand visual mode — HMC blue surfaces and glow + ADAC yellow accents and CTAs.',
    swatchA: '#0F6FE5',
    swatchB: '#FFCC00',
    swatchC: '#54C7E8',
  },
];

/**
 * Control Mode — Theme tab.
 *
 * Two-card chooser for the optional visual theme. Premium Navy is the
 * default and the safe rollback target; partnership is opt-in. The
 * top-right on-screen Visual Theme switcher performs the same toggle
 * without opening this panel.
 */
export function ThemeTab() {
  const { theme, setTheme } = useVisualTheme();

  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-gold/30 bg-gold/[0.04] p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold">
            <Palette size={16} />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
              Visual Theme
            </p>
            <p className="mt-1 font-display text-lg leading-tight text-white">
              Local visual setting only — does not change content or data.
            </p>
            <p className="mt-1 text-xs text-ice/80">
              Theme persists in this browser via localStorage. The
              top-right Visual Theme switcher applies the same change
              from anywhere in the deck.
            </p>
          </div>
        </div>
      </section>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {OPTIONS.map((opt) => {
          const isCurrent = opt.id === theme;
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`group relative flex h-full w-full flex-col overflow-hidden rounded-sm border bg-navy/40 p-5 text-left transition-all duration-300 ${
                  isCurrent
                    ? 'border-gold/60 shadow-card-hover'
                    : 'border-white/10 hover:-translate-y-0.5 hover:border-gold/40'
                }`}
              >
                {isCurrent && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm border border-gold/50 bg-gold/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
                    <Check size={11} />
                    Current
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-7 w-7 rounded-sm border border-white/15"
                    style={{ background: opt.swatchA }}
                    aria-hidden
                  />
                  <span
                    className="inline-block h-7 w-7 rounded-sm border border-white/15"
                    style={{ background: opt.swatchB }}
                    aria-hidden
                  />
                  <span
                    className="inline-block h-7 w-7 rounded-sm border border-white/15"
                    style={{ background: opt.swatchC }}
                    aria-hidden
                  />
                </div>
                <p className="mt-4 font-display text-base font-semibold text-white">
                  {opt.label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ice/85">
                  {opt.description}
                </p>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ice/55">
                  id: {opt.id}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <section className="rounded-sm border border-white/10 bg-navy/40 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
          Manual rollback
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ice/85">
          If anything renders incorrectly under a non-default theme, run
          one of these from the browser console to force the safe theme:
        </p>
        <pre className="mt-3 overflow-auto rounded-sm border border-white/5 bg-navy-deep/60 p-3 font-mono text-[11px] leading-relaxed text-ice/85">
{`localStorage.setItem('hmc-adac-visual-theme-v1', 'premium-navy');
location.reload();`}
        </pre>
      </section>
    </div>
  );
}
