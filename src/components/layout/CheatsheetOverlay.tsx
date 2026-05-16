'use client';

import { useEffect, useState } from 'react';

interface Shortcut {
  keys: string;
  action: string;
  category: 'Navigation' | 'Display' | 'Power';
}

const SHORTCUTS: Shortcut[] = [
  { keys: '→', action: 'Next section / subtopic', category: 'Navigation' },
  { keys: '←', action: 'Previous section / subtopic', category: 'Navigation' },
  { keys: '↓', action: 'Reveal subtopics (when at section top)', category: 'Navigation' },
  { keys: '↑', action: 'Return to section top from subtopic grid', category: 'Navigation' },
  { keys: 'Esc', action: 'Close modal · go up one level', category: 'Navigation' },
  { keys: 'Home', action: 'Jump to cover', category: 'Navigation' },
  { keys: 'Ctrl + B', action: 'Toggle sidebar', category: 'Display' },
  { keys: '?', action: 'Show / hide this cheatsheet', category: 'Display' },
  { keys: 'Ctrl + F', action: 'Open package search (Section 12)', category: 'Power' },
  { keys: 'Ctrl + 1 / 2 / 3', action: 'Switch pricing scenario', category: 'Power' },
];

export function CheatsheetOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
      }
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const categories: Shortcut['category'][] = ['Navigation', 'Display', 'Power'];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-deep/70 px-8 py-12 backdrop-blur-md"
      onClick={() => setOpen(false)}
    >
      <div
        className="max-w-2xl rounded-md border border-white/10 bg-navy/80 p-10 shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold">Keyboard Shortcuts</p>
        <h2 className="mt-2 font-display text-3xl text-white">Quick reference</h2>
        <div className="gold-rule mt-6 w-16" />
        <div className="mt-8 grid gap-8">
          {categories.map((cat) => (
            <div key={cat}>
              <p className="text-[11px] uppercase tracking-[0.3em] text-ink-soft/70">{cat}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {SHORTCUTS.filter((s) => s.category === cat).map((s) => (
                  <li key={s.keys} className="flex items-center justify-between gap-6">
                    <span className="text-ink-soft">{s.action}</span>
                    <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-gold">
                      {s.keys}
                    </kbd>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-ink-soft/50">
          Press ? again or Esc to close
        </p>
      </div>
    </div>
  );
}
