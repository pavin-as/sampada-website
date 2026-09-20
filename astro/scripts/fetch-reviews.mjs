#!/usr/bin/env node
/**
 * Refresh src/data/reviews.json from the Google Places API.
 *
 * Env: GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID
 *
 * Never throws. If anything goes wrong — missing env, network error, API error,
 * or too few usable reviews — it logs a warning, leaves the existing
 * reviews.json untouched, and exits 0 so the build always proceeds.
 *
 * Note: the Places API returns at most 5 reviews per place, so a run may find
 * fewer than MIN_REVIEWS five-star entries. In that case we keep what is on disk.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/reviews.json');
const MIN_REVIEWS = 3;
const MAX_REVIEWS = 3;
const MAX_LEN = 420;

const warn = (m) => console.warn(`[fetch-reviews] ${m}`);
const info = (m) => console.log(`[fetch-reviews] ${m}`);

function keepExisting(reason) {
  warn(`${reason} — keeping the existing src/data/reviews.json.`);
  process.exit(0);
}

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

if (!KEY || !PLACE_ID) {
  keepExisting('GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set');
}

let current;
try {
  current = JSON.parse(await readFile(OUT, 'utf8'));
} catch {
  current = { reviews: [] };
}

const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
url.searchParams.set('place_id', PLACE_ID);
url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews,url');
url.searchParams.set('reviews_sort', 'newest');
url.searchParams.set('language', 'en');
url.searchParams.set('key', KEY);

let payload;
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) keepExisting(`Places API returned HTTP ${res.status}`);
  payload = await res.json();
} catch (err) {
  keepExisting(`request failed: ${err?.message || err}`);
}

if (payload.status !== 'OK') {
  keepExisting(`Places API status "${payload.status}"${payload.error_message ? `: ${payload.error_message}` : ''}`);
}

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

const picked = (payload.result?.reviews || [])
  .filter((r) => r.rating === 5 && clean(r.text).length > 40)
  .sort((a, b) => (b.time || 0) - (a.time || 0))
  .slice(0, MAX_REVIEWS)
  .map((r) => {
    let text = clean(r.text);
    if (text.length > MAX_LEN) text = `${text.slice(0, MAX_LEN).replace(/\s+\S*$/, '')}…`;
    return {
      author: clean(r.author_name),
      rating: 5,
      relativeTime: clean(r.relative_time_description),
      text,
    };
  });

if (picked.length < MIN_REVIEWS) {
  keepExisting(`only ${picked.length} usable 5-star review(s) returned (need ${MIN_REVIEWS})`);
}

const next = {
  source: 'Google Business Profile',
  placeId: PLACE_ID,
  updatedAt: new Date().toISOString().slice(0, 10),
  profileUrl: payload.result?.url || current.profileUrl || '',
  reviews: picked,
};

if (JSON.stringify(next.reviews) === JSON.stringify(current.reviews)) {
  info('reviews unchanged since last run.');
  process.exit(0);
}

await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
info(`wrote ${picked.length} five-star reviews to src/data/reviews.json`);
