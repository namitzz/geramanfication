/**
 * Build-time German audio generator.
 *
 * Synthesizes a real MP3 for every card in the curated decks using Microsoft
 * Edge's free neural German voice (female, de-DE-KatjaNeural), bundles each
 * deck's clips into a downloadable ZIP under public/audio/, and writes a
 * manifest the app uses to show "Download audio pack" buttons.
 *
 * Run with:  npm run audio:generate
 *
 * This needs network access (Edge TTS service) at build time only. The
 * resulting ZIPs are committed and served statically, so end users download
 * them without any API or key.
 */

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'audio');
const MANIFEST = join(ROOT, 'src', 'content', 'generated', 'audioManifest.json');

const VOICE = 'de-DE-KatjaNeural';

const { allDecks } = await import('../src/content/decks.ts');

/** Make a filesystem- and zip-safe file name. */
function slug(text, index) {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/ß/g, 'ss')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return `${String(index + 1).padStart(3, '0')}_${base || 'clip'}.mp3`;
}

/** Synthesize one German phrase to an MP3 buffer (fresh connection per call). */
async function synth(text) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  const chunks = [];
  await new Promise((resolve, reject) => {
    audioStream.on('data', (c) => chunks.push(c));
    audioStream.on('end', resolve);
    audioStream.on('error', reject);
  });
  return Buffer.concat(chunks);
}

async function synthWithRetry(text, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const buf = await synth(text);
      if (buf.length > 0) return buf;
      throw new Error('empty audio');
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

function zipDir(files, outPath) {
  const zip = new AdmZip();
  for (const { name, buffer } of files) zip.addFile(name, buffer);
  zip.writeZip(outPath);
  return zip.toBuffer().length;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = {};

  for (const deck of allDecks) {
    process.stdout.write(`\n${deck.name} (${deck.cards.length}) `);
    const files = [];
    for (let i = 0; i < deck.cards.length; i++) {
      const card = deck.cards[i];
      const buffer = await synthWithRetry(card.de);
      files.push({ name: slug(card.de, i), buffer });
      process.stdout.write('.');
    }

    const zipPath = join(OUT_DIR, `${deck.id}.zip`);
    const bytes = await zipDir(files, zipPath);
    manifest[deck.id] = {
      file: `${deck.id}.zip`,
      count: files.length,
      bytes,
    };
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  process.stdout.write('\n\nDone. Packs written to public/audio/\n');
  console.table(
    Object.fromEntries(
      Object.entries(manifest).map(([k, v]) => [k, { count: v.count, KB: Math.round(v.bytes / 1024) }])
    )
  );
}

main().catch(async (err) => {
  console.error('\nAudio generation failed:', err);
  // Leave any partial output for inspection but signal failure.
  await rm(MANIFEST, { force: true }).catch(() => {});
  process.exit(1);
});
