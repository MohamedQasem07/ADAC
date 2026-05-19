'use client';

import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAccessMode } from '@/context/AccessModeContext';
import { cn } from '@/lib/utils';

/**
 * Phase 2.4AB — Logout button.
 *
 * Renders top-right whenever the viewer is authenticated (admin OR
 * guest). On click:
 *   1. Clear `hmc-adac-access-mode` and `hmc-audience-mode` from
 *      sessionStorage so the next paint sees no stored mode.
 *   2. Hard-navigate to `/?admin=1` so the LoginGate is forced to
 *      re-show, regardless of which route the viewer was on.
 *
 * Hidden when `accessMode` is null (LoginGate is showing). Hidden on
 * `/control` (the page already exposes its own "Sign out" button in
 * the header and would otherwise show two side by side).
 *
 * Position is offset so it doesn't collide with the ThemeSwitcher
 * (which is also at top-right for admins). For guests, ThemeSwitcher
 * doesn't render, so this button stands alone.
 */
export function LogoutButton() {
  const { accessMode } = useAccessMode();
  const pathname = usePathname() || '/';

  if (!accessMode) return null;
  if (pathname.startsWith('/control')) return null;

  const handleLogout = () => {
    try {
      window.sessionStorage.removeItem('hmc-adac-access-mode');
      window.sessionStorage.removeItem('hmc-audience-mode');
    } catch {
      /* ignore */
    }
    // Use `?admin=1` so AccessModeContext re-shows the gate even if
    // some stray storage state survives.
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.location.href = `${basePath || ''}/?admin=1`;
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Logout"
      title="Logout"
      className={cn(
        'group fixed z-[46] inline-flex h-9 items-center gap-2 rounded-sm border bg-white/[0.04] px-3 text-ice/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2',
        'border-white/10 hover:border-[var(--theme-accent)]/55 focus:ring-[var(--theme-accent)]/55',
        // Top-right; sits next to the ThemeSwitcher (which is at right-4
        // top-4 z-45). On smaller screens we drop the text label.
        'right-4 top-16 md:right-16 md:top-4'
      )}
    >
      <LogOut
        size={14}
        className="transition-colors duration-300 group-hover:text-[var(--theme-accent)]"
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
        Logout
      </span>
    </button>
  );
}
