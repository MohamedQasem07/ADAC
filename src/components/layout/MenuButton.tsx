'use client';

import { Menu } from 'lucide-react';

interface MenuButtonProps {
  onClick: () => void;
}

/**
 * Top-left fixed menu button. Visible on every slide including the cover.
 * Glassmorphism background + subtle gold-glow hover. Opens the sidebar.
 */
export function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      aria-label="Open navigation menu"
      onClick={onClick}
      className="group pointer-events-auto fixed left-4 top-4 z-[36] inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-navy-deep/40 text-ink-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold hover:shadow-gold-glow focus:outline-none focus:ring-2 focus:ring-gold/60"
    >
      <Menu size={18} />
    </button>
  );
}
