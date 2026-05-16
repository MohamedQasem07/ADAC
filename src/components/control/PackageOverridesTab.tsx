'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, EyeOff, Eye, Search, StickyNote } from 'lucide-react';
import { fallbackPackagesData } from '@/data/fallback';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { usePricing } from '@/context/PricingContext';
import { PACKAGE_STATUSES, type PackageStatus } from '@/lib/overrides';
import type { Package, PackageCategory } from '@/types/content';

export function PackageOverridesTab() {
  const { overrides, packageOverrideOf, setPackageOverride, resetPackage, resetAllPackages } =
    useOverrides();
  const { scenario } = usePricing();
  const allPackages = fallbackPackagesData.packages as Package[];
  const categories = fallbackPackagesData.categories as PackageCategory[];

  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<PackageStatus | 'all' | 'edited' | 'disabled'>(
    'all'
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPackages.filter((p) => {
      const o = overrides.packages[p.code];
      const name = (o?.name ?? p.name).toLowerCase();
      const matchesQuery =
        !q ||
        p.code.toLowerCase().includes(q) ||
        name.includes(q) ||
        (o?.included ?? p.included).toLowerCase().includes(q);
      if (!matchesQuery) return false;
      if (filterStatus === 'all') return true;
      if (filterStatus === 'edited') return !!o;
      if (filterStatus === 'disabled') return o?.enabled === false || o?.status === 'Removed';
      return o?.status === filterStatus;
    });
  }, [query, filterStatus, allPackages, overrides.packages]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<number, Package[]>();
    for (const p of filtered) {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filtered]);

  const editedCount = Object.keys(overrides.packages).length;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ice/60"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages — code, name, or service…"
              className="w-full rounded-sm border border-white/10 bg-navy/50 py-2 pl-9 pr-3 text-sm text-white placeholder-ice/40 focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-ice/70">
            <span>
              {editedCount} of {allPackages.length} edited
            </span>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Reset all package overrides? Names, prices, status, and disabled flags will be cleared.'
                  )
                ) {
                  resetAllPackages();
                }
              }}
              className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/40 hover:text-gold"
              disabled={editedCount === 0}
            >
              Reset all packages
            </button>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px] uppercase tracking-[0.2em]">
          {(
            ['all', 'edited', 'disabled', ...PACKAGE_STATUSES] as const
          ).map((s) => {
            const active = s === filterStatus;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`rounded-sm border px-2.5 py-1 transition-colors ${
                  active
                    ? 'border-gold/60 bg-gold/10 text-gold'
                    : 'border-white/10 bg-white/[0.02] text-ice/70 hover:border-gold/30 hover:text-gold'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Negotiation Board */}
      <NegotiationBoard />

      {/* Per-category package list */}
      {grouped.length === 0 && (
        <p className="rounded-sm border border-white/5 bg-navy/30 p-6 text-sm text-ice/70">
          No packages match the current filters.
        </p>
      )}

      {grouped.map(([catId, items]) => {
        const cat = categories.find((c) => c.id === catId);
        if (!cat) return null;
        return (
          <section key={catId} className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
              {cat.code} · {cat.name}
            </h3>
            <ul className="space-y-3">
              {items.map((p) => (
                <PackageRow
                  key={p.code}
                  pkg={p}
                  scenario={scenario}
                  override={packageOverrideOf(p.code)}
                  onSave={(patch) => setPackageOverride(p.code, patch)}
                  onReset={() => resetPackage(p.code)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/** Inline editor for one package row. */
function PackageRow({
  pkg,
  scenario,
  override,
  onSave,
  onReset,
}: {
  pkg: Package;
  scenario: 'A' | 'B' | 'C';
  override: ReturnType<typeof Object> | undefined;
  onSave: (patch: import('@/lib/overrides').PackageOverride) => void;
  onReset: () => void;
}) {
  const o = override as import('@/lib/overrides').PackageOverride | undefined;
  const [name, setName] = useState(o?.name ?? pkg.name);
  const [included, setIncluded] = useState(o?.included ?? pkg.included);
  const [priceB, setPriceB] = useState(
    o?.prices?.B !== undefined ? String(o.prices.B) : String(pkg.prices.B)
  );
  const [priceC, setPriceC] = useState(
    o?.prices?.C !== undefined ? String(o.prices.C) : String(pkg.prices.C)
  );
  const [enabled, setEnabled] = useState(o?.enabled !== false);
  const [status, setStatus] = useState<PackageStatus>(o?.status ?? 'Proposed');
  const [note, setNote] = useState(o?.internalNote ?? '');

  const dirty =
    name !== (o?.name ?? pkg.name) ||
    included !== (o?.included ?? pkg.included) ||
    priceB !== String(o?.prices?.B ?? pkg.prices.B) ||
    priceC !== String(o?.prices?.C ?? pkg.prices.C) ||
    enabled !== (o?.enabled !== false) ||
    status !== (o?.status ?? 'Proposed') ||
    note !== (o?.internalNote ?? '');

  const save = () => {
    onSave({
      enabled,
      name: name !== pkg.name ? name : undefined,
      included: included !== pkg.included ? included : undefined,
      prices: {
        B: priceB !== String(pkg.prices.B) ? Number(priceB) || pkg.prices.B : undefined,
        C: priceC !== String(pkg.prices.C) ? Number(priceC) || pkg.prices.C : undefined,
      },
      status,
      internalNote: note || undefined,
    });
  };

  return (
    <li
      className={`relative rounded-sm border bg-navy/40 p-4 ${
        o ? 'border-gold/30' : 'border-white/10'
      } ${!enabled ? 'opacity-70' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/90">
            {pkg.code}
            {pkg.section ? ` · §${pkg.section}` : ''}
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-transparent font-display text-base leading-snug text-white focus:outline-none"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!enabled && (
            <span className="inline-flex items-center gap-1 rounded-sm border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.25em] text-amber-200">
              <EyeOff size={11} /> Disabled
            </span>
          )}
          <StatusBadge value={status} />
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="block text-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ice/60">Standard (B)</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-gold-soft">€</span>
            <input
              type="number"
              inputMode="numeric"
              value={priceB}
              onChange={(e) => setPriceB(e.target.value)}
              className="w-full rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1.5 text-sm text-white focus:border-gold/50 focus:outline-none"
            />
          </div>
        </label>
        <label className="block text-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ice/60">Premium (C)</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-gold-soft">€</span>
            <input
              type="number"
              inputMode="numeric"
              value={priceC}
              onChange={(e) => setPriceC(e.target.value)}
              className="w-full rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1.5 text-sm text-white focus:border-gold/50 focus:outline-none"
            />
          </div>
        </label>
      </div>

      <label className="mt-3 block text-xs">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ice/60">What&rsquo;s included</span>
        <textarea
          value={included}
          onChange={(e) => setIncluded(e.target.value)}
          rows={2}
          className="mt-1 block w-full resize-vertical rounded-sm border border-white/10 bg-navy-deep/60 px-3 py-2 text-sm leading-relaxed text-ice/90 focus:border-gold/50 focus:outline-none"
        />
      </label>

      <label className="mt-3 block text-xs">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-ice/60">
          <StickyNote size={11} /> Internal note (not shown to audience)
        </span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional — review reminder, owner note, etc."
          className="mt-1 block w-full rounded-sm border border-white/10 bg-navy-deep/60 px-3 py-1.5 text-sm text-ice/90 placeholder-ice/40 focus:border-gold/50 focus:outline-none"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-ice/80">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          <span className="inline-flex items-center gap-1">
            <Eye size={12} /> Visible in audience deck
          </span>
        </label>

        <label className="inline-flex items-center gap-2 text-xs text-ice/80">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ice/60">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PackageStatus)}
            className="rounded-sm border border-white/10 bg-navy-deep/60 px-2 py-1 text-xs text-white focus:border-gold/50 focus:outline-none"
          >
            {PACKAGE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <span className="ml-auto inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-ice/50">
          Scenario {scenario === 'A' ? 'A (To be agreed)' : scenario === 'B' ? 'B (Standard)' : 'C (Premium)'}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!dirty}
          onClick={save}
          className="rounded-sm border border-gold/60 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25 disabled:opacity-40"
        >
          Save
        </button>
        <button
          type="button"
          disabled={!o}
          onClick={() => {
            onReset();
            setName(pkg.name);
            setIncluded(pkg.included);
            setPriceB(String(pkg.prices.B));
            setPriceC(String(pkg.prices.C));
            setEnabled(true);
            setStatus('Proposed');
            setNote('');
          }}
          className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/30 hover:text-gold disabled:opacity-40"
        >
          Reset
        </button>
      </div>
    </li>
  );
}

