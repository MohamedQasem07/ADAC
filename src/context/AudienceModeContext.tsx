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
 * Phase 2.4W — Mobile Audience Mode.
 *
 * Public flag for the deck when ADAC attendees follow along from their
 * phones. Activated by visiting `/m` (which sets a sessionStorage flag
 * and adds `?m=1`) or by any URL carrying `?m=1`.
 *
 * Storage strategy (deliberate):
 *   - **sessionStorage** only — never localStorage. SessionStorage dies
 *     when the tab closes, so a presenter laptop that accidentally hit
 *     the QR cannot bleed audience mode into the next session or the
 *     projector tab.
 *   - **?m=1** in the URL is the source of truth across reloads;
 *     sessionStorage is the suspender to the URL's belt so internal
 *     navigation that fails to preserve the query string still keeps
 *     mobile mode for the current tab.
 *
 * SSR safety:
 *   - `isAudience` starts `false` on the server and during first paint;
 *     flips after mount once the URL / sessionStorage check completes.
 *   - All presenter chrome is therefore visible during initial hydration
 *     and removed in the post-hydration effect. This is acceptable —
 *     the cover is mostly logo + glow and the mobile audience never
 *     sees the SSR'd shell on a slow connection (the swap is < 50 ms).
 */

const SESSION_KEY = 'hmc-audience-mode';
const SESSION_VALUE = '1';
// Phase 2.4Z — guest access mode (set by LoginGate or /m) also activates
// audience-safe rendering. Read directly from sessionStorage so this
// module stays import-cycle-free with AccessModeContext.
const ACCESS_KEY = 'hmc-adac-access-mode';
const ACCESS_GUEST = 'guest';

interface AudienceModeState {
  /** True when the current tab is in mobile audience mode. */
  isAudience: boolean;
}

const AudienceModeContext = createContext<AudienceModeState | undefined>(undefined);

export function AudienceModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const { accessMode } = useAccessMode();
  const [isAudience, setIsAudience] = useState(false);

  // Detect audience mode from URL (?m=1), sessionStorage, or the
  // Phase 2.4Z guest access mode. Reading window.location.search
  // directly (instead of useSearchParams) avoids the App-Router
  // static-export Suspense requirement and is sufficient because we
  // re-evaluate on every pathname change.
  //
  // Depending on `accessMode` (from AccessModeContext, mounted above)
  // means the LoginGate's "Continue as Guest" click flips this hook
  // synchronously — no polling needed.
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
    // Phase 2.4Z — guest access mode also activates audience-safe rendering.
    if (!active && accessMode === 'guest') {
      active = true;
    }

    if (active) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, SESSION_VALUE);
      } catch {
        // ignore
      }
    }

    setIsAudience(active);
  }, [pathname, accessMode]);

  const value = useMemo<AudienceModeState>(() => ({ isAudience }), [isAudience]);

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
 * Synchronous, hook-free check used by global keyboard listeners that
 * need a defense-in-depth guard outside React render (e.g. PricingContext
 * Ctrl+1/2/3 handler on iPads with a Bluetooth keyboard). Reads URL
 * and sessionStorage directly. Returns false during SSR.
 */
export function audienceModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (new URLSearchParams(window.location.search).get('m') === '1') return true;
    if (window.sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE) return true;
    // Phase 2.4Z — guest access mode also activates audience-safe behaviour
    // (no pricing writes, no Cmd+1/2/3, no presenter chrome, etc.).
    if (window.sessionStorage.getItem(ACCESS_KEY) === ACCESS_GUEST) return true;
    return false;
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
