'use client';

import { useState } from 'react';
import {
  AlertCircle,
  FileJson,
  Palette,
  RotateCcw,
  Tag,
  TextSelect,
  Wallet,
} from 'lucide-react';
import { useOverrides } from '@/context/PresentationOverridesContext';
import { TextOverridesTab } from './TextOverridesTab';
import { PackageOverridesTab } from './PackageOverridesTab';
import { PricingOverridesTab } from './PricingOverridesTab';
import { ImportExportTab } from './ImportExportTab';
import { ResetOverridesTab } from './ResetOverridesTab';
import { ThemeTab } from './ThemeTab';

type TabId = 'text' | 'packages' | 'pricing' | 'theme' | 'io' | 'reset';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'text', label: 'Slide Text', icon: <TextSelect size={14} /> },
  { id: 'packages', label: 'Package Catalogue', icon: <Tag size={14} /> },
  { id: 'pricing', label: 'Pricing', icon: <Wallet size={14} /> },
  { id: 'theme', label: 'Theme', icon: <Palette size={14} /> },
  { id: 'io', label: 'Import / Export', icon: <FileJson size={14} /> },
  { id: 'reset', label: 'Reset', icon: <RotateCcw size={14} /> },
];

/**
 * Hidden Presenter Control Mode panel. Rendered either inside the
 * Ctrl/Cmd+Shift+E overlay or at the standalone /control route.
 *
 * All overrides are local-only — they live in localStorage and never
 * touch the network. Export/import is the only way to move overrides
 * between devices.
 */
export function ControlPanel() {
  const [tab, setTab] = useState<TabId>('text');
  const { hasOverrides, overrides } = useOverrides();

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Banner */}
      <header className="flex-shrink-0 border-b border-white/10 bg-navy-deep/95 px-6 py-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold">
            <AlertCircle size={16} />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
              Presenter Control Mode
            </p>
            <h1 className="mt-1 font-display text-2xl leading-tight text-white">
              Local changes only until exported.
            </h1>
            <p className="mt-1 text-sm text-ice/80">
              Edits apply instantly in this browser. Audience never sees this panel.
              Use the Import / Export tab to move overrides to another device.
            </p>
          </div>
          <div className="ml-auto hidden shrink-0 rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 text-right text-[10px] uppercase tracking-[0.25em] text-ice/70 md:block">
            <p>{hasOverrides ? 'Overrides active' : 'No overrides'}</p>
            {hasOverrides && (
              <p className="mt-0.5 font-mono text-[9px] normal-case text-ice/50">
                {new Date(overrides.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <nav className="mt-5 flex flex-wrap gap-1.5">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  active
                    ? 'border-gold/60 bg-gold/10 text-gold'
                    : 'border-white/10 bg-white/[0.02] text-ice/70 hover:border-gold/30 hover:text-gold'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {tab === 'text' && <TextOverridesTab />}
        {tab === 'packages' && <PackageOverridesTab />}
        {tab === 'pricing' && <PricingOverridesTab />}
        {tab === 'theme' && <ThemeTab />}
        {tab === 'io' && <ImportExportTab />}
        {tab === 'reset' && <ResetOverridesTab />}
      </main>
    </div>
  );
}
