'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';

export function ResetOverridesTab() {
  const { overrides, hasOverrides, clearAll, resetAllText, resetAllPackages } = useOverrides();
  const [confirmed, setConfirmed] = useState(false);

  const textCount = Object.keys(overrides.text).length;
  const packageCount = Object.keys(overrides.packages).length;
  const pricingCount = Object.keys(overrides.pricing).length;

  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-white/10 bg-navy/40 p-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Current local overrides
        </h3>
        <ul className="mt-3 grid grid-cols-3 gap-3 text-center text-xs text-ice/80">
          <li className="rounded-sm border border-white/10 bg-navy-deep/40 p-3">
            <p className="font-display text-2xl text-white">{textCount}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ice/60">
              Text fields
            </p>
          </li>
          <li className="rounded-sm border border-white/10 bg-navy-deep/40 p-3">
            <p className="font-display text-2xl text-white">{packageCount}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ice/60">
              Package edits
            </p>
          </li>
          <li className="rounded-sm border border-white/10 bg-navy-deep/40 p-3">
            <p className="font-display text-2xl text-white">{pricingCount}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ice/60">
              Pricing prefs
            </p>
          </li>
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={textCount === 0}
            onClick={() => {
              if (window.confirm('Reset all text overrides?')) {
                resetAllText();
              }
            }}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-40"
          >
            Reset all text
          </button>
          <button
            type="button"
            disabled={packageCount === 0}
            onClick={() => {
              if (window.confirm('Reset all package overrides?')) {
                resetAllPackages();
              }
            }}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-40"
          >
            Reset all packages
          </button>
        </div>
      </section>

      <section
        className={`rounded-sm border p-5 ${
          hasOverrides ? 'border-rose-400/40 bg-rose-400/5' : 'border-white/10 bg-navy/40'
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border ${
              hasOverrides
                ? 'border-rose-400/40 bg-rose-400/10 text-rose-200'
                : 'border-white/10 bg-white/5 text-ice/70'
            }`}
          >
            <AlertTriangle size={16} />
          </span>
          <div>
            <p className="font-display text-lg text-white">Clear all overrides</p>
            <p className="mt-1 text-sm text-ice/80">
              This will remove all local edits and restore the published deck. The original
              bundled data is never touched, so this only affects this browser.
            </p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs text-ice/80">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="h-4 w-4 accent-rose-400"
              />
              <span>I understand — clear all local edits.</span>
            </label>
            <div className="mt-3">
              <button
                type="button"
                disabled={!confirmed || !hasOverrides}
                onClick={() => {
                  clearAll();
                  setConfirmed(false);
                }}
                className="rounded-sm border border-rose-400/60 bg-rose-400/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-rose-100 transition-colors hover:bg-rose-400/25 disabled:opacity-40"
              >
                Clear all overrides
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
