'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { buildTextRegistry, type TextField } from './text-registry';

export function TextOverridesTab() {
  const { overrides, textOf, setText, resetText, resetAllText } = useOverrides();
  const [query, setQuery] = useState('');

  const registry = useMemo(() => buildTextRegistry(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registry;
    return registry.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.group.toLowerCase().includes(q) ||
        f.key.toLowerCase().includes(q) ||
        f.defaultValue.toLowerCase().includes(q)
    );
  }, [query, registry]);

  // Group filtered list by group label, preserving order.
  const grouped = useMemo(() => {
    const map = new Map<string, TextField[]>();
    for (const f of filtered) {
      const arr = map.get(f.group) ?? [];
      arr.push(f);
      map.set(f.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const editedCount = Object.keys(overrides.text).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ice/60"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search text blocks — label, group, or content…"
            className="w-full rounded-sm border border-white/10 bg-navy/50 py-2 pl-9 pr-3 text-sm text-white placeholder-ice/40 focus:border-gold/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-ice/70">
          <span>
            {editedCount} of {registry.length} edited
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all text overrides? Original copy will be restored.')) {
                resetAllText();
              }
            }}
            className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/40 hover:text-gold"
            disabled={editedCount === 0}
          >
            Reset all text
          </button>
        </div>
      </div>

      {grouped.length === 0 && (
        <p className="rounded-sm border border-white/5 bg-navy/30 p-6 text-sm text-ice/70">
          No fields match &ldquo;{query}&rdquo;.
        </p>
      )}

      {grouped.map(([group, fields]) => (
        <section key={group} className="space-y-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">{group}</h3>
          <ul className="space-y-3">
            {fields.map((f) => {
              const isOverridden = f.key in overrides.text;
              return (
                <li
                  key={f.key}
                  className={`rounded-sm border bg-navy/40 p-4 ${
                    isOverridden ? 'border-gold/40' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-sm leading-snug text-white">{f.label}</p>
                    {isOverridden && (
                      <span className="shrink-0 rounded-sm border border-gold/40 bg-gold/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.3em] text-gold">
                        Edited
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-ice/40">{f.key}</p>
                  <TextEditor
                    multiline={!!f.multiline}
                    value={textOf(f.key, f.defaultValue)}
                    fallback={f.defaultValue}
                    isOverridden={isOverridden}
                    onSave={(v) => setText(f.key, v)}
                    onReset={() => resetText(f.key)}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function TextEditor({
  value,
  fallback,
  isOverridden,
  multiline,
  onSave,
  onReset,
}: {
  value: string;
  fallback: string;
  isOverridden: boolean;
  multiline: boolean;
  onSave: (v: string) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(value);
  // Keep draft in sync when value flips (e.g. import).
  if (draft !== value && !isOverridden) {
    // no-op; we'll let user override
  }

  const dirty = draft !== value;

  return (
    <div className="mt-3 space-y-3">
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="block w-full resize-vertical rounded-sm border border-white/10 bg-navy-deep/60 px-3 py-2 text-sm leading-relaxed text-white placeholder-ice/40 focus:border-gold/50 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="block w-full rounded-sm border border-white/10 bg-navy-deep/60 px-3 py-2 text-sm text-white placeholder-ice/40 focus:border-gold/50 focus:outline-none"
        />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => onSave(draft)}
          className="rounded-sm border border-gold/60 bg-gold/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25 disabled:opacity-40"
        >
          Save
        </button>
        <button
          type="button"
          disabled={!isOverridden}
          onClick={() => {
            onReset();
            setDraft(fallback);
          }}
          className="rounded-sm border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ice/80 transition-colors hover:border-gold/30 hover:text-gold disabled:opacity-40"
        >
          Reset
        </button>
        <p className="ml-auto text-[10px] text-ice/40">
          {dirty ? 'Unsaved changes' : isOverridden ? 'Override active' : 'Showing default'}
        </p>
      </div>
    </div>
  );
}
