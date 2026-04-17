// Generate Greenstone Peptides typographic wordmark logo
// Outputs: public/logo.svg, public/logo.png (1200x400), public/logo-2x.png (2400x800)
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const fontsDir = resolve(__dirname, 'fonts');
const publicDir = resolve(projectRoot, 'public');

const cormorantPath = resolve(fontsDir, 'CormorantGaramond-Medium.ttf');
const jetbrainsPath = resolve(fontsDir, 'JetBrainsMono-Regular.ttf');

const cormorantB64 = readFileSync(cormorantPath).toString('base64');
const jetbrainsB64 = readFileSync(jetbrainsPath).toString('base64');

// Brand colors
const WHITE = '#F5F1EB';
const GOLD = '#C9A96E';

// SVG with embedded fonts via @font-face data URIs
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
  <defs>
    <style type="text/css"><![CDATA[
      @font-face {
        font-family: 'Cormorant Garamond';
        font-style: normal;
        font-weight: 500;
        src: url(data:font/ttf;base64,${cormorantB64}) format('truetype');
      }
      @font-face {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 400;
        src: url(data:font/ttf;base64,${jetbrainsB64}) format('truetype');
      }
      .primary {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 500;
        font-size: 140px;
        fill: ${WHITE};
      }
      .secondary {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 400;
        font-size: 28px;
        letter-spacing: 5.6px;
        fill: ${GOLD};
      }
    ]]></style>
  </defs>
  <text x="600" y="200" text-anchor="middle" dominant-baseline="middle" class="primary">Greenstone Peptides</text>
  <text x="600" y="290" text-anchor="middle" class="secondary">PEPTIDE SOLUTIONS</text>
</svg>`;

// Write SVG
const svgOut = resolve(publicDir, 'logo.svg');
writeFileSync(svgOut, svg, 'utf8');

// Rasterize PNGs via sharp. Render at high density for crisp text.
const svgBuffer = Buffer.from(svg);

const pngOut = resolve(publicDir, 'logo.png');
const png2xOut = resolve(publicDir, 'logo-2x.png');

// 1x: render SVG at elevated density then fit to 1200x400
await sharp(svgBuffer, { density: 300 })
  .resize(1200, 400, { fit: 'contain', kernel: 'lanczos3', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(pngOut);

// 2x: render at higher density, output 2400x800
await sharp(svgBuffer, { density: 600 })
  .resize(2400, 800, { fit: 'contain', kernel: 'lanczos3', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(png2xOut);

// Verify metadata
const meta1 = await sharp(pngOut).metadata();
const meta2 = await sharp(png2xOut).metadata();

function kb(p) {
  return (statSync(p).size / 1024).toFixed(2) + ' KB';
}

console.log('--- Generated logo files ---');
console.log(`SVG:    ${svgOut}  (${kb(svgOut)})`);
console.log(`PNG 1x: ${pngOut}  (${kb(pngOut)})  dims=${meta1.width}x${meta1.height}  format=${meta1.format}`);
console.log(`PNG 2x: ${png2xOut}  (${kb(png2xOut)})  dims=${meta2.width}x${meta2.height}  format=${meta2.format}`);
