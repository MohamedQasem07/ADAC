'use client';

import { useEffect } from 'react';
import { usePricing } from '@/context/PricingContext';

/**
 * Phase 2.4W — Audience mode forces pricing to Scenario B (Standard).
 *
 * Renders nothing. On mount, calls setScenario('B') once so any prior
 * scenario from the presenter's localStorage is replaced for the
 * audience tab. PricingContext's persist + hotkey effects independently
 * guard against writes in audience mode via `audienceModeActive()`, so
 * this is the user-visible reset to ensure the lock is immediate.
 *
 * Only mounted by PresentationShell when `useAudienceMode().isAudience`
 * is true.
 */
export function AudienceScenarioLock() {
  const { setScenario } = usePricing();
  useEffect(() => {
    setScenario('B');
  }, [setScenario]);
  return null;
}
