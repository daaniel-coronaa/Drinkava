#!/usr/bin/env node
// Regenerates every brand raster from the single vector definition below, so the mark can
// be tuned in one place. macOS only: SVGs are rasterized with Quick Look (`qlmanage`),
// which doesn't keep transparency — transparent assets are recovered by rendering the
// artwork over black and over white and solving for alpha (difference matting).
//
//   node scripts/generate-brand-assets.mjs
//
// Concept: a Didone "D" — heavy stem, hairline bowl (the same thick/thin contrast as the
// Playfair Display titles) — with a rising column of bubbles in its counter, in champagne
// foil on near-black. See DESIGN.md §1 and §3.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pngjs from 'pngjs';

const { PNG } = pngjs;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---- Mark geometry (1024 × 1024 canvas, mark centered) --------------------------------
const BOX = { left: 275, right: 749, top: 250, bottom: 774 };
const STEM_W = 72;
// [cx, cy, r] — a gentle S-curve of bubbles that shrink as they rise.
const BUBBLES = [
  [548, 622, 30],
  [500, 505, 20],
  [556, 410, 13],
  [512, 335, 8],
];
const FOIL = [
  [0, '#FFC08A'],
  [0.5, '#FF8A3D'],
  [1, '#E8601C'],
];
const NEAR_BLACK = '#0A0A0B';

function svg({ size = 1024, bg, scale = 1, fill = 'foil', bowlStroke = 14, bubbleMinR = 0 }) {
  const { left, right, top, bottom } = BOX;
  const paint = fill === 'foil' ? 'url(#foil)' : fill;
  const R = (bottom - top - bowlStroke) / 2;
  const cx = right - R - bowlStroke / 2;
  const yTop = top + bowlStroke / 2;
  const yBottom = bottom - bowlStroke / 2;
  const joinX = left + STEM_W - 8; // bowl starts inside the stem so the joint has no seam
  const bowl = `M${joinX} ${yTop} H${cx} A${R} ${R} 0 0 1 ${cx} ${yBottom} H${joinX}`;
  const bubbles = BUBBLES.filter(([, , r]) => r >= bubbleMinR)
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`)
    .join('');
  const background =
    bg === 'icon'
      ? '<rect width="1024" height="1024" fill="url(#vignette)"/>'
      : bg
        ? `<rect width="1024" height="1024" fill="${bg}"/>`
        : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
<defs>
<linearGradient id="foil" gradientUnits="userSpaceOnUse" x1="${left}" y1="${top}" x2="${right}" y2="${bottom}">${FOIL.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>
<radialGradient id="vignette" gradientUnits="userSpaceOnUse" cx="512" cy="470" r="720"><stop offset="0" stop-color="#1F1814"/><stop offset="1" stop-color="${NEAR_BLACK}"/></radialGradient>
</defs>
${background}
<g transform="translate(512 512) scale(${scale}) translate(-512 -512)" fill="${paint}">
<rect x="${left}" y="${top}" width="${STEM_W}" height="${bottom - top}"/>
<path d="${bowl}" fill="none" stroke="${paint}" stroke-width="${bowlStroke}"/>
${bubbles}
</g>
</svg>
`;
}

// ---- Rasterizing ----------------------------------------------------------------------
const work = mkdtempSync(join(tmpdir(), 'drinkava-brand-'));
let n = 0;

function raster(source, size) {
  const file = join(work, `r${n++}.svg`);
  writeFileSync(file, source);
  execFileSync('qlmanage', ['-t', '-s', String(size), '-o', work, file], { stdio: 'ignore' });
  const png = PNG.sync.read(readFileSync(`${file}.png`));
  if (png.width !== size || png.height !== size) {
    throw new Error(`qlmanage returned ${png.width}×${png.height}, expected ${size}×${size}`);
  }
  // Quick Look renders small sizes (< ~512) into a fraction of the canvas and pads the rest
  // with white. Every background we draw is near-uniform, so opposite corners must match.
  const last = (size * size - 1) * 4;
  for (let c = 0; c < 3; c++) {
    if (Math.abs(png.data[c] - png.data[last + c]) > 12) {
      throw new Error(`qlmanage did not fill the ${size}px canvas — render at 1024 and downscale instead`);
    }
  }
  return png;
}

