'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { useAccessMode } from '@/context/AccessModeContext';

/**
 * Phase 2.4W / 2.4AB — Mobile Audience Mode + viewer-safe split.
 *
 * Two concepts, two flags:
 *
 *   - `isAudience` — **strict mobile**. True only when the URL carries
 *     `?m=1` or sessionStorage holds the mobile-audience flag. Controls
 *     mobile-specific UI (MobileBottomNav, mobile-padded body, hidden
 *     QR card on the cover). NEVER auto-flips for desktop guests.
 *
 *   - `isViewerSafe` — **derived UX gate**. True when `isAudience` OR
 *     the access mode is `'guest'`. Controls everything that must be
 *     hidden from non-admin viewers regardless of device: presenter
 *     chrome (Sidebar, ThemeSwitcher, KeyboardNav, ScenarioIndicator,
 *     CheatsheetOverlay, SearchOverlay, ControlPanelOverlay), and the
 *     "To be agreed" price override. Desktop guests get this without
 *     getting the mobile layout.
 *
 * Storage strategy (deliberate):
 *   - **sessionStorage** only — never localStorage. SessionStorage
 *     dies when the tab closes, so a presenter laptop that
 *     accidentally hit the QR cannot bleed audience mode into the
 *     next session or the projector tab.
 *   - **?m=1** in the URL is the source of truth for mobile audience
 *     across reloads; sessionStorage is the suspender to the URL's
 *     belt so internal navigation that fails to preserve the query
 *     string still keeps mobile mode for the current tab.
 */

const SESSION_KEY = 'hmc-audience-mode';
const SESSION_VALUE = '1';
const ACCESS_KEY = 'hmc-adac-access-mode';
const ACCESS_GUEST = 'guest';

interface AudienceModeState {
  /**
   * True when the current tab is in **mobile** audience mode (route
   * `/m` or URL `?m=1`). Use this only for mobile-specific UI like
   * MobileBottomNav. For "should we hide prices / presenter chrome"
   * checks, use `isViewerSafe` instead.
   */
  isAudience: boolean;
  /**
   * True when the current viewer should NOT see prices, scenarios, or
   * any presenter-only tooling. Covers both mobile audience visitors
   * AND desktop guests. Use this for `<PriceBadge>` etc.
   */
  isViewerSafe: boolean;
}

const AudienceModeContext = createContext<AudienceModeState | undefined>(undefined);

export function AudienceModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const { accessMode } = useAccessMode();
  const [isAudience, setIsAudience] = useState(false);

  // Detect strict mobile audience mode from URL (?m=1) or sessionStorage.
  // `accessMode` does NOT feed into this — guest desktops stay desktop.
  useEffect(() => {
    let active = false;
    try {
      active = new URLSearchParams(window.location.search).get('m') === '1';
    } catch {
      active = false;
    }
    if (!active) {
      try {
        active = window.sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE;
      } catch {
        // sessionStorage unavailable — silently leave inactive.
      }
    }

    if (active) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, SESSION_VALUE);
      } catch {
        // ignore
      }
    } else {
      // Clear any stale audience flag when the URL is not /m / ?m=1 — a
      // desktop guest tab must not inherit mobile mode just because the
      // previous tab visited /m.
      try {
        if (window.sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE) {
          window.sessionStorage.removeItem(SESSION_KEY);
        }
      } catch {
        // ignore
      }
    }

    setIsAudience(active);
  }, [pathname]);

  const value = useMemo<AudienceModeState>(
    () => ({
      isAudience,
      isViewerSafe: isAudience || accessMode === 'guest',
    }),
    [isAudience, accessMode]
  );

  return (
    <AudienceModeContext.Provider value={value}>{children}</AudienceModeContext.Provider>
  );
}

export function useAudienceMode(): AudienceModeState {
  const ctx = useContext(AudienceModeContext);
  if (!ctx) {
    throw new Error('useAudienceMode must be used inside <AudienceModeProvider>');
  }
  return ctx;
}

/**
 * Synchronous, hook-free **strict mobile** check. Use only for code
 * paths that genuinely need to branch on mobile-route presence
 * (e.g. AudienceQRCode hiding on mobile, the /control SSG no-flash
 * branch). For "is this viewer audience-safe" checks (e.g. Pricing
 * Cmd+1/2/3 keyboard guard), use `viewerSafeActive()` instead.
 */
export function audienceModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (new URLSearchParams(window.location.search).get('m') === '1') return true;
    if (window.sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Synchronous, hook-free viewer-safe check — mobile audience OR
 * desktop guest. Use inside non-React code paths (e.g. PricingContext
 * keyboard guard) that need to suppress presenter-only behaviour for
 * any non-admin viewer.
 */
export function viewerSafeActive(): boolean {
  if (audienceModeActive()) return true;
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(ACCESS_KEY) === ACCESS_GUEST;
  } catch {
    return false;
  }
}

/**
 * Append `?m=1` to an internal href when the current tab is in audience
 * mode. Use this in every audience-mode `<Link href>` and `router.push`
 * so the query parameter survives navigation across refresh boundaries.
 *
 * Pure function — caller decides when to call (typically by reading
 * `useAudienceMode().isAudience` first, or just calling
 * `audienceModeActive()` for non-render code).
 */
export function audienceHref(href: string): string {
  if (!href || href.startsWith('http')) return href;
  if (href.includes('m=1')) return href;
  const sep = href.includes('?') ? '&' : '?';
  // Preserve any hash fragment at the end.
  const hashIdx = href.indexOf('#');
  if (hashIdx >= 0) {
    return `${href.slice(0, hashIdx)}${sep}m=1${href.slice(hashIdx)}`;
  }
  return `${href}${sep}m=1`;
}
