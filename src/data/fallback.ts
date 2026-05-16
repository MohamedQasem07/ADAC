/**
 * Bundled fallback for the two heaviest data files. If a runtime fetch
 * of /data/adac-data.json or /data/packages.json fails (network error,
 * 404, malformed JSON), the data-loader returns these bundled copies so
 * the deck never crashes during the live meeting.
 *
 * Source of truth: src/content/*.json (read at build time and imported
 * here). The build inlines them into the JS bundle.
 */

import adacData from '@/content/adac-data.json';

// packages.json is added in Phase 7. Until then, the fallback object is empty.
export const fallbackADACData = adacData;
