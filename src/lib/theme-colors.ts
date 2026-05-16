'use client';

import { useVisualTheme, type VisualTheme } from '@/context/VisualThemeContext';

export interface ChartPalette {
  primary: string;
  primarySoft: string;
  primaryRgb: string;
  secondary: string;
  tertiary: string;
  cyan: string;
  danger: string;
  textPrimary: string;
  textSecondary: string;
}

const PALETTES: Record<VisualTheme, ChartPalette> = {
  'premium-navy': {
    primary: '#C9A961',
    primarySoft: '#E0C988',
    primaryRgb: '201, 169, 97',
    secondary: '#2E75B6',
    tertiary: '#0096B4',
    cyan: '#54C7E8',
    danger: '#E74747',
    textPrimary: '#F4F8FC',
    textSecondary: '#B8C7D6',
  },
  partnership: {
    primary: '#FFD200',
    primarySoft: '#E5B800',
    primaryRgb: '255, 210, 0',
    secondary: '#2F80ED',
    tertiary: '#54C7E8',
    cyan: '#54C7E8',
    danger: '#E74747',
    textPrimary: '#F7FAFC',
    textSecondary: '#D7E2EF',
  },
};

/**
 * Returns the chart color palette for the current visual theme.
 * Call inside a client component that renders a Recharts chart;
 * pass the returned colors as `fill`, `stroke`, etc.
 *
 * Charts that don't opt in to theming continue to import from
 * `chart-style.ts` and stay on the Premium Navy palette regardless of
 * the active theme — that's the deliberate "where safe" approach.
 */
export function useThemeChartColors(): ChartPalette {
  const { theme } = useVisualTheme();
  return PALETTES[theme];
}

/** Server-safe accessor for non-hook contexts (e.g. SSR-rendered SVG defs). */
export function getThemeChartColors(theme: VisualTheme): ChartPalette {
  return PALETTES[theme];
}
