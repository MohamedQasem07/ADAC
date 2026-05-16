'use client';

import { useMemo, useState } from 'react';
import { fallbackPackagesData } from '@/data/fallback';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { usePricing } from '@/context/PricingContext';
import { computeScenarioC } from '@/lib/pricing';
import type { Package, PackageCategory, PricingScenario } from '@/types/content';

const SCENARIO_LABELS: Record<PricingScenario, string> = {
  A: 'A · To be agreed',
  B: 'B · Standard',
  C: 'C · Premium',
};

export function PricingOverridesTab() {
  const { overrides, setPackageOverride, setDefaultScenario } = useOverrides();
  const { scenario, setScenario } = usePricing();

  const allPackages = fallbackPackagesData.packages as Package[];
  const categories = fallbackPackagesData.categories as PackageCategory[];

  const summary = useMemo(() => {
    return categories.map((cat) => {
      const catPkgs = allPackages.filter((p) => p.category === cat.id);
      const visible = catPkgs.filter((p) => {
        const o = overrides.packages[p.code];
        if (o?.enabled === false) return false;
        if (o?.status === 'Removed') return false;
        return true;
      });
      const effPrices = visible.map((p) => {
        const o = overrides.packages[p.code];
        const b = typeof o?.prices?.B === 'number' ? (o.prices.B as number) : Number(o?.prices?.B) || p.prices.B;
        const c = typeof o?.prices?.C === 'number' ? (o.prices.C as number) : Number(o?.prices?.C) || p.prices.C;
        return { b, c };
      });
      const minB = effPrices.length ? Math.min(...effPrices.map((p) => p.b)) : 0;
      const maxB = effPrices.length ? Math.max(...effPrices.map((p) => p.b)) : 0;
      const minC = effPrices.length ? Math.min(...effPrices.map((p) => p.c)) : 0;
      const maxC = effPrices.length ? Math.max(...effPrices.map((p) => p.c)) : 0;
      return {
        cat,
        active: visible.length,
        total: catPkgs.length,
        minB,
        maxB,
        minC,
        maxC,
      };
    });
  }, [overrides.packages, allPackages, categories]);

  const totalActive = summary.reduce((acc, s) => acc + s.active, 0);
  const totalAll = summary.reduce((acc, s) => acc + s.total, 0);

  // Bulk multiplier state
  const [multCat, setMultCat] = useState<number | 'all'>('all');
  const [multFactor, setMultFactor] = useState('1.8');
  const [multPreview, setMultPreview] = useState<
    { code: string; b: number; nextC: number }[] | null
  >(null);

  // Bulk percent state
  const [pctCat, setPctCat] = useState<number | 'all'>('all');
  const [pctValue, setPctValue] = useState('5');
  const [pctTier, setPctTier] = useState<'B' | 'C'>('B');
  const [pctPreview, setPctPreview] = useState<
    { code: string; current: number; next: number }[] | null
  >(null);

  const previewMultiplier = () => {
    const factor = Number(multFactor);
    if (!Number.isFinite(factor) || factor <= 0) return;
    const targets = allPackages.filter((p) => (multCat === 'all' ? true : p.category === multCat));
    const preview = targets.map((p) => {
      const b =
        typeof overrides.packages[p.code]?.prices?.B === 'number'
          ? (overrides.packages[p.code]!.prices!.B as number)
          : p.prices.B;
      return { code: p.code, b, nextC: Math.round((b * factor) / 10) * 10 };
    });
    setMultPreview(preview);
  };

  const applyMultiplier = () => {
    if (!multPreview) return;
    for (const row of multPreview) {
      setPackageOverride(row.code, { prices: { C: row.nextC } });
    }
    setMultPreview(null);
  };

  const previewPercent = () => {
    const pct = Number(pctValue);
    if (!Number.isFinite(pct)) return;
    const targets = allPackages.filter((p) => (pctCat === 'all' ? true : p.category === pctCat));
    const preview = targets.map((p) => {
      const o = overrides.packages[p.code];
      const current =
        pctTier === 'B'
          ? typeof o?.prices?.B === 'number'
            ? (o.prices.B as number)
            : p.prices.B
          : typeof o?.prices?.C === 'number'
            ? (o.prices.C as number)
            : p.prices.C;
      const next = Math.round((current * (1 + pct / 100)) / 10) * 10;
      return { code: p.code, current, next };
    });
    setPctPreview(preview);
  };

  const applyPercent = () => {
    if (!pctPreview) return;
    for (const row of pctPreview) {
      setPackageOverride(row.code, { prices: { [pctTier]: row.next } });
    }
    setPctPreview(null);
  };

  const setNegotiationMode = () => {
    setScenario('A');
    setDefaultScenario('A');
  };

  const restoreStandard = () => {
    setScenario('B');
    setDefaultScenario('B');
  };

  return (
    <div className="space-y-8">
      {/* Scenario indicator (Control Mode only) */}
      <section className="rounded-sm border border-gold/30 bg-gold/[0.04] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Active scenario
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-2xl text-white">
            {SCENARIO_LABELS[scenario]}
          </p>
          <div className="flex flex-wrap gap-2">
            {(['A', 'B', 'C'] as PricingScenario[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScenario(s)}
                className={`rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  scenario === s
                    ? 'border-gold/60 bg-gold/15 text-gold'
                    : 'border-white/10 text-ice/80 hover:border-gold/40 hover:text-gold'
                }`}
              >
                {SCENARIO_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ice/70">
          <span>Default scenario for this browser:</span>
          <select
            value={overrides.pricing.defaultScenario ?? ''}
            onChange={(e) =>
              setDefaultScenario((e.target.value || undefined) as PricingScenario | undefined)
            }
            className="rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1 text-xs text-white focus:border-gold/50 focus:outline-none"
          >
            <option value="">(none — fall back to last used / B)</option>
            <option value="A">A · To be agreed</option>
            <option value="B">B · Standard</option>
            <option value="C">C · Premium</option>
          </select>
          <span className="ml-auto text-[10px] uppercase tracking-[0.25em] text-ice/50">
            Audience labels remain hidden
          </span>
        </div>
      </section>

      {/* Negotiation mode quick toggle */}
      <section className="rounded-sm border border-white/10 bg-navy/40 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Negotiation mode
        </p>
        <p className="mt-1 text-sm text-ice/80">
          Quickly switch visible prices to &ldquo;To be agreed&rdquo; or restore standard prices for
          the whole catalogue.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={setNegotiationMode}
            className="rounded-sm border border-gold/50 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25"
          >
            Set to &ldquo;To be agreed&rdquo;
          </button>
          <button
            type="button"
            onClick={restoreStandard}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/30 hover:text-gold"
          >
            Restore Standard
          </button>
        </div>
      </section>

      {/* Category summary */}
      <section className="space-y-3">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Category summary
        </h3>
        <p className="text-xs text-ice/70">
          {totalActive} of {totalAll} packages active across {categories.length} categories.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.25em] text-ice/60">
              <tr>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2 text-right">Active / Total</th>
                <th className="px-3 py-2 text-right">B range</th>
                <th className="px-3 py-2 text-right">C range</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s) => (
                <tr key={s.cat.id} className="border-t border-white/5">
                  <td className="px-3 py-2 text-ice/90">
                    <span className="font-mono text-[10px] text-gold/80">{s.cat.code}</span>
                    <span className="ml-2 text-white">{s.cat.name}</span>
                  </td>
                  <td className="px-3 py-2 text-right text-ice/90">
                    {s.active} / {s.total}
                  </td>
                  <td className="px-3 py-2 text-right font-display text-gold-soft">
                    €{s.minB} – €{s.maxB}
                  </td>
                  <td className="px-3 py-2 text-right font-display text-gold-soft">
                    €{s.minC} – €{s.maxC}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Premium multiplier tool */}
      <section className="rounded-sm border border-white/10 bg-navy/40 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Apply premium multiplier (B → C)
        </p>
        <p className="mt-1 text-xs text-ice/70">
          Recompute Premium (C) prices from Standard (B) using a multiplier. Default 1.8x, rounded
          to nearest €10. Preview before applying.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs text-ice/80">
            Category
            <select
              value={multCat}
              onChange={(e) => setMultCat(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="ml-2 rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1 text-xs text-white focus:border-gold/50 focus:outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-ice/80">
            Factor
            <input
              type="number"
              step="0.1"
              value={multFactor}
              onChange={(e) => setMultFactor(e.target.value)}
              className="ml-2 w-20 rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1 text-xs text-white focus:border-gold/50 focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={previewMultiplier}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            Preview
          </button>
          <button
            type="button"
            disabled={!multPreview}
            onClick={applyMultiplier}
            className="rounded-sm border border-gold/60 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25 disabled:opacity-40"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setMultPreview(null)}
            disabled={!multPreview}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/30 hover:text-gold disabled:opacity-40"
          >
            Discard
          </button>
        </div>
        {multPreview && multPreview.length > 0 && (
          <div className="mt-3 max-h-56 overflow-y-auto rounded-sm border border-white/5 bg-navy-deep/50">
            <table className="w-full text-xs">
              <thead className="text-left text-[10px] uppercase tracking-[0.2em] text-ice/60">
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2 text-right">B</th>
                  <th className="px-3 py-2 text-right">New C</th>
                  <th className="px-3 py-2 text-right">Δ vs. computeC(B)</th>
                </tr>
              </thead>
              <tbody>
                {multPreview.map((r) => (
                  <tr key={r.code} className="border-t border-white/5 text-ice/85">
                    <td className="px-3 py-1.5 font-mono">{r.code}</td>
                    <td className="px-3 py-1.5 text-right">€{r.b}</td>
                    <td className="px-3 py-1.5 text-right text-gold-soft">€{r.nextC}</td>
                    <td className="px-3 py-1.5 text-right text-ice/60">
                      {r.nextC - computeScenarioC(r.b) > 0 ? '+' : ''}
                      {r.nextC - computeScenarioC(r.b)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Bulk percent edit */}
      <section className="rounded-sm border border-white/10 bg-navy/40 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
          Bulk percent edit
        </p>
        <p className="mt-1 text-xs text-ice/70">
          Increase or decrease prices by a percentage. Rounded to nearest €10. Preview first.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs text-ice/80">
            Category
            <select
              value={pctCat}
              onChange={(e) => setPctCat(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="ml-2 rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1 text-xs text-white focus:border-gold/50 focus:outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-ice/80">
            Tier
            <select
              value={pctTier}
              onChange={(e) => setPctTier(e.target.value as 'B' | 'C')}
              className="ml-2 rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1 text-xs text-white focus:border-gold/50 focus:outline-none"
            >
              <option value="B">Standard (B)</option>
              <option value="C">Premium (C)</option>
            </select>
          </label>
          <label className="text-xs text-ice/80">
            Change
            <span className="ml-2 inline-flex items-center gap-1">
              <input
                type="number"
                value={pctValue}
                onChange={(e) => setPctValue(e.target.value)}
                className="w-20 rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1 text-xs text-white focus:border-gold/50 focus:outline-none"
              />
              <span className="text-ice/80">%</span>
            </span>
          </label>
          <button
            type="button"
            onClick={previewPercent}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            Preview
          </button>
          <button
            type="button"
            disabled={!pctPreview}
            onClick={applyPercent}
            className="rounded-sm border border-gold/60 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25 disabled:opacity-40"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setPctPreview(null)}
            disabled={!pctPreview}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/30 hover:text-gold disabled:opacity-40"
          >
            Discard
          </button>
        </div>
        {pctPreview && pctPreview.length > 0 && (
          <div className="mt-3 max-h-56 overflow-y-auto rounded-sm border border-white/5 bg-navy-deep/50">
            <table className="w-full text-xs">
              <thead className="text-left text-[10px] uppercase tracking-[0.2em] text-ice/60">
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2 text-right">Current {pctTier}</th>
                  <th className="px-3 py-2 text-right">Next {pctTier}</th>
                </tr>
              </thead>
              <tbody>
                {pctPreview.map((r) => (
                  <tr key={r.code} className="border-t border-white/5 text-ice/85">
                    <td className="px-3 py-1.5 font-mono">{r.code}</td>
                    <td className="px-3 py-1.5 text-right">€{r.current}</td>
                    <td className="px-3 py-1.5 text-right text-gold-soft">€{r.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
