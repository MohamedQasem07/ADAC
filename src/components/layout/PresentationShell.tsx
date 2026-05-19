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
import { LogoutButton } from '@/components/access/LogoutButton';
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
  // Phase 2.4AB — two flags now: `isAudience` is strict mobile (route
  // /m or ?m=1), `isViewerSafe` is mobile-OR-guest. Presenter chrome
  // gates on the wider `isViewerSafe`; mobile-only UI (bottom nav,
  // mobile padding) gates on the strict `isAudience` so desktop guests
  // get the normal desktop layout minus prices/admin tools.
  const { isAudience, isViewerSafe } = useAudienceMode();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);

  // `isCover` is reserved for later — we'll suppress some shell chrome on
  // the cover (e.g. hint indicators) once §1 has its full cinematic
  // treatment. The sidebar itself is always available via Cmd/Ctrl+B.
  void isCover;

  return (
    <>
      <AmbientBackground />

      {/* Scenario lock side effect: force scenario back to B once and
          guard the persist+hotkey paths in PricingContext for any
          non-admin viewer (mobile OR desktop guest). Renders nothing. */}
      {isViewerSafe && <AudienceScenarioLock />}

      {/* Phase 2.4AC — Sidebar + MenuButton are part of the normal
          DESKTOP chrome and must remain visible for desktop guests.
          They're hidden only when the strict mobile audience flag is
          on (the mobile layout uses MobileBottomNav instead). The
          Sidebar itself hides its gold "anchor" focus markers for
          non-admin viewers via useAccessMode(). */}
      {!isAudience && (
        <>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <MenuButton onClick={() => setSidebarOpen(true)} />
        </>
      )}

      {/* ThemeSwitcher remains a presenter-only visual control —
          hidden from both mobile audience and desktop guest. */}
      {!isViewerSafe && <ThemeSwitcher />}

      <Breadcrumb />

      {/* Main slot — section pages render their own SectionFrame later.
          Mobile-only bottom padding so the MobileBottomNav doesn't cover
          the last line of content; desktop guests don't need it. */}
      <div
        className={`relative z-10 min-h-screen ${
          isAudience ? 'pb-[calc(env(safe-area-inset-bottom)+5.5rem)]' : ''
        }`}
      >
        <PageTransition>{children}</PageTransition>
      </div>

      {/* Presenter-only overlays — same gating as the top-left chrome. */}
      {!isViewerSafe && (
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

      {/* Strict mobile UI — only when on /m or ?m=1. Desktop guests
          must NOT get the mobile bottom nav. */}
      {isAudience && (
        <>
          <MobileBottomNav onOpenQuickJump={() => setQuickJumpOpen(true)} />
          <MobileQuickJumpSheet
            open={quickJumpOpen}
            onClose={() => setQuickJumpOpen(false)}
          />
        </>
      )}

      {/* Logout button — visible whenever a viewer is authenticated.
          Hidden on the LoginGate (LoginGate covers everything anyway). */}
      <LogoutButton />
    </>
  );
}
