/**
 * Shared chart-readability constants. Tuned so axis and label text stays
 * legible on the projected dark background at 1920×1080 from 5 metres.
 *
 * Use these constants in every chart component — do not introduce
 * ad-hoc faint colors.
 */

export const CHART_TEXT_PRIMARY = '#F4F8FC';      // hero values, prominent labels
export const CHART_TEXT_SECONDARY = '#B8C7D6';    // axis ticks, secondary labels
export const CHART_GOLD = '#C9A961';
export const CHART_GOLD_SOFT = '#E0C988';
export const CHART_GRID = 'rgba(255,255,255,0.08)';
export const CHART_AXIS_LINE = 'rgba(255,255,255,0.16)';

export const CHART_TOOLTIP_STYLE = {
  background: 'rgba(13,27,42,0.95)',
  border: '1px solid rgba(201,169,97,0.35)',
  borderRadius: 2,
  color: CHART_TEXT_PRIMARY,
  fontSize: 13,
} as const;
