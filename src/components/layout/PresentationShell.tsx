'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { PricingProvider } from '@/context/PricingContext';
import { parsePathname } from '@/lib/nav-config';
import { AmbientBackground } from './AmbientBackground';
import { Breadcrumb } from './Breadcrumb';
import { CheatsheetOverlay } from './CheatsheetOverlay';
import { HotkeyToast } from './HotkeyToast';
import { KeyboardNav } from './KeyboardNav';
import { PageTransition } from './PageTransition';
import { ScenarioIndicator } from './ScenarioIndicator';
import { Sidebar } from './Sidebar';

/**
 * Top-level client shell. Mounts the pricing provider, the keyboard
 * handler, the corner scenario dot, the breadcrumb, the sidebar, the
 * hotkey toast, and the cheatsheet overlay.
 *
 * Sidebar is hidden on the cover (§1) so the opener stays cinematic.
 */
export function PresentationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);
  const isCover = route.sectionId === '1' && !route.subId;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // `isCover` is reserved for later — we'll suppress some shell chrome on
  // the cover (e.g. hint indicators) once §1 has its full cinematic
  // treatment. The sidebar itself is always available via Cmd/Ctrl+B.
  void isCover;

  return (
    <PricingProvider>
      <AmbientBackground />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Breadcrumb />

      {/* Main slot — section pages render their own SectionFrame later. */}
      <div className="relative z-10 min-h-screen">
        <PageTransition>{children}</PageTransition>
      </div>

      <KeyboardNav onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <ScenarioIndicator />
      <HotkeyToast />
      <CheatsheetOverlay />
    </PricingProvider>
  );
}
