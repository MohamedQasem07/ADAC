'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AccessModeProvider } from '@/context/AccessModeContext';
import { AudienceModeProvider, useAudienceMode } from '@/context/AudienceModeContext';
import { PricingProvider } from '@/context/PricingContext';
import { PresentationOverridesProvider } from '@/context/PresentationOverridesContext';
import { VisualThemeProvider } from '@/context/VisualThemeContext';
import { parsePathname } from '@/lib/nav-config';
import { LoginGate } from '@/components/access/LoginGate';
import { ControlPanelOverlay } from '@/components/control/ControlPanelOverlay';
import { AmbientBackground } from './AmbientBackground';
import { Breadcrumb } from './Breadcrumb';
import { CheatsheetOverlay } from './CheatsheetOverlay';
import { HotkeyToast } from './HotkeyToast';
import { KeyboardNav } from './KeyboardNav';
import { MenuButton } from './MenuButton';
import { PageTransition } from './PageTransition';
import { ScenarioIndicator } from './ScenarioIndicator';
import { SearchOverlay } from '@/components/packages/SearchOverlay';
import { Sidebar } from './Sidebar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { AudienceScenarioLock } from './AudienceScenarioLock';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { MobileQuickJumpSheet } from '@/components/mobile/MobileQuickJumpSheet';

/**
 * Top-level client shell. Mounts the pricing provider, the keyboard
 * handler, the corner scenario dot, the breadcrumb, the sidebar, the
 * hotkey toast, and the cheatsheet overlay.
 *
 * Phase 2.4W — wrapped in AudienceModeProvider. When audience mode is
 * active (mobile attendees following along via QR), ShellChrome hides
 * every presenter-only surface and replaces them with mobile nav.
 */
export function PresentationShell({ children }: { children: React.ReactNode }) {
  return (
    <VisualThemeProvider>
      <AccessModeProvider>
        <PresentationOverridesProvider>
          <PricingProvider>
            <AudienceModeProvider>
              <ShellChrome>{children}</ShellChrome>
              <LoginGate />
            </AudienceModeProvider>
          </PricingProvider>
        </PresentationOverridesProvider>
      </AccessModeProvider>
    </VisualThemeProvider>
  );
}

function ShellChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const route = parsePathname(pathname);
  const isCover = route.sectionId === '1' && !route.subId;
  const { isAudience } = useAudienceMode();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);

  // `isCover` is reserved for later — we'll suppress some shell chrome on
  // the cover (e.g. hint indicators) once §1 has its full cinematic
  // treatment. The sidebar itself is always available via Cmd/Ctrl+B.
  void isCover;

  return (
    <>
      <AmbientBackground />

      {/* Audience-mode side effect: force scenario back to B once and
          guard the persist+hotkey paths in PricingContext. Renders
          nothing. */}
      {isAudience && <AudienceScenarioLock />}

      {!isAudience && (
        <>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <MenuButton onClick={() => setSidebarOpen(true)} />
          <ThemeSwitcher />
        </>
      )}

      <Breadcrumb />

      {/* Main slot — section pages render their own SectionFrame later. */}
      <div
        className={`relative z-10 min-h-screen ${
          isAudience ? 'pb-[calc(env(safe-area-inset-bottom)+5.5rem)]' : ''
        }`}
      >
        <PageTransition>{children}</PageTransition>
      </div>

      {!isAudience && (
        <>
          <KeyboardNav onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <ScenarioIndicator />
          <CheatsheetOverlay />
          <SearchOverlay />
          <ControlPanelOverlay />
        </>
      )}

      {/* HotkeyToast is harmless on mobile (no hotkeys to toast) and is
          referenced by other systems for ephemeral feedback, so we leave
          it mounted in both modes. */}
      <HotkeyToast />

      {isAudience && (
        <>
          <MobileBottomNav onOpenQuickJump={() => setQuickJumpOpen(true)} />
          <MobileQuickJumpSheet
            open={quickJumpOpen}
            onClose={() => setQuickJumpOpen(false)}
          />
        </>
      )}
    </>
  );
}
