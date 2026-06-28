/**
 * Build-time content importer for DeutschSprint.
 *
 * Pulls vocabulary, grammar rules, and graded sentences from the German
 * Language API (rep12.com) and writes them as bundled JSON into
 * src/content/generated/. Run with:
 *
 *   npm run content:fetch
 *
 * The API key is read from the CONTENT_API_KEY env var and falls back to the
 * public demo key. The demo key is rate-limited and not for production use --
 * set CONTENT_API_KEY to your own key before a real import.
 *
 * Design notes:
 * - The API caps `limit` at 500, so every resource is fetched page by page
 *   using limit + offset.
 * - The API is hosted on a free tier that cold-starts slowly, so each request
 *   is retried with backoff.
 * - This is offline-first: the app never calls the API at runtime. Re-run this
 *   script to refresh the bundled content.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE_URL =
  process.env.CONTENT_API_URL || 'https://german-language.onrender.com';
const API_KEY = process.env.CONTENT_API_KEY || 'demo-key-12345';
const PAGE_SIZE = 500; // API hard cap for /vocab and /grammar
const SENTENCE_PAGE_SIZE = 200; // /sentences caps limit at 200
const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1'];

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'src', 'content', 'generated');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fetch a single page of JSON with retry/backoff for cold starts. */
async function getJson(path, { retries = 5 } = {}) {
  const url = `${BASE_URL}${path}`;
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'X-API-Key': API_KEY },
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${path}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      const wait = Math.min(2000 * attempt, 10_000);
      console.warn(
        `  ! ${path} failed (attempt ${attempt}/${retries}): ${err.message}. Retrying in ${wait}ms...`
      );
      await sleep(wait);
    }
  }
  throw new Error(`Giving up on ${path}: ${lastErr?.message}`);
}

/** Page through a resource until all rows are collected. */
async function fetchAll(path, extraParams = {}, pageSize = PAGE_SIZE) {
  const all = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    const params = new URLSearchParams({
      ...extraParams,
      limit: String(pageSize),
      offset: String(offset),
    });
    const page = await getJson(`${path}?${params.toString()}`);
    const rows = page.data ?? [];
    all.push(...rows);
    total = page.total ?? all.length;
    offset += pageSize;
    if (rows.length === 0) break; // safety against bad totals
    process.stdout.write(`\r  ${path} ${all.length}/${total}   `);
  }
  process.stdout.write('\n');
  return all;
}

async function main() {
  console.log(`Importing German content from ${BASE_URL}`);
  if (API_KEY === 'demo-key-12345') {
    console.warn('Using public demo key (rate-limited). Set CONTENT_API_KEY for production.');
  }

  // --- Vocabulary (per level) ---
  console.log('\nVocabulary:');
  const vocab = [];
  for (const level of LEVELS) {
    const rows = await fetchAll('/vocab', { level });
    for (const r of rows) vocab.push({ ...r, level: level.toUpperCase() });
  }

  // --- Grammar (all levels in one collection) ---
  console.log('\nGrammar:');
  const grammar = await fetchAll('/grammar');

  // --- Sentences (per level) ---
  console.log('\nSentences:');
  const sentences = [];
  for (const level of LEVELS) {
    const rows = await fetchAll('/sentences', { level }, SENTENCE_PAGE_SIZE);
    for (const r of rows) sentences.push(r);
  }

  // --- Write outputs ---
  await mkdir(OUT_DIR, { recursive: true });
  const meta = {
    fetchedAt: new Date().toISOString(),
    source: BASE_URL,
    counts: {
      vocab: vocab.length,
      grammar: grammar.length,
      sentences: sentences.length,
    },
  };

  await Promise.all([
    writeFile(join(OUT_DIR, 'vocab.json'), JSON.stringify(vocab)),
    writeFile(join(OUT_DIR, 'grammar.json'), JSON.stringify(grammar)),
    writeFile(join(OUT_DIR, 'sentences.json'), JSON.stringify(sentences)),
    writeFile(join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2)),
  ]);

  console.log('\nDone:');
  console.table(meta.counts);
  console.log(`Written to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('\nImport failed:', err);
  process.exit(1);
});