function StatusBadge({ value }: { value: PackageStatus }) {
  const style: Record<PackageStatus, string> = {
    Proposed: 'border-royal/40 bg-royal/10 text-royal',
    'Needs discussion': 'border-amber-400/40 bg-amber-400/10 text-amber-200',
    Approved: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
    Removed: 'border-rose-400/40 bg-rose-400/10 text-rose-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.25em] ${style[value]}`}
    >
      {value === 'Approved' && <CheckCircle2 size={11} />}
      {value}
    </span>
  );
}

/** Negotiation board — packages grouped by status, presenter-only. */
function NegotiationBoard() {
  const { overrides } = useOverrides();
  const allPackages = fallbackPackagesData.packages as Package[];

  const byStatus = useMemo(() => {
    const buckets: Record<PackageStatus, Package[]> = {
      Proposed: [],
      'Needs discussion': [],
      Approved: [],
      Removed: [],
    };
    for (const p of allPackages) {
      const o = overrides.packages[p.code];
      const status: PackageStatus = o?.status ?? 'Proposed';
      buckets[status].push(p);
    }
    return buckets;
  }, [allPackages, overrides.packages]);

  const totals = (PACKAGE_STATUSES as PackageStatus[]).reduce(
    (acc, s) => acc + byStatus[s].length,
    0
  );
  if (totals === 0) return null;

  return (
    <section className="rounded-sm border border-white/10 bg-navy/30 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
        Negotiation Board
      </p>
      <p className="mt-1 text-xs text-ice/70">Presenter-only view, grouped by status.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {PACKAGE_STATUSES.map((s) => (
          <div
            key={s}
            className="rounded-sm border border-white/10 bg-navy-deep/40 p-3"
          >
            <div className="flex items-center justify-between">
              <StatusBadge value={s} />
              <span className="font-display text-base text-white">{byStatus[s].length}</span>
            </div>
            <ul className="mt-3 space-y-1 text-[11px] text-ice/80">
              {byStatus[s].slice(0, 6).map((p) => (
                <li key={p.code} className="truncate">
                  <span className="font-mono text-[9px] text-ice/50">{p.code}</span>{' '}
                  {overrides.packages[p.code]?.name ?? p.name}
                </li>
              ))}
              {byStatus[s].length > 6 && (
                <li className="text-[10px] uppercase tracking-[0.2em] text-ice/40">
                  +{byStatus[s].length - 6} more
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
