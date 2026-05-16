'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, Sliders } from 'lucide-react';
import { useVisualTheme, type VisualTheme } from '@/context/VisualThemeContext';
import { cn } from '@/lib/utils';

interface ThemeOption {
  id: VisualTheme;
  label: string;
  /** Two-stop swatch shown next to the label (primary / accent). */
  swatchA: string;
  swatchB: string;
}

const OPTIONS: ThemeOption[] = [
  { id: 'premium-navy', label: 'Premium Navy',     swatchA: '#0A1929', swatchB: '#C9A961' },
  { id: 'partnership',  label: 'HMC × ADAC Mode',  swatchA: '#0F6FE5', swatchB: '#FFCC00' },
];

/**
 * Top-right on-screen Visual Theme switcher (Phase 2.4E.2).
 *
 *   - Tiny glass icon button, fixed top-right (does not overlap the
 *     top-left MenuButton, the centered Breadcrumb, or the package
 *     SearchOverlay / PackageModal / Sidebar which sit at higher z).
 *   - Click opens a 2-row dropdown with a checkmark on the active
 *     theme. Selecting silently switches; the dropdown closes; the
 *     button retains focus.
 *   - Hidden on /control (the presenter is already inside the Theme
 *     tab there).
 *   - Always visible during the Welcome opening animation so the
 *     presenter can pick a theme before starting the deck.
 *
 * z-index 45: above slide content (z-10) and the Breadcrumb (z-30),
 *             below modal overlays (PackageModal z-100, SearchOverlay
 *             z-95, Sidebar panel z-50, HotkeyToast z-80).
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useVisualTheme();
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Hide on the Control Mode standalone page — the Theme tab inside
  // Control Mode already covers the same switching.
  const hidden = pathname.startsWith('/control');

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onBlur = () => setOpen(false);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('blur', onBlur);
    };
  }, [open]);

  // Close dropdown when route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed right-4 top-4 z-[45]"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label="Visual Theme"
        title="Visual Theme"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-sm border bg-white/[0.04] text-ice/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2',
          // Theme-aware border + focus ring colours via CSS variables —
          // gold under Premium Navy, ADAC yellow under Partnership.
          'border-white/10 hover:border-[var(--theme-accent)]/55 focus:ring-[var(--theme-accent)]/55'
        )}
      >
        <Sliders size={15} className="transition-colors duration-300 group-hover:text-[var(--theme-accent)]" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Visual Theme"
          className="pointer-events-auto absolute right-0 top-11 min-w-[210px] overflow-hidden rounded-sm border bg-navy-deep/95 shadow-card-hover backdrop-blur-md"
          style={{ borderColor: 'var(--theme-card-border)' }}
        >
          <ul className="py-1">
            {OPTIONS.map((opt) => {
              const isCurrent = opt.id === theme;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isCurrent}
                    onClick={() => {
                      setTheme(opt.id);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
                      isCurrent
                        ? 'text-white'
                        : 'text-ice/85 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {/* Two-stop swatch */}
                    <span aria-hidden className="inline-flex h-4 w-7 shrink-0 overflow-hidden rounded-sm border border-white/15">
                      <span className="block h-full w-1/2" style={{ background: opt.swatchA }} />
                      <span className="block h-full w-1/2" style={{ background: opt.swatchB }} />
                    </span>
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isCurrent ? (
                      <Check size={14} className="shrink-0" style={{ color: 'var(--theme-accent)' }} />
                    ) : (
                      <span aria-hidden className="inline-block h-[14px] w-[14px]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
