// Run: node --test tests/page.test.mjs (no dependencies)
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const SITE = 'https://www.gcucr.com/';

const localRefs = [
  ...html.matchAll(/\b(?:src|href)="([^"]+)"/g),
  ...html.matchAll(/url\(['"]?([^'")]+)['"]?\)/g),
]
  .map((m) => m[1])
  .filter((ref) => !/^(https?:|mailto:|tel:|data:|#|%23)/.test(ref));

test('every local image and asset the page points at exists', () => {
  assert.ok(localRefs.length > 0);
  for (const ref of localRefs) assert.ok(existsSync(new URL(ref, root)), ref);
});

test('every absolute www.gcucr.com image URL maps to a file in the repo', () => {
  for (const [, path] of html.matchAll(/https:\/\/www\.gcucr\.com\/(images\/[^"]+)/g)) {
    assert.ok(existsSync(new URL(path, root)), path);
  }
});

test('every img has alt text', () => {
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag, /\balt="[^"]+"/, tag);
});

test('canonical, og:url, JSON-LD url and the sitemap agree on one address', () => {
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}"`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${SITE}"`));
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(ld.url, SITE);
  const sitemap = readFileSync(new URL('sitemap.xml', root), 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]), [SITE]);
  assert.match(readFileSync(new URL('robots.txt', root), 'utf8'), new RegExp(`Sitemap: ${SITE}sitemap.xml`));
});
