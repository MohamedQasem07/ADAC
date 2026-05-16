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
  padding: '8px 12px',
} as const;

/**
 * Recharts <Tooltip> needs explicit `labelStyle` + `itemStyle` props on top of
 * `contentStyle`. Without them the *label* line (the X-axis category at the
 * top of the tooltip) inherits the Recharts default of `color: #000` and
 * renders near-black on the dark glass background. These two constants are
 * the single source of truth — every Recharts <Tooltip> in the deck should
 * pass them.
 */
export const CHART_TOOLTIP_LABEL_STYLE = {
  color: CHART_TEXT_PRIMARY,
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4,
} as const;

export const CHART_TOOLTIP_ITEM_STYLE = {
  color: '#D7E2EF',
  fontSize: 12,
  padding: 0,
} as const;
