'use client';

import { useEffect, useState } from 'react';

export interface HotkeyToastMessage {
  /** Visible key combo, e.g. "→" or "Cmd+B". */
  keys: string;
  /** Action description, e.g. "Next section". */
  action: string;
}

let externalEmit: ((msg: HotkeyToastMessage) => void) | null = null;

/**
 * Imperatively show a hotkey toast. Called from KeyboardNav and from
 * the scenario context whenever a recognized shortcut fires.
 */
export function emitHotkeyToast(msg: HotkeyToastMessage) {
  externalEmit?.(msg);
}

/**
 * Top-right ephemeral toast that confirms a recognized hotkey. Fades
 * out after 1.5 s. Only one toast at a time — a newer one replaces the
 * previous immediately for snappy feel.
 */
export function HotkeyToast() {
  const [msg, setMsg] = useState<HotkeyToastMessage | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    externalEmit = (m) => {
      setMsg(m);
      setNonce((n) => n + 1);
    };
    return () => {
      externalEmit = null;
    };
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 1500);
    return () => window.clearTimeout(t);
  }, [msg, nonce]);

  if (!msg) return null;

  return (
    <div
      key={nonce}
      className="pointer-events-none fixed right-6 top-6 z-[80] flex items-center gap-3 rounded border border-white/10 bg-navy-deep/85 px-4 py-2 text-sm text-white shadow-card-rest backdrop-blur-sm animate-[hkfade_1.5s_ease-out_forwards]"
    >
      <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-gold">
        {msg.keys}
      </kbd>
      <span className="text-ink-soft">{msg.action}</span>
      <style jsx>{`
        @keyframes hkfade {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          10%,
          70% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
