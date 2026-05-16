'use client';

import { Menu } from 'lucide-react';

interface MenuButtonProps {
  onClick: () => void;
}

/**
 * Top-left fixed menu button. Visible on every slide including the
 * cover. Glassmorphism background; theme-aware hover (gold under
 * Premium Navy, ADAC yellow under Partnership) via --theme-accent.
 */
export function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      aria-label="Open navigation menu"
      onClick={onClick}
      className="group pointer-events-auto fixed left-4 top-4 z-[36] inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-navy-deep/40 text-ink-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 focus:outline-none"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          'color-mix(in srgb, var(--theme-accent) 60%, transparent)';
        e.currentTarget.style.color = 'var(--theme-accent)';
        e.currentTarget.style.boxShadow =
          '0 0 32px color-mix(in srgb, var(--theme-accent) 25%, transparent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.color = '';
        e.currentTarget.style.boxShadow = '';
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow =
          '0 0 0 2px color-mix(in srgb, var(--theme-accent) 60%, transparent)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <Menu size={18} />
    </button>
  );
}
