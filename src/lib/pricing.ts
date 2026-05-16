/**
 * Pricing helpers for the hidden scenario toggle.
 *
 * Scenario A = "To be agreed" (negotiation mode)
 * Scenario B = standard catalogue price (verbatim from PDF)
 * Scenario C = round(B × 1.8 / 10) × 10 (premium)
 *
 * The Scenario C values in packages.json were pre-computed for visual
 * stability, but this helper is also exported so any derived price
 * computation (matrix totals, ranges) stays consistent.
 */

import type { Package, PricingScenario } from '@/types/content';

export function formatScenarioPrice(pkg: Package, scenario: PricingScenario): string {
  if (scenario === 'A') return 'To be agreed';
  const value = scenario === 'B' ? pkg.prices.B : pkg.prices.C;
  return `€${value}`;
}

export function rawScenarioPrice(pkg: Package, scenario: PricingScenario): number | string {
  if (scenario === 'A') return 'To be agreed';
  return scenario === 'B' ? pkg.prices.B : pkg.prices.C;
}

/** Compute scenario C from scenario B with the standard rounding rule. */
export function computeScenarioC(b: number): number {
  return Math.round((b * 1.8) / 10) * 10;
}

export function categoryPriceRange(
  packages: Package[],
  scenario: PricingScenario
): string {
  if (scenario === 'A') return 'To be agreed';
  const values = packages.map((p) =>
    scenario === 'B' ? p.prices.B : p.prices.C
  );
  if (values.length === 0) return '—';
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `€${min}` : `€${min} – €${max}`;
}
