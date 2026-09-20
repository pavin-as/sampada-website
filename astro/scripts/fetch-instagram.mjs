#!/usr/bin/env node
/**
 * Refresh src/data/instagram.json with the newest posts from @sampadavr.
 *
 * Configure ONE of (as repository secrets in CI, or env vars locally):
 *   INSTAGRAM_FEED_URL       A JSON feed URL from a feed service (e.g. Behold, Curator, or your own proxy).
 *                            Accepts an array of posts, or { posts: [...] } / { data: [...] }.
 *   INSTAGRAM_ACCESS_TOKEN   A long-lived Instagram API access token (graph.instagram.com/me/media).
 *
 * Never throws. If neither variable is set, the request fails, or fewer than MIN_POSTS
 * usable posts come back, it logs a warning, leaves src/data/instagram.json untouched
 * (the bundled fallback keeps the homepage section populated) and exits 0 so the build
 * always proceeds.
 *
 * Instagram image URLs are signed and expire within days, so each image is downloaded to
 * public/instagram/ and the JSON points at the local copy.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/instagram.json');
const IMG_DIR = resolve(HERE, '../public/instagram');
const MAX_POSTS = 6;
const MIN_POSTS = 3;
const TIMEOUT = 20000;
const PROFILE = 'https://www.instagram.com/sampadavr/';

const warn = (m) => console.warn(`[fetch-instagram] ${m}`);
const info = (m) => console.log(`[fetch-instagram] ${m}`);
const keepExisting = (reason) => {
  warn(`${reason} — keeping the existing src/data/instagram.json.`);
  process.exit(0);
};

const FEED_URL = process.env.INSTAGRAM_FEED_URL;
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!FEED_URL && !TOKEN) {
  keepExisting('INSTAGRAM_FEED_URL / INSTAGRAM_ACCESS_TOKEN not set');
}

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
  return res.json();
}

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  for (const k of ['posts', 'data', 'items', 'media']) if (Array.isArray(payload?.[k])) return payload[k];
  return [];
}

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
function snippet(caption, max = 160) {
  const c = clean(caption);
  if (c.length <= max) return c;
  return c.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/** Normalise the different feed shapes into { id, permalink, imageUrl, caption, timestamp }. */
function normalise(raw) {
  const permalink = raw.permalink || raw.url || raw.link;
  const isVideo = /video|reel/i.test(raw.media_type || raw.mediaType || '');
  const imageUrl = isVideo
    ? raw.thumbnail_url || raw.thumbnailUrl || raw.sizes?.medium?.mediaUrl
    : raw.media_url || raw.mediaUrl || raw.image || raw.imageUrl || raw.sizes?.medium?.mediaUrl || raw.thumbnail_url || raw.thumbnailUrl;
  const id = String(raw.id || permalink?.match(/\/(?:p|reel)\/([\w-]+)/)?.[1] || '').replace(/[^\w-]/g, '');
  if (!id || !permalink || !imageUrl) return null;
  if (!/^https:\/\/(www\.)?instagram\.com\//.test(permalink)) return null; // links must point at Instagram
  if (!/^https:\/\//.test(imageUrl)) return null;
  return { id, permalink, imageUrl, caption: raw.caption || raw.text || '', timestamp: raw.timestamp || raw.date || null };
}

async function download(post) {
  const res = await fetch(post.imageUrl, { signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const file = `${post.id}.${ext}`;
  await writeFile(resolve(IMG_DIR, file), Buffer.from(await res.arrayBuffer()));
  return `/instagram/${file}`;
}

let rawPosts;
try {
  const url = FEED_URL
    || `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${MAX_POSTS * 2}&access_token=${encodeURIComponent(TOKEN)}`;
  rawPosts = toArray(await getJson(url));
} catch (err) {
  keepExisting(`feed request failed: ${err?.message || err}`);
}

const candidates = rawPosts.map(normalise).filter(Boolean);
if (candidates.length < MIN_POSTS) keepExisting(`only ${candidates.length} usable posts returned`);

await mkdir(IMG_DIR, { recursive: true });
const posts = [];
for (const c of candidates) {
  if (posts.length >= MAX_POSTS) break;
  try {
    const image = await download(c);
    const caption = snippet(c.caption);
    posts.push({
      id: c.id,
      permalink: c.permalink,
      image,
      alt: caption || 'Instagram post from @sampadavr',
      caption: caption || 'View this post on Instagram',
      timestamp: c.timestamp,
    });
  } catch (err) {
    warn(`skipping ${c.id}: ${err?.message || err}`);
  }
}
if (posts.length < MIN_POSTS) keepExisting(`only ${posts.length} images could be downloaded`);

await writeFile(
  OUT,
  JSON.stringify({ handle: '@sampadavr', profile: PROFILE, source: 'instagram', updatedAt: new Date().toISOString(), posts }, null, 2) + '\n',
);
info(`wrote ${posts.length} posts to src/data/instagram.json`);
