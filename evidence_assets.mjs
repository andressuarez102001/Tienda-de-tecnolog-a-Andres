import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const outDir = new URL('./evidencia_frontend/recursos/', import.meta.url);
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const routes = [
  ['inicio', 'http://localhost:3000/'],
  ['productos_top', 'http://localhost:3000/productos-top'],
  ['detalle_producto', 'http://localhost:3000/producto/funda-iphone-17'],
];

for (const [name, url] of routes) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, outDir)), fullPage: false });
}

await browser.close();
