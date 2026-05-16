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
import { emitHotkeyToast } from '@/components/layout/HotkeyToast';

export type VisualTheme = 'premium-navy' | 'partnership';

export const THEME_STORAGE_KEY = 'hmc-adac-visual-theme-v1';
export const DEFAULT_THEME: VisualTheme = 'premium-navy';

interface VisualThemeState {
  theme: VisualTheme;
  setTheme: (theme: VisualTheme) => void;
  toggleTheme: () => void;
}

const VisualThemeContext = createContext<VisualThemeState | undefined>(undefined);

function isValidTheme(value: unknown): value is VisualTheme {
  return value === 'premium-navy' || value === 'partnership';
}

const THEME_LABELS: Record<VisualTheme, string> = {
  'premium-navy': 'Premium Navy',
  partnership: 'HMC × ADAC Partnership',
};

/**
 * Visual theme provider — opt-in second theme system added in Phase 2.4E.
 *
 *   Default: 'premium-navy' (current/safe)
 *   Optional: 'partnership' (HMC blue + ADAC yellow dual-brand)
 *
 * Theme is applied by setting `data-theme` on <html>; CSS variables in
 * globals.css switch atomically. A small inline script in app/layout.tsx
 * sets the attribute pre-hydration to avoid a flash of default.
 *
 * Three ways to switch:
 *   1. This provider's setTheme/toggleTheme (called by the Control Mode
 *      Theme tab)
 *   2. Ctrl/Cmd + Shift + T global hotkey (toggles)
 *   3. Manual localStorage edit via browser console (rollback path)
 *
 * Rollback discipline: if the localStorage value is missing or invalid,
 * the provider falls back to 'premium-navy' AND clears the bad value
 * from storage so the next load is clean.
 */
export function VisualThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<VisualTheme>(DEFAULT_THEME);

  // Hydrate from localStorage + sync the html attribute on first mount.
  // (The pre-hydration script in layout.tsx may have already set the
  // attribute; this effect makes the React state agree with what's on
  // disk so subsequent toggles behave correctly.)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isValidTheme(stored)) {
        setThemeState(stored);
        document.documentElement.dataset.theme = stored;
      } else if (stored !== null) {
        // Bad value — clear it.
        window.localStorage.removeItem(THEME_STORAGE_KEY);
        delete document.documentElement.dataset.theme;
      } else {
        delete document.documentElement.dataset.theme;
      }
    } catch {
      // localStorage unavailable — silently use the default.
    }
  }, []);

  const applyTheme = useCallback((next: VisualTheme) => {
    setThemeState(next);
    try {
      if (next === DEFAULT_THEME) {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
        delete document.documentElement.dataset.theme;
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
        document.documentElement.dataset.theme = next;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback(
    (next: VisualTheme) => {
      if (!isValidTheme(next)) return;
      applyTheme(next);
      emitHotkeyToast({
        keys: 'Theme',
        action: `Visual Theme: ${THEME_LABELS[next]}`,
      });
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'premium-navy' ? 'partnership' : 'premium-navy');
  }, [setTheme, theme]);

  // Ctrl/Cmd + Shift + T global hotkey.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (!e.shiftKey) return;
      if (e.altKey) return;
      if (e.key.toLowerCase() !== 't') return;

      // Ignore while typing in an input/textarea.
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
      }

      e.preventDefault();
      toggleTheme();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleTheme]);

  const value = useMemo<VisualThemeState>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <VisualThemeContext.Provider value={value}>{children}</VisualThemeContext.Provider>
  );
}

export function useVisualTheme(): VisualThemeState {
  const ctx = useContext(VisualThemeContext);
  if (!ctx) {
    throw new Error('useVisualTheme must be used inside <VisualThemeProvider>');
  }
  return ctx;
}
