'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  applyOverridesToPackages,
  applyPackageOverride,
  clearStorage,
  EMPTY_OVERRIDES,
  getOverrideText,
  isPackageVisible,
  loadFromStorage,
  makeOverridesShell,
  saveToStorage,
  validate,
  type PackageOverride,
  type PresentationOverrides,
} from '@/lib/overrides';
import type { Package } from '@/types/content';

interface OverridesState {
  overrides: PresentationOverrides;
  hasOverrides: boolean;

  /** Text override helpers. */
  textOf: (key: string, fallback: string) => string;
  setText: (key: string, value: string) => void;
  resetText: (key: string) => void;
  resetAllText: () => void;

  /** Package override helpers. */
  packageOverrideOf: (code: string) => PackageOverride | undefined;
  setPackageOverride: (code: string, patch: PackageOverride) => void;
  resetPackage: (code: string) => void;
  resetAllPackages: () => void;
  applyPackage: (pkg: Package) => Package;
  applyPackages: (packages: Package[]) => Package[];
  isVisible: (code: string) => boolean;

  /** Pricing override helpers. */
  setDefaultScenario: (scenario: 'A' | 'B' | 'C' | undefined) => void;

  /** Bulk import / clear. */
  importOverrides: (raw: unknown) => { ok: boolean; error?: string };
  clearAll: () => void;

  /** A monotonic counter that increments on every change — components
   *  can use this as a dependency to force re-render when needed. */
  rev: number;
}

const PresentationOverridesContext = createContext<OverridesState | undefined>(undefined);

export function PresentationOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<PresentationOverrides>(EMPTY_OVERRIDES);
  const [rev, setRev] = useState(0);

  // Hydrate on first client render.
  useEffect(() => {
    const { data } = loadFromStorage();
    setOverrides(data);
    setRev((r) => r + 1);
  }, []);

  const persist = useCallback((next: PresentationOverrides) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    saveToStorage(stamped);
    setOverrides(stamped);
    setRev((r) => r + 1);
  }, []);

  const hasOverrides = useMemo(
    () =>
      Object.keys(overrides.text).length > 0 ||
      Object.keys(overrides.packages).length > 0 ||
      Object.keys(overrides.pricing).length > 0,
    [overrides]
  );

  // ─── Text ──────────────────────────────────────────────────────
  const textOf = useCallback(
    (key: string, fallback: string) => getOverrideText(overrides, key, fallback),
    [overrides]
  );

  const setText = useCallback(
    (key: string, value: string) => {
      persist({
        ...overrides,
        text: { ...overrides.text, [key]: value },
      });
    },
    [overrides, persist]
  );

  const resetText = useCallback(
    (key: string) => {
      const next = { ...overrides.text };
      delete next[key];
      persist({ ...overrides, text: next });
    },
    [overrides, persist]
  );

  const resetAllText = useCallback(() => {
    persist({ ...overrides, text: {} });
  }, [overrides, persist]);

  // ─── Packages ──────────────────────────────────────────────────
  const packageOverrideOf = useCallback(
    (code: string) => overrides.packages[code],
    [overrides]
  );

  const setPackageOverride = useCallback(
    (code: string, patch: PackageOverride) => {
      const current = overrides.packages[code] ?? {};
      const merged: PackageOverride = { ...current, ...patch };
      // Merge nested prices object explicitly.
      if (patch.prices) {
        merged.prices = { ...(current.prices ?? {}), ...patch.prices };
      }
      persist({
        ...overrides,
        packages: { ...overrides.packages, [code]: merged },
      });
    },
    [overrides, persist]
  );

  const resetPackage = useCallback(
    (code: string) => {
      const next = { ...overrides.packages };
      delete next[code];
      persist({ ...overrides, packages: next });
    },
    [overrides, persist]
  );

  const resetAllPackages = useCallback(() => {
    persist({ ...overrides, packages: {} });
  }, [overrides, persist]);

  const applyPackage = useCallback(
    (pkg: Package) => applyPackageOverride(pkg, overrides.packages[pkg.code]),
    [overrides]
  );

  const applyPackages = useCallback(
    (packages: Package[]) => applyOverridesToPackages(packages, overrides),
    [overrides]
  );

  const isVisible = useCallback(
    (code: string) => isPackageVisible(overrides.packages[code]),
    [overrides]
  );

  // ─── Pricing ───────────────────────────────────────────────────
  const setDefaultScenario = useCallback(
    (scenario: 'A' | 'B' | 'C' | undefined) => {
      const next: PresentationOverrides = {
        ...overrides,
        pricing: { ...overrides.pricing, defaultScenario: scenario },
      };
      if (!scenario) delete next.pricing.defaultScenario;
      persist(next);
    },
    [overrides, persist]
  );

  // ─── Import / clear ────────────────────────────────────────────
  const importOverrides = useCallback(
    (raw: unknown) => {
      const result = validate(raw);
      if (!result.ok) return { ok: false, error: result.error };
      persist(result.data);
      return { ok: true };
    },
    [persist]
  );

  const clearAll = useCallback(() => {
    clearStorage();
    setOverrides(EMPTY_OVERRIDES);
    setRev((r) => r + 1);
  }, []);

  const value = useMemo<OverridesState>(
    () => ({
      overrides,
      hasOverrides,
      textOf,
      setText,
      resetText,
      resetAllText,
      packageOverrideOf,
      setPackageOverride,
      resetPackage,
      resetAllPackages,
      applyPackage,
      applyPackages,
      isVisible,
      setDefaultScenario,
      importOverrides,
      clearAll,
      rev,
    }),
    [
      overrides,
      hasOverrides,
      textOf,
      setText,
      resetText,
      resetAllText,
      packageOverrideOf,
      setPackageOverride,
      resetPackage,
      resetAllPackages,
      applyPackage,
      applyPackages,
      isVisible,
      setDefaultScenario,
      importOverrides,
      clearAll,
      rev,
    ]
  );

  // Helper export: also expose a freshly stamped shell for import-flow.
  void makeOverridesShell;

  return (
    <PresentationOverridesContext.Provider value={value}>
      {children}
    </PresentationOverridesContext.Provider>
  );
}

export function useOverrides(): OverridesState {
  const ctx = useContext(PresentationOverridesContext);
  if (!ctx) {
    throw new Error('useOverrides must be used inside <PresentationOverridesProvider>');
  }
  return ctx;
}