// Area-average resize (each output pixel averages the exact source rectangle it covers).
function downscale(src, size) {
  const out = new PNG({ width: size, height: size });
  const k = src.width / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0, 0];
      let weight = 0;
      for (let sy = Math.floor(y * k); sy < Math.ceil((y + 1) * k); sy++) {
        const wy = Math.min(sy + 1, (y + 1) * k) - Math.max(sy, y * k);
        for (let sx = Math.floor(x * k); sx < Math.ceil((x + 1) * k); sx++) {
          const w = wy * (Math.min(sx + 1, (x + 1) * k) - Math.max(sx, x * k));
          const i = (sy * src.width + sx) * 4;
          for (let c = 0; c < 4; c++) acc[c] += src.data[i + c] * w;
          weight += w;
        }
      }
      const o = (y * size + x) * 4;
      for (let c = 0; c < 4; c++) out.data[o + c] = Math.round(acc[c] / weight);
    }
  }
  return out;
}

function transparent(opts) {
  const size = opts.size ?? 1024;
  const onBlack = raster(svg({ ...opts, bg: '#000000' }), size);
  const onWhite = raster(svg({ ...opts, bg: '#FFFFFF' }), size);
  const out = new PNG({ width: size, height: size });
  for (let i = 0; i < out.data.length; i += 4) {
    const diff = (onWhite.data[i] - onBlack.data[i] + onWhite.data[i + 1] - onBlack.data[i + 1] + onWhite.data[i + 2] - onBlack.data[i + 2]) / (3 * 255);
    const alpha = Math.min(1, Math.max(0, 1 - diff));
    for (let c = 0; c < 3; c++) out.data[i + c] = alpha > 0.004 ? Math.min(255, Math.round(onBlack.data[i + c] / alpha)) : 0;
    out.data[i + 3] = Math.round(alpha * 255);
  }
  return out;
}

const write = (rel, png, options) => {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, PNG.sync.write(png, options));
  console.log(`wrote ${rel}`);
};
const writeText = (rel, text) => {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
  console.log(`wrote ${rel}`);
};

try {
  // Vector sources (transparent mark, and the full icon on its vignette).
  writeText('assets/brand/drinkava-mark.svg', svg({}));
  writeText('assets/brand/drinkava-icon.svg', svg({ bg: 'icon', scale: 1.15 }));

  // App icon: opaque RGB (the App Store rejects icons with an alpha channel).
  write('assets/images/icon.png', raster(svg({ bg: 'icon', scale: 1.15 }), 1024), { colorType: 2 });

  // Splash: mark only, transparent; the splash background color comes from app.json.
  write('assets/images/splash-icon.png', transparent({ scale: 1 }));

  // Android adaptive icon: mark kept inside the 66% safe zone; color background in app.json.
  write('assets/images/android-icon-foreground.png', transparent({ scale: 0.9 }));
  write('assets/images/android-icon-monochrome.png', transparent({ scale: 0.9, fill: '#FFFFFF' }));

  // Favicon: heavier hairline and no tiny bubbles so it survives 48px.
  write(
    'assets/images/favicon.png',
    downscale(raster(svg({ bg: NEAR_BLACK, scale: 1.55, bowlStroke: 30, bubbleMinR: 18 }), 1024), 48),
  );

  // iOS 26 icon-composer layer.
  write('assets/expo.icon/Assets/drinkava-mark.png', transparent({ scale: 1.15 }));
} finally {
  rmSync(work, { recursive: true, force: true });
}
