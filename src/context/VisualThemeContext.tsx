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

/**
 * Visual theme provider — opt-in second theme system.
 *
 *   Default: 'premium-navy' (current/safe)
 *   Optional: 'partnership' (HMC blue + ADAC yellow dual-brand)
 *
 * Theme is applied by setting `data-theme` on <html>; CSS variables in
 * globals.css switch atomically. A small inline script in app/layout.tsx
 * sets the attribute pre-hydration to avoid a flash of default.
 *
 * Three ways to switch (Phase 2.4E.2 — no keyboard hotkey, the
 * previous Ctrl/Cmd+Shift+T binding was removed because it collided
 * with browser/system shortcuts):
 *   1. Top-right on-screen Visual Theme switcher (silent — no toast).
 *   2. Control Mode → Theme tab.
 *   3. Manual localStorage edit via browser console (rollback path).
 *
 * Rollback discipline: if the localStorage value is missing or invalid,
 * the provider falls back to 'premium-navy' AND clears the bad value
 * from storage so the next load is clean.
 */
export function VisualThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<VisualTheme>(DEFAULT_THEME);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isValidTheme(stored)) {
        setThemeState(stored);
        document.documentElement.dataset.theme = stored;
      } else if (stored !== null) {
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

  // Silent setter — the on-screen switcher's checkmark and the Theme
  // tab's selected-card state already give the user feedback, so we do
  // not emit a hotkey toast on theme change.
  const setTheme = useCallback(
    (next: VisualTheme) => {
      if (!isValidTheme(next)) return;
      applyTheme(next);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'premium-navy' ? 'partnership' : 'premium-navy');
  }, [setTheme, theme]);

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
