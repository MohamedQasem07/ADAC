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
import type { PricingScenario } from '@/types/content';

interface PricingState {
  scenario: PricingScenario;
  setScenario: (s: PricingScenario) => void;
  /** Whether the scenario just changed — UI can play a ripple. */
  ripple: { scenario: PricingScenario; nonce: number } | null;
}

const STORAGE_KEY = 'hmc-adac-scenario';
const DEFAULT_SCENARIO: PricingScenario = 'B';

const PricingContext = createContext<PricingState | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<PricingScenario>(DEFAULT_SCENARIO);
  const [ripple, setRipple] = useState<PricingState['ripple']>(null);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'A' || stored === 'B' || stored === 'C') {
        setScenarioState(stored);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — silently keep default.
    }
  }, []);

  const setScenario = useCallback((next: PricingScenario) => {
    setScenarioState((prev) => {
      if (prev === next) return prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      setRipple({ scenario: next, nonce: Date.now() });
      return next;
    });
  }, []);

  // Keyboard listener: Cmd/Ctrl + 1/2/3.
  // Ignores when an input/textarea/contentEditable element is focused
  // (i.e. when the search overlay is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.altKey || e.shiftKey) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
      }

      if (e.key === '1') {
        e.preventDefault();
        setScenario('A');
      } else if (e.key === '2') {
        e.preventDefault();
        setScenario('B');
      } else if (e.key === '3') {
        e.preventDefault();
        setScenario('C');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setScenario]);

  const value = useMemo<PricingState>(
    () => ({ scenario, setScenario, ripple }),
    [scenario, setScenario, ripple]
  );

  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
}

export function usePricing(): PricingState {
  const ctx = useContext(PricingContext);
  if (!ctx) {
    throw new Error('usePricing must be used inside <PricingProvider>');
  }
  return ctx;
}
