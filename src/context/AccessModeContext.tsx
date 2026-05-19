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
import { usePathname } from 'next/navigation';

/**
 * Phase 2.4Z — Lightweight access gate for the deck.
 *
 * NOT real authentication. This is a static GitHub Pages export, so
 * the password lives in the bundle and the check is a UX gate only.
 * The point is to keep the audience experience clean and to prevent
 * casual visitors from seeing prices / scenario chrome / /control.
 *
 * Two modes:
 *   - 'admin' — full presenter deck: sidebar, shortcuts, scenarios,
 *               ThemeSwitcher, /control, print, §13.6 editable.
 *   - 'guest' — view-only deck: prices replaced with "To be agreed",
 *               no presenter chrome, no /control, no scenario tools.
 *               Behaves like mobile audience mode.
 *
 * Storage strategy mirrors AudienceModeContext:
 *   - **sessionStorage** only (key: hmc-adac-access-mode). Dies when
 *     the tab closes — guest mode can't bleed into the presenter's
 *     next session, admin mode can't bleed into the projector tab.
 *
 * Mobile audience flow:
 *   - Visiting `/m` or any URL with `?m=1` auto-grants 'guest' so the
 *     QR scan path does not hit the login gate. AudienceModeProvider
 *     still owns the `isAudience` flag — guest just feeds into it.
 *
 * Rescue path:
 *   - Append `?admin=1` to any URL to force re-show the login gate,
 *     clearing any stored mode. Documented inline so the presenter
 *     can recover from a bad state on the meeting laptop.
 */

export type AccessMode = 'admin' | 'guest';

const STORAGE_KEY = 'hmc-adac-access-mode';
const AUDIENCE_KEY = 'hmc-audience-mode';
const AUDIENCE_VALUE = '1';

interface AccessModeState {
  /** Resolved access mode for this tab; null while the gate is open. */
  accessMode: AccessMode | null;
  /** True once the post-mount hydration check has decided accessMode. */
  isHydrated: boolean;
  /** Update access mode + persist to sessionStorage. Pass null to clear. */
  setAccessMode: (mode: AccessMode | null) => void;
}

const AccessModeContext = createContext<AccessModeState | undefined>(undefined);

function isAccessMode(v: unknown): v is AccessMode {
  return v === 'admin' || v === 'guest';
}

function readAudienceFlag(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('m') === '1') return true;
    return window.sessionStorage.getItem(AUDIENCE_KEY) === AUDIENCE_VALUE;
  } catch {
    return false;
  }
}

function isMobileLandingPath(path: string): boolean {
  if (!path) return false;
  if (path === '/m' || path === '/m/') return true;
  // GitHub Pages basePath puts the deck under /ADAC/* — still ends with /m.
  return path.endsWith('/m') || path.endsWith('/m/');
}

export function AccessModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const [accessMode, setAccessModeState] = useState<AccessMode | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      // Rescue hatch — `?admin=1` clears the stored mode and forces
      // the login gate, regardless of what was previously saved.
      let forceLogin = false;
      try {
        forceLogin =
          new URLSearchParams(window.location.search).get('admin') === '1';
      } catch {
        forceLogin = false;
      }

      if (forceLogin) {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setAccessModeState(null);
        return;
      }

      // Mobile audience path or `?m=1` — auto-grant 'guest' so the QR
      // scan flow does not interrupt with a login gate.
      if (isMobileLandingPath(pathname) || readAudienceFlag()) {
        try {
          window.sessionStorage.setItem(STORAGE_KEY, 'guest');
        } catch {
          /* ignore */
        }
        setAccessModeState('guest');
        return;
      }

      // Saved session value (admin or guest) re-applies for this tab.
      try {
        const stored = window.sessionStorage.getItem(STORAGE_KEY);
        if (isAccessMode(stored)) {
          setAccessModeState(stored);
        }
      } catch {
        /* ignore */
      }
    } finally {
      setIsHydrated(true);
    }
  }, [pathname]);

  const setAccessMode = useCallback((mode: AccessMode | null) => {
    setAccessModeState(mode);
    try {
      if (mode === null) {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } else {
        window.sessionStorage.setItem(STORAGE_KEY, mode);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AccessModeState>(
    () => ({ accessMode, isHydrated, setAccessMode }),
    [accessMode, isHydrated, setAccessMode]
  );

  return (
    <AccessModeContext.Provider value={value}>
      {children}
    </AccessModeContext.Provider>
  );
}

export function useAccessMode(): AccessModeState {
  const ctx = useContext(AccessModeContext);
  if (!ctx) {
    throw new Error('useAccessMode must be used inside <AccessModeProvider>');
  }
  return ctx;
}

/**
 * Synchronous, hook-free access-mode read. Use inside event listeners
 * and non-React code paths (e.g. PricingContext keyboard guard).
 * Returns null on the server and when no mode has been chosen.
 */
export function accessModeActive(): AccessMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (isAccessMode(stored)) return stored;
  } catch {
    /* ignore */
  }
  return null;
}
