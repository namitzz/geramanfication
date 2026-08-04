// Regenerate the Tovo app icons (two-lens mark on a warm-dark rounded tile)
// from an inline SVG. Run: node scripts/gen-icons.mjs
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// The two-lens mark centered on a warm-dark rounded tile, sized for maskable
// safe zone (mark ~55% of the canvas).
const icon = (bg = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  ${bg ? '<rect width="512" height="512" rx="112" fill="#17131a"/>' : ''}
  <g transform="translate(256 256) scale(3.4) translate(-48 -48)">
    <defs><clipPath id="l"><circle cx="62" cy="48" r="27"/></clipPath></defs>
    <circle cx="34" cy="48" r="27" fill="#ff6a2b"/>
    <circle cx="62" cy="48" r="27" fill="#f5a623"/>
    <circle cx="34" cy="48" r="27" clip-path="url(#l)" fill="#e4340c"/>
  </g>
</svg>`;

const render = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png();

const targets = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of targets) {
  await render(icon(true), size).toFile(join(pub, name));
  console.log('wrote', name, size);
}

// favicon.ico from 32 + 16 px renders of the mark on a tile
const ico16 = await render(icon(true), 16).toBuffer();
const ico32 = await render(icon(true), 32).toBuffer();
await writeFile(join(pub, 'favicon.ico'), await pngToIco([ico16, ico32]));
console.log('wrote favicon.ico');
