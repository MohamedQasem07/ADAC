'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  firstSubtopic,
  nextRoute,
  parsePathname,
  prevRoute,
  routeToHref,
} from '@/lib/nav-config';
import { emitHotkeyToast } from './HotkeyToast';

interface KeyboardNavProps {
  onToggleSidebar: () => void;
}

/**
 * Global keyboard handler for navigation. Mounted once inside
 * PresentationShell. Hotkey responsibilities split:
 *   - This component: arrow keys, Esc, Home, Cmd/Ctrl+B
 *   - PricingContext: Cmd/Ctrl+1/2/3
 *   - CheatsheetOverlay: ?
 *   - SearchOverlay (phase 7): Cmd/Ctrl+F
 */
export function KeyboardNav({ onToggleSidebar }: KeyboardNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const go = (href: string) => router.push(href);

    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in an input.
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
      }

      const current = parsePathname(pathname || '/');

      // Cmd/Ctrl + B → toggle sidebar.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onToggleSidebar();
        emitHotkeyToast({ keys: 'Ctrl+B', action: 'Toggle sidebar' });
        return;
      }

      // Ignore other modifier combos (Cmd/Ctrl + 1/2/3/F handled elsewhere).
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Plain-key sidebar toggle (M) — user requested for live presentation.
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onToggleSidebar();
        emitHotkeyToast({ keys: 'M', action: 'Toggle menu' });
        return;
      }

      // Plain-key fullscreen toggle (F).
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        emitHotkeyToast({ keys: 'F', action: 'Toggle fullscreen' });
        return;
      }

      switch (e.key) {
        case 'ArrowRight': {
          const next = nextRoute(current);
          if (next) {
            e.preventDefault();
            emitHotkeyToast({ keys: '→', action: 'Next' });
            go(routeToHref(next));
          }
          break;
        }
        case 'ArrowLeft': {
          const prev = prevRoute(current);
          if (prev) {
            e.preventDefault();
            emitHotkeyToast({ keys: '←', action: 'Previous' });
            go(routeToHref(prev));
          }
          break;
        }
        case 'ArrowDown': {
          // Only drill into subtopics from a section top-level page.
          if (!current.subId) {
            const sub = firstSubtopic(current.sectionId);
            if (sub) {
              e.preventDefault();
              emitHotkeyToast({ keys: '↓', action: 'Drill into subtopics' });
              go(routeToHref(sub));
            }
          }
          break;
        }
        case 'ArrowUp': {
          if (current.subId) {
            e.preventDefault();
            emitHotkeyToast({ keys: '↑', action: 'Up to section top' });
            go(routeToHref({ sectionId: current.sectionId }));
          }
          break;
        }
        case 'Escape': {
          if (current.subId) {
            e.preventDefault();
            emitHotkeyToast({ keys: 'Esc', action: 'Back to section top' });
            go(routeToHref({ sectionId: current.sectionId }));
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          emitHotkeyToast({ keys: 'Home', action: 'Jump to cover' });
          go(routeToHref({ sectionId: '1' }));
          break;
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, router, onToggleSidebar]);

  return null;
}

function toggleFullscreen() {
  if (typeof document === 'undefined') return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {
      /* user may have denied or device unsupported — silent */
    });
  } else {
    document.exitFullscreen?.().catch(() => {
      /* silent */
    });
  }
}
