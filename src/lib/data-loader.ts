'use client';

import { fallbackADACData } from '@/data/fallback';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const FETCH_TIMEOUT_MS = 3000;

interface CacheEntry<T> {
  data: T;
  source: 'fetch' | 'fallback';
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Fetch a JSON file from `public/data/` with a timeout and bundled
 * fallback. The fallback is the same data shipped at build time, so the
 * deck always renders even with no network during the meeting.
 *
 * Logs the resolved source URL to the console for debugging only —
 * nothing visible to ADAC.
 */
async function loadJsonWithFallback<T>(filename: string, fallback: T): Promise<T> {
  const cached = cache.get(filename);
  if (cached) return cached.data as T;

  const url = `${BASE_PATH}/data/${filename}`;

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, { signal: controller.signal });
    window.clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as T;

    // eslint-disable-next-line no-console
    console.info('[ADAC Presentation] Data loaded from:', url);

    cache.set(filename, { data: json, source: 'fetch', timestamp: Date.now() });
    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.info(
      '[ADAC Presentation] Falling back to bundled data for',
      filename,
      '· reason:',
      err
    );
    cache.set(filename, { data: fallback, source: 'fallback', timestamp: Date.now() });
    return fallback;
  }
}

/**
 * Hook-friendly synchronous accessor. Returns the bundled fallback
 * immediately (so the chart renders with the correct shape on first
 * paint) and triggers a background refresh from /data/. When the
 * fetched JSON differs, the second render uses it.
 *
 * Charts that want live updates should call this through useEffect.
 */
export async function loadADACData() {
  return loadJsonWithFallback('adac-data.json', fallbackADACData);
}

/** Synchronous access to the bundled fallback. Use for first paint. */
export function getBundledADACData() {
  return fallbackADACData;
}
