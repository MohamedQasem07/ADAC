/**
 * Bundled fallback for the two heaviest data files. If a runtime fetch
 * of /data/adac-data.json or /data/packages.json fails (network error,
 * 404, malformed JSON), the data-loader returns these bundled copies so
 * the deck never crashes during the live meeting.
 */

import adacData from '@/content/adac-data.json';
import packagesData from '@/content/packages.json';

export const fallbackADACData = adacData;
export const fallbackPackagesData = packagesData;
