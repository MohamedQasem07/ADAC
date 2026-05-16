/**
 * Presenter overrides — local, no-backend layer for last-minute edits.
 *
 * The deck reads original bundled content first, then merges these
 * overrides on top at render time. Overrides live in localStorage
 * under `hmc-adac-presentation-overrides-v1`. Nothing is sent over the
 * network; nothing replaces the original files.
 *
 * Export/import flows through Control Mode (Ctrl/Cmd+Shift+E or /control).
 */

import type { Package, PricingScenario } from '@/types/content';

export const OVERRIDES_STORAGE_KEY = 'hmc-adac-presentation-overrides-v1';
export const OVERRIDES_VERSION = 1;

export type PackageStatus = 'Proposed' | 'Needs discussion' | 'Approved' | 'Removed';

export const PACKAGE_STATUSES: PackageStatus[] = [
  'Proposed',
  'Needs discussion',
  'Approved',
  'Removed',
];

export interface PackageOverride {
  enabled?: boolean;
  name?: string;
  included?: string;
  prices?: Partial<{ A: string; B: number | string; C: number | string }>;
  status?: PackageStatus;
  internalNote?: string;
}

export interface PricingOverride {
  defaultScenario?: PricingScenario;
}

export interface PresentationOverrides {
  version: number;
  updatedAt: string;
  text: Record<string, string>;
  packages: Record<string, PackageOverride>;
  pricing: PricingOverride;
}

export const EMPTY_OVERRIDES: PresentationOverrides = {
  version: OVERRIDES_VERSION,
  updatedAt: new Date(0).toISOString(),
  text: {},
  packages: {},
  pricing: {},
};

/** Build a fresh overrides object stamped with the current ISO date. */
export function makeOverridesShell(): PresentationOverrides {
  return {
    version: OVERRIDES_VERSION,
    updatedAt: new Date().toISOString(),
    text: {},
    packages: {},
    pricing: {},
  };
}

/**
 * Load from localStorage with graceful validation. Returns EMPTY_OVERRIDES
 * if no value, or if JSON is malformed. Caller may surface a one-line
 * warning to the user via the validation result.
 */
export function loadFromStorage(): {
  data: PresentationOverrides;
  error?: string;
} {
  if (typeof window === 'undefined') return { data: EMPTY_OVERRIDES };
  try {
    const raw = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);
    if (!raw) return { data: EMPTY_OVERRIDES };
    const parsed = JSON.parse(raw);
    const result = validate(parsed);
    if (!result.ok) return { data: EMPTY_OVERRIDES, error: result.error };
    return { data: result.data };
  } catch (err) {
    return {
      data: EMPTY_OVERRIDES,
      error: err instanceof Error ? err.message : 'Could not parse overrides',
    };
  }
}

export function saveToStorage(data: PresentationOverrides): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // private mode / quota — silent
  }
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(OVERRIDES_STORAGE_KEY);
  } catch {
    // silent
  }
}

/**
 * Structural validation. Accepts version 1 only. Tolerates missing
 * subtrees (treated as empty). Returns either the normalized object
 * or an error message.
 */
export function validate(
  candidate: unknown
):
  | { ok: true; data: PresentationOverrides }
  | { ok: false; error: string } {
  if (typeof candidate !== 'object' || candidate === null) {
    return { ok: false, error: 'Overrides must be an object.' };
  }
  const c = candidate as Record<string, unknown>;
  if (typeof c.version === 'number' && c.version !== OVERRIDES_VERSION) {
    return { ok: false, error: `Unsupported overrides version: ${c.version}.` };
  }
  const text = (c.text && typeof c.text === 'object') ? (c.text as Record<string, string>) : {};
  const packages =
    c.packages && typeof c.packages === 'object'
      ? (c.packages as Record<string, PackageOverride>)
      : {};
  const pricing =
    c.pricing && typeof c.pricing === 'object'
      ? (c.pricing as PricingOverride)
      : {};
  const data: PresentationOverrides = {
    version: OVERRIDES_VERSION,
    updatedAt: typeof c.updatedAt === 'string' ? c.updatedAt : new Date().toISOString(),
    text,
    packages,
    pricing,
  };
  return { ok: true, data };
}

/** Merge a package with its override into the shape used by the rest of the app. */
export function applyPackageOverride(
  pkg: Package,
  override: PackageOverride | undefined
): Package & { _override?: PackageOverride } {
  if (!override) return pkg;
  const merged: Package = {
    ...pkg,
    name: override.name ?? pkg.name,
    included: override.included ?? pkg.included,
    prices: {
      A: override.prices?.A ?? pkg.prices.A,
      B: coerceNumber(override.prices?.B, pkg.prices.B),
      C: coerceNumber(override.prices?.C, pkg.prices.C),
    },
  };
  return Object.assign(merged, { _override: override });
}

function coerceNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

/** Returns true if the package should be visible in audience-facing UI. */
export function isPackageVisible(override: PackageOverride | undefined): boolean {
  if (!override) return true;
  if (override.enabled === false) return false;
  if (override.status === 'Removed') return false;
  return true;
}

/**
 * Apply overrides to a package list — filters disabled and merges per-package edits.
 * Use this single helper everywhere audience-facing package data is consumed.
 */
export function applyOverridesToPackages(
  packages: Package[],
  overrides: PresentationOverrides
): Package[] {
  return packages
    .filter((p) => isPackageVisible(overrides.packages[p.code]))
    .map((p) => applyPackageOverride(p, overrides.packages[p.code]));
}

/** Look up a text override; fall back to the supplied default if not present. */
export function getOverrideText(
  overrides: PresentationOverrides,
  key: string,
  fallback: string
): string {
  const v = overrides.text[key];
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

/** Build the export filename used by the Import/Export tab. */
export function exportFilename(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `adac-presentation-overrides-${yyyy}-${mm}-${dd}.json`;
}
